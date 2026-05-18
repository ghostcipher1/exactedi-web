import { useState } from "react";
import SEO from "@/components/SEO";
import { useConversionPageView } from "@/hooks/useConversionPageView";
import { snipLevels, supportedTransactions } from "@/mocks/snipRoadmap";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

const roadmapJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "ExactEDI SNIP Validation Roadmap — X12 HIPAA EDI Compliance",
  "description": "ExactEDI publishes its SNIP coverage explicitly so buyers know exactly what they're getting at each release. Beta customers know what they have today and what's landing next month.",
  "url": `${siteUrl}/roadmap`,
};

export default function RoadmapPage() {
  useConversionPageView("view_roadmap");
  const [filter, setFilter] = useState<"all" | "beta" | "ga" | "v1x">("all");

  const filtered = snipLevels.filter((row) => {
    if (filter === "all") return true;
    if (filter === "beta") return row.beta === "✓";
    if (filter === "ga") return row.ga === "✓" || row.ga === "partial" || row.ga === "837/835";
    if (filter === "v1x") return row.v1x === "✓" || row.v1x === "marquee";
    return true;
  });

  return (
    <>
      <SEO
        title="ExactEDI SNIP Validation Roadmap — X12 HIPAA EDI Compliance"
        description="ExactEDI publishes its SNIP coverage explicitly so buyers know exactly what they're getting at each release. Beta customers know what they have today and what's landing next month."
        canonicalPath="/roadmap"
        keywords="ExactEDI roadmap, SNIP validation, X12 EDI roadmap, HIPAA EDI validation"
        jsonLd={roadmapJsonLd}
      />
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-stedi-dark">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stedi-green/10 border border-stedi-green/20 mb-4">
              <span className="text-xs font-medium text-stedi-green">Last updated: May 2026</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Validation Roadmap
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl leading-relaxed">
              ExactEDI publishes its SNIP coverage explicitly so buyers know exactly what they&apos;re getting at each release. The roadmap is on the site, not buried in a sales conversation. Beta customers know what they have today and what&apos;s landing next month.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {(["all", "beta", "ga", "v1x"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                    filter === f
                      ? "bg-stedi-dark text-white"
                      : "bg-stedi-gray-light text-stedi-gray-text hover:bg-stedi-gray-border"
                  }`}
                >
                  {f === "all" ? "All SNIP levels" : f === "beta" ? "Shipping in beta" : f === "ga" ? "GA target" : "v1.x"}
                </button>
              ))}
            </div>

            {/* Full SNIP matrix */}
            <div className="rounded-xl border border-stedi-gray-border bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stedi-gray-border bg-stedi-gray-light">
                      <th className="text-left py-3 px-4 text-xs font-medium text-stedi-gray-text">SNIP Level</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-stedi-gray-text">What it covers</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-stedi-gray-text">Beta</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-stedi-gray-text">GA target</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-stedi-gray-text">v1.x</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, i) => (
                      <tr key={i} className="border-b border-stedi-gray-border last:border-0">
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold text-stedi-dark-text">{row.level}</span>
                          <span className="text-xs text-stedi-gray-text ml-1 block">{row.name}</span>
                        </td>
                        <td className="py-3 px-4 text-xs text-stedi-gray-text">{row.what}</td>
                        <td className="py-3 px-4 text-center">
                          {row.beta === "✓" ? (
                            <i className="ri-check-line text-stedi-green" />
                          ) : (
                            <span className="text-stedi-gray-text">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.ga === "✓" ? (
                            <i className="ri-check-line text-stedi-green" />
                          ) : (
                            <span className="text-stedi-gray-text">{row.ga}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.v1x === "✓" ? (
                            <i className="ri-check-line text-stedi-green" />
                          ) : row.v1x === "marquee" ? (
                            <span className="text-xs font-medium text-stedi-green">Marquee</span>
                          ) : (
                            <span className="text-stedi-gray-text">{row.v1x}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 text-xs text-stedi-gray-text">
              Beta customers get SNIP 1 + envelope balancing today. They pin to a beta version, see new SNIP levels land in release notes as they ship, and never get a rug-pull at GA — the validation diagnostic shape is forward-compatible from beta.1 onward.
            </div>
          </div>
        </section>

        {/* Supported transactions */}
        <section className="py-12 md:py-16 bg-stedi-gray-light">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-6">
              Supported transaction types
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportedTransactions.map((tx) => (
                <div
                  key={tx.code}
                  className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-stedi-gray-border"
                >
                  <span className="font-mono font-semibold text-stedi-dark-text">{tx.code}</span>
                  <span className="text-sm text-stedi-gray-text">{tx.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}