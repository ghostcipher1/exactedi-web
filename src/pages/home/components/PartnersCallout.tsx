export default function PartnersCallout() {
  return (
    <section className="py-10 md:py-14 bg-stedi-gray-light border-y border-stedi-gray-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <p className="text-sm text-stedi-gray-text mb-4 leading-relaxed">
          ExactEDI is in beta — licensed via the customer portal, not public registries.
          <span className="text-stedi-dark-text font-medium"> Early adopters</span>
          {" "}shape the validation roadmap.
        </p>
        <a
          href="/request-access"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors whitespace-nowrap"
        >
          Request early access
          <i className="ri-arrow-right-line text-xs" />
        </a>
      </div>
    </section>
  );
}