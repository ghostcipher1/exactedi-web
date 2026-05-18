import SEO from "@/components/SEO";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

const securityJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Compliance & Security — ExactEDI",
  "description": "ExactEDI is engineered for regulated healthcare environments. On-premises by design, deterministic by architecture, and transparent about what we do and do not claim.",
  "url": `${siteUrl}/security`,
};

export default function SecurityPage() {
  return (
    <>
      <SEO
        title="Compliance & Security — ExactEDI"
        description="ExactEDI is engineered for regulated healthcare environments. On-premises by design, deterministic by architecture, and transparent about what we do and do not claim."
        canonicalPath="/security"
        keywords="ExactEDI security, HIPAA compliance, PHI safety, on-premises EDI security"
        jsonLd={securityJsonLd}
      />
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-stedi-dark">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Compliance &amp; Security
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl leading-relaxed">
              ExactEDI is engineered for regulated healthcare environments. On-premises by design, deterministic by architecture, and transparent about what we do and do not claim.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-12 md:space-y-16">
            {/* On-premises */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                On-premises by design
              </h2>
              <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                ExactEDI ships as native libraries — not a hosted service, not a cloud API. PHI never leaves your infrastructure. Air-gapped deployments are fully supported. There are no network dependencies, no telemetry endpoints, and no phone-home mechanisms.
              </p>
              <div className="rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-5">
                <ul className="space-y-2">
                  {[
                    "Windows, Linux, macOS — x64 and ARM64",
                    "No internet required at any point",
                    "License verification is fully offline (signed payloads, local verification)",
                    "Docker images available for CI integration",
                    "Customer-portal-gated download (no public registries)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-stedi-gray-text">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <i className="ri-check-line text-stedi-green" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PHI Safety */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                PHI-safe fact extraction
              </h2>
              <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                The ExactEDI fact extractor produces structured analytical data with patient identifiers stripped per HIPAA Safe Harbor. The output is designed for LLM consumption and analytics warehouses — no separate de-identification step required.
              </p>
              <div className="rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-5">
                <ul className="space-y-2">
                  {[
                    "Safe Harbor-compliant de-identification of facts output only",
                    "Deterministic redaction — same input always produces the same output",
                    "Fact JSON schema designed for RAG and retrieval pipelines",
                    "~8.6 KB per transaction after beta.2 optimization",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-stedi-gray-text">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <i className="ri-check-line text-stedi-green" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-xs text-stedi-gray-text italic">
                The HIPAA Safe Harbor claim is scoped to fact-extractor output only. Do not generalize this to &quot;HIPAA-compliant product.&quot;
              </p>
            </div>

            {/* Deterministic */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                Deterministic &amp; auditable
              </h2>
              <p className="text-sm text-stedi-gray-text leading-relaxed">
                Same input → same output. Bit-for-bit reproducible. Critical for audit trails, regulatory review, and regression testing. Every release is conformance-corpus gated in CI.
              </p>
            </div>

            {/* What we don't claim */}
            <div className="rounded-xl border border-stedi-gray-border bg-white p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                What we do not claim
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "SOC 2 or HITRUST certification (not claimed at this time)",
                  "Full SNIP 2-7 conformance (see roadmap for current coverage)",
                  "A substitute for an AMA CPT license (CPT is BYO)",
                  "A clearinghouse — we do not transmit claims",
                  "An EHR or practice management system",
                  "A cloud API or SaaS product",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-stedi-gray-text">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <i className="ri-close-line text-red-400" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Trial mechanics */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                Trial mechanics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "14 days", desc: "Calendar-day limit from first launch." },
                  { title: "Hardware-bound", desc: "Machine ID fingerprint. Cannot be moved between machines." },
                  { title: "Offline verification", desc: "Clock-rollback detection, multi-location markers, signed payloads. No internet required." },
                ].map((card) => (
                  <div key={card.title} className="rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-5">
                    <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">{card.title}</h4>
                    <p className="text-xs text-stedi-gray-text leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}