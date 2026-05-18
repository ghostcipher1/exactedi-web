import SEO from "@/components/SEO";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PartnersCallout from "./components/PartnersCallout";
import ValueProp from "./components/ValueProp";
import Capabilities from "./components/Capabilities";
import CodeCarousel from "./components/CodeCarousel";
import PerformanceSection from "./components/PerformanceSection";
import RoadmapTeaser from "./components/RoadmapTeaser";
import PHIAISection from "./components/PHIAISection";
import ArchitectureSection from "./components/ArchitectureSection";
import UseCaseStrip from "./components/UseCaseStrip";
import CompliancePanel from "./components/CompliancePanel";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "ExactEDI",
      "url": siteUrl,
      "description": "Native X12 EDI engine with developer-first bindings and English-based data abstractions",
    },
    {
      "@type": "Organization",
      "name": "ExactEDI",
      "url": siteUrl,
      "description": "Deterministic, on-premises X12 EDI engine with generation support",
    },
    {
      "@type": "SoftwareApplication",
      "name": "ExactEDI",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Linux, Windows, macOS",
      "description": "Deterministic, on-premises X12 EDI engine with developer-first bindings, English-based data abstractions, and generation support. Parses, validates, explains, and generates healthcare claims and remittance files.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <SEO
        title="ExactEDI — Deterministic X12 EDI with Developer-First Bindings"
        description="ExactEDI is a native, on-premises X12 EDI engine with developer-friendly bindings, English-based data abstractions, and full generation support. Runs on your hardware. Zero telemetry."
        canonicalPath="/"
        keywords="ExactEDI, X12 EDI, HIPAA EDI, 837 claims, 835 remittance, EDI engine, developer tools, on-premises"
        jsonLd={homeJsonLd}
      />
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <PartnersCallout />
        <ValueProp />
        <Capabilities />
        <CodeCarousel />
        <PHIAISection />
        <ArchitectureSection />
        <RoadmapTeaser />
        <PerformanceSection />
        <UseCaseStrip />
        <CompliancePanel />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}