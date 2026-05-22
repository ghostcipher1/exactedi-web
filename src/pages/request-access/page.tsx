import { useState } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";
import { useConversionPageView } from "@/hooks/useConversionPageView";
import { trackEvent } from "@/lib/analytics";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

const requestJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Request Early Access — ExactEDI",
  "description": "ExactEDI is in beta. Request early access through the customer portal — licensed library for on-premises X12 validation.",
  "url": `${siteUrl}/request-access`,
};

export default function RequestAccessPage() {
  useConversionPageView("view_request_access");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Simple client-side validation
    const email = formData.get("email") as string;
    if (!email || !email.includes("@")) {
      setFormError("Please enter a valid work email.");
      return;
    }

    const useCase = formData.get("primary_use_case") as string;
    if (!useCase) {
      setFormError("Please select a primary use case.");
      return;
    }

    setFormError("");

    try {
      const params = new URLSearchParams();
      formData.forEach((value, key) => {
        params.append(key, value as string);
      });

      const response = await fetch("/api/beta-access", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (response.ok) {
        trackEvent("beta_form_submit", {
          form_name: "request_access",
          primary_use_case: useCase,
        });
        setSubmitted(true);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <SEO
        title="Request Early Access — ExactEDI"
        description="ExactEDI is in beta. Request early access — licensed via the customer portal for on-premises 837 and 835 validation."
        canonicalPath="/request-access"
        keywords="ExactEDI beta, EDI engine beta access, healthcare EDI trial, X12 EDI beta"
        jsonLd={requestJsonLd}
      />
      <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-stedi-dark">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Request early access
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ExactEDI is in beta. Licensed builds are provisioned through the customer portal
            after we review your use case.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {submitted ? (
            <div className="rounded-xl border border-stedi-green/20 bg-stedi-green-light p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 rounded-full bg-stedi-green/10">
                <i className="ri-check-line text-stedi-green text-xl" />
              </div>
              <h2 className="text-xl font-bold text-stedi-dark-text mb-2">
                Application received
              </h2>
              <p className="text-sm text-stedi-gray-text leading-relaxed">
                We&apos;ll be in touch within 1 business day. For serious enterprise leads, we&apos;ll send a calendar link to talk engineering directly.
              </p>
            </div>
          ) : (
            <form
              id="beta-access-request"
              data-readdy-form
              onSubmit={handleSubmit}
              action="/api/beta-access"
              method="POST"
              className="space-y-6"
            >
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                    Organization
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                    placeholder="Acme Health Systems"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                    Role
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                    placeholder="Engineering Manager"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="transactions_per_month" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                    Transactions per month (approximate)
                  </label>
                  <select
                    id="transactions_per_month"
                    name="transactions_per_month"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                  >
                    <option value="">Select a range</option>
                    <option value="< 10k">&lt; 10,000</option>
                    <option value="10k - 100k">10,000 – 100,000</option>
                    <option value="100k - 1M">100,000 – 1,000,000</option>
                    <option value="1M - 10M">1,000,000 – 10,000,000</option>
                    <option value="> 10M">&gt; 10,000,000</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="target_os" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                    Target deployment OS
                  </label>
                  <select
                    id="target_os"
                    name="target_os"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                  >
                    <option value="">Select OS</option>
                    <option value="Linux">Linux</option>
                    <option value="Windows">Windows</option>
                    <option value="macOS">macOS</option>
                    <option value="Multiple">Multiple</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="anticipated_languages" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                  Anticipated SDK languages
                </label>
                <input
                  id="anticipated_languages"
                  name="anticipated_languages"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                  placeholder="Python, .NET"
                />
              </div>

              <div>
                <label htmlFor="primary_use_case" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                  Primary use case <span className="text-stedi-gray-text font-normal">(drives cohort fit)</span>
                </label>
                <select
                  id="primary_use_case"
                  name="primary_use_case"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                >
                  <option value="">Select use case</option>
                  <option value="parse_throughput">Parse / throughput</option>
                  <option value="validation">Validation</option>
                  <option value="facts_extraction">Facts extraction</option>
                  <option value="format_conversion">Format conversion</option>
                  <option value="audit_compliance">Audit / compliance</option>
                </select>
                <p className="mt-1.5 text-xs text-stedi-gray-text">
                  Parse/throughput, validation (SNIP 1–3), facts extraction, and format conversion are beta-fit. Element-level IG validation and audit workflows expand through GA.
                </p>
              </div>

              <div>
                <label htmlFor="use_case_details" className="block text-sm font-medium text-stedi-dark-text mb-1.5">
                  Tell us about your use case
                </label>
                <textarea
                  id="use_case_details"
                  name="use_case_details"
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                  placeholder="We process 837 claims from 40+ provider groups and need to validate envelope structure before loading into our warehouse..."
                />
                <p className="mt-1 text-xs text-stedi-gray-text">Maximum 500 characters</p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="authorization"
                  name="authorization"
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-stedi-gray-border text-stedi-green focus:ring-stedi-green/30"
                />
                <label htmlFor="authorization" className="text-sm text-stedi-gray-text leading-relaxed">
                  I confirm I am authorized to evaluate software for my organization.
                </label>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors shadow-lg shadow-stedi-green/25 whitespace-nowrap"
              >
                Submit application
                <i className="ri-arrow-right-line ml-2 text-xs" />
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  </>
  );
}