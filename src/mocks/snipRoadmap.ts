export interface SnipLevel {
  level: string;
  name: string;
  what: string;
  beta: string;
  ga: string;
  v1x: string;
}

export const snipLevels: SnipLevel[] = [
  { level: "1", name: "EDI syntax / structure", what: "Segment/element syntax, envelope structure", beta: "✓", ga: "✓", v1x: "✓" },
  { level: "2", name: "IG loop & segment structure", what: "Loop nesting, triggers, placement, repeat caps — 10 transaction types (837P, 835, 270, 271, 276, 277, 277CA, 278, 820, 999)", beta: "✓", ga: "✓", v1x: "✓" },
  { level: "2", name: "IG element-level rules", what: "Element usage, valid code lists, syntax rules from segment-detail pages", beta: "—", ga: "✓", v1x: "✓" },
  { level: "2", name: "Remaining transaction types", what: "837I, 837D, 834 loop structure", beta: "—", ga: "partial", v1x: "✓" },
  { level: "3", name: "Envelope balancing", what: "Control numbers, segment & transaction counts", beta: "✓", ga: "✓", v1x: "✓" },
  { level: "3", name: "Claim / monetary balancing", what: "835 BPR02 vs. CLP04 sums; 837 CLM02 vs. SV1 line sums", beta: "✓", ga: "✓", v1x: "✓" },
  { level: "4", name: "Inter-segment situational", what: "Conditional element rules", beta: "—", ga: "837/835", v1x: "✓" },
  { level: "5", name: "External code sets", what: "ICD-10, HCPCS, CARC, RARC, POS, taxonomy (bundled); CPT (BYO)", beta: "—", ga: "partial", v1x: "✓" },
  { level: "6", name: "Product-type variance", what: "837P vs. I vs. D, etc.", beta: "—", ga: "partial", v1x: "✓" },
  { level: "7", name: "Trading-partner companion guides", what: "Declarative DSL, library-side enforcement", beta: "—", ga: "—", v1x: "marquee" },
];

export const supportedTransactions = [
  { code: "837P", name: "Professional claim", loopValidation: true },
  { code: "837I", name: "Institutional claim", loopValidation: false },
  { code: "837D", name: "Dental claim", loopValidation: false },
  { code: "835", name: "Remittance advice", loopValidation: true },
  { code: "270", name: "Eligibility inquiry", loopValidation: true },
  { code: "271", name: "Eligibility response", loopValidation: true },
  { code: "276", name: "Claim status request", loopValidation: true },
  { code: "277", name: "Claim status response", loopValidation: true },
  { code: "277CA", name: "Claim acknowledgment", loopValidation: true },
  { code: "278", name: "Prior authorization", loopValidation: true },
  { code: "820", name: "Premium payment", loopValidation: true },
  { code: "834", name: "Benefit enrollment", loopValidation: false },
  { code: "999", name: "Implementation acknowledgment", loopValidation: true },
  { code: "TA1", name: "Interchange acknowledgment", loopValidation: false },
];
