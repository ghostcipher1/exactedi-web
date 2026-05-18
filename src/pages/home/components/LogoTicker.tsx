const logos = [
  { name: "Adonis", hasCaseStudy: true },
  { name: "Berry Street", hasCaseStudy: true },
  { name: "Candid Health", hasCaseStudy: false },
  { name: "Lumary", hasCaseStudy: false },
  { name: "Nirvana", hasCaseStudy: true },
  { name: "Pair Team", hasCaseStudy: true },
  { name: "PQT Health", hasCaseStudy: false },
  { name: "Ritten", hasCaseStudy: true },
  { name: "Tennr", hasCaseStudy: true },
];

function LogoItem({ name, hasCaseStudy }: { name: string; hasCaseStudy: boolean }) {
  return (
    <div className="flex items-center gap-2 px-6 shrink-0">
      <span className="text-lg md:text-xl font-semibold text-stedi-dark-text tracking-tight whitespace-nowrap">
        {name}
      </span>
      {hasCaseStudy && (
        <span className="flex items-center gap-1 text-xs text-stedi-green font-medium whitespace-nowrap">
          <i className="ri-arrow-right-line" />
          Case study
        </span>
      )}
    </div>
  );
}

export default function LogoTicker() {
  return (
    <section className="py-12 md:py-16 bg-stedi-gray-light border-y border-stedi-gray-border">
      <p className="text-center text-sm text-stedi-gray-text mb-8 font-medium tracking-wide uppercase">
        Trusted by leading health tech companies
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-ticker">
          {[...logos, ...logos].map((logo, i) => (
            <LogoItem key={i} name={logo.name} hasCaseStudy={logo.hasCaseStudy} />
          ))}
        </div>
      </div>
    </section>
  );
}