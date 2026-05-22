export interface SnipLevel {
  level: string;
  name: string;
  what: string;
  beta: string;
  ga: string;
  v1x: string;
}

export const snipLevels: SnipLevel[] = [
  { level: "1", name: "EDI syntax / standard integrity", what: "Segment terminators, structure, control envelope", beta: "✓", ga: "✓", v1x: "✓" },
  { level: "3", name: "Balancing (envelope/control counts)", what: "ISA/IEA, GS/GE, ST/SE control numbers and counts", beta: "—", ga: "✓", v1x: "✓" },
  { level: "3", name: "Balancing (monetary/claim totals)", what: "CLP totals = line sums; transaction totals reconcile", beta: "—", ga: "✓", v1x: "✓" },
  { level: "2", name: "HIPAA IG conformance (837P/I/D, 835)", what: "Limits, repeats, qualifiers, codes", beta: "—", ga: "✓", v1x: "✓" },
  { level: "2", name: "HIPAA IG conformance (other transactions)", what: "270/271, 276/277, 278, 820, 834, 999", beta: "—", ga: "partial", v1x: "✓" },
  { level: "4", name: "Inter-segment situational", what: "Syntax-note rules, conditional element requirements", beta: "—", ga: "837/835", v1x: "✓" },
  { level: "5", name: "External code sets", what: "ICD-10, HCPCS, POS, CARC, RARC, taxonomy (bundled); CPT (BYO)", beta: "—", ga: "partial", v1x: "✓" },
  { level: "6", name: "Product-type", what: "Per-product variance (837P vs I vs D, etc.)", beta: "—", ga: "partial", v1x: "✓" },
  { level: "7", name: "Trading-partner-specific", what: "Declarative companion-guide format, library-side enforcement", beta: "—", ga: "—", v1x: "marquee" },
];

export const supportedTransactions = [
  { code: "837P/I/D", name: "Claims (professional, institutional, dental)" },
  { code: "835", name: "Remittance Advice" },
];