import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import DevDocsMarkdown from "@/components/DevDocsMarkdown";
import { useConversionPageView } from "@/hooks/useConversionPageView";
import { getDevDocByPath } from "@/lib/dev-docs/config";
import { getDocContent } from "@/lib/dev-docs/content";
import DevDocsSidebar from "./components/DevDocsSidebar";
import NotFound from "@/pages/NotFound";

const siteUrl =
  (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

export default function DocPage() {
  useConversionPageView("view_dev_docs");
  const location = useLocation();
  const page = getDevDocByPath(location.pathname);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  if (!page) {
    return <NotFound />;
  }

  const content = getDocContent(page.file);
  if (!content) {
    return <NotFound />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "TechArticle"],
    name: `${page.title} — ExactEDI Developer Documentation`,
    description: page.description,
    url: `${siteUrl}${page.path}`,
  };

  return (
    <>
      <SEO
        title={`${page.title} — ExactEDI Developer Documentation`}
        description={page.description}
        canonicalPath={page.path}
        keywords="ExactEDI documentation, X12 EDI developer guide, EDI parsing API, healthcare EDI"
        jsonLd={jsonLd}
      />

      <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-stedi-dark">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-book-open-line text-stedi-green text-sm" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stedi-green">
              Documentation
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            {page.title}
          </h1>
          <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
            {page.description}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex gap-10">
            <DevDocsSidebar currentPage={page} content={content} />
            <div className="flex-1 min-w-0 max-w-3xl">
              <DevDocsMarkdown content={content} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
