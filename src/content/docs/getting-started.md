# Getting Started with ExactEDI

> **5 minutes from "I have an X12 file" to "I'm querying claims data in Python."**
>
> This guide walks one happy path: you have an 837P claims file, you want to parse it, validate it, extract PHI-safe analytical facts, and load the results into a pandas DataFrame. Everything else lives in the reference docs — links at the end.

---

## Before you start

You need three things:

1. **An ExactEDI build for your platform.** Download from your customer portal — wheels for Python, binaries for the CLI, headers for C/C++. Beta is portal-gated; ExactEDI is not on PyPI or NuGet by design.
2. **A license file.** Your portal also issues a `.lic` file (trial or paid tier). Save it as `exactedi.lic` in your working directory, or set `EXACTEDI_LICENSE=/path/to/license.lic`. Without a license, the trial fallback gives you 14 days of parse + validate features.
3. **An 837P file to work with.** The portal tarball includes a `samples/` directory at the top level with three synthetic, no-PHI files: `sample_837p.x12`, `sample_835.x12`, and `sample_malformed.x12`. After extracting the tarball, `cd` into the extract root and the relative path `samples/sample_837p.x12` used throughout this guide will work as-is. See [`samples/README.md`](../samples/README.md) for what each file is. Substitute your own data once you've followed the guide through.

System requirements: Python 3.9+, Linux/macOS/Windows, x64 or ARM64.

---

## Step 1 — Install (30 seconds)

```bash
pip install ./exactedi-1.0.0b3-cp311-cp311-manylinux_2_17_x86_64.whl[pandas]
```

The exact wheel filename depends on your platform and Python version. The `[pandas]` extra pulls in pandas for the DataFrame walkthrough at the end; drop it if you only need the core SDK.

Verify the install:

```bash
python -c "import exactedi; print(exactedi.version(), exactedi.license_status())"
```

```
1.0.0-beta.3 Trial
```

If you see `Trial`, the license auto-discovered your `.lic` file or fell back to the 14-day trial. If you see an error about a missing license, point `EXACTEDI_LICENSE` at your `.lic` file and re-run.

---

## Step 2 — Parse the file from the CLI

Before writing any Python, see what's in the file at the segment level. The CLI `parse` command emits one JSON object per X12 segment — useful for debugging and shell pipelines.

```bash
exactedi parse samples/sample_837p.x12 | head -3
```

```json
{"elem":["00","          ","00","          ","ZZ","SENDER837      ","ZZ","RECEIVER837    ","230201","1030","^","00501","000000003","0","P",":"],"pos":{"byte":0,"idx":0},"seg":"ISA"}
{"elem":["HC","SENDER837","RECEIVER837","20230201","1030","3","X","005010X222A1"],"pos":{"byte":108,"idx":1},"seg":"GS"}
{"elem":["837","0003","005010X222A1"],"pos":{"byte":169,"idx":2},"seg":"ST"}
```

Each line is a segment with its elements, segment index, and byte offset. Pipe to `jq` if you want to filter:

```bash
exactedi parse samples/sample_837p.x12 | jq 'select(.seg == "CLM")'
```

This is the lowest-level view of the file. Most of the time you won't need it — but when something is wrong with a file, the byte-offset trail is exactly what you'll grep through.

---

## Step 3 — Validate envelope structure

Before extracting anything, confirm the file is structurally sound. In beta, `validate` covers **SNIP Level 1** (syntax and envelope structure) plus envelope-level **SNIP Level 3** (control-number balancing). HIPAA SNIP 2-4 IG conformance is shipping incrementally — see [validation roadmap](#validation-coverage-beta) below.

```bash
exactedi validate samples/sample_837p.x12
```

```
File: "sample_837p.x12"
Valid: Yes
Segments: 14
Interchanges: 1
Groups: 1
Transactions: 1
Errors: 0
Warnings: 0
```

(The CLI prints two `[INFO]` log lines to stderr before the report — `entering trial mode` and `Validating <path>`. Redirect with `2>/dev/null` if you want only the report on stdout.)

What "Valid: Yes" means **today** (beta): the file's syntax is well-formed, all envelopes pair correctly, and control numbers/counts reconcile. It does **not** yet mean the file conforms to the HIPAA 837P implementation guide — that's SNIP 2-4 territory and on the roadmap.

What it looks like when something is broken — try the bundled malformed sample:

```bash
exactedi validate samples/sample_malformed.x12
```

```
File: "sample_malformed.x12"
Valid: No
Segments: 6
Interchanges: 1
Groups: 1
Transactions: 1
Errors: 2
Warnings: 0

Diagnostics:
  [ERROR] MISSING_SE: Transaction 0001 is missing SE (segment #2, byte offset 0)
  [ERROR] TRANSACTION_COUNT_MISMATCH: Transaction count mismatch: expected=1, actual=0 (segment #4, byte offset 222)
```

Every diagnostic carries a byte offset — point your editor at it and you'll land on the broken line.

---

## Step 4 — Extract PHI-safe facts

The `explain` command parses the file and emits structured analytical facts with patient identifiers stripped (HIPAA Safe Harbor scope: names, addresses, member IDs, DOB, account numbers). What you get is what an LLM or a dashboard can safely consume.

```bash
exactedi explain samples/sample_837p.x12 > facts.json
cat facts.json
```

```json
{
  "counts": {
    "groups": 1,
    "interchanges": 1,
    "segments": 14,
    "transactions": 1
  },
  "file": {
    "file_size": 526,
    "filename": "sample_837p.x12",
    "parse_timestamp": "2026-05-12T15:26:32Z"
  },
  "transactions": [
    {
      "billing_provider_npi": "1234567890",
      "claim_id": "CLM0001",
      "diagnosis_codes": ["M79606", "I10"],
      "group_control": "3",
      "interchange_control": "000000003",
      "original_reference": "REF12345",
      "patient_responsibility": 0.0,
      "payer_id": "BLUEPAYER001",
      "payer_name": "BLUE SHIELD",
      "place_of_service": "11",
      "procedure_codes": ["99213-25", "99214"],
      "service_dates": ["20230115-20230115"],
      "service_line_count": 2,
      "total_charge": 750.0,
      "total_payment": 0.0,
      "transaction_control": "0003",
      "type": "837P"
    }
  ],
  "validation": {
    "errors": 0,
    "warnings": 0
  }
}
```

Notice what's **not** there: no patient name, no DOB, no member ID, no subscriber address. `claim_id` is the provider-assigned claim control number (CLM01), not a patient identifier. `total_charge` matches the CLM02 segment total from the file ($750). This is the JSON shape your downstream analytics should consume.

---

## Step 5 — Do the same thing in Python

Now write the equivalent in code. The Python SDK's `analyze_file` returns the same facts as a typed `AnalysisResult` object:

```python
import exactedi

result = exactedi.analyze_file("samples/sample_837p.x12")

print(f"License:      {exactedi.license_status()}")
print(f"Valid:        {result.is_valid}")
print(f"Transactions: {result.transaction_count}")
print()

for tx in result.transactions:
    print(f"  Type:        {tx.type}")
    print(f"  Claim ID:    {tx.claim_id}")
    print(f"  Payer:       {tx.payer_name}")
    print(f"  Provider:    {tx.billing_provider_npi}")
    print(f"  Total:       ${tx.total_charge:,.2f}")
    print(f"  Diagnoses:   {', '.join(tx.diagnosis_codes)}")
    print(f"  Procedures:  {', '.join(tx.procedure_codes)}")
```

```
License:      Trial
Valid:        True
Transactions: 1

  Type:        837P
  Claim ID:    CLM0001
  Payer:       BLUE SHIELD
  Provider:    1234567890
  Total:       $750.00
  Diagnoses:   M79606, I10
  Procedures:  99213-25, 99214
```

A real claims file from a payer or clearinghouse will have hundreds or thousands of transactions — the loop above scales without changes.

---

## Step 6 — Answer a real question with pandas

Now the payoff. Swap the single-claim sample for your own multi-claim 837P file (anything from a daily batch to a monthly extract) and ask: **which payers do we bill the most?**

```python
import exactedi

# Substitute your own batched 837P file here. The bundled samples are
# single-transaction; real-world claims files have hundreds to thousands.
result = exactedi.analyze_file("path/to/your_837p_batch.x12")

df = exactedi.to_dataframe(result)

billing_by_payer = (
    df.groupby("payer_name")["total_charge"]
      .agg(["count", "sum", "mean"])
      .sort_values("sum", ascending=False)
)

print(billing_by_payer)
```

Illustrative output against a realistic batch:

```
                count        sum     mean
payer_name
BLUE CROSS        412  524130.50  1272.16
AETNA             287  391847.25  1364.97
CIGNA             198  248901.00  1257.07
UHC               103  118455.75  1150.05
```

That's the end of the happy path. You went from a 1 MB X12 file to ranked analytics in 6 lines of Python. Swap `to_dataframe` for whatever your warehouse loader expects, and you've shortened a multi-week integration to an afternoon.

**Performance reference:** on commodity hardware (Ryzen 7 5700G), the same flow against a 1 GB 837P file runs in ~8 seconds end-to-end with constant ~5 MB memory for parse, and ~8.6 KB/tx retained for the facts. For files larger than memory, use the streaming API documented in [PYTHON_GUIDE.md](PYTHON_GUIDE.md#streaming).

---

## Validation coverage (beta)

So you know what you have today vs. what's landing through GA:

| SNIP Level | Coverage | Status |
|---|---|---|
| **1 — EDI syntax / structure** | Full | Shipping (beta) |
| **3 — Envelope balancing** | Control numbers, segment counts | Shipping (beta) |
| **3 — Claim/monetary balancing** | CLP totals vs. line sums, transaction totals | GA target |
| **2 — HIPAA IG conformance** | 837P/I/D and 835 | GA target |
| **2 — HIPAA IG conformance** | 270/271, 276/277, 278, 820, 834, 999 | Partial GA, full v1.x |
| **4 — Inter-segment situational** | Conditional element rules | GA target (837/835 first) |
| **5 — External code sets** | ICD-10, HCPCS, CARC, RARC, POS, taxonomy bundled; CPT BYO | Partial GA, full v1.x |
| **6 — Product-type variance** | 837P vs. I vs. D, etc. | Partial GA, full v1.x |
| **7 — Trading-partner companion guides** | Declarative DSL, library-side enforcement | v1.x marquee |

The diagnostic shape on `result.validation` is forward-compatible — new SNIP levels add new diagnostic codes, they don't change the fields you already consume. Pin to a beta version, take updates, no rewrite at GA.

---

## What to read next

- **[PYTHON_GUIDE.md](PYTHON_GUIDE.md)** — full Python SDK reference: async, streaming, options, error handling
- **[X12 mapping reference](x12-mapping/index.md)** *(in progress)* — English-to-X12 vocabulary: "patient NPI" → "NM109 in Loop 2010BA where NM101=IL"
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** — consuming JSONL/JSON output in downstream warehouses and pipelines
- **[facts_json_schema.md](facts_json_schema.md)** — full schema for the `explain` output
- **[SDK_OVERVIEW.md](SDK_OVERVIEW.md)** — architecture, C/C++/.NET bindings, build-from-source
- **[INSTALLATION.md](INSTALLATION.md)** — platform-specific install, license file locations, troubleshooting
- **[LICENSE_GUIDE.md](LICENSE_GUIDE.md)** — license file format, hardware binding, tier features

If something here doesn't work as advertised, that's a bug — file it with your beta support contact and include the file (or a structural twin without PHI) plus the exact command and output.
