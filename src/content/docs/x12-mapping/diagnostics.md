# Validation Diagnostics — English Reference

This document explains every diagnostic the validation engine can emit — **35
codes** in total. Each
code is described twice — once in plain English (for novice readers and
business stakeholders), and once in X12 detail (for EDI engineers). Severity
is one of `Error`, `Warning`, or `Info`.

If you only care about the codes for programmatic filtering, scroll to the
[Code Index](#code-index) at the bottom.

> X12 jargon used throughout this doc is defined in [mappings.md](mappings.md)
> and in the short [Validation Concepts](#validation-concepts) primer below.

---

## How validation runs

A transaction passes through a small pipeline of validators. Each may add
diagnostics to the result; none short-circuits the others.

| Layer | What it checks | Where it lives |
|---|---|---|
| **Envelope tracker** | ISA/IEA, GS/GE, ST/SE pairing, control numbers, segment & transaction counts | `EnvelopeTracker` |
| **Transaction structure** | Required and recommended segments for the transaction type | `TransactionValidator` |
| **HL hierarchy** | Structural integrity of the X12 Hierarchical Level chain (transaction-independent) | `HlValidator` |
| **Loop repeat caps** | Each loop instance count stays within the §2.3.1 cap | `LoopValidator` |
| **Segment placement** | Trigger segments have a reachable parent loop; member segments sit in a loop that allows them | `LoopPlacementValidator` |
| **Financial balancing** | 835 BPR02 vs CLP04 sums, 837 CLM02 vs SV1 sums | `FactsExtractor` (`BalancingResult`) |

Diagnostics from all layers share a single `ValidationResult` so a developer
sees one ordered list.

---

## Reading a diagnostic

Every diagnostic carries:

| Field | What it tells you |
|---|---|
| `severity` | `Error` (structural problem, may affect interpretation), `Warning` (something to look at, processing continues), `Info` (advisory) |
| `category` | `Envelope`, `SegmentCount`, `ControlNumber`, `Structure`, or `Syntax` — useful for routing diagnostics to the right team |
| `code` | Stable machine identifier (e.g. `TX_HL_ORPHAN`) — never changes once shipped, safe to alert/filter on |
| `message` | Human-readable explanation including segment positions and any §2.3.1 reference |
| `position` | Byte offset / segment index in the source file, when known |

The `code` is your stable contract. The `message` may be reworded over time
for clarity — don't pattern-match against it.

---

## Validation Concepts

Skip this section if you already know X12.

### Envelope
X12 wraps every payload in three nested envelopes: **ISA/IEA** at the outer
"interchange" level, **GS/GE** at the "functional group" level, and **ST/SE**
at the individual "transaction set" level. Each pair has matching control
numbers; the trailer reports a count that must match what was actually sent.
The envelope tracker enforces all of that.

### Segments
A segment is one line of an X12 file — `CLM*CLAIM001*500*...~`. The first
field is the segment ID (`CLM` here); the rest are positional elements.

### Loops
Many segments come in groups called **loops**, identified by their first
("trigger") segment. For example:

- A claim is loop **2300**, triggered by `CLM`. Everything from a `CLM`
  segment until the next `CLM` (or a higher-level trigger) belongs to that
  claim.
- A service line is loop **2400**, triggered by `LX`, nested inside a 2300.

Loops have:
- A **trigger segment** (the first one)
- A **repeat cap** (e.g. up to 50 service lines per claim)
- A **parent** (or alternative parents) — the loops it's allowed to nest in
- A **member-segment set** — which segment IDs may appear directly in it
  (everything else either opens a child loop or is misplaced)

Some segment IDs (`NM1`, in particular) trigger many different loops; they
are disambiguated by a qualifier element such as `NM101` (the entity
identifier code). `NM1*82~` opens "Rendering Provider Name" (`2310B`),
`NM1*85~` opens "Billing Provider Name" (`2010AA`), and so on.

### HL hierarchy
The `HL` segment defines an X12 base-standard hierarchical structure with
four positional elements: `HL01` (unique ID), `HL02` (parent's HL01),
`HL03` (level code, e.g. 20=Information Source, 22=Subscriber,
23=Dependent), `HL04` (child flag: 1 if this HL has children, 0 if not).
In 837, the billing provider, subscriber, and patient each get an HL.
The HL hierarchy validator checks IDs are sequential, parent references
exist and precede their children, and child flags match reality.

### Placement
Once the recognizer assigns each segment to a loop, the placement validator
asks two questions:

1. **Trigger placement** — when a segment that could open a loop arrives,
   is its target loop's parent currently in scope? If not, it's a misplaced
   trigger (`TX_TRIGGER_PARENT_MISSING`).
2. **Member placement** — for non-trigger segments, is the segment listed
   as a member of the loop it ended up in? If not, it's a misplaced member
   (`TX_SEGMENT_NOT_MEMBER`). Segments with no loop at all (orphans before
   the first loop opens) get `TX_SEGMENT_OUT_OF_LOOP`.

---

## Envelope diagnostics

These come from the envelope tracker and apply to every transaction type.
Category is `Envelope`, `SegmentCount`, or `ControlNumber`.

### `ISA_NOT_FIRST` — Error
**Plain English:** The first segment in the file should be `ISA` — the
interchange header. We found something else first.
**X12 detail:** Every X12 file begins with `ISA`. Anything before it (extra
whitespace beyond newlines, stray segments, partial transactions) is a
structural error.

### `NESTED_ISA` — Error
**Plain English:** A second `ISA` appeared before the first interchange was
closed.
**X12 detail:** A new `ISA` was encountered while a prior interchange's
`IEA` had not yet been seen. Interchanges cannot nest.

### `MISSING_IEA` — Error
**Plain English:** An `ISA` opened an interchange but no closing `IEA` was
ever found.
**X12 detail:** `IEA` is required to close every `ISA`. Likely cause:
truncated file or stripped trailer.

### `ISA_IEA_MISMATCH` — Error
**Plain English:** The closing `IEA` doesn't match the opening `ISA` (their
control numbers disagree).
**X12 detail:** `ISA13` (Interchange Control Number) must equal `IEA02`.
A mismatch means the trailer was generated against a different envelope.

### `NESTED_GS` — Error
**Plain English:** A second `GS` (functional group) appeared while the
previous one was still open.
**X12 detail:** Each `GS` must be closed by `GE` before another `GS` opens.

### `MISSING_GE` — Error
**Plain English:** A `GS` opened a functional group but no closing `GE` was
seen.
**X12 detail:** `GE` is required to close every `GS`.

### `GS_GE_MISMATCH` — Error
**Plain English:** The closing `GE` doesn't match the opening `GS` (control
numbers disagree).
**X12 detail:** `GS06` (Group Control Number) must equal `GE02`.

### `NESTED_ST` — Error
**Plain English:** A second `ST` (transaction set) appeared before the
previous one closed with `SE`.
**X12 detail:** Each `ST` must be closed by `SE` before another `ST` opens.

### `MISSING_SE` — Error
**Plain English:** An `ST` opened a transaction but no closing `SE` was seen.
**X12 detail:** `SE` is required to close every `ST`.

### `ST_SE_MISMATCH` — Error
**Plain English:** The closing `SE` doesn't match the opening `ST` (control
numbers disagree).
**X12 detail:** `ST02` (Transaction Set Control Number) must equal `SE02`.

### `SEGMENT_COUNT_MISMATCH` — Error
**Plain English:** The `SE` trailer says the transaction had N segments,
but we actually saw a different number.
**X12 detail:** `SE01` must equal the actual count of segments from `ST`
through `SE` inclusive.

### `TRANSACTION_COUNT_MISMATCH` — Error
**Plain English:** The `GE` trailer claims a transaction-set count that
doesn't match what we found.
**X12 detail:** `GE01` must equal the number of `ST/SE` pairs in the group.

### `GROUP_COUNT_MISMATCH` — Error
**Plain English:** The `IEA` trailer claims a functional-group count that
doesn't match what we found.
**X12 detail:** `IEA01` must equal the number of `GS/GE` pairs in the
interchange.

### `UNEXPECTED_SEGMENT` — Warning
**Plain English:** A segment appeared outside any open envelope.
**X12 detail:** Content segments must live inside `ST/SE`. Anything between
envelopes or before the first `ISA` falls here.

### `UNSUPPORTED_TRANSACTION` — Warning
**Plain English:** The `ST01` transaction-set identifier isn't one the engine
recognizes.
**X12 detail:** Validation continues at the envelope level, but no
transaction-specific rules apply.

### `UNEXPECTED_IEA` / `UNEXPECTED_GE` / `UNEXPECTED_SE` — Error
**Plain English:** A trailer segment appeared without a corresponding
opener.
**X12 detail:** Stray `IEA`/`GE`/`SE` segments — a trailer with no
matching opener earlier in the stream.

### `ST_WITHOUT_GS` / `GS_WITHOUT_ISA` — Error
**Plain English:** A transaction or group was opened outside its required
outer envelope.
**X12 detail:** `ST` must be inside `GS/GE`; `GS` must be inside `ISA/IEA`.

---

## Transaction-structure diagnostics

Emitted by `TransactionValidator`. Category is `Structure`.

### `TX_MISSING_REQUIRED_SEGMENT` — Error
**Plain English:** A segment the spec lists as Required for this
transaction type wasn't present.
**X12 detail:** The §2.3.1 listing for the transaction set marks the
segment as USG **R** (Required); the message names which segment and
its role (e.g. "CLM segment required for 837P: Claim Information").
**Common causes:** generator bug, EDI mapping omission, truncated transaction.
**How to fix:** add the missing segment with the values from your source data.

### `TX_MISSING_RECOMMENDED_SEGMENT` — Warning
**Plain English:** A segment the spec lists as recommended (situational
and commonly populated) wasn't present.
**X12 detail:** The §2.3.1 listing marks the segment as Situational (USG
**S**) but in this engine's rule table it's flagged as expected for the
transaction type. Won't block processing, but worth investigating.

### `TX_UNKNOWN_TYPE` — Warning
**Plain English:** The engine has no validation rules for this transaction
type yet.
**X12 detail:** `loops_for(type)` and the rule table returned null. Common
for transaction types not yet implemented; envelope checks still apply.

---

## HL hierarchy diagnostics

Emitted by `HlValidator` for any transaction containing `HL` segments
(837P/I/D, 270/271, 276/277, 277CA, 278). All category `Structure`. The
checks come from the X12 base standard, not from any TR3, so they apply
identically across transactions.

### `TX_HL_MALFORMED_ID` — Error
**Plain English:** An HL segment's ID number (the first field) is missing
or isn't a number.
**X12 detail:** `HL01` (Hierarchical ID Number) must be a positive integer.
**How to fix:** ensure each HL01 is populated with a sequential integer
starting at 1.

### `TX_HL_DUPLICATE_ID` — Error
**Plain English:** Two HL segments share the same ID number.
**X12 detail:** Every `HL01` value within a transaction must be unique.
**Common causes:** generator regression after an iteration loop reset bug.

### `TX_HL_ID_NOT_SEQUENTIAL` — Error
**Plain English:** The HL ID numbers aren't 1, 2, 3, … in document order.
**X12 detail:** Per the X12 standard, `HL01` begins at 1 and increments by 1
in the order the HL segments appear.

### `TX_HL_SELF_PARENT` — Error
**Plain English:** An HL claims to be its own parent.
**X12 detail:** `HL02` equals `HL01` — a structural impossibility.

### `TX_HL_ORPHAN` — Error
**Plain English:** An HL references a parent that doesn't exist in this
transaction.
**X12 detail:** `HL02` points to an `HL01` value that no earlier `HL`
declared.
**Common causes:** subscriber HL points at a billing-provider HL number
that was never sent.

### `TX_HL_FORWARD_PARENT` — Error
**Plain English:** An HL's parent appears later in the file than the child.
**X12 detail:** `HL02` must reference an `HL01` that precedes the current
segment. Parents come before children.

### `TX_HL_CHILD_FLAG_MISMATCH` — Warning
**Plain English:** An HL says it has subordinate HL segments but none
follow (or vice versa).
**X12 detail:** `HL04` = `"1"` declares that child HLs follow; `"0"` or
empty declares no children. The validator compares this flag against the
actual HL02 references in the transaction.
**Why a warning:** parsers can still interpret the transaction; the flag is
metadata, not load-bearing.

---

## Loop-structure diagnostics

Emitted by `LoopValidator` and `LoopPlacementValidator`. Apply to
transactions with a `loops_for(type)` entry — currently 837P, 835, 270,
271, 276, 277, 277CA, 278, 820, and 999 (10 transactions, encoded from
their respective TR3 §2.3.1 transaction-set listings). All category
`Structure`.

### `TX_LOOP_REPEAT_EXCEEDED` — Error
**Plain English:** A loop repeated more times than the spec allows for its
position.
**X12 detail:** The §2.3.1 "LOOP RPT" cap was exceeded — e.g. more than 50
service lines (`LX`) within a single claim (loop 2400 cap is 50), or more
than 100 claims under one HL (loop 2300 cap is 100). Counted by the
recognizer via the trigger segment within its parent scope, so the same
mechanism applies uniformly across every transaction with an encoded loop
index.

### `TX_TRIGGER_PARENT_MISSING` — Error
**Plain English:** A segment that opens a new loop appeared without its
required parent loop in scope.
**X12 detail:** An exclusively-trigger segment (e.g. `CLM`, `LX`, `HL`,
`NM1` with a recognized qualifier) matched a known loop in the model, but
none of that loop's acceptable parents was on the open-loop stack. The
diagnostic message lists which loop(s) the segment could have opened.
**Common causes:**
- a `CLM` outside any subscriber HL (the HL hierarchy was forgotten),
- a `SVC` (in 835) without a `CLP` opening loop 2100 first.

### `TX_SEGMENT_OUT_OF_LOOP` — Error
**Plain English:** A segment appeared outside any defined loop.
**X12 detail:** The segment isn't an envelope segment, isn't one of the
transaction's allowed header/summary segments, and the open-loop stack is
empty at this position.
**Common causes:** a member segment (N3, REF, …) appearing between the
transaction header and the first loop trigger.

### `TX_SEGMENT_NOT_MEMBER` — Error
**Plain English:** A segment ended up inside a loop where it's not allowed.
**X12 detail:** The segment was assigned to a loop instance by the
recognizer, but the §2.3.1 member-segment list for that loop doesn't
include the segment's ID. Examples:
- `N3` (address) directly inside loop 2300 — N3 belongs in the various
  name loops (2010xx, 2310C, 2310E/F, 2420C/E/G/H), not in the claim body.
- `SV1` (Professional Service) inside loop 2300 with no prior `LX` —
  SV1 is a 2400 member, not a 2300 member.
**Common causes:** missing a trigger segment (typically an `NM1` or `LX`)
that would have opened the correct child loop before the misplaced member.

---

## Financial diagnostics

Emitted by the facts extractor during balancing checks.

### `TX_FINANCIAL_IMBALANCE` — Warning
**Plain English:** The transaction's declared payment total doesn't match
the sum of its line-item amounts.
**X12 detail (835):** `BPR02` (Total Actual Provider Payment Amount) is
compared against the sum of `CLP04` (Claim Payment Amount) across all 2100
claim loops. A delta beyond rounding tolerance fires the diagnostic.
**X12 detail (837):** `CLM02` (Total Claim Charge Amount) is compared
against the sum of `SV1*02` (Charge Amount) across the claim's service
lines.
**Why a warning:** common in real-world 835s due to legitimate
adjustments (CAS), withholds, or reporting omissions — but it's always
worth a look.

---

## Code Index

For programmatic filtering. Codes are stable strings; messages may
change. Category and severity are listed for routing decisions.

| Code | Severity | Category |
|---|---|---|
| `ISA_NOT_FIRST` | Error | Envelope |
| `NESTED_ISA` | Error | Envelope |
| `MISSING_IEA` | Error | Envelope |
| `ISA_IEA_MISMATCH` | Error | ControlNumber |
| `NESTED_GS` | Error | Envelope |
| `MISSING_GE` | Error | Envelope |
| `GS_GE_MISMATCH` | Error | ControlNumber |
| `GS_WITHOUT_ISA` | Error | Envelope |
| `NESTED_ST` | Error | Envelope |
| `MISSING_SE` | Error | Envelope |
| `ST_SE_MISMATCH` | Error | ControlNumber |
| `ST_WITHOUT_GS` | Error | Envelope |
| `SEGMENT_COUNT_MISMATCH` | Error | SegmentCount |
| `TRANSACTION_COUNT_MISMATCH` | Error | SegmentCount |
| `GROUP_COUNT_MISMATCH` | Error | SegmentCount |
| `UNEXPECTED_SEGMENT` | Warning | Envelope |
| `UNEXPECTED_IEA` | Error | Envelope |
| `UNEXPECTED_GE` | Error | Envelope |
| `UNEXPECTED_SE` | Error | Envelope |
| `UNSUPPORTED_TRANSACTION` | Warning | Envelope |
| `TX_MISSING_REQUIRED_SEGMENT` | Error | Structure |
| `TX_MISSING_RECOMMENDED_SEGMENT` | Warning | Structure |
| `TX_UNKNOWN_TYPE` | Warning | Structure |
| `TX_HL_MALFORMED_ID` | Error | Structure |
| `TX_HL_DUPLICATE_ID` | Error | Structure |
| `TX_HL_ID_NOT_SEQUENTIAL` | Error | Structure |
| `TX_HL_SELF_PARENT` | Error | Structure |
| `TX_HL_ORPHAN` | Error | Structure |
| `TX_HL_FORWARD_PARENT` | Error | Structure |
| `TX_HL_CHILD_FLAG_MISMATCH` | Warning | Structure |
| `TX_LOOP_REPEAT_EXCEEDED` | Error | Structure |
| `TX_TRIGGER_PARENT_MISSING` | Error | Structure |
| `TX_SEGMENT_OUT_OF_LOOP` | Error | Structure |
| `TX_SEGMENT_NOT_MEMBER` | Error | Structure |
| `TX_FINANCIAL_IMBALANCE` | Warning | Structure |

---

## Reference

- Class/method/property English-to-X12 translation: [mappings.md](mappings.md)
- X12 IGs cited in messages:
  - 005010X222A1 — 837 Professional
  - 005010X221  — 835 Health Care Claim Payment/Advice
