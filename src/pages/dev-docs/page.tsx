import SEO from "@/components/SEO";
import { useConversionPageView } from "@/hooks/useConversionPageView";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";
import Sidebar from "./components/Sidebar";
import IntegrationSections from "./components/IntegrationSections";
import PythonSections from "./components/PythonSections";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

const devDocsJsonLd = {
  "@context": "https://schema.org",
  "@type": ["WebPage", "TechArticle"],
  "name": "Developer Documentation — ExactEDI",
  "description": "Everything you need to parse, validate, and analyze X12 EDI files with ExactEDI. Installation guides, CLI reference, Python SDK, and integration documentation.",
  "url": `${siteUrl}/dev-docs`,
};

export default function DevDocsPage() {
  useConversionPageView("view_dev_docs");
  return (
    <>
      <SEO
        title="Developer Documentation — ExactEDI"
        description="Everything you need to parse, validate, and analyze X12 EDI files with ExactEDI. Installation guides, CLI reference, Python SDK, and integration documentation."
        canonicalPath="/dev-docs"
        keywords="ExactEDI documentation, X12 EDI developer guide, EDI parsing API, Python EDI SDK"
        jsonLd={devDocsJsonLd}
      />
      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Page Header */}
        <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-stedi-dark">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-book-open-line text-stedi-green text-sm" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stedi-green">
                Documentation
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Developer Documentation
            </h1>
            <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
              Everything you need to parse, validate, and analyze X12 EDI files with ExactEDI.
            </p>
          </div>
        </section>

        {/* Content Layout */}
        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex gap-10">
              <Sidebar />

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="max-w-3xl">
                  {/* Intro */}
                  <div className="mb-10 pb-10 border-b border-stedi-gray-border">
                    <p className="text-lg text-stedi-dark-text font-medium mb-3">
                      5 minutes from &quot;I have an X12 file&quot; to &quot;I&apos;m querying claims data in Python.&quot;
                    </p>
                    <p className="text-sm text-stedi-gray-text leading-relaxed">
                      This guide walks one happy path: you have an 837P claims file, you want to parse it, validate it, extract PHI-safe analytical facts, and load the results into a pandas DataFrame. Everything else lives in the reference docs.
                    </p>
                  </div>

                  {/* Before you start */}
                  <div id="before-you-start" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Before you start
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      You need three things:
                    </p>
                    <ol className="space-y-3 mb-4">
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">1</span>
                        <span><strong className="text-stedi-dark-text">An ExactEDI build for your platform.</strong> Download from your customer portal — wheels for Python, binaries for the CLI, headers for C/C++. Beta is portal-gated; ExactEDI is not on PyPI or NuGet by design.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">2</span>
                        <span><strong className="text-stedi-dark-text">A license file.</strong> Your portal also issues a <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">.lic</code> file (trial or paid tier). Save it as <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">exactedi.lic</code> in your working directory, or set <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">EXACTEDI_LICENSE=/path/to/license.lic</code>. Without a license, the trial fallback gives you 14 days of parse + validate features.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">3</span>
                        <span><strong className="text-stedi-dark-text">An 837P file to work with.</strong> The portal tarball includes a <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">samples/</code> directory with three synthetic, no-PHI files. See <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">samples/README.md</code> for what each file is.</span>
                      </li>
                    </ol>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <p className="text-xs text-stedi-gray-text">
                        <strong className="text-stedi-dark-text">System requirements:</strong> Python 3.9+, Linux/macOS/Windows, x64 or ARM64.
                      </p>
                    </div>
                  </div>

                  {/* Step 1 */}
                  <div id="step-1-install" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Step 1 — Install (30 seconds)
                    </h2>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        pip install ./exactedi-1.0.0b3-cp311-cp311-manylinux_2_17_x86_64.whl[pandas]
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      The exact wheel filename depends on your platform and Python version. The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">[pandas]</code> extra pulls in pandas for the DataFrame walkthrough at the end; drop it if you only need the core SDK.
                    </p>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">
                      Verify the install:
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        python -c &quot;import exactedi; print(exactedi.version(), exactedi.license_status())&quot;
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre">
                        1.0.0-beta.3 Trial
                      </code>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div id="step-2-parse" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Step 2 — Parse the file from the CLI
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      Before writing any Python, see what&apos;s in the file at the segment level. The CLI <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">parse</code> command emits one JSON object per X12 segment — useful for debugging and shell pipelines.
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        exactedi parse samples/sample_837p.x12 | head -3
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
                      <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{"seg":"ISA","elem":["00","          ","00","          ","ZZ","SENDER837      ","ZZ","RECEIVER837    ","230201","1030","^","00501","000000003","0","P",":"],"pos":{"idx":0,"byte":0}}
{"seg":"GS","elem":["HC","SENDER837","RECEIVER837","20230201","1030","3","X","005010X222A1"],"pos":{"idx":1,"byte":107}}
{"seg":"ST","elem":["837","0003","005010X222A1"],"pos":{"idx":2,"byte":160}}`}
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed">
                      Each line is a segment with its elements, segment index, and byte offset. Pipe to <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">jq</code> if you want to filter. This is the lowest-level view of the file — but when something is wrong with a file, the byte-offset trail is exactly what you&apos;ll grep through.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div id="step-3-validate" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Step 3 — Validate envelope structure
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      Before extracting anything, confirm the file is structurally sound. In beta, <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">validate</code> covers <strong className="text-stedi-dark-text">SNIP Level 1</strong> (syntax and envelope structure) plus envelope-level <strong className="text-stedi-dark-text">SNIP Level 3</strong> (control-number balancing). HIPAA SNIP 2-4 IG conformance is shipping incrementally.
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        exactedi validate samples/sample_837p.x12
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`File: "samples/sample_837p.x12"
Valid: Yes
Segments: 13
Interchanges: 1
Groups: 1
Transactions: 1
Errors: 0
Warnings: 0`}
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-3">
                      What &quot;Valid: Yes&quot; means <strong className="text-stedi-dark-text">today</strong> (beta): the file&apos;s syntax is well-formed, all envelopes pair correctly, and control numbers/counts reconcile. It does <strong className="text-stedi-dark-text">not</strong> yet mean the file conforms to the HIPAA 837P implementation guide — that&apos;s SNIP 2-4 territory and on the roadmap.
                    </p>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">
                      What it looks like when something is broken — try the bundled malformed sample:
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`File: "samples/sample_malformed.x12"
Valid: No
Segments: 6
Errors: 1

Diagnostics:
  [ERROR] MISSING_SE: Transaction set 0001 (ST at segment #3) is missing its terminating SE segment`}
                      </code>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div id="step-4-extract" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Step 4 — Extract PHI-safe facts
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      The <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">explain</code> command parses the file and emits structured analytical facts with patient identifiers stripped (HIPAA Safe Harbor scope: names, addresses, member IDs, DOB, account numbers). What you get is what an LLM or a dashboard can safely consume.
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        exactedi explain samples/sample_837p.x12 &gt; facts.json
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4 overflow-x-auto">
                      <code className="text-xs text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`{
  "file": {
    "filename": "sample_837p.x12",
    "file_size": 526,
    "parse_timestamp": "2026-05-12T19:30:00Z"
  },
  "counts": {
    "segments": 13,
    "interchanges": 1,
    "groups": 1,
    "transactions": 1
  },
  "transactions": [
    {
      "type": "837P",
      "claim_id": "CLM0001",
      "total_charge": 750.00,
      "payer_name": "BLUE SHIELD",
      "billing_provider_npi": "1234567890",
      "service_dates": ["20230115"],
      "procedure_codes": ["99213", "99214"],
      "diagnosis_codes": ["M79.606", "I10"],
      "service_line_count": 2
    }
  ],
  "validation": {
    "errors": 0,
    "warnings": 0
  }
}`}
                      </code>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm text-amber-800 leading-relaxed">
                        <strong>Notice what&apos;s not there:</strong> no patient name, no DOB, no member ID, no subscriber address. <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-xs">claim_id</code> is the provider-assigned claim control number (CLM01), not a patient identifier. This is the JSON shape your downstream analytics should consume.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div id="step-5-python" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Step 5 — Do the same thing in Python
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      Now write the equivalent in code. The Python SDK&apos;s <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">analyze_file</code> returns the same facts as a typed <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">AnalysisResult</code> object:
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import exactedi

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
    print(f"  Total:       \${tx.total_charge:,.2f}")
    print(f"  Diagnoses:   {', '.join(tx.diagnosis_codes)}")
    print(f"  Procedures:  {', '.join(tx.procedure_codes)}")`}
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`License:      Trial
Valid:        True
Transactions: 1

  Type:        837P
  Claim ID:    CLM0001
  Payer:       BLUE SHIELD
  Provider:    1234567890
  Total:       $750.00
  Diagnoses:   M79.606, I10
  Procedures:  99213, 99214`}
                      </code>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div id="step-6-pandas" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Step 6 — Answer a real question with pandas
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      Now the payoff. Swap the single-claim sample for your own multi-claim 837P file (anything from a daily batch to a monthly extract) and ask: <strong className="text-stedi-dark-text">which payers do we bill the most?</strong>
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
{`import exactedi

# Substitute your own batched 837P file here.
result = exactedi.analyze_file("path/to/your_837p_batch.x12")

df = exactedi.to_dataframe(result)

billing_by_payer = (
    df.groupby("payer_name")["total_charge"]
      .agg(["count", "sum", "mean"])
      .sort_values("sum", ascending=False)
)

print(billing_by_payer)`}
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre leading-relaxed">
{`                count        sum     mean
payer_name
BLUE CROSS        412  524130.50  1272.16
AETNA             287  391847.25  1364.97
CIGNA             198  248901.00  1257.07
UHC               103  118455.75  1150.05`}
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      That&apos;s the end of the happy path. You went from a 1 MB X12 file to ranked analytics in 6 lines of Python. Swap <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">to_dataframe</code> for whatever your warehouse loader expects, and you&apos;ve shortened a multi-week integration to an afternoon.
                    </p>
                    <div className="rounded-lg border border-stedi-green-light p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          <i className="ri-speed-line text-stedi-green" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stedi-dark-text mb-1">Performance reference</p>
                          <p className="text-sm text-stedi-gray-text leading-relaxed">
                            On commodity hardware (Ryzen 7 5700G), the same flow against a 1 GB 837P file runs in ~8 seconds end-to-end with constant ~5 MB memory for parse, and ~8.6 KB/tx retained for the facts. For files larger than memory, use the streaming API.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation Coverage */}
                  <div id="validation-coverage" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Validation coverage (beta)
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      So you know what you have today vs. what&apos;s landing through GA:
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">SNIP Level</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Coverage</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">1 — EDI syntax / structure</td>
                            <td className="px-4 py-3 text-stedi-gray-text">Full</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Shipping (beta)</span>
                            </td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">3 — Envelope balancing</td>
                            <td className="px-4 py-3 text-stedi-gray-text">Control numbers, segment counts</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Shipping (beta)</span>
                            </td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">3 — Claim/monetary balancing</td>
                            <td className="px-4 py-3 text-stedi-gray-text">CLP totals vs. line sums, transaction totals</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stedi-green-light text-stedi-green">GA target</span>
                            </td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">2 — HIPAA IG conformance</td>
                            <td className="px-4 py-3 text-stedi-gray-text">837P/I/D and 835</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stedi-green-light text-stedi-green">GA target</span>
                            </td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">2 — HIPAA IG conformance</td>
                            <td className="px-4 py-3 text-stedi-gray-text">270/271, 276/277, 278, 820, 834, 999</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Partial GA, full v1.x</span>
                            </td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">4 — Inter-segment situational</td>
                            <td className="px-4 py-3 text-stedi-gray-text">Conditional element rules</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stedi-green-light text-stedi-green">GA target (837/835 first)</span>
                            </td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">5 — External code sets</td>
                            <td className="px-4 py-3 text-stedi-gray-text">ICD-10, HCPCS, CARC, RARC, POS, taxonomy bundled; CPT BYO</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Partial GA, full v1.x</span>
                            </td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">6 — Product-type variance</td>
                            <td className="px-4 py-3 text-stedi-gray-text">837P vs. I vs. D, etc.</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Partial GA, full v1.x</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">7 — Trading-partner companion guides</td>
                            <td className="px-4 py-3 text-stedi-gray-text">Declarative DSL, library-side enforcement</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stedi-green-light text-stedi-green">v1.x marquee</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed">
                      The diagnostic shape on <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">result.validation</code> is forward-compatible — new SNIP levels add new diagnostic codes, they don&apos;t change the fields you already consume. Pin to a beta version, take updates, no rewrite at GA.
                    </p>
                  </div>

                  {/* What to read next */}
                  <div id="what-to-read-next" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      What to read next
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { title: "ExactEDI with Python", desc: "Full Python SDK reference: async, streaming, options, error handling" },
                        { title: "X12 mapping reference", desc: "English-to-X12 vocabulary: patient NPI → NM109 in Loop 2010BA where NM101=IL" },
                        { title: "Integration with ExactEDI", desc: "Consuming JSONL/JSON output in downstream warehouses and pipelines" },
                        { title: "Facts JSON Schema", desc: "Full schema for the explain output" },
                        { title: "ExactEDI SDK Overview", desc: "Architecture, C/C++/.NET bindings, build-from-source" },
                        { title: "Installing ExactEDI", desc: "Platform-specific install, license file locations, troubleshooting" },
                        { title: "ExactEDI Licensing", desc: "License file format, hardware binding, tier features" },
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

                  {/* Installing ExactEDI */}
                  <div className="mb-6 pt-4">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-download-line text-stedi-green text-sm" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-stedi-green">
                        Installing ExactEDI
                      </span>
                    </div>
                  </div>

                  {/* System Requirements */}
                  <div id="system-requirements" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      System Requirements
                    </h2>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Operating System</h3>
                    <div className="rounded-lg border border-stedi-gray-border overflow-hidden mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Platform</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Requirements</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">Linux</td>
                            <td className="px-4 py-3 text-stedi-gray-text">RHEL 8+, Ubuntu 20.04+, Debian 11+. x86_64 or ARM64. glibc 2.17+</td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">Windows</td>
                            <td className="px-4 py-3 text-stedi-gray-text">Server 2016+ or Windows 10/11. x64. No runtime dependencies</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-stedi-dark-text font-medium">macOS</td>
                            <td className="px-4 py-3 text-stedi-gray-text">12+ (Monterey). arm64 (Apple Silicon) or x86_64 (Intel)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Hardware</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <p className="text-xs font-semibold text-stedi-dark-text mb-2">Minimum</p>
                        <ul className="space-y-1 text-xs text-stedi-gray-text">
                          <li>CPU: 1 core, 1 GHz</li>
                          <li>RAM: 512 MB</li>
                          <li>Disk: 100 MB free</li>
                        </ul>
                      </div>
                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <p className="text-xs font-semibold text-stedi-dark-text mb-2">Recommended (Production)</p>
                        <ul className="space-y-1 text-xs text-stedi-gray-text">
                          <li>CPU: 4+ cores, 2.5 GHz</li>
                          <li>RAM: 16 GB (8 GB min)</li>
                          <li>Disk: 10 GB free</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Memory Usage by File Size</h3>
                    <div className="rounded-lg border border-stedi-gray-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">File Size</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Transactions</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Parse / Validate</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Explain / Normalize</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-gray-text">&lt; 100 MB</td>
                            <td className="px-4 py-3 text-stedi-gray-text">&lt; 10,000</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~5 MB (streaming)</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~80-90 MB</td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-gray-text">100-500 MB</td>
                            <td className="px-4 py-3 text-stedi-gray-text">10,000-50,000</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~5 MB</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~400-500 MB</td>
                          </tr>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-gray-text">500 MB – 1 GB</td>
                            <td className="px-4 py-3 text-stedi-gray-text">50,000-100,000</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~5 MB</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~700 MB – 1 GB</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-stedi-gray-text">&gt; 1 GB</td>
                            <td className="px-4 py-3 text-stedi-gray-text">&gt; 100,000</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~5 MB</td>
                            <td className="px-4 py-3 text-stedi-gray-text">~1-2 GB</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Linux Installation */}
                  <div id="linux-installation" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Linux Installation
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      ExactEDI is distributed as a statically-linked binary. Installation is extract-and-place — no package manager or dependencies.
                    </p>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 1 — Download and Extract</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`wget https://downloads.exactedi.com/exactedi-linux-x64-v1.0.0.tar.gz
sha256sum exactedi-linux-x64-v1.0.0.tar.gz
tar -xzf exactedi-linux-x64-v1.0.0.tar.gz
cd exactedi-linux-x64-v1.0.0`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 2 — Install Binary</h3>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">For single-user install:</p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`mkdir -p ~/.local/bin
cp bin/exactedi ~/.local/bin/
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`}
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">For system-wide install (requires root):</p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`sudo cp bin/exactedi /usr/local/bin/
sudo chown root:root /usr/local/bin/exactedi
sudo chmod 755 /usr/local/bin/exactedi`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 3 — Verify</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`exactedi --version
exactedi --help`}
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre">
                        ExactEDI Engine v1.0.0
                      </code>
                    </div>
                  </div>

                  {/* Windows Installation */}
                  <div id="windows-installation" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Windows Installation
                    </h2>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 1 — Download and Extract</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`# Verify checksum (optional)
Get-FileHash exactedi-windows-x64-v1.0.0.zip -Algorithm SHA256

# Extract
Expand-Archive -Path exactedi-windows-x64-v1.0.0.zip -DestinationPath "C:\Program Files\ExactEDI"`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 2 — Add to PATH</h3>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">User-level PATH (no admin):</p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$userPath;C:\Program Files\ExactEDI\bin", "User")`}
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">System-level PATH (requires admin):</p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
[Environment]::SetEnvironmentVariable("Path", "$systemPath;C:\Program Files\ExactEDI\bin", "Machine")`}
                      </code>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Restart PowerShell or Command Prompt after modifying PATH for changes to take effect.
                      </p>
                    </div>
                  </div>

                  {/* macOS Installation */}
                  <div id="macos-installation" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      macOS Installation
                    </h2>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 1 — Download and Extract</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`# Apple Silicon
curl -O https://downloads.exactedi.com/exactedi-macos-arm64-v1.0.0.tar.gz

# Intel
curl -O https://downloads.exactedi.com/exactedi-macos-x64-v1.0.0.tar.gz

tar -xzf exactedi-macos-*.tar.gz
cd exactedi-macos-*`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 2 — Install Binary</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`sudo cp bin/exactedi /usr/local/bin/
sudo chmod 755 /usr/local/bin/exactedi`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Step 3 — Handle Gatekeeper</h3>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">
                      On first run, macOS may block the binary. Remove the quarantine attribute:
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        xattr -d com.apple.quarantine /usr/local/bin/exactedi
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed">
                      Or allow via <strong className="text-stedi-dark-text">System Preferences &gt; Security &amp; Privacy &gt; General</strong>.
                    </p>
                  </div>

                  {/* Binary Layout */}
                  <div id="binary-layout" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Binary Layout
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      After extraction, the distribution contains:
                    </p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-xs text-gray-300 font-mono whitespace-pre leading-relaxed">
{`exactedi-linux-x64-v1.0.0/
├── bin/
│   └── exactedi              # Main executable (only required file)
├── docs/
│   ├── INSTALLATION.md
│   ├── getting-started.md
│   ├── LICENSE_GUIDE.md
│   ├── cli_contracts.md
│   └── facts_json_schema.md
├── samples/
│   ├── sample_837p.x12       # Synthetic, no PHI
│   ├── sample_835.x12
│   ├── sample_malformed.x12  # Broken — for diagnostic demos
│   └── README.md
├── LICENSE.txt
└── README.md`}
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <p className="text-sm text-stedi-gray-text leading-relaxed">
                        Only <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">bin/exactedi</code> is required for operation. Samples are synthetic — no real PHI — and can be redistributed freely for evaluation.
                      </p>
                    </div>
                  </div>

                  {/* License File Setup */}
                  <div id="license-file-setup" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      License File Setup
                    </h2>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      ExactEDI searches for license files in this order:
                    </p>
                    <ol className="space-y-2 mb-4">
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">1</span>
                        <span><strong className="text-stedi-dark-text">CLI flag:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">exactedi --license /path/to/license.lic</code></span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">2</span>
                        <span><strong className="text-stedi-dark-text">Environment variable:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">EXACTEDI_LICENSE</code></span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">3</span>
                        <span><strong className="text-stedi-dark-text">Current directory:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">./exactedi.lic</code></span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">4</span>
                        <span><strong className="text-stedi-dark-text">User home:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">~/.exactedi/license.lic</code> (Linux/macOS) or <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">%USERPROFILE%\.exactedi\license.lic</code> (Windows)</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-stedi-gray-text">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stedi-green-light text-stedi-green text-xs font-semibold shrink-0 mt-0.5">5</span>
                        <span><strong className="text-stedi-dark-text">System directory:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">/etc/exactedi/license.lic</code> (Linux only)</span>
                      </li>
                    </ol>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Linux / macOS — User-Specific</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`mkdir -p ~/.exactedi
cp license.lic ~/.exactedi/
chmod 600 ~/.exactedi/license.lic`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Windows — User Profile</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.exactedi"
Copy-Item license.lic "$env:USERPROFILE\.exactedi\"`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">File Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <p className="text-xs font-semibold text-stedi-dark-text mb-1">Linux / macOS</p>
                        <p className="text-xs text-stedi-gray-text">User-specific: <code className="px-1 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">600</code></p>
                        <p className="text-xs text-stedi-gray-text">System-wide: <code className="px-1 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">644</code></p>
                      </div>
                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <p className="text-xs font-semibold text-stedi-dark-text mb-1">Windows</p>
                        <p className="text-xs text-stedi-gray-text">No special permissions required. Use NTFS ACLs for shared environments.</p>
                      </div>
                    </div>
                  </div>

                  {/* First-Run Verification */}
                  <div id="first-run-verification" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      First-Run Verification
                    </h2>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 mt-4">Test 1 — Version Check</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        exactedi --version
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre">
                        ExactEDI Engine v1.0.0
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Test 2 — License Status</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        exactedi license
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4 mb-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre">
{`License: Professional
Organization: Your Organization Name
Expires: 2027-12-31
Features: parse, validate, explain, normalize, import`}
                      </code>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                      If no license is found, the trial fallback activates: <strong className="text-stedi-dark-text">14 days remaining, 10 files remaining</strong>.
                    </p>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Test 3 — Parse Sample File</h3>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">Create a minimal test file:</p>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`cat > test.x12 << 'EOF'
ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *230115*0900*^*00501*000000001*0*P*:~
GS*HC*SENDER*RECEIVER*20230115*0900*1*X*005010X222A1~
ST*837*0001*005010X222A1~
SE*1*0001~
GE*1*1~
IEA*1*000000001~
EOF`}
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
                        exactedi validate test.x12
                      </code>
                    </div>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <code className="text-sm text-stedi-gray-text font-mono whitespace-pre">
{`File: "test.x12"
Valid: Yes
Segments: 6
Interchanges: 1
Groups: 1
Transactions: 1
Errors: 0
Warnings: 0`}
                      </code>
                    </div>
                  </div>

                  {/* Common Installation Issues */}
                  <div id="common-installation-issues" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Common Installation Issues
                    </h2>

                    <div className="space-y-4">
                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">Binary Not Found</h3>
                        <p className="text-sm text-stedi-gray-text leading-relaxed">
                          <strong className="text-stedi-dark-text">Symptom:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">exactedi: command not found</code>
                        </p>
                        <p className="text-sm text-stedi-gray-text leading-relaxed mt-1">
                          <strong className="text-stedi-dark-text">Fix:</strong> Verify <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">/usr/local/bin</code> is in <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">$PATH</code>. Restart your terminal after editing shell config.
                        </p>
                      </div>

                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">Permission Denied (Linux / macOS)</h3>
                        <p className="text-sm text-stedi-gray-text leading-relaxed">
                          <strong className="text-stedi-dark-text">Symptom:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">Permission denied</code>
                        </p>
                        <p className="text-sm text-stedi-gray-text leading-relaxed mt-1">
                          <strong className="text-stedi-dark-text">Fix:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">sudo chmod 755 /usr/local/bin/exactedi</code>
                        </p>
                      </div>

                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">License File Not Found</h3>
                        <p className="text-sm text-stedi-gray-text leading-relaxed">
                          <strong className="text-stedi-dark-text">Symptom:</strong> Trial mode activates when you expect a paid license.
                        </p>
                        <p className="text-sm text-stedi-gray-text leading-relaxed mt-1">
                          <strong className="text-stedi-dark-text">Fix:</strong> Verify the file exists at <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">~/.exactedi/license.lic</code> and is readable. Test with an explicit path: <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">exactedi --license ~/.exactedi/license.lic license</code>.
                        </p>
                      </div>

                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">License Signature Verification Failed</h3>
                        <p className="text-sm text-stedi-gray-text leading-relaxed">
                          <strong className="text-stedi-dark-text">Symptom:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">License file signature verification failed</code>
                        </p>
                        <p className="text-sm text-stedi-gray-text leading-relaxed mt-1">
                          <strong className="text-stedi-dark-text">Fix:</strong> Re-download from your portal. Ensure the file is UTF-8 encoded and was not modified during transfer. Contact support for reissue if needed.
                        </p>
                      </div>

                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">macOS Gatekeeper Block</h3>
                        <p className="text-sm text-stedi-gray-text leading-relaxed">
                          <strong className="text-stedi-dark-text">Fix:</strong> <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">xattr -d com.apple.quarantine /usr/local/bin/exactedi</code>
                        </p>
                      </div>

                      <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                        <h3 className="text-sm font-semibold text-stedi-dark-text mb-1">Windows SmartScreen</h3>
                        <p className="text-sm text-stedi-gray-text leading-relaxed">
                          <strong className="text-stedi-dark-text">Fix:</strong> Click <strong className="text-stedi-dark-text">More info</strong> then <strong className="text-stedi-dark-text">Run anyway</strong>. For enterprise deployment, add an exclusion in Windows Defender.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Environment Variables Reference */}
                  <div id="environment-variables-reference" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Environment Variables Reference
                    </h2>
                    <div className="rounded-lg border border-stedi-gray-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-stedi-gray-light border-b border-stedi-gray-border">
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Variable</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Purpose</th>
                            <th className="text-left px-4 py-3 font-semibold text-stedi-dark-text">Example</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-stedi-gray-border">
                            <td className="px-4 py-3 text-stedi-dark-text font-medium"><code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">EXACTEDI_LICENSE</code></td>
                            <td className="px-4 py-3 text-stedi-gray-text">Path to license file</td>
                            <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">/opt/licenses/exactedi.lic</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-stedi-dark-text font-medium"><code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">EXACTEDI_LOG_FILE</code></td>
                            <td className="px-4 py-3 text-stedi-gray-text">Path for detailed logs</td>
                            <td className="px-4 py-3 text-stedi-gray-text font-mono text-xs">/var/log/exactedi/app.log</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-stedi-gray-text leading-relaxed mt-4">
                      All environment variables are optional. Command-line flags take precedence over environment variables.
                    </p>
                  </div>

                  {/* Uninstallation */}
                  <div id="uninstallation" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Uninstallation
                    </h2>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Linux / macOS</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`# Remove binary
sudo rm /usr/local/bin/exactedi

# Remove user config (optional)
rm -rf ~/.exactedi

# Remove system config (optional)
sudo rm -rf /etc/exactedi`}
                      </code>
                    </div>

                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">Windows</h3>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 mb-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono whitespace-pre">
{`# Remove installation directory
Remove-Item -Recurse -Force "C:\Program Files\ExactEDI"

# Remove user config (optional)
Remove-Item -Recurse -Force "$env:USERPROFILE\.exactedi"

# Remove from PATH (reverse of install steps)`}
                      </code>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div id="installation-next-steps" className="mb-10 pb-10 border-b border-stedi-gray-border scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Next Steps
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { title: "License Management", desc: "License troubleshooting, renewal, and hardware binding" },
                        { title: "CLI Reference", desc: "Complete command documentation for parse, validate, explain, and more" },
                        { title: "Integration Guide", desc: "Consuming ExactEDI output in data pipelines and warehouses" },
                        { title: "Database Schema", desc: "SQLite import feature documentation" },
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

                  {/* Support */}
                  <div id="installation-support" className="mb-6 scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                      Support
                    </h2>
                    <div className="rounded-lg border border-stedi-gray-border bg-stedi-gray-light p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          <i className="ri-customer-service-line text-stedi-green" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stedi-dark-text mb-1">Installation Support</p>
                          <p className="text-sm text-stedi-gray-text leading-relaxed mb-2">
                            Professional tier: <a href="mailto:support@exactedi.com" className="text-stedi-green hover:underline">support@exactedi.com</a>
                          </p>
                          <p className="text-sm text-stedi-gray-text leading-relaxed">
                            Enterprise tier: Use your dedicated support channel.
                          </p>
                          <p className="text-sm text-stedi-gray-text leading-relaxed mt-2">
                            Include <code className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs">exactedi --version</code> output and operating system details in all support requests.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <IntegrationSections />
                  <PythonSections />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}