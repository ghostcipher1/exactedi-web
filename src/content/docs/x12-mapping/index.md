# X12 Mapping Reference

Two companion documents make up the English-to-X12 bridge. Both are written
so an X12-novice developer and an EDI engineer get what they need from the
same page — every entry has both a plain-English summary and the underlying
X12 reference.

- **[mappings.md](mappings.md)** — English-to-X12 lookup for the SDK's
  classes, methods, and properties. Start here if you're integrating the
  library and want to understand which X12 concept each API surface maps to.
- **[diagnostics.md](diagnostics.md)** — Plain-English reference for every
  validation diagnostic the engine can emit, with severity, category,
  X12-jargon detail, common causes, and remediation. Start here if a
  validation report surfaced a code you don't recognize.

Stable contract: diagnostic **codes** (`TX_HL_ORPHAN`, etc.) and API
**method names** do not change after they ship. Diagnostic **messages** and
documentation prose may be reworded over time for clarity — don't
pattern-match against them programmatically.
