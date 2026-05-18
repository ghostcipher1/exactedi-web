const capabilities = [
  { label: "Parse", desc: "Full X12 envelope tracking with byte-precise source mapping" },
  { label: "Validate", desc: "Deterministic SNIP conformance — same input, same diagnostics, every run" },
  { label: "Explain", desc: "PHI-safe facts with human-readable field names for queries and LLMs" },
  { label: "Generate ACKs", desc: "999 implementation acknowledgments built from structured input" },
  { label: "Normalize", desc: "Reconstruct valid X12 from facts, business rules, and partner configs" },
  { label: "Stream", desc: "Constant memory regardless of file size. No surprises, no OOMs." },
  { label: "Async APIs", desc: "std::future, async/await, Task\u003CT\u003E. Fits your existing concurrency model." },
  { label: "Language bindings", desc: "C, C++, C#/.NET, Python. Drop in. Compile. Ship." },
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