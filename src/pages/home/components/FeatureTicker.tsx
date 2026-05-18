const features = [
  {
    icon: <i className="ri-translate text-stedi-green text-2xl" />,
    title: "Explain",
    description: "Read arcane segment loops into structured English with human-readable field names.",
  },
  {
    icon: <i className="ri-bubble-chart-line text-stedi-green text-2xl" />,
    title: "Explain",
    description: "Emit JSONL facts your queries and LLMs can reason about—no loop-reference memorization.",
  },
  {
    icon: <i className="ri-git-merge-line text-stedi-green text-2xl" />,
    title: "Normalize",
    description: "Reconstruct valid X12 from structured facts, business rules, and partner configurations.",
  },
  {
    icon: <i className="ri-send-plane-line text-stedi-green text-2xl" />,
    title: "Normalize",
    description: "Generate outbound 837s, 999 ACKs, and custom transactions from validated data.",
  },
  {
    icon: <i className="ri-shield-check-line text-stedi-green text-2xl" />,
    title: "Validate",
    description: "Deterministic SNIP conformance—same input produces the same diagnostics every run.",
  },
  {
    icon: <i className="ri-fingerprint-line text-stedi-green text-2xl" />,
    title: "Validate",
    description: "Zero-network, zero-surprise validation that stays on your hardware with no hosted API.",
  },
];

export default function FeatureTicker() {
  return (
    <section className="py-12 md:py-16 bg-stedi-gray-light overflow-hidden">
      <div className="relative">
        <div className="flex animate-ticker">
          {[...features, ...features, ...features, ...features].map((feature, i) => (
            <div
              key={i}
              className="shrink-0 w-72 mx-3 p-5 rounded-xl bg-white border border-stedi-gray-border"
            >
              <div className="w-8 h-8 flex items-center justify-center mb-3">
                {feature.icon}
              </div>
              <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-stedi-gray-text leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}