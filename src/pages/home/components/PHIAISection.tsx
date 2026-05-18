export default function PHIAISection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-stedi-dark-text mb-4">
              From arcane segment loops to structured English your code can reason about.
            </h2>
            <p className="text-base text-stedi-gray-text mb-6 leading-relaxed">
              ExactEDI&apos;s Explain layer produces structured, de-identified analytical data with human-readable field names designed for LLM consumption, analytics warehouses, and direct SQL queries. HIPAA Safe Harbor compliant — same input always produces the same output.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Patient identifiers stripped per Safe Harbor",
                "Human-readable field names — no memorizing loop references",
                "Structured JSON schema for RAG, retrieval, and warehouse ETL",
                "Deterministic redaction — auditable and reproducible",
                "~8.6 KB per transaction (post beta.2 optimization)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-stedi-gray-text">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    <i className="ri-check-line text-stedi-green" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/request-access"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors"
            >
              Request beta access
              <i className="ri-arrow-right-line text-xs" />
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-stedi-gray-border bg-[#0f1520]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161d2d] border-b border-white/10">
              <span className="text-xs text-gray-500 font-mono">facts.json</span>
            </div>
            <div className="p-5 overflow-x-auto">
              <pre className="text-xs font-mono leading-5 text-gray-300">
                <code>{`{
  "transaction_type": "837P",
  "control_number": "000012345",
  "submitter": {
    "npi": "[REDACTED]",
    "name": "Acme Medical Group"
  },
  "claims": [
    {
      "claim_id": "[REDACTED]",
      "charge_amount": 1250.00,
      "diagnosis_codes": ["J44.1", "E11.9"],
      "procedure_codes": ["99213", "93000"],
      "service_date": "2026-04-15"
    }
  ],
  "fact_schema_version": "1.0.0-beta.2"
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}