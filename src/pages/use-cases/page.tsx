import { Link, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";
import NotFound from "@/pages/NotFound";
import { getUseCaseBySlug, useCases } from "@/mocks/useCases";
import { trackEvent } from "@/lib/analytics";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

export default function UseCasePage() {
  const { slug } = useParams<{ slug: string }>();
  const useCase = slug ? getUseCaseBySlug(slug) : undefined;

  if (!useCase) {
    return <NotFound />;
  }

  const canonicalPath = `/use-cases/${useCase.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: useCase.metaTitle,
    description: useCase.metaDescription,
    url: `${siteUrl}${canonicalPath}`,
  };

  const related = useCases.filter((uc) => uc.slug !== useCase.slug).slice(0, 3);

  return (
    <>
      <SEO
        title={useCase.metaTitle}
        description={useCase.metaDescription}
        canonicalPath={canonicalPath}
        keywords={`ExactEDI, ${useCase.title}, X12 EDI, healthcare EDI, on-premises`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-stedi-dark">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
            >
              <i className="ri-arrow-left-line text-xs" />
              Home
            </Link>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-stedi-green/10 border border-stedi-green/20 mb-6">
              <i className={`${useCase.icon} text-2xl text-stedi-green`} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              {useCase.title}
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl leading-relaxed">
              {useCase.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/request-access"
                onClick={() =>
                  trackEvent("cta_click", {
                    cta_location: "use_case_hero",
                    use_case: useCase.slug,
                    link_url: "/request-access",
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors"
              >
                Request beta access
                <i className="ri-arrow-right-line text-xs" />
              </Link>
              <Link
                to="/dev-docs"
                onClick={() =>
                  trackEvent("cta_click", {
                    cta_location: "use_case_hero",
                    use_case: useCase.slug,
                    link_url: "/dev-docs",
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Read dev docs
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 border-b border-stedi-gray-border">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-6">
              Why teams choose ExactEDI
            </h2>
            <ul className="space-y-4">
              {useCase.painPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm text-stedi-gray-text leading-relaxed"
                >
                  <i className="ri-close-circle-line text-red-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-stedi-gray-light">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-8">
              How ExactEDI helps
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {useCase.capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-xl border border-stedi-gray-border bg-white p-5 md:p-6"
                >
                  <h3 className="text-sm font-semibold text-stedi-dark-text mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-stedi-gray-text leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-6">
              Outcomes
            </h2>
            <ul className="space-y-3">
              {useCase.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex gap-3 text-sm text-stedi-gray-text leading-relaxed"
                >
                  <i className="ri-checkbox-circle-line text-stedi-green shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-stedi-dark">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Deploy on your hardware
            </h2>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              ExactEDI is in private beta. We review applications weekly and prioritize teams
              with production X12 volume and on-premises requirements.
            </p>
            <Link
              to="/request-access"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_location: "use_case_footer",
                  use_case: useCase.slug,
                  link_url: "/request-access",
                })
              }
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors"
            >
              Request beta access
            </Link>
          </div>
        </section>

        <section className="py-12 md:py-16 border-t border-stedi-gray-border">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-lg font-semibold text-stedi-dark-text mb-6">
              Other use cases
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((uc) => (
                <Link
                  key={uc.slug}
                  to={`/use-cases/${uc.slug}`}
                  className="group rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-4 hover:border-stedi-green/30 transition-colors"
                >
                  <i className={`${uc.icon} text-stedi-green text-lg mb-2 block`} />
                  <h3 className="text-sm font-semibold text-stedi-dark-text group-hover:text-stedi-green transition-colors">
                    {uc.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
