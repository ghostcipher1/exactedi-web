const capabilities = [
  { label: "Parse", desc: "837 claims and 835 remittances to structured JSON / JSONL" },
  { label: "Validate", desc: "SNIP Types 1–3: structural, loop structure, and monetary balancing (beta.4)" },
  { label: "Extract", desc: "PHI-safe facts — HIPAA Safe Harbor compliant output" },
  { label: "Stream", desc: "1 GB files in under one minute; multi-gigabyte files on standard hardware" },
  { label: "CLI", desc: "Pipe output into ETL and pipeline workflows" },
  { label: "On-premises", desc: "Zero network calls — all processing is local" },
  { label: "Deterministic", desc: "Same input, same output, every run" },
  { label: "Bindings", desc: "Python and .NET — licensed via the customer portal" },
];

export default function Capabilities() {
  return (
    <section className="py-16 md:py-24 bg-stedi-gray-light">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-stedi-dark-text mb-10 md:mb-14">
          What it does
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {capabilities.map((cap) => (
            <div
              key={cap.label}
              className="rounded-xl border border-stedi-gray-border bg-white p-5 md:p-6 hover:border-stedi-green/30 transition-colors"
            >
              <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">{cap.label}</h4>
              <p className="text-xs text-stedi-gray-text leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}