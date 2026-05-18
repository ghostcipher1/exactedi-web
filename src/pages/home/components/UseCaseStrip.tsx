import { Link } from "react-router-dom";
import { useCases } from "@/mocks/useCases";

export default function UseCaseStrip() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-stedi-dark-text mb-10 md:mb-14">
          Built for your stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {useCases.map((uc) => (
            <Link
              key={uc.slug}
              to={`/use-cases/${uc.slug}`}
              className="group rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-5 md:p-6 hover:border-stedi-green/30 transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-3 rounded-lg bg-stedi-green-light">
                <i className={`${uc.icon} text-stedi-green text-lg`} />
              </div>
              <h4 className="text-sm font-semibold text-stedi-dark-text mb-1 group-hover:text-stedi-green transition-colors">
                {uc.title}
              </h4>
              <p className="text-xs text-stedi-gray-text leading-relaxed">{uc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}