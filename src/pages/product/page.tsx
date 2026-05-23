import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ExactEDI Product — On-Premises X12 EDI Engine",
  description:
    "Parse, validate, and extract PHI-safe facts from HIPAA X12 transactions on your infrastructure. Licensed library with CLI, Python, and .NET SDKs.",
  url: `${siteUrl}/product`,
};

const capabilities = [
  {
    id: "parsing-validation",
    title: "Parsing & validation",
    icon: "ri-file-check-line",
    body:
      "ExactEDI parses 837 claims, 835 remittances, and twelve other HIPAA X12 transaction types. Validation ships SNIP Types 1–3 in beta.4: syntax and envelopes, loop-and-segment structure on ten transaction types, and envelope plus monetary balancing.",
    links: [
      { label: "Validation roadmap", href: "/roadmap" },
      { label: "Diagnostic reference", href: "/dev-docs/x12-mapping/diagnostics" },
    ],
  },
  {
    id: "facts-extraction",
    title: "Facts extraction",
    icon: "ri-database-2-line",
    body:
      "The explain command and SDK APIs emit PHI-safe analytical facts — HIPAA Safe Harbor scoped. Structured JSON for warehouses, dashboards, and LLM pipelines without shipping raw PHI to a vendor cloud.",
    links: [
      { label: "Facts JSON schema", href: "/dev-docs/facts-schema" },
      { label: "Integration guide", href: "/dev-docs/integration" },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    icon: "ri-speed-line",
    body:
      "Stream multi-gigabyte files with constant memory. On commodity hardware, a 1 GB 837P file parses end-to-end in roughly eight seconds with about 8.6 KB retained per transaction for facts.",
    links: [
      { label: "Getting Started", href: "/dev-docs" },
    ],
  },
  {
    id: "sdks",
    title: "SDKs & CLI",
    icon: "ri-code-box-line",
    body:
      "Ship as native libraries with Python and .NET bindings, a C/C++ API, and a CLI for parse, validate, and explain workflows. Portal-gated distribution — not on PyPI or nuget.org by design.",
    links: [
      { label: "Python SDK", href: "/dev-docs/python" },
      { label: "C# / .NET SDK", href: "/dev-docs/csharp" },
      { label: "CLI reference", href: "/dev-docs/cli" },
    ],
  },
];

export default function ProductPage() {
  return (
    <>
      <SEO
        title="ExactEDI Product — On-Premises X12 EDI Engine"
        description="Parse, validate, and extract PHI-safe facts from 837, 835, and other HIPAA X12 transactions. Licensed on-premises library with CLI, Python, and .NET SDKs."
        canonicalPath="/product"
        keywords="ExactEDI product, X12 EDI library, 837 parser, 835 validation, on-premises EDI"
        jsonLd={productJsonLd}
      />
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-stedi-dark">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Product
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl leading-relaxed">
              ExactEDI is a licensed library — not a SaaS, cloud API, or clearinghouse. Parse,
              validate, and analyze HIPAA X12 on your hardware with zero network calls.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-14 md:space-y-16">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-4">
                What you get
              </h2>
              <p className="text-sm text-stedi-gray-text leading-relaxed mb-6">
                A single engine for ingestion pipelines, partner onboarding, and analytics prep.
                Recognizes 14 transaction types; ten receive loop-aware structural validation in
                beta.4. Bindings share the same validation and facts output as the CLI.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Native C++ core with C, Python, and .NET surfaces",
                  "CLI: parse, validate, explain, normalize",
                  "Byte-precise diagnostics (35 codes documented)",
                  "Offline license verification — no telemetry",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-4 text-sm text-stedi-gray-text"
                  >
                    <i className="ri-check-line text-stedi-green mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {capabilities.map((cap) => (
              <div key={cap.id} id={cap.id} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-stedi-green-light">
                    <i className={`${cap.icon} text-stedi-green text-lg`} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text">
                    {cap.title}
                  </h2>
                </div>
                <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">{cap.body}</p>
                <div className="flex flex-wrap gap-3">
                  {cap.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-sm font-medium text-stedi-green hover:underline"
                    >
                      {link.label}
                      <i className="ri-arrow-right-line ml-0.5 text-xs" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-6 md:p-8">
              <h2 className="text-lg font-bold text-stedi-dark-text mb-2">Ready to evaluate?</h2>
              <p className="text-sm text-stedi-gray-text leading-relaxed mb-4">
                Download from your customer portal, run the five-minute Getting Started path on
                bundled samples, then point the SDK at your own files.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/request-access"
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors"
                >
                  Request early access
                  <i className="ri-arrow-right-line text-xs" />
                </Link>
                <Link
                  to="/dev-docs"
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full border border-stedi-gray-border bg-white text-stedi-dark-text hover:border-stedi-green transition-colors"
                >
                  Developer docs
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full border border-stedi-gray-border bg-white text-stedi-dark-text hover:border-stedi-green transition-colors"
                >
                  Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
