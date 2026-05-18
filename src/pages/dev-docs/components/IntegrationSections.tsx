export default function IntegrationSections() {
  return (
    <>
      {/* Integrating ExactEDI Header */}
      <div className="mb-6 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-plug-line text-stedi-green text-sm" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stedi-green">
            Integrating ExactEDI
          </span>
        </div>
      </div>

      {/* Overview */}
      <div id="overview" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Overview
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          ExactEDI provides three primary output formats for integration:
        </p>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Format</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Command</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium">JSONL</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">parse</td>
                <td className="px-4 py-3 text-stedi-gray-text">Segment-level streaming data for detailed analysis</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium">Facts JSON</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">explain</td>
                <td className="px-4 py-3 text-stedi-gray-text">PHI-safe transaction summaries for analytics and AI</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium">SQLite</td>
                <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">import</td>
                <td className="px-4 py-3 text-stedi-gray-text">Persistent storage for historical analysis</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-stedi-gray-text leading-relaxed">
          This guide focuses on JSONL and Facts JSON formats. For SQLite integration, see DATABASE_SCHEMA.md.
        </p>
      </div>

      {/* JSONL Output Format */}
      <div id="jsonl-output-format" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          JSONL Output Format (parse command)
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">parse</code> command outputs line-delimited JSON (JSONL), with one JSON object per segment.
        </p>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">File Layout</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          Each line is a complete JSON object representing a single X12 segment. Files can be processed incrementally without loading the entire dataset into memory.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-gray-300 font-mono whitespace-pre leading-relaxed">
{`{"seg":"ISA","elem":[...],"pos":{...}}
{"seg":"GS","elem":[...],"pos":{...}}
{"seg":"ST","elem":[...],"pos":{...}}
...
{"seg":"SE","elem":[...],"pos":{...}}
{"seg":"GE","elem":[...],"pos":{...}}
{"seg":"IEA","elem":[...],"pos":{...}}`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Record Structure</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          Each JSONL record contains three fields:
        </p>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">seg</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">Segment identifier (ISA, GS, ST, CLM, CLP, etc.)</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">elem</td>
                <td className="px-4 py-3 text-stedi-gray-text">array</td>
                <td className="px-4 py-3 text-stedi-gray-text">Array of element values in segment order</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">pos</td>
                <td className="px-4 py-3 text-stedi-gray-text">object</td>
                <td className="px-4 py-3 text-stedi-gray-text">Position metadata</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Position Metadata</h3>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">idx</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">Zero-indexed segment position in file</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">byte</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">Byte offset of segment start</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Element Array</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">elem</code> array contains segment elements in their original order, preserving leading/trailing whitespace, empty elements, and component separators.
        </p>

        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Example ISA Segment</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "seg": "ISA",
  "elem": [
    "00",
    "          ",
    "00",
    "          ",
    "ZZ",
    "PAYER835       ",
    "ZZ",
    "PROVIDER835    ",
    "230220",
    "1100",
    "^",
    "00501",
    "000000005",
    "0",
    "P",
    ":"
  ],
  "pos": {
    "byte": 0,
    "idx": 0
  }
}`}
          </code>
        </div>

        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Example CLM Segment (837P Claim)</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "seg": "CLM",
  "elem": [
    "CLM0001",
    "1500.00",
    "",
    "",
    "11:B:1",
    "Y",
    "A",
    "Y",
    "Y"
  ],
  "pos": {
    "byte": 2048,
    "idx": 42
  }
}`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Streaming Characteristics</h3>
        <div className="space-y-3 mb-4">
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">Memory Efficiency</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              JSONL output is streamed line-by-line. Files of any size can be processed with constant memory usage by reading one line at a time.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">Deterministic Ordering</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Segments appear in the exact order they occur in the source X12 file.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">No Lookahead</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Each segment is output immediately after parsing. No buffering or transaction grouping occurs.
            </p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Common Use Cases</h3>
        <ul className="space-y-2 text-sm text-stedi-gray-text leading-relaxed">
          <li><strong className="text-stedi-dark-text">Filter Specific Segments:</strong> Extract only CLM (claim header) segments for claim-level analysis.</li>
          <li><strong className="text-stedi-dark-text">Transaction Boundary Detection:</strong> Identify ST/SE pairs to group segments into transactions.</li>
          <li><strong className="text-stedi-dark-text">Element Extraction:</strong> Parse specific element positions for targeted data extraction (e.g., NPI from NM109).</li>
        </ul>
      </div>

      {/* Facts JSON Format */}
      <div id="facts-json-format" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Facts JSON Format (explain command)
        </h2>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">explain</code> command outputs a single JSON object containing PHI-safe summaries of the entire file.
        </p>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Schema Version</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          Current schema: <strong className="text-stedi-dark-text">1.0.0</strong>. The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">schema_version</code> field in the output indicates the format version. Consumers should validate this field and handle unknown versions gracefully.
        </p>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Root Object Structure</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "file": { /* file metadata */ },
  "counts": { /* envelope counts */ },
  "transactions": [ /* transaction summaries */ ],
  "validation": { /* error/warning summary */ }
}`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">File Metadata</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "file": {
    "filename": "enhanced_835.x12",
    "file_size": 663,
    "parse_timestamp": "2026-01-14T00:59:31Z"
  }
}`}
          </code>
        </div>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Required</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">filename</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">Yes</td>
                <td className="px-4 py-3 text-stedi-gray-text">Original filename (no path)</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">file_size</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">Yes</td>
                <td className="px-4 py-3 text-stedi-gray-text">File size in bytes</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">parse_timestamp</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">Yes</td>
                <td className="px-4 py-3 text-stedi-gray-text">ISO 8601 UTC timestamp when file was parsed</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Envelope Counts</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "counts": {
    "interchanges": 1,
    "groups": 1,
    "transactions": 1,
    "segments": 16
  }
}`}
          </code>
        </div>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Required</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">interchanges</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">Yes</td>
                <td className="px-4 py-3 text-stedi-gray-text">Number of ISA/IEA envelope pairs</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">groups</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">Yes</td>
                <td className="px-4 py-3 text-stedi-gray-text">Number of GS/GE envelope pairs</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">transactions</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">Yes</td>
                <td className="px-4 py-3 text-stedi-gray-text">Number of ST/SE transaction sets</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">segments</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">Yes</td>
                <td className="px-4 py-3 text-stedi-gray-text">Total segment count</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Transaction Summaries</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "transactions": [
    {
      "type": "835",
      "claim_id": "CLM0001",
      "claim_status": "1",
      "group_control": "5",
      "interchange_control": "000000005",
      "transaction_control": "0005",
      "original_reference": "TRC0987654321",
      "payer_id": "MEGAPAYER123",
      "payer_name": "MEGA INSURANCE",
      "billing_provider_npi": "1112223333",
      "total_charge": 1250.0,
      "total_payment": 600.0,
      "patient_responsibility": 650.0,
      "service_line_count": 2,
      "procedure_codes": ["99213", "99214"]
    }
  ]
}`}
          </code>
        </div>

        <h4 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-3">Common Transaction Fields</h4>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Tx Types</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">type</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">All</td>
                <td className="px-4 py-3 text-stedi-gray-text">Transaction type: 837P, 837I, 837D, 835</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">transaction_control</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">All</td>
                <td className="px-4 py-3 text-stedi-gray-text">ST02/SE02 control number</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">group_control</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">All</td>
                <td className="px-4 py-3 text-stedi-gray-text">GS06/GE02 control number</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">interchange_control</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">All</td>
                <td className="px-4 py-3 text-stedi-gray-text">ISA13/IEA02 control number</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">claim_id</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">All</td>
                <td className="px-4 py-3 text-stedi-gray-text">CLM01 (837) or CLP01 (835)</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">total_charge</td>
                <td className="px-4 py-3 text-stedi-gray-text">number</td>
                <td className="px-4 py-3 text-stedi-gray-text">All</td>
                <td className="px-4 py-3 text-stedi-gray-text">Sum of billed amounts</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">total_payment</td>
                <td className="px-4 py-3 text-stedi-gray-text">number</td>
                <td className="px-4 py-3 text-stedi-gray-text">835</td>
                <td className="px-4 py-3 text-stedi-gray-text">Sum of paid amounts (0.0 for 837)</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">patient_responsibility</td>
                <td className="px-4 py-3 text-stedi-gray-text">number</td>
                <td className="px-4 py-3 text-stedi-gray-text">835</td>
                <td className="px-4 py-3 text-stedi-gray-text">Patient responsibility amount</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">service_line_count</td>
                <td className="px-4 py-3 text-stedi-gray-text">integer</td>
                <td className="px-4 py-3 text-stedi-gray-text">All</td>
                <td className="px-4 py-3 text-stedi-gray-text">Number of service lines (SV1/SV2/SVC)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-3">837-Specific Fields</h4>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">billing_provider_npi</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">NPI from 2010AA loop NM109</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">payer_id</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">Payer identifier from 2010BB loop NM109</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">payer_name</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">Payer name from 2010BB loop NM103</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">place_of_service</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">CLM05-1 (837P) or CLM05 (837I)</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">diagnosis_codes</td>
                <td className="px-4 py-3 text-stedi-gray-text">array[string]</td>
                <td className="px-4 py-3 text-stedi-gray-text">ICD-10 codes from HI segments</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">procedure_codes</td>
                <td className="px-4 py-3 text-stedi-gray-text">array[string]</td>
                <td className="px-4 py-3 text-stedi-gray-text">CPT/HCPCS codes from SV1/SV2 segments</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">service_dates</td>
                <td className="px-4 py-3 text-stedi-gray-text">array[string]</td>
                <td className="px-4 py-3 text-stedi-gray-text">Date ranges from DTP segments</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">original_reference</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">REF segment reference numbers</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-3">835-Specific Fields</h4>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">claim_status</td>
                <td className="px-4 py-3 text-stedi-gray-text">string</td>
                <td className="px-4 py-3 text-stedi-gray-text">CLP02 status code</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-dark-text font-medium font-mono text-xs">procedure_codes</td>
                <td className="px-4 py-3 text-stedi-gray-text">array[string]</td>
                <td className="px-4 py-3 text-stedi-gray-text">Procedure codes from SVC segments</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Validation Summary</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "validation": {
    "errors": 0,
    "warnings": 0
  }
}`}
          </code>
        </div>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          When errors or warnings are present, a <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">diagnostics</code> array is added:
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
          <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "validation": {
    "errors": 1,
    "warnings": 0
  },
  "diagnostics": [
    "[ERROR] SEGMENT_COUNT_MISMATCH: SE01=11, actual=10 (segment #11, byte offset 486)"
  ]
}`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Optional Fields</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          The following fields appear only when relevant data is present:
        </p>
        <ul className="space-y-1 text-sm text-stedi-gray-text leading-relaxed mb-4">
          <li><code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">diagnosis_codes</code> — Only for 837 transactions with HI segments</li>
          <li><code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">procedure_codes</code> — Only when SV1/SV2/SVC segments contain parseable codes</li>
          <li><code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">service_dates</code> — Only when DTP segments are present</li>
          <li><code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">diagnostics</code> — Only when errors or warnings exist</li>
        </ul>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">PHI Safety</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          Facts JSON excludes all protected health information:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-xs font-semibold text-stedi-dark-text mb-2">Not Included</p>
            <ul className="space-y-1 text-xs text-stedi-gray-text">
              <li>Patient names, dates of birth, addresses</li>
              <li>Medical record numbers (MRNs)</li>
              <li>Social Security Numbers</li>
              <li>Subscriber/member IDs</li>
              <li>Account numbers</li>
              <li>Free-text descriptions</li>
            </ul>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-green-light p-4">
            <p className="text-xs font-semibold text-stedi-dark-text mb-2">Included (PHI-safe)</p>
            <ul className="space-y-1 text-xs text-stedi-gray-text">
              <li>Control numbers (ISA/GS/ST)</li>
              <li>Payer and provider NPIs</li>
              <li>Organization names (payers, providers)</li>
              <li>Service dates (not patient DOB)</li>
              <li>Diagnosis and procedure codes</li>
              <li>Monetary amounts</li>
            </ul>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Versioning Considerations</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          The schema follows semantic versioning:
        </p>
        <ul className="space-y-2 text-sm text-stedi-gray-text leading-relaxed mb-4">
          <li><strong className="text-stedi-dark-text">Major version change (2.0.0):</strong> Breaking changes, field renames, structure changes</li>
          <li><strong className="text-stedi-dark-text">Minor version change (1.1.0):</strong> New optional fields added</li>
          <li><strong className="text-stedi-dark-text">Patch version change (1.0.1):</strong> Documentation updates, no schema changes</li>
        </ul>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`facts = json.loads(facts_json)
schema_version = facts.get("schema_version", "1.0.0")

if schema_version.startswith("1."):
    process_v1_facts(facts)
else:
    raise ValueError(f"Unsupported schema version: {schema_version}")`}
          </code>
        </div>
      </div>

      {/* Integration Examples */}
      <div id="integration-examples" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Integration Examples
        </h2>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Python: Processing JSONL Output</h3>
        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Streaming Segment Parser</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import json
import sys

def process_jsonl(file_path):
    segment_counts = {}

    with open(file_path, 'r') as f:
        for line_num, line in enumerate(f, 1):
            try:
                record = json.loads(line)
                seg_id = record['seg']
                segment_counts[seg_id] = segment_counts.get(seg_id, 0) + 1

                if seg_id == 'CLM':
                    claim_id = record['elem'][0]
                    charge = float(record['elem'][1])
                    print(f"Claim {claim_id}: $\{charge:.2f}")

                elif seg_id == 'CLP':
                    claim_id = record['elem'][0]
                    status = record['elem'][1]
                    payment = float(record['elem'][3])
                    print(f"Payment {claim_id}: $\{payment:.2f} (status {status})")

            except json.JSONDecodeError as e:
                print(f"Error parsing line {line_num}: {e}", file=sys.stderr)
            except (KeyError, IndexError, ValueError) as e:
                print(f"Error processing line {line_num}: {e}", file=sys.stderr)

    print("\\nSegment Counts:")
    for seg_id, count in sorted(segment_counts.items()):
        print(f"  {seg_id}: {count}")

process_jsonl('claims.jsonl')`}
          </code>
        </div>

        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Extract Transactions</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import json

def extract_transactions(jsonl_path):
    transactions = []
    current_tx = None

    with open(jsonl_path, 'r') as f:
        for line in f:
            record = json.loads(line)
            seg_id = record['seg']

            if seg_id == 'ST':
                current_tx = {
                    'type': record['elem'][0],
                    'control': record['elem'][1],
                    'segments': [record]
                }
            elif seg_id == 'SE':
                if current_tx:
                    current_tx['segments'].append(record)
                    transactions.append(current_tx)
                    current_tx = None
            elif current_tx:
                current_tx['segments'].append(record)

    return transactions

transactions = extract_transactions('claims.jsonl')
for tx in transactions:
    print(f"Transaction {tx['control']} (type {tx['type']}): {len(tx['segments'])} segments")`}
          </code>
        </div>

        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Filter and Transform</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import json
import sys

def extract_npis(jsonl_path, output_csv):
    with open(jsonl_path, 'r') as infile, open(output_csv, 'w') as outfile:
        outfile.write("segment_index,entity_type,npi\\n")

        for line in infile:
            record = json.loads(line)

            if record['seg'] == 'NM1':
                elem = record['elem']
                if len(elem) >= 9 and elem[7] == 'XX':
                    entity_type = elem[0]
                    npi = elem[8]
                    idx = record['pos']['idx']
                    outfile.write(f"{idx},{entity_type},{npi}\\n")

extract_npis('claims.jsonl', 'npis.csv')`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Python: Processing Facts JSON</h3>
        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Basic Analysis</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import json

def analyze_facts(facts_path):
    with open(facts_path, 'r') as f:
        facts = json.load(f)

    print(f"File: {facts['file']['filename']}")
    print(f"Size: {facts['file']['file_size']:,} bytes")
    print(f"Parsed: {facts['file']['parse_timestamp']}")
    print()

    counts = facts['counts']
    print(f"Segments: {counts['segments']:,}")
    print(f"Transactions: {counts['transactions']}")
    print(f"Groups: {counts['groups']}")
    print(f"Interchanges: {counts['interchanges']}")
    print()

    validation = facts['validation']
    print(f"Errors: {validation['errors']}")
    print(f"Warnings: {validation['warnings']}")

    if 'diagnostics' in facts:
        print("\\nDiagnostics:")
        for diag in facts['diagnostics']:
            print(f"  {diag}")
    print()

    total_charge = 0.0
    total_payment = 0.0

    for tx in facts.get('transactions', []):
        tx_type = tx['type']
        charge = tx.get('total_charge', 0.0)
        payment = tx.get('total_payment', 0.0)

        total_charge += charge
        total_payment += payment

        print(f"{tx_type} Transaction {tx['transaction_control']}:")
        print(f"  Claim ID: {tx.get('claim_id', 'N/A')}")
        print(f"  Charge: $\{charge:,.2f}")
        print(f"  Payment: $\{payment:,.2f}")

        if 'procedure_codes' in tx:
            print(f"  Procedures: {', '.join(tx['procedure_codes'])}")

    print()
    print(f"Totals: $\{total_charge:,.2f} charged, $\{total_payment:,.2f} paid")

analyze_facts('facts.json')`}
          </code>
        </div>

        <p className="text-sm font-semibold text-stedi-dark-text mb-2">ETL Pipeline Integration</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import json
import psycopg2
from datetime import datetime

def load_facts_to_postgres(facts_path, db_conn):
    with open(facts_path, 'r') as f:
        facts = json.load(f)

    cursor = db_conn.cursor()

    cursor.execute("""
        INSERT INTO edi_files (filename, file_size, parsed_at, segment_count, is_valid)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """, (
        facts['file']['filename'],
        facts['file']['file_size'],
        facts['file']['parse_timestamp'],
        facts['counts']['segments'],
        facts['validation']['errors'] == 0
    ))

    file_id = cursor.fetchone()[0]

    for tx in facts.get('transactions', []):
        cursor.execute("""
            INSERT INTO transactions (
                file_id, tx_type, control_number, claim_id,
                total_charge, total_payment, service_line_count
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            file_id,
            tx['type'],
            tx['transaction_control'],
            tx.get('claim_id'),
            tx.get('total_charge', 0.0),
            tx.get('total_payment', 0.0),
            tx.get('service_line_count', 0)
        ))

    db_conn.commit()
    cursor.close()

conn = psycopg2.connect("dbname=warehouse user=etl")
load_facts_to_postgres('facts.json', conn)
conn.close()`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">JavaScript/Node.js: Processing JSONL</h3>
        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Streaming Parser</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`const fs = require('fs');
const readline = require('readline');

async function processJSONL(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const segmentCounts = {};
  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;

    try {
      const record = JSON.parse(line);
      const segId = record.seg;

      segmentCounts[segId] = (segmentCounts[segId] || 0) + 1;

      if (segId === 'CLM') {
        const claimId = record.elem[0];
        const charge = parseFloat(record.elem[1]);
        console.log(\`Claim \${claimId}: $\${charge.toFixed(2)}\`);
      }

    } catch (err) {
      console.error(\`Error parsing line \${lineNum}: \${err.message}\`);
    }
  }

  console.log('\\nSegment Counts:');
  Object.entries(segmentCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([seg, count]) => console.log(\`  \${seg}: \${count}\`));
}

processJSONL('claims.jsonl');`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">JavaScript/Node.js: Processing Facts JSON</h3>
        <p className="text-sm font-semibold text-stedi-dark-text mb-2">Summary Report</p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`const fs = require('fs');

function analyzeFacts(factsPath) {
  const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

  console.log(\`File: \${facts.file.filename}\`);
  console.log(\`Size: \${facts.file.file_size.toLocaleString()} bytes\`);
  console.log(\`Parsed: \${facts.file.parse_timestamp}\\n\`);

  console.log(\`Segments: \${facts.counts.segments.toLocaleString()}\`);
  console.log(\`Transactions: \${facts.counts.transactions}\`);
  console.log(\`Validation: \${facts.validation.errors} errors, \${facts.validation.warnings} warnings\\n\`);

  const byType = {};

  for (const tx of facts.transactions || []) {
    const type = tx.type;

    if (!byType[type]) {
      byType[type] = {
        count: 0,
        totalCharge: 0,
        totalPayment: 0
      };
    }

    byType[type].count++;
    byType[type].totalCharge += tx.total_charge || 0;
    byType[type].totalPayment += tx.total_payment || 0;
  }

  console.log('Transaction Summary:');
  for (const [type, stats] of Object.entries(byType)) {
    console.log(\`  \${type}: \${stats.count} transactions\`);
    console.log(\`    Charges: $\${stats.totalCharge.toLocaleString(undefined, {minimumFractionDigits: 2})}\`);
    console.log(\`    Payments: $\${stats.totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2})}\`);
  }
}

analyzeFacts('facts.json');`}
          </code>
        </div>
      </div>

      {/* CLI Integration Patterns */}
      <div id="cli-integration-patterns" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Command-Line Integration Patterns
        </h2>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Shell Pipeline Processing</h3>
        <div className="space-y-3 mb-4">
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 overflow-x-auto">
            <p className="text-xs text-gray-400 mb-1">Extract segment counts:</p>
            <code className="text-sm text-gray-300 font-mono whitespace-pre">
              exactedi parse file.x12 | jq -r &apos;.seg&apos; | sort | uniq -c
            </code>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 overflow-x-auto">
            <p className="text-xs text-gray-400 mb-1">Filter CLM segments:</p>
            <code className="text-sm text-gray-300 font-mono whitespace-pre">
              exactedi parse file.x12 | jq &apos;select(.seg == &quot;CLM&quot;)&apos;
            </code>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 overflow-x-auto">
            <p className="text-xs text-gray-400 mb-1">Convert JSONL to CSV:</p>
            <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`exactedi parse file.x12 | \
  jq -r &apos;[.seg, .pos.idx, .pos.byte] | @csv&apos; > segments.csv`}
            </code>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 overflow-x-auto">
            <p className="text-xs text-gray-400 mb-1">Validate and extract facts:</p>
            <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`exactedi validate file.x12 && \
  exactedi explain file.x12 | jq &apos;.transactions[] | {claim: .claim_id, charge: .total_charge}&apos;`}
            </code>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Batch Processing</h3>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <p className="text-xs text-gray-400 mb-2">Process directory of files:</p>
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`#!/bin/bash
for file in /data/incoming/*.x12; do
  base=$(basename "$file" .x12)

  exactedi parse "$file" > "/data/parsed/\${base}.jsonl"
  exactedi explain "$file" > "/data/facts/\${base}.json"
  exactedi import "$file" --db /data/analytics.db
done`}
          </code>
        </div>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <p className="text-xs text-gray-400 mb-2">Parallel processing with GNU parallel:</p>
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`find /data/incoming -name "*.x12" | \
  parallel -j 4 "exactedi explain {} > /data/facts/{/.}.json"`}
          </code>
        </div>
      </div>

      {/* Error Handling */}
      <div id="error-handling" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Error Handling
        </h2>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">JSONL Parse Errors</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          ExactEDI outputs all parseable segments before encountering errors. Error messages are written to stderr, not stdout.
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`# Separate stdout (JSONL) and stderr (errors)
exactedi parse file.x12 > segments.jsonl 2> parse_errors.log

# Check exit code
if [ $? -ne 0 ]; then
  echo "Parse failed. See parse_errors.log"
fi`}
          </code>
        </div>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import subprocess
import sys

result = subprocess.run(
    ['exactedi', 'parse', 'file.x12'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

if result.returncode == 0:
    for line in result.stdout.splitlines():
        record = json.loads(line)
        # Process record
else:
    print(f"Parse failed: {result.stderr}", file=sys.stderr)
    sys.exit(1)`}
          </code>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Facts JSON Validation Errors</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          When validation errors exist, the Facts JSON still outputs successfully but includes error details:
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`facts = json.load(open('facts.json'))

if facts['validation']['errors'] > 0:
    print("File has validation errors:")
    for diag in facts.get('diagnostics', []):
        print(f"  {diag}")

    if facts['validation']['errors'] > 10:
        raise ValueError("Too many errors, rejecting file")`}
          </code>
        </div>
      </div>

      {/* Performance Considerations */}
      <div id="performance-considerations" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Performance Considerations
        </h2>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Memory Usage</h3>
        <div className="space-y-3 mb-4">
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">JSONL (parse)</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Memory usage: 5-10 MB regardless of file size. Output is streamed line-by-line. Suitable for multi-gigabyte files.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">Facts JSON (explain)</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Memory usage: Proportional to transaction count. Entire JSON object built in memory. For 1 GB files with 100,000+ transactions, expect 10-20 GB RAM usage.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-4">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Recommendation:</strong> Use <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-xs">parse</code> for large files when only segment-level data is needed. Use <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-xs">explain</code> for files under 500 MB or when transaction summaries are required.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Processing Throughput</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          Tested on AMD EPYC 7763 (single-threaded):
        </p>
        <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">File Size</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Segments</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">parse Output Time</th>
                <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">explain Output Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-gray-text">50 MB</td>
                <td className="px-4 py-3 text-stedi-gray-text">280,000</td>
                <td className="px-4 py-3 text-stedi-gray-text">8.2 sec</td>
                <td className="px-4 py-3 text-stedi-gray-text">10.5 sec</td>
              </tr>
              <tr className="border-b border-stedi-gray-border">
                <td className="px-4 py-3 text-stedi-gray-text">200 MB</td>
                <td className="px-4 py-3 text-stedi-gray-text">1,120,000</td>
                <td className="px-4 py-3 text-stedi-gray-text">32.5 sec</td>
                <td className="px-4 py-3 text-stedi-gray-text">45.2 sec</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stedi-gray-text">1 GB</td>
                <td className="px-4 py-3 text-stedi-gray-text">6,544,197</td>
                <td className="px-4 py-3 text-stedi-gray-text">3m 24s</td>
                <td className="px-4 py-3 text-stedi-gray-text">4m 15s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-stedi-gray-text leading-relaxed">
          <strong className="text-stedi-dark-text">Optimization tips:</strong> Process files in parallel using multiple ExactEDI instances. Use <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">parse</code> for filtering before heavy processing. Consider splitting large files by interchange (ISA/IEA) before processing.
        </p>
      </div>

      {/* API Contract Guarantees */}
      <div id="api-contract-guarantees" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          API Contract Guarantees
        </h2>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">JSONL Format Stability</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          The JSONL output format is stable: fields <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">seg</code>, <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">elem</code>, and <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">pos</code> will always be present. Field names and structure will not change. New fields may be added in future versions (ignore unknown fields).
        </p>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Facts JSON Schema Evolution</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          The Facts JSON schema follows semantic versioning: minor version updates add optional fields only; major version updates may rename or restructure fields. Consumers should check the <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">schema_version</code> field.
        </p>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Output Encoding</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
          All output is UTF-8 encoded. Non-ASCII characters in X12 data are preserved as-is.
        </p>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Decimal Precision</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          Monetary amounts in Facts JSON use IEEE 754 double-precision floating-point. For financial calculations requiring exact decimal arithmetic, convert to fixed-point representations:
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre">
            from decimal import Decimal
            total_charge = Decimal(str(tx[&apos;total_charge&apos;]))
          </code>
        </div>
      </div>

      {/* Compliance and PHI Handling */}
      <div id="compliance-and-phi-handling" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Compliance and PHI Handling
        </h2>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">HIPAA Considerations</h3>
        <div className="space-y-3 mb-4">
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">JSONL Output</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Contains raw X12 segment data. May include PHI (patient names, SSNs, addresses in specific segments). Treat as PHI and apply appropriate safeguards.
            </p>
          </div>
          <div className="rounded-lg border border-stedi-gray-border bg-stedi-green-light p-4">
            <p className="text-sm font-semibold text-stedi-dark-text mb-1">Facts JSON Output</p>
            <p className="text-sm text-stedi-gray-text leading-relaxed">
              Designed to be PHI-safe by excluding patient identifiers. Contains only aggregated statistics and codes. Still subject to organizational policies.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-4">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Recommendation:</strong> Apply the same security controls to all ExactEDI output as you would to source X12 files until organizational data governance reviews Facts JSON for PHI content.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Audit Logging</h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
          For compliance, log ExactEDI invocations:
        </p>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`#!/bin/bash
LOG="/var/log/exactedi/audit.log"

echo "$(date -Iseconds) - User: $(whoami) - File: $1" >> "$LOG"
exactedi parse "$1"`}
          </code>
        </div>
      </div>

      {/* Support */}
      <div id="integration-support" className="mb-6 scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
          Support
        </h2>
        <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
              <i className="ri-customer-service-line text-stedi-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-stedi-dark-text mb-1">Integration Support</p>
              <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">
                Professional tier: <a href="mailto:support@exactedi.com" className="text-stedi-green hover:underline">support@exactedi.com</a>
              </p>
              <p className="text-sm text-stedi-gray-text leading-relaxed">
                Enterprise tier: Dedicated Slack channel
              </p>
              <p className="text-sm text-stedi-gray-text leading-relaxed mt-2">
                Documentation: <a href="https://docs.exactedi.com" className="text-stedi-green hover:underline" target="_blank" rel="noopener noreferrer">https://docs.exactedi.com</a>
              </p>
              <p className="text-sm text-stedi-gray-text leading-relaxed mt-2">
                Include sample input/output files and code snippets when reporting integration issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}