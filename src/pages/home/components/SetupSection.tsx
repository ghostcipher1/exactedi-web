const steps = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#1E6FEB" strokeWidth="2" />
        <path d="M10 14l3 3 5-5" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fully self-serve",
    description: "Implement on your own timeline with comprehensive documentation and a powerful developer experience.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4v16M6 12l8-8 8 8" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h20" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Supported onboarding",
    description: "We'll help you set up your first partners and get live in record time.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#1E6FEB" strokeWidth="2" />
        <path d="M14 9v5l4 2" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Add partners in hours",
    description: "Don't let EDI slow your business. Onboard new trading partners in hours, not months.",
  },
];

export default function SetupSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-stedi-dark-text mb-4">
          Setup in{" "}
          <span className="line-through text-stedi-gray-text decoration-2">months</span>{" "}
          <span className="text-stedi-green">minutes</span>
        </h2>
        <p className="text-stedi-gray-text mb-12 md:mb-16 max-w-xl">
          ExactEDI removes the friction from EDI implementation. Start processing transactions the same day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-stedi-green-light">
                  {step.icon}
                </div>
                <span className="text-3xl font-bold text-stedi-gray-border">0{i + 1}</span>
              </div>
              <h3 className="text-base font-semibold text-stedi-dark-text mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-stedi-gray-text leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}