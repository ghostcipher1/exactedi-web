import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { useConversionPageView } from "@/hooks/useConversionPageView";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  pricingTiers,
  capabilityRows,
  metaRows,
  pricingFaqs,
  pricingFootnote,
} from "@/mocks/pricing";

const siteUrl =
  (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ExactEDI Pricing — Licensed by Capability and Deployment Scope",
  description:
    "ExactEDI is licensed by capability and deployment scope. All tiers run entirely on your hardware — no telemetry, no phone-home, no PHI ever leaves your network.",
  url: `${siteUrl}/pricing`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why don't you publish prices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ExactEDI is deployed into healthcare infrastructure where the right shape of a license depends on transaction volume, deployment footprint, and trading-partner coverage. We work those out with each customer rather than guessing on a pricing page. Most beta deals close within a week.",
      },
    },
    {
      "@type": "Question",
      name: "What does 'hardware-bound' mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each license file is cryptographically bound to the machine ID of the system it runs on (or to a defined fleet, for Enterprise). The license is signed offline by us and verified locally by the SDK — no internet connection is ever required. Re-binding to new hardware is handled through your customer portal.",
      },
    },
    {
      "@type": "Question",
      name: "What does Trial include and how do I start one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trial gives you 14 days of Parse + Validate against your own files, on a single machine, with no internet required. Request access using the form — qualified leads are provisioned within one business day.",
      },
    },
    {
      "@type": "Question",
      name: "Can I embed ExactEDI in a product I sell or distribute to my own customers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — embedding ExactEDI inside a product you redistribute (whether commercial, OEM, or as part of a SaaS offering) is covered by a separate ISV/OEM agreement. Contact sales to scope a license that fits your distribution model.",
      },
    },
  ],
};

function CapabilityLabel({
  label,
  hasRoadmapLink,
  hasVersionTag,
}: {
  label: string;
  hasRoadmapLink?: boolean;
  hasVersionTag?: boolean;
}) {
  if (hasRoadmapLink) {
    const parts = label.split("see roadmap");
    return (
      <span>
        {parts[0]}
        <Link to="/roadmap" className="text-stedi-green hover:underline">
          see roadmap
        </Link>
        {parts[1] || ""}
      </span>
    );
  }

  if (hasVersionTag) {
    return (
      <span className="flex items-center gap-2 flex-wrap">
        {label}
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stedi-green/10 text-stedi-green border border-stedi-green/20">
          v1.x
        </span>
      </span>
    );
  }

  return <span>{label}</span>;
}

function CheckCell({ included }: { included: boolean }) {
  if (included) {
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <i className="ri-check-line text-stedi-green" />
      </div>
    );
  }
  return <span className="text-gray-500">—</span>;
}

const revealStyle = (
  isVisible: boolean,
  delayMs: number
): React.CSSProperties => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 0.5s ease-out ${delayMs}ms, transform 0.5s ease-out ${delayMs}ms`,
});

function FadeTr({
  children,
  delayMs,
  className = "",
}: {
  children: React.ReactNode;
  delayMs: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLTableRowElement>();
  return (
    <tr
      ref={ref}
      className={className}
      style={revealStyle(isVisible, delayMs)}
    >
      {children}
    </tr>
  );
}

function FadeCard({
  children,
  delayMs,
  className = "",
}: {
  children: React.ReactNode;
  delayMs: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={revealStyle(isVisible, delayMs)}
    >
      {children}
    </div>
  );
}

export default function PricingPage() {
  useConversionPageView("view_pricing");
  const [openMobileTier, setOpenMobileTier] = useState<string>("professional");

  const toggleMobileTier = (key: string) => {
    setOpenMobileTier((prev) => (prev === key ? "" : key));
  };

  return (
    <>
      <SEO
        title="ExactEDI Pricing — Licensed by Capability and Deployment Scope"
        description="ExactEDI is licensed by capability and deployment scope. All tiers run entirely on your hardware — no telemetry, no phone-home, no PHI ever leaves your network."
        canonicalPath="/pricing"
        keywords="ExactEDI pricing, X12 EDI licensing, healthcare EDI licensing, on-premises EDI"
        jsonLd={[pricingJsonLd, faqJsonLd]}
      />
      <main className="min-h-screen bg-stedi-dark">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-10 md:pt-36 md:pb-14">
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Pricing
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-3">
              ExactEDI is licensed by capability and deployment scope. All
              tiers run entirely on your hardware — no telemetry, no
              phone-home, no PHI ever leaves your network.
            </p>
            <p className="text-sm md:text-base text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Pricing scales with deployment footprint and trading-partner-specific
              requirements. Beta pricing is locked through GA for design
              partners.
            </p>
          </div>
        </section>

        {/* Desktop Comparison Table */}
        <section className="pb-16 md:pb-20 hidden lg:block">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="rounded-xl border border-stedi-gray-border/20 bg-stedi-darker overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stedi-gray-border/20">
                    <th className="px-5 py-4 text-sm font-medium text-gray-400 w-[40%]">
                      Capability
                    </th>
                    {pricingTiers.map((tier) => (
                      <th
                        key={tier.name}
                        className="px-4 py-4 text-center w-[15%]"
                      >
                        <div className="flex flex-col items-center">
                          {tier.isRecommended && (
                            <span className="mb-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stedi-green/10 text-stedi-green border border-stedi-green/20">
                              Recommended
                            </span>
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              tier.isTrial ? "text-gray-400" : "text-white"
                            }`}
                          >
                            {tier.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {capabilityRows.map((cap, i) => (
                    <FadeTr
                      key={i}
                      delayMs={i * 60}
                      className="border-b border-stedi-gray-border/10"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-300">
                        <CapabilityLabel
                          label={cap.label}
                          hasRoadmapLink={cap.hasRoadmapLink}
                          hasVersionTag={cap.hasVersionTag}
                        />
                      </td>
                      {cap.values.map((val, j) => (
                        <td
                          key={j}
                          className={`px-4 py-3.5 text-center ${
                            j === 2 ? "bg-stedi-green/5" : ""
                          }`}
                        >
                          <div className="flex justify-center">
                            <CheckCell included={val} />
                          </div>
                        </td>
                      ))}
                    </FadeTr>
                  ))}
                  {metaRows.map((row, i) => (
                    <FadeTr
                      key={`meta-${i}`}
                      delayMs={(capabilityRows.length + i) * 60}
                      className="border-b border-stedi-gray-border/10"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-400">
                        {row.label}
                      </td>
                      {row.values.map((val, j) => (
                        <td
                          key={j}
                          className={`px-4 py-3.5 text-center text-sm ${
                            j === 2 ? "bg-stedi-green/5" : ""
                          } ${
                            row.isMono
                              ? "font-mono text-gray-400"
                              : "text-gray-300"
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                    </FadeTr>
                  ))}
                  {/* CTA Row */}
                  <FadeTr
                    delayMs={(capabilityRows.length + metaRows.length) * 60}
                  >
                    <td className="px-5 py-4" />
                    {pricingTiers.map((tier, j) => (
                      <td
                        key={tier.name}
                        className={`px-4 py-4 text-center ${
                          j === 2 ? "bg-stedi-green/5" : ""
                        }`}
                      >
                        <Link
                          to={tier.ctaHref}
                          className={`inline-block w-full text-center px-4 py-2.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                            tier.isRecommended
                              ? "bg-stedi-green text-white hover:bg-stedi-green-hover"
                              : "border border-stedi-gray-border/30 text-gray-300 hover:border-stedi-green/50 hover:text-white"
                          }`}
                        >
                          {tier.ctaLabel}
                        </Link>
                      </td>
                    ))}
                  </FadeTr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Mobile Accordion */}
        <section className="pb-16 lg:hidden">
          <div className="max-w-md mx-auto px-4 space-y-3">
            {pricingTiers.map((tier, tierIdx) => {
              const isOpen = openMobileTier === tier.name;
              return (
                <FadeCard
                  key={tier.name}
                  delayMs={tierIdx * 80}
                  className="rounded-xl border border-stedi-gray-border/20 bg-stedi-darker overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileTier(tier.name)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-semibold ${
                          tier.isTrial ? "text-gray-400" : "text-white"
                        }`}
                      >
                        {tier.name}
                      </span>
                      {tier.isRecommended && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stedi-green/10 text-stedi-green border border-stedi-green/20">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <i
                        className={`ri-arrow-down-s-line text-gray-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <div className="space-y-2 mb-4">
                        {capabilityRows.map((cap, i) => {
                          const included = cap.values[tierIdx];
                          return (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                {included ? (
                                  <i className="ri-check-line text-stedi-green" />
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    —
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-sm ${
                                  included
                                    ? "text-gray-200"
                                    : "text-gray-500"
                                }`}
                              >
                                <CapabilityLabel
                                  label={cap.label}
                                  hasRoadmapLink={cap.hasRoadmapLink}
                                  hasVersionTag={cap.hasVersionTag}
                                />
                              </span>
                            </div>
                          );
                        })}
                        {metaRows.map((row, i) => (
                          <div
                            key={`meta-${i}`}
                            className="flex items-start gap-2.5 pt-1"
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0" />
                            <span className="text-sm text-gray-400">
                              {row.label}:{" "}
                              <span
                                className={
                                  row.isMono
                                    ? "font-mono text-gray-300"
                                    : "text-gray-300"
                                }
                              >
                                {row.values[tierIdx]}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={tier.ctaHref}
                        className={`block w-full text-center px-4 py-2.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                          tier.isRecommended
                            ? "bg-stedi-green text-white hover:bg-stedi-green-hover"
                            : "border border-stedi-gray-border/30 text-gray-300 hover:border-stedi-green/50 hover:text-white"
                        }`}
                      >
                        {tier.ctaLabel}
                      </Link>
                    </div>
                  )}
                </FadeCard>
              );
            })}
          </div>
        </section>

        {/* Footnote */}
        <section className="pb-12 md:pb-16">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed">
              {pricingFootnote}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-20 md:pb-24">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-5">
              {pricingFaqs.map((faq, i) => (
                <FadeCard
                  key={i}
                  delayMs={i * 100}
                  className="rounded-lg border border-stedi-gray-border/20 bg-stedi-darker p-5"
                >
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </FadeCard>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}