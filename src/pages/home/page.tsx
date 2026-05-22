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
      "description": "On-premises X12 EDI library for parsing and validating 837 claims and 835 remittances",
    },
    {
      "@type": "Organization",
      "name": "ExactEDI",
      "url": siteUrl,
      "description": "Deterministic, on-premises X12 EDI library for healthcare claims and remittance validation",
    },
    {
      "@type": "SoftwareApplication",
      "name": "ExactEDI",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Linux, Windows, macOS",
      "description": "High-performance library that parses and validates 837 claims and 835 remittances on your infrastructure with zero network calls.",
      "softwareVersion": "1.0.x beta",
    },
  ],
};

export default function Home() {
  return (
    <>
      <SEO
        title="ExactEDI — Catch malformed claims before a payer does"
        description="ExactEDI parses and validates 837 claims and 835 remittances against X12 and HIPAA TR3 rules — entirely on your infrastructure, with zero network calls."
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