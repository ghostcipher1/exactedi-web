# Release Notes

Notable ExactEDI Engine releases. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); versions follow [Semantic Versioning](https://semver.org/).

For SNIP coverage by release, see the [validation roadmap](/roadmap) and the [validation coverage table](getting-started.md#validation-coverage-beta) in Getting Started.

---

## [1.0.0-beta.4] — 2026-05-21

Second design-partner beta. The headline is a major expansion of validation —
§2.3.1 loop-aware structural checks now span ten transaction types, joined by
HL-hierarchy, transaction-structure, and 835/837 monetary-balancing checks —
plus a .NET async API and a multi-platform SDK packaging pipeline that builds
native libraries, Python wheels, and the NuGet package on every supported OS.

### Added

- **Tier-2 loop-aware structural validation** across ten transaction types:
  837P, 835, 270, 271, 276, 277, 277CA, 278, 820, and 999. Validates loop
  nesting, trigger segments, segment placement, and repeat-count caps against
  the §2.3.1 implementation-guide loop structure. The LoopValidator is
  recognizer-driven and generic across transaction types.
- **HL-hierarchy and transaction-structure validation** — structural integrity
  of the X12 Hierarchical Level chain (HL01–HL04) plus required- and
  recommended-segment checks per transaction type. The `HlValidator` and
  `TransactionValidator` are now wired into the validation engine.
- **Monetary balancing** — 835 BPR02-vs-CLP04 payment sums and 837
  CLM02-vs-SV1 line-charge sums are reconciled, emitting `TX_FINANCIAL_IMBALANCE`
  when totals disagree.
- **.NET async API** — `AnalyzeFileAsync`, `AnalyzeStringAsync`,
  `AnalyzeMemoryAsync`, `ValidateFileAsync`, and `AnalyzeFileStreamingAsync`,
  each returning `Task<T>` and honoring a `CancellationToken`. See the
  [C# / .NET SDK guide](CSHARP_GUIDE.md#async-api).
- The C ABI — and the .NET binding — now expose all 14 transaction types.
- X12 mapping reference documentation, including [Validation Diagnostics](x12-mapping/diagnostics.md),
  a plain-English reference for all **35** diagnostic codes.

### Changed

- The .NET managed assembly now ships as `ExactEDI.Sdk.dll`. The NuGet package
  id (`ExactEDI`) and the `ExactEDI` namespace are unchanged, so consuming code
  is unaffected.

### Fixed

- Patched a `System.Text.Json` security advisory in the .NET binding.
- Corrected 277CA 2000D HL03 (`PT`, not `23`) and an 835 N1/NM1 spec violation
  surfaced by the new validation.
- The SDK packaging pipeline now builds native libraries (Linux, Windows,
  macOS), Python wheels, and the NuGet package across all supported platforms.

### Upgrade notes

- Install the beta.4 wheel or NuGet package from your customer portal. The
  [Getting Started](getting-started.md) guide uses `1.0.0b4` wheels and documents
  the expanded `validate` output.
- If you filter diagnostics programmatically, review the
  [diagnostics reference](x12-mapping/diagnostics.md) — new loop-structure and
  financial-balancing codes ship with this release.

---

## Earlier betas

| Version | Date | Highlights |
|---------|------|------------|
| **1.0.0-beta.3** | 2026-05-12 | Bundled samples, Getting Started guide, validation roadmap framing, `total_charge` fix |
| **1.0.0-beta.2** | 2026-05-10 | StreamReader for large files, async C++ API, Python pandas stubs |
| **1.0.0-beta.1** | 2026-04-28 | Initial design-partner beta |

Full engine changelog history ships in the portal tarball as `CHANGELOG.md`.
