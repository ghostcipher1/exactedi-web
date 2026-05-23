import NewsletterForm from "@/components/feature/NewsletterForm";
import { useCases } from "@/mocks/useCases";

const footerLinks = {
  Product: [
    { label: "Overview", href: "/product" },
    { label: "Parsing & Validation", href: "/product#parsing-validation" },
    { label: "Facts Extraction", href: "/product#facts-extraction" },
    { label: "Performance", href: "/product#performance" },
    { label: "SDKs", href: "/product#sdks" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Pricing", href: "/pricing" },
  ],
  "Use Cases": useCases.map((uc) => ({
    label: uc.title,
    href: `/use-cases/${uc.slug}`,
  })),
  Resources: [
    { label: "Documentation", href: "/dev-docs" },
    { label: "Validation Roadmap", href: "/roadmap" },
    { label: "Security & Compliance", href: "/security" },
    { label: "Benchmarks", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

function ExactEDILogoFooter() {
  return (
    <img
      src="https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/8c61ba98ef22aa6dcd2220b725f673ab.svg"
      alt="ExactEDI"
      className="h-9 w-auto"
    />
  );
}

export default function Footer() {
  return (
    <footer className="bg-stedi-gray-light border-t border-stedi-gray-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a href="/" className="inline-block">
              <ExactEDILogoFooter />
            </a>
            <div className="mt-4 space-y-1 text-sm text-stedi-gray-text">
              <p className="font-medium text-stedi-dark-text">contact@exactedi.com</p>
              <p>ExactEDI, Inc.</p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg border border-stedi-gray-border text-stedi-gray-text hover:text-stedi-dark-text hover:border-stedi-green transition-colors">
                <i className="ri-linkedin-fill" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg border border-stedi-gray-border text-stedi-gray-text hover:text-stedi-dark-text hover:border-stedi-green transition-colors">
                <i className="ri-twitter-x-fill" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg border border-stedi-gray-border text-stedi-gray-text hover:text-stedi-dark-text hover:border-stedi-green transition-colors">
                <i className="ri-youtube-fill" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-stedi-dark-text mb-4">
                    {category}
                  </h4>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-stedi-gray-text hover:text-stedi-green transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-stedi-gray-border">
          <NewsletterForm
            heading="Stay updated"
            subtext="Release notes, roadmap updates, and beta announcements."
            buttonLabel="Subscribe"
            successMessage="You are subscribed!"
          />
        </div>

        {/* Compliance + Legal */}
        <div className="mt-12 pt-8 border-t border-stedi-gray-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-md border border-stedi-gray-border text-xs font-semibold text-stedi-gray-text bg-white">
                HIPAA Safe Harbor
              </div>
              <div className="px-3 py-1.5 rounded-md border border-stedi-gray-border text-xs font-semibold text-stedi-gray-text bg-white">
                On-premises
              </div>
              <div className="px-3 py-1.5 rounded-md border border-stedi-gray-border text-xs font-semibold text-stedi-gray-text bg-white">
                No telemetry
              </div>
            </div>
            <p className="text-xs text-stedi-gray-text max-w-xl leading-relaxed">
              ExactEDI is a licensed library — on-premises, zero network calls. Not a SaaS, cloud API, or clearinghouse. Beta software — see the validation roadmap for current SNIP coverage.
            </p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-stedi-gray-text">
              &copy; {new Date().getFullYear()} ExactEDI, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-stedi-gray-text hover:text-stedi-green transition-colors">
                Service Terms
              </a>
              <a href="#" className="text-xs text-stedi-gray-text hover:text-stedi-green transition-colors">
                Privacy Notice
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}