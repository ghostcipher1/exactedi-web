export default function PythonSections() {
  return (
    <>
      {/* ExactEDI with Python Header */}
      <div className="mb-6 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-terminal-box-line text-stedi-green text-sm" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stedi-green">
            ExactEDI with Python
          </span>
        </div>
      </div>

      {/* Installation */}
      <div id="installation" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Installation
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          ExactEDI for Python is distributed as a platform-specific wheel. Download the correct wheel from your customer portal and install it with pip.
        </p>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Supported Platforms</h3>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Platform</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Wheel Tag</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Python</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-gray-text">Linux x86_64</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">manylinux_2_17_x86_64</td>
                <td className="px-4 py-3 text-stedi-gray-text">3.9 - 3.13</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-gray-text">Linux ARM64</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">manylinux_2_17_aarch64</td>
                <td className="px-4 py-3 text-stedi-gray-text">3.9 - 3.13</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-gray-text">macOS x86_64</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">macosx_13_0_x86_64</td>
                <td className="px-4 py-3 text-stedi-gray-text">3.9 - 3.13</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-gray-text">macOS ARM64</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">macosx_14_0_arm64</td>
                <td className="px-4 py-3 text-stedi-gray-text">3.9 - 3.13</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-gray-text">Windows x64</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">win_amd64</td>
                <td className="px-4 py-3 text-stedi-gray-text">3.9 - 3.13</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Install the Wheel</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre">
            pip install ./exactedi-1.0.0b3-cp311-cp311-manylinux_2_17_x86_64.whl
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Optional Extras</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre">
            pip install exactedi[pandas]   # Includes pandas integration
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Verify Installation</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`python -c "import exactedi; print(exactedi.version(), exactedi.license_status())"
# Output: 1.0.0-beta.3 Trial`}
          </code>
        </div>
      </div>

      {/* Quick Start */}
      <div id="quick-start" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Quick Start
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          Parse, validate, and extract facts from an 837P file in five lines of Python.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import exactedi

result = exactedi.analyze_file("claims_837p.x12")

print(f"Valid: {result.is_valid}")
print(f"Transactions: {result.transaction_count}")
print(f"Total Charge: \${result.total_charge:,.2f}")`}
          </code>
        </div>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">analyze_file</code> function is the fastest way to get from an X12 file to actionable data. It runs parse, validate, and explain in a single pass and returns an <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">AnalysisResult</code> object.
        </p>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">One-Liner to DataFrame</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import exactedi

df = exactedi.to_dataframe(exactedi.analyze_file("claims_837p.x12"))
print(df[["claim_id", "payer_name", "total_charge"]].head())`}
          </code>
        </div>
      </div>

      {/* Module Functions */}
      <div id="module-functions" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Module Functions
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">exactedi</code> module exposes these top-level functions for common workflows.
        </p>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Function</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Returns</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">analyze_file(path)</td>
                <td className="px-4 py-3 text-stedi-gray-text">AnalysisResult</td>
                <td className="px-4 py-3 text-stedi-gray-text">Parse, validate, and explain in one pass</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">parse_file(path)</td>
                <td className="px-4 py-3 text-stedi-gray-text">list[Segment]</td>
                <td className="px-4 py-3 text-stedi-gray-text">Raw segment-level parse</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">validate_file(path)</td>
                <td className="px-4 py-3 text-stedi-gray-text">ValidationReport</td>
                <td className="px-4 py-3 text-stedi-gray-text">Structure validation only</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">explain_file(path)</td>
                <td className="px-4 py-3 text-stedi-gray-text">dict</td>
                <td className="px-4 py-3 text-stedi-gray-text">PHI-safe facts as a plain dict</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">to_dataframe(result)</td>
                <td className="px-4 py-3 text-stedi-gray-text">DataFrame</td>
                <td className="px-4 py-3 text-stedi-gray-text">Convert AnalysisResult to pandas DataFrame</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">to_json(result)</td>
                <td className="px-4 py-3 text-stedi-gray-text">str</td>
                <td className="px-4 py-3 text-stedi-gray-text">Serialize result to JSON string</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">version()</td>
                <td className="px-4 py-3 text-stedi-gray-text">str</td>
                <td className="px-4 py-3 text-stedi-gray-text">Engine version string</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">analyze_file Signature</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`exactedi.analyze_file(
    path: str | Path,
    *,
    options: AnalyzeOptions | None = None,
    callback: Callable[[int, int], None] | None = None
) -> AnalysisResult`}
          </code>
        </div>
        <ul className="space-y-2 text-sm text-stedi-gray-text leading-relaxed mb-4">
          <li><strong className="text-stedi-dark-text">path</strong> — File path to the X12 document</li>
          <li><strong className="text-stedi-dark-text">options</strong> — Optional analysis configuration (see AnalyzeOptions)</li>
          <li><strong className="text-stedi-dark-text">callback</strong> — Progress callback invoked with (segments_processed, total_segments)</li>
        </ul>
      </div>

      {/* Analyzer Class */}
      <div id="analyzer-class" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Analyzer Class
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          For fine-grained control, use the <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">Analyzer</code> class directly. It lets you configure parsing rules, set custom segment handlers, and reuse the same configuration across multiple files.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from exactedi import Analyzer, AnalyzeOptions

opts = AnalyzeOptions(
    strict_delimiters=True,
    skip_validation=False,
    max_errors=100,
    include_raw_segments=False
)

analyzer = Analyzer(options=opts)

result = analyzer.analyze("file1.x12")
result2 = analyzer.analyze("file2.x12")`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">AnalyzeOptions</h3>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Option</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Default</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">strict_delimiters</td>
                <td className="px-4 py-3 text-stedi-gray-text">bool</td>
                <td className="px-4 py-3 text-stedi-gray-text">False</td>
                <td className="px-4 py-3 text-stedi-gray-text">Reject non-standard delimiter usage</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">skip_validation</td>
                <td className="px-4 py-3 text-stedi-gray-text">bool</td>
                <td className="px-4 py-3 text-stedi-gray-text">False</td>
                <td className="px-4 py-3 text-stedi-gray-text">Skip SNIP validation for speed</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">max_errors</td>
                <td className="px-4 py-3 text-stedi-gray-text">int</td>
                <td className="px-4 py-3 text-stedi-gray-text">0</td>
                <td className="px-4 py-3 text-stedi-gray-text">Stop after N errors (0 = unlimited)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">include_raw_segments</td>
                <td className="px-4 py-3 text-stedi-gray-text">bool</td>
                <td className="px-4 py-3 text-stedi-gray-text">False</td>
                <td className="px-4 py-3 text-stedi-gray-text">Include raw segment text in result</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Custom Segment Handler</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`def on_segment(seg, ctx):
    if seg.id == "CLM":
        claim_id = seg.elements[0]
        ctx.claims_seen += 1
        print(f"  Claim {claim_id} (#{ctx.claims_seen})")

analyzer = Analyzer(options=opts)
analyzer.on_segment = on_segment
result = analyzer.analyze("batch.x12")`}
          </code>
        </div>
      </div>

      {/* AnalysisResult */}
      <div id="analysis-result" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          AnalysisResult
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          The object returned by <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">analyze_file</code> and <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">Analyzer.analyze</code>. It bundles parse metadata, validation status, and extracted transaction facts.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`AnalysisResult(
    file_name="claims_837p.x12",
    file_size=125840,
    parse_timestamp=datetime(2026, 5, 12, 14, 30, 0, tzinfo=timezone.utc),
    is_valid=True,
    transaction_count=47,
    interchange_count=1,
    group_count=1,
    segment_count=1243,
    validation=ValidationSummary(errors=0, warnings=1),
    transactions=[TransactionFacts(...), ...],
    diagnostics=[...],
    raw_segments=None  # only if include_raw_segments=True
)`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Properties</h3>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Property</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">file_name</td>
                <td className="px-4 py-3 text-stedi-gray-text">str</td>
                <td className="px-4 py-3 text-stedi-gray-text">Base filename (no path)</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">file_size</td>
                <td className="px-4 py-3 text-stedi-gray-text">int</td>
                <td className="px-4 py-3 text-stedi-gray-text">Size in bytes</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">parse_timestamp</td>
                <td className="px-4 py-3 text-stedi-gray-text">datetime</td>
                <td className="px-4 py-3 text-stedi-gray-text">UTC timestamp when parsing completed</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">is_valid</td>
                <td className="px-4 py-3 text-stedi-gray-text">bool</td>
                <td className="px-4 py-3 text-stedi-gray-text">True if no validation errors</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">transaction_count</td>
                <td className="px-4 py-3 text-stedi-gray-text">int</td>
                <td className="px-4 py-3 text-stedi-gray-text">Number of ST/SE transaction sets</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">segment_count</td>
                <td className="px-4 py-3 text-stedi-gray-text">int</td>
                <td className="px-4 py-3 text-stedi-gray-text">Total segments parsed</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">transactions</td>
                <td className="px-4 py-3 text-stedi-gray-text">list[TransactionFacts]</td>
                <td className="px-4 py-3 text-stedi-gray-text">One per transaction set</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">diagnostics</td>
                <td className="px-4 py-3 text-stedi-gray-text">list[str]</td>
                <td className="px-4 py-3 text-stedi-gray-text">Error/warning messages if any</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Methods</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`result.to_dict()      # -> dict (JSON-serializable)
result.to_json()      # -> str
result.summary()      # -> str (human-readable one-liner)`}
          </code>
        </div>
      </div>

      {/* TransactionFacts */}
      <div id="transaction-facts" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          TransactionFacts
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          Each transaction in an X12 file becomes a <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">TransactionFacts</code> object inside <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">AnalysisResult.transactions</code>. All fields are PHI-safe — no patient identifiers.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`TransactionFacts(
    type="837P",
    claim_id="CLM0001",
    transaction_control="0001",
    group_control="1",
    interchange_control="000000001",
    payer_name="BLUE SHIELD",
    billing_provider_npi="1234567890",
    total_charge=750.00,
    total_payment=0.0,
    patient_responsibility=0.0,
    service_line_count=2,
    procedure_codes=["99213", "99214"],
    diagnosis_codes=["M79.606", "I10"],
    service_dates=["20230115"],
    place_of_service="11",
    original_reference="REF12345"
)`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Common Fields</h3>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">X12 Source</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">type</td>
                <td className="px-4 py-3 text-stedi-gray-text">str</td>
                <td className="px-4 py-3 text-stedi-gray-text">ST01 / GS01</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">claim_id</td>
                <td className="px-4 py-3 text-stedi-gray-text">str</td>
                <td className="px-4 py-3 text-stedi-gray-text">CLM01 (837) / CLP01 (835)</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">payer_name</td>
                <td className="px-4 py-3 text-stedi-gray-text">str</td>
                <td className="px-4 py-3 text-stedi-gray-text">NM103 in Loop 2010BB</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">billing_provider_npi</td>
                <td className="px-4 py-3 text-stedi-gray-text">str</td>
                <td className="px-4 py-3 text-stedi-gray-text">NM109 in Loop 2010AA</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">total_charge</td>
                <td className="px-4 py-3 text-stedi-gray-text">float</td>
                <td className="px-4 py-3 text-stedi-gray-text">Sum of CLM02 or SV102</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">procedure_codes</td>
                <td className="px-4 py-3 text-stedi-gray-text">list[str]</td>
                <td className="px-4 py-3 text-stedi-gray-text">SV101-1 / SVC01-1</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">diagnosis_codes</td>
                <td className="px-4 py-3 text-stedi-gray-text">list[str]</td>
                <td className="px-4 py-3 text-stedi-gray-text">HI01-1, HI02-1, ...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Async API */}
      <div id="async-api" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Async API
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          For async frameworks like FastAPI, asyncio, or async Celery tasks, use <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">analyze_file_async</code>. It runs the heavy parsing in a background thread pool and returns an awaitable.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import asyncio
import exactedi

async def process_batch(files):
    tasks = [exactedi.analyze_file_async(f) for f in files]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    for path, result in zip(files, results):
        if isinstance(result, Exception):
            print(f"{path}: FAILED — {result}")
        else:
            print(f"{path}: {result.transaction_count} transactions")

asyncio.run(process_batch(["a.x12", "b.x12", "c.x12"]))`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">AsyncAnalyzer Class</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          For repeated async analysis with shared options, instantiate <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">AsyncAnalyzer</code>:
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from exactedi import AsyncAnalyzer, AnalyzeOptions

opts = AnalyzeOptions(max_errors=50)
analyzer = AsyncAnalyzer(options=opts, max_workers=4)

async def main():
    result = await analyzer.analyze("claims.x12")
    print(result.is_valid)`}
          </code>
        </div>
      </div>

      {/* Pandas Integration */}
      <div id="pandas-integration" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Pandas Integration
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          Convert any <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">AnalysisResult</code> to a pandas DataFrame in one call. Install with the <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">[pandas]</code> extra.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import exactedi

result = exactedi.analyze_file("batch_837p.x12")
df = exactedi.to_dataframe(result)

print(df.columns.tolist())
# ['claim_id', 'type', 'payer_name', 'billing_provider_npi',
#  'total_charge', 'total_payment', 'patient_responsibility',
#  'service_line_count', 'procedure_codes', 'diagnosis_codes',
#  'service_dates', 'place_of_service', 'transaction_control',
#  'group_control', 'interchange_control']`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Common Queries</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`# Billing by payer
billing = df.groupby("payer_name")["total_charge"].agg(["count", "sum", "mean"])

# Top procedures
procedures = df.explode("procedure_codes")["procedure_codes"].value_counts().head(10)

# Flag high-value claims
high_value = df[df["total_charge"] > 5000][["claim_id", "payer_name", "total_charge"]]

# Monthly volume from service_dates
df["service_month"] = pd.to_datetime(df["service_dates"].str[0]).dt.to_period("M")
monthly = df.groupby("service_month").size()`}
          </code>
        </div>
        <div className="rounded-lg border border-stedi-green-light p-4">
          <p className="text-sm text-stedi-dark-text leading-relaxed">
            <strong>Performance note:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">to_dataframe</code> is zero-copy for scalar fields. List fields (procedure_codes, diagnosis_codes) are stored as object dtype. For very large files, consider normalizing list columns into separate tables.
          </p>
        </div>
      </div>

      {/* Streaming Large Files */}
      <div id="streaming-large-files" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Streaming Large Files
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          For files larger than available RAM, use the streaming API. It yields one <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">TransactionFacts</code> at a time without building the full result in memory.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from exactedi import stream_transactions

total_charge = 0.0
count = 0

for tx in stream_transactions("huge_batch.x12"):
    total_charge += tx.total_charge
    count += 1

print(f"Processed {count} transactions, total charge \${total_charge:,.2f}")`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Streaming with Validation</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from exactedi import stream_transactions, AnalyzeOptions

opts = AnalyzeOptions(skip_validation=False)

valid_count = 0
invalid_count = 0

for tx, meta in stream_transactions("huge_batch.x12", options=opts, yield_meta=True):
    if meta.is_valid:
        valid_count += 1
    else:
        invalid_count += 1
        print(f"Invalid transaction {tx.claim_id}: {meta.diagnostics}")`}
          </code>
        </div>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Method</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Memory</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium">analyze_file</td>
                <td className="px-4 py-3 text-stedi-gray-text">~80-90 MB per 100 MB file</td>
                <td className="px-4 py-3 text-stedi-gray-text">Files &lt; 500 MB, full analytics</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium">stream_transactions</td>
                <td className="px-4 py-3 text-stedi-gray-text">~5 MB regardless of size</td>
                <td className="px-4 py-3 text-stedi-gray-text">Files &gt; 500 MB, ETL pipelines</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Handling */}
      <div id="error-handling" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Error Handling
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          ExactEDI raises specific exception types so you can handle different failure modes gracefully.
        </p>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Exception</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">When Raised</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">ParseError</td>
                <td className="px-4 py-3 text-stedi-gray-text">Malformed X12 syntax, missing envelopes</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">ValidationError</td>
                <td className="px-4 py-3 text-stedi-gray-text">SNIP validation failures exceed max_errors</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">LicenseError</td>
                <td className="px-4 py-3 text-stedi-gray-text">Expired, invalid, or missing license</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">FileNotFoundError</td>
                <td className="px-4 py-3 text-stedi-gray-text">Standard library — file path invalid</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">RuntimeError</td>
                <td className="px-4 py-3 text-stedi-gray-text">Internal engine failure (rare)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Graceful Handling Example</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import exactedi
from exactedi.exceptions import ParseError, ValidationError, LicenseError

def safe_analyze(path):
    try:
        return exactedi.analyze_file(path)
    except ParseError as e:
        print(f"Malformed file: {e}")
        return None
    except ValidationError as e:
        print(f"Validation failed: {e}")
        # Still return partial results if available
        return e.partial_result
    except LicenseError as e:
        print(f"License issue: {e}")
        raise SystemExit(1)

result = safe_analyze("unknown.x12")`}
          </code>
        </div>
      </div>

      {/* Working with JSON Output */}
      <div id="working-with-json-output" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Working with JSON Output
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          Every result object can be serialized to JSON for APIs, queues, or document stores.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import exactedi
import json

result = exactedi.analyze_file("claims.x12")

# Built-in serialization
json_str = result.to_json(indent=2)

# Or manual with custom hooks
payload = {
    "source": "nightly_etl",
    "parsed_at": result.parse_timestamp.isoformat(),
    "transactions": [t.to_dict() for t in result.transactions],
    "summary": {
        "valid": result.is_valid,
        "tx_count": result.transaction_count,
        "total_charge": result.total_charge
    }
}

json_str = json.dumps(payload, default=str)`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Pretty-Print Facts</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from exactedi import explain_file
import json

facts = explain_file("claims.x12")
print(json.dumps(facts, indent=2, default=str))`}
          </code>
        </div>
      </div>

      {/* Batch Processing */}
      <div id="batch-processing" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Batch Processing
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          Process a directory of files with progress tracking and error collection.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from pathlib import Path
import exactedi
from exactedi import Analyzer

def process_directory(input_dir, output_dir):
    analyzer = Analyzer()
    results = []

    files = sorted(Path(input_dir).glob("*.x12"))
    print(f"Found {len(files)} files")

    for i, path in enumerate(files, 1):
        print(f"[{i}/{len(files)}] {path.name} ... ", end="", flush=True)

        try:
            result = analyzer.analyze(str(path))
            results.append(result)

            # Save JSON sidecar
            out_path = Path(output_dir) / f"{path.stem}.json"
            out_path.write_text(result.to_json())

            status = "OK" if result.is_valid else "WARN"
        except Exception as e:
            status = f"ERR: {e}"

        print(status)

    return results

results = process_directory("/data/incoming", "/data/processed")`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">With concurrent.futures</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from concurrent.futures import ProcessPoolExecutor
import exactedi

def analyze_one(path):
    try:
        return exactedi.analyze_file(path)
    except Exception as e:
        return {"file": path, "error": str(e)}

files = ["a.x12", "b.x12", "c.x12", "d.x12"]

with ProcessPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(analyze_one, files))`}
          </code>
        </div>
      </div>

      {/* Flask Integration */}
      <div id="flask-integration" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Flask Integration
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          Build a lightweight REST endpoint that accepts X12 uploads and returns PHI-safe JSON.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from flask import Flask, request, jsonify
import exactedi
import tempfile
import os

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    with tempfile.NamedTemporaryFile(suffix=".x12", delete=False) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        result = exactedi.analyze_file(tmp_path)
        return jsonify({
            "valid": result.is_valid,
            "transactions": [t.to_dict() for t in result.transactions],
            "counts": {
                "segments": result.segment_count,
                "transactions": result.transaction_count
            }
        })
    except exactedi.exceptions.ParseError as e:
        return jsonify({"error": "Parse failed", "detail": str(e)}), 422
    finally:
        os.unlink(tmp_path)

if __name__ == "__main__":
    app.run(debug=True)`}
          </code>
        </div>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
          <p className="text-sm text-stedi-gray-text leading-relaxed">
            <strong>Production tip:</strong> Use <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">gunicorn</code> with a sane timeout (30-60s) for large files. Keep uploaded files in tmpfs if memory allows, or on fast NVMe for files over 100 MB.
          </p>
        </div>
      </div>

      {/* FastAPI Integration */}
      <div id="fastapi-integration" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          FastAPI Integration
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          FastAPI&apos;s async model pairs naturally with <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">analyze_file_async</code>. The endpoint stays responsive while the engine works in a background thread pool.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import exactedi
import tempfile
import os

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename.endswith(".x12"):
        raise HTTPException(400, "Expected .x12 file")

    with tempfile.NamedTemporaryFile(suffix=".x12", delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = await exactedi.analyze_file_async(tmp_path)
        return {
            "valid": result.is_valid,
            "file_name": result.file_name,
            "transactions": [t.to_dict() for t in result.transactions],
            "validation": {
                "errors": result.validation.errors,
                "warnings": result.validation.warnings
            }
        }
    except exactedi.exceptions.ParseError as e:
        raise HTTPException(422, detail=str(e))
    finally:
        os.unlink(tmp_path)`}
          </code>
        </div>
        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Pydantic Response Model</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`from pydantic import BaseModel
from typing import List

class TransactionOut(BaseModel):
    claim_id: str
    type: str
    total_charge: float
    payer_name: str

class AnalyzeResponse(BaseModel):
    valid: bool
    transaction_count: int
    transactions: List[TransactionOut]

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(file: UploadFile = File(...)):
    ...`}
          </code>
        </div>
      </div>

      {/* Common Patterns */}
      <div id="common-patterns" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Common Patterns
        </h2>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Filter by Payer</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`result = exactedi.analyze_file("batch.x12")

blue_cross = [tx for tx in result.transactions if tx.payer_name == "BLUE CROSS"]
total = sum(tx.total_charge for tx in blue_cross)
print(f"BLUE CROSS: {len(blue_cross)} claims, \${total:,.2f}")`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Flag Unpaid Claims</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`unpaid = [
    tx.claim_id
    for tx in result.transactions
    if tx.total_payment == 0 and tx.type == "835"
]
print(f"Unpaid claims: {unpaid}")`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Extract All NPIs</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`npis = set()
for tx in result.transactions:
    if tx.billing_provider_npi:
        npis.add(tx.billing_provider_npi)

print(f"Unique billing NPIs: {len(npis)}")`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Merge 837 and 835</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`claim_837 = exactedi.analyze_file("claim_837p.x12")
payment_835 = exactedi.analyze_file("remit_835.x12")

# Match by claim_id
payments = {tx.claim_id: tx for tx in payment_835.transactions}

for claim in claim_837.transactions:
    remit = payments.get(claim.claim_id)
    if remit:
        print(f"{claim.claim_id}: Billed \${claim.total_charge:,.2f}, Paid \${remit.total_payment:,.2f}")
    else:
        print(f"{claim.claim_id}: No remittance found")`}
          </code>
        </div>
      </div>

      {/* Performance Tips */}
      <div id="performance-tips" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Performance Tips
        </h2>

        <div className="space-y-4 mb-4">
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">1. Skip Validation When Re-parsing</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              If you already validated upstream, set <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">skip_validation=True</code> to save 15-25% of parse time.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">2. Reuse the Analyzer</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Instantiating <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">Analyzer</code> once and calling <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">.analyze()</code> many times avoids repeated option parsing overhead.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">3. Use Streaming for ETL</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">stream_transactions</code> keeps memory flat regardless of file size. Pipe results directly into your loader.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">4. Process Pools for Batches</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              The ExactEDI engine releases the GIL during parse. Use <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">ProcessPoolExecutor</code> to saturate CPU across files.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">5. Limit max_errors</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              For batch jobs where one bad file should not hang the pipeline, set <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">max_errors=10</code> to fail fast.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div id="troubleshooting" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Troubleshooting
        </h2>

        <div className="space-y-4 mb-4">
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">ImportError: No module named exactedi</h3>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              The wheel is platform-specific. Confirm you downloaded the wheel matching your OS, architecture, and Python version. Run <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">pip debug --verbose</code> to see compatible tags.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">LicenseError on import</h3>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Place <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">exactedi.lic</code> in your working directory or set <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">EXACTEDI_LICENSE</code>. Without a license, the trial gives 14 days / 10 files.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">ParseError on a known-good file</h3>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Check delimiter characters. Some trading partners use non-standard segment or element terminators. Set <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">strict_delimiters=False</code> to allow relaxed parsing.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">MemoryError on large files</h3>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Switch from <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">analyze_file</code> to <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">stream_transactions</code>. The streaming API uses constant memory regardless of file size.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">Segmentation fault (rare)</h3>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Report with the file that triggers it (synthetic / de-identified is fine). ExactEDI has a 100% safe-mode fallback: set <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">EXACTEDI_SAFE_MODE=1</code> to use the pure-Python parser.
            </p>
          </div>
        </div>
      </div>

      {/* See Also */}
      <div id="see-also" className="mb-6 scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          See Also
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "ExactEDI with C-Sharp", desc: ".NET SDK reference, NuGet package, and async patterns" },
            { title: "ExactEDI SDK Overview", desc: "Architecture, FFI layer, and language bindings" },
            { title: "Integration Guide", desc: "JSONL and Facts JSON formats for downstream pipelines" },
            { title: "CLI Reference", desc: "Complete command-line documentation" },
            { title: "Installing ExactEDI", desc: "Platform-specific binary installation" },
            { title: "Licensing", desc: "License file format, renewal, and hardware binding" },
          ].map((doc) => (
            <a
              key={doc.title}
              href="#"
              className="group rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 hover:border-stedi-green transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-file-text-line text-stedi-green text-xs" />
                </div>
                <span className="text-sm font-semibold text-stedi-dark-text group-hover:text-stedi-green transition-colors">
                  {doc.title}
                </span>
              </div>
              <p className="text-xs text-stedi-gray-text leading-relaxed ml-6">
                {doc.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}