export interface PricingTier {
  name: string;
  ctaLabel: string;
  ctaHref: string;
  isTrial: boolean;
  isRecommended: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Trial",
    ctaLabel: "Request early access",
    ctaHref: "/request-access?tier=trial",
    isTrial: true,
    isRecommended: false,
  },
  {
    name: "Standard",
    ctaLabel: "Contact sales",
    ctaHref: "/request-access?tier=standard",
    isTrial: false,
    isRecommended: false,
  },
  {
    name: "Professional",
    ctaLabel: "Contact sales",
    ctaHref: "/request-access?tier=professional",
    isTrial: false,
    isRecommended: true,
  },
  {
    name: "Enterprise",
    ctaLabel: "Contact sales",
    ctaHref: "/request-access?tier=enterprise",
    isTrial: false,
    isRecommended: false,
  },
];

export interface CapabilityRow {
  label: string;
  values: boolean[];
  hasRoadmapLink?: boolean;
  hasVersionTag?: boolean;
}

export const capabilityRows: CapabilityRow[] = [
  { label: "Parse X12 → JSON / JSONL", values: [true, true, true, true] },
  {
    label: "Validate envelope & structure (SNIP Type 1)",
    values: [true, true, true, true],
  },
  {
    label: "HIPAA TR3 validation (SNIP Type 2 — see roadmap)",
    values: [false, true, true, true],
    hasRoadmapLink: true,
  },
  {
    label: "PHI-safe fact extraction",
    values: [false, true, true, true],
  },
  {
    label: "837 and 835 support",
    values: [true, true, true, true],
  },
  {
    label: "Language bindings — Python and .NET",
    values: [false, true, true, true],
  },
  { label: "CLI", values: [true, true, true, true] },
  {
    label: "Balancing & situational rules (SNIP Types 3–4)",
    values: [false, false, true, true],
    hasRoadmapLink: true,
  },
  {
    label: "Extended throughput / fleet licensing",
    values: [false, false, false, true],
  },
];

export interface MetaRow {
  label: string;
  values: string[];
  isMono?: boolean;
}

export const metaRows: MetaRow[] = [
  {
    label: "Time-bound",
    values: ["14 days", "annual", "annual", "annual"],
  },
  {
    label: "Hardware-bound",
    values: ["machine ID", "machine ID", "machine ID", "site / fleet"],
    isMono: true,
  },
  {
    label: "Support",
    values: ["community", "email", "email + SLA", "dedicated"],
  },
];

export const pricingFaqs = [
  {
    q: "Why don't you publish prices?",
    a: "ExactEDI is deployed into healthcare infrastructure where the right shape of a license depends on transaction volume, deployment footprint, and trading-partner coverage. We work those out with each customer rather than guessing on a pricing page.",
  },
  {
    q: "What does 'hardware-bound' mean?",
    a: "Each license file is cryptographically bound to the machine ID of the system it runs on (or to a defined fleet, for Enterprise). The license is signed offline by us and verified locally by the SDK — no internet connection is ever required. Re-binding to new hardware is handled through your customer portal.",
  },
  {
    q: "How do I get early access?",
    a: "Request early access using the form. Qualified leads are provisioned through the customer portal — ExactEDI is not distributed via public package registries.",
  },
  {
    q: "Can I embed ExactEDI in a product I sell or distribute to my own customers?",
    a: "Embedding ExactEDI inside a product you redistribute is covered by a separate ISV/OEM agreement. Contact sales to scope a license that fits your distribution model.",
  },
];

export const pricingFootnote =
  "All tiers run entirely on your hardware. No telemetry. No phone-home. License files are signed offline and verified locally. ExactEDI is distributed via the customer portal only — not on PyPI, NuGet, or any public registry. Contact sales for quotes; no dollar amounts published.";
