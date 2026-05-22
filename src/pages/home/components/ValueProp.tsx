const values = [
  {
    title: "On-premises.",
    description:
      "All processing runs locally. PHI never leaves your network — zero network dependencies.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="2" stroke="#1E6FEB" strokeWidth="2" />
        <path d="M10 8V6a4 4 0 018 0v2" stroke="#1E6FEB" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Deterministic.",
    description:
      "Identical input always produces identical output — auditable and testable in regulated environments.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4v16M8 14l6 6 6-6" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h20" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Drop into your pipeline.",
    description:
      "CLI-first with JSON / JSONL output. Python and .NET bindings. Licensed via the customer portal.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="3" stroke="#1E6FEB" strokeWidth="2" />
        <path d="M10 14l3 3 5-5" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ValueProp() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {values.map((v) => (
            <div key={v.title} className="group">
              <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-stedi-green-light">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-stedi-dark-text mb-2">{v.title}</h3>
              <p className="text-sm text-stedi-gray-text leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}