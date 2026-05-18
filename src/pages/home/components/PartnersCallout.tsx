export default function PartnersCallout() {
  return (
    <section className="py-10 md:py-14 bg-stedi-gray-light border-y border-stedi-gray-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <p className="text-sm text-stedi-gray-text mb-4 leading-relaxed">
          Now in private beta with selected payers and clearinghouses.
          <span className="text-stedi-dark-text font-medium"> Design partners wanted</span>
          {" "}— applications reviewed weekly.
        </p>
        <a
          href="/request-access"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors whitespace-nowrap"
        >
          Apply for beta access
          <i className="ri-arrow-right-line text-xs" />
        </a>
      </div>
    </section>
  );
}