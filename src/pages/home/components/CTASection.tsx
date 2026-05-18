export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-stedi-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-stedi-green/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-stedi-green/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to see it run on your data?
        </h2>
        <p className="text-gray-400 mb-8 text-base">
          Request beta access. We review applications weekly and prioritize cohort fit.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/request-access"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors shadow-lg shadow-stedi-green/25 whitespace-nowrap"
          >
            Request beta access
            <i className="ri-arrow-right-line text-xs" />
          </a>
          <a
            href="https://docs.exactedi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors whitespace-nowrap"
          >
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}