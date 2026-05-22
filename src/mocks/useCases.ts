export interface UseCase {
  slug: string;
  title: string;
  description: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  painPoints: string[];
  capabilities: { title: string; description: string }[];
  outcomes: string[];
}

export const useCases: UseCase[] = [
  {
    slug: "payers",
    title: "Healthcare Payers",
    description:
      "Explain millions of 837s/835s into structured, queryable facts. Generate compliant outbound acknowledgments — all without sending PHI to a vendor cloud.",
    icon: "ri-shield-check-line",
    metaTitle: "X12 EDI for Healthcare Payers — On-Premises 837 & 835 Processing",
    metaDescription:
      "ExactEDI helps payers parse, validate, and extract PHI-safe facts from inbound 837 claims and 835 remittance at wire speed — entirely on your infrastructure.",
    heroSubtitle:
      "Process high-volume claim and remittance files on your own hardware. Deterministic validation, SNIP-aware diagnostics, and Safe Harbor facts for actuarial and operations teams.",
    painPoints: [
      "Cloud EDI vendors require PHI to leave your network for parsing and enrichment.",
      "Legacy parsers choke on large files and return opaque loop/segment errors.",
      "Downstream teams need English-field JSON, not raw X12, for analytics and automation.",
    ],
    capabilities: [
      {
        title: "High-throughput 837/835 ingestion",
        description:
          "Parse institutional and professional claims plus remittance advice at hundreds of MB/s on commodity hardware — no JVM warm-up, no per-file API calls.",
      },
      {
        title: "SNIP validation with byte-precise diagnostics",
        description:
          "Catch structural and HIPAA compliance issues before they hit adjudication. Errors cite segment, element, and trading-partner context.",
      },
      {
        title: "PHI-safe Explain output",
        description:
          "Emit structured facts with human-readable field names and Safe Harbor de-identification built in — ready for warehouses and LLM workflows.",
      },
      {
        title: "Bidirectional generation",
        description:
          "Produce compliant 997/999 acknowledgments and outbound envelopes from validated facts — not a read-only pipe.",
      },
    ],
    outcomes: [
      "Keep PHI inside your security boundary",
      "Shorten time-to-insight on claim and payment data",
      "Reduce vendor lock-in on parsing and validation",
    ],
  },
  {
    slug: "clearinghouses",
    title: "Clearinghouses & Switches",
    description:
      "Read any transaction at wire speed. Validate with byte-precise diagnostics. Generate corrected envelopes and acknowledgments — a two-way engine, not a one-way pipe.",
    icon: "ri-exchange-line",
    metaTitle: "X12 EDI for Clearinghouses — Validate, Route & Acknowledge at Scale",
    metaDescription:
      "ExactEDI gives clearinghouses and switches a native engine to validate, explain, and generate healthcare X12 — on-premises, with deterministic throughput.",
    heroSubtitle:
      "Your switch sits between thousands of trading partners. ExactEDI is the engine layer: validate inbound, explain for ops, generate compliant outbound — all in-process.",
    painPoints: [
      "Per-transaction SaaS pricing does not scale with interchange volume.",
      "One-way parsers cannot regenerate corrected files or acknowledgments.",
      "Partner-specific companion guides are hard to enforce in generic toolchains.",
    ],
    capabilities: [
      {
        title: "Any HIPAA transaction, one engine",
        description:
          "837, 835, 270/271, 276/277, 278, and envelopes — same API surface for read, validate, explain, and write.",
      },
      {
        title: "Trading-partner rules (SNIP 7 roadmap)",
        description:
          "Declarative companion-guide enforcement is on the roadmap; today, SNIP Types 1–3 ship with byte-level error reporting across ten transaction types.",
      },
      {
        title: "Deterministic performance",
        description:
          "Benchmark-class throughput for batch reprocessing, replay, and disaster recovery without cloud egress.",
      },
      {
        title: "Embed in your product",
        description:
          "Native libraries (Python, .NET, CLI) drop into existing routing pipelines — not a black-box appliance.",
      },
    ],
    outcomes: [
      "Lower marginal cost per million segments processed",
      "Faster partner onboarding with explainable validation output",
      "Full control over data residency and audit trails",
    ],
  },
  {
    slug: "rcm-vendors",
    title: "RCM Vendors",
    description:
      "Embed Explain and Normalize in your product so customers query claims in English, then generate compliant outbound X12 from validated data.",
    icon: "ri-money-dollar-circle-line",
    metaTitle: "X12 EDI for RCM Vendors — Embed Parsing & Generation in Your Platform",
    metaDescription:
      "RCM platforms use ExactEDI to offer customers on-prem X12 parsing, PHI-safe facts, and outbound claim generation — without building an EDI team from scratch.",
    heroSubtitle:
      "Your customers expect modern APIs and readable claim data. ExactEDI is the engine you embed so they never touch raw loops — while you stay out of their PHI path.",
    painPoints: [
      "Building and maintaining an X12 stack distracts from core RCM workflows.",
      "Customers in regulated environments reject cloud-only EDI middleware.",
      "Generating outbound 837 from edited facts requires a true two-way engine.",
    ],
    capabilities: [
      {
        title: "Developer-first bindings",
        description:
          "Python and .NET SDKs plus CLI for batch jobs — integrate in days, not quarters.",
      },
      {
        title: "English-field abstractions",
        description:
          "Explain turns X12 into queryable structures your UI and rules engine can consume directly.",
      },
      {
        title: "Normalize for outbound",
        description:
          "Rebuild compliant X12 from validated facts and trading-partner rules — close the edit-and-resubmit loop.",
      },
      {
        title: "White-label friendly",
        description:
          "Deploy inside customer VPCs or on-prem racks; no ExactEDI branding required in their data path.",
      },
    ],
    outcomes: [
      "Ship EDI features faster without hiring X12 specialists",
      "Win regulated accounts that require on-premises deployment",
      "Differentiate with explainable, auditable claim data",
    ],
  },
  {
    slug: "ai-analytics",
    title: "AI / Analytics Teams",
    description:
      "Feed LLMs and warehouses structured, de-identified facts with human-readable field names. No loop-reference memorization required.",
    icon: "ri-bar-chart-box-line",
    metaTitle: "PHI-Safe X12 Facts for AI & Analytics — ExactEDI Explain",
    metaDescription:
      "Analytics and AI teams use ExactEDI to extract de-identified, deterministic facts from 837/835 files — Safe Harbor compliant, on your infrastructure.",
    heroSubtitle:
      "Stop prompting models on raw X12. ExactEDI Explain produces stable, English-keyed JSON designed for warehouses, feature stores, and RAG pipelines.",
    painPoints: [
      "Raw EDI is a poor input for LLMs — high token cost, hallucination risk, and PHI exposure.",
      "Ad-hoc de-identification scripts are brittle and hard to audit.",
      "Non-deterministic cloud parsers make reproducible ML features impossible.",
    ],
    capabilities: [
      {
        title: "Safe Harbor by architecture",
        description:
          "Patient identifiers are stripped in the fact extractor — same input always yields the same output shape.",
      },
      {
        title: "Pandas-ready in six lines",
        description:
          "Go from file to DataFrame in a short Python script — see dev docs for the full happy path.",
      },
      {
        title: "Deterministic replay",
        description:
          "Re-run extraction on historical archives for model retraining without vendor API drift.",
      },
      {
        title: "SQL-friendly field names",
        description:
          "Human-readable keys map cleanly to warehouse schemas — no CLM01 memorization for analysts.",
      },
    ],
    outcomes: [
      "Safer LLM and analytics inputs without a separate de-ID pipeline",
      "Faster feature engineering on claims and remittance data",
      "Audit-friendly, repeatable extraction for regulated environments",
    ],
  },
  {
    slug: "format-conversion",
    title: "Format Conversion",
    description:
      "X12-to-FHIR, X12-to-CSV, ETL into warehouses — deterministic, auditable, and bidirectional. Parse in. Generate out.",
    icon: "ri-file-transfer-line",
    metaTitle: "X12 EDI Format Conversion — FHIR, CSV & Warehouse ETL",
    metaDescription:
      "Convert healthcare X12 to FHIR, CSV, or warehouse tables with ExactEDI — deterministic, on-premises, and bidirectional when you need to generate X12 back.",
    heroSubtitle:
      "Interop projects stall on unreliable parsers. ExactEDI gives ETL and integration teams a single engine for ingest, transform, and optional outbound X12 generation.",
    painPoints: [
      "Point-to-point converters break when trading partners change implementation guides.",
      "FHIR mapping from X12 is usually a one-off script, not a maintained pipeline.",
      "Teams need audit trails proving what was read and what was emitted.",
    ],
    capabilities: [
      {
        title: "Parse → transform → load",
        description:
          "Extract facts once, map to FHIR Resources, CSV columns, or Parquet in your own jobs — no duplicate parsing steps.",
      },
      {
        title: "Bidirectional when required",
        description:
          "Generate X12 from normalized facts for test harnesses, partner simulators, and round-trip QA.",
      },
      {
        title: "Batch and CLI friendly",
        description:
          "Process directories of files in CI/CD or nightly ETL without a hosted conversion API.",
      },
      {
        title: "Version-controlled mappings",
        description:
          "Your transformation logic lives in your repo; ExactEDI handles the X12 layer deterministically.",
      },
    ],
    outcomes: [
      "One parsing engine for every downstream format",
      "Reproducible conversions for compliance reviews",
      "No per-file cloud conversion fees at scale",
    ],
  },
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return useCases.find((uc) => uc.slug === slug);
}
