const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="10" height="10" rx="2" stroke="#1E6FEB" strokeWidth="2" />
        <rect x="18" y="4" width="10" height="10" rx="2" stroke="#1E6FEB" strokeWidth="2" />
        <rect x="4" y="18" width="10" height="10" rx="2" stroke="#1E6FEB" strokeWidth="2" />
        <rect x="18" y="18" width="10" height="10" rx="2" stroke="#1E6FEB" strokeWidth="2" />
      </svg>
    ),
    title: "All-in-one EDI",
    description: "Translate, validate, send, and receive any healthcare transaction type — all from one unified platform.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="#1E6FEB" strokeWidth="2" />
        <path d="M16 10v6l4 2" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Control everything",
    description: "Every setting and option is available for self-service configuration — no more waiting on a support queue.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="14" width="20" height="12" rx="2" stroke="#1E6FEB" strokeWidth="2" />
        <path d="M10 14V10a6 6 0 0112 0v4" stroke="#1E6FEB" strokeWidth="2" />
        <circle cx="16" cy="20" r="2" fill="#1E6FEB" />
      </svg>
    ),
    title: "Not just for developers",
    description: "Designed to be usable by operations employees, developers, management, and everyone else.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 12l4 4-4 4" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 20h10" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" />
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="#1E6FEB" strokeWidth="2" />
      </svg>
    ),
    title: "Fully programmable",
    description: "Drive all key functionality using powerful event-driven APIs. Process transactions in real-time.",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="group">
              <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-stedi-green-light">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-stedi-dark-text mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-stedi-gray-text leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}