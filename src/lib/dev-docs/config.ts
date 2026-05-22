export interface DevDocPage {
  id: string;
  path: string;
  title: string;
  description: string;
  file: string;
  navLabel?: string;
}

export const devDocPages: DevDocPage[] = [
  {
    id: "getting-started",
    path: "/dev-docs",
    title: "Getting Started",
    description:
      "From your first X12 file to PHI-safe analytics in Python — the recommended onboarding path.",
    file: "getting-started.md",
    navLabel: "Getting Started",
  },
  {
    id: "installation",
    path: "/dev-docs/installation",
    title: "Installation",
    description:
      "Platform-specific install, license file setup, verification, and troubleshooting.",
    file: "INSTALLATION.md",
    navLabel: "Installation",
  },
  {
    id: "release-notes",
    path: "/dev-docs/release-notes",
    title: "Release Notes",
    description:
      "Engine release history — beta.4 validation expansion, .NET async API, and packaging updates.",
    file: "RELEASE_NOTES.md",
    navLabel: "Release Notes",
  },
  {
    id: "python",
    path: "/dev-docs/python",
    title: "Python SDK",
    description:
      "Complete Python SDK reference: async, streaming, pandas, frameworks, and error handling.",
    file: "PYTHON_GUIDE.md",
    navLabel: "Python SDK",
  },
  {
    id: "csharp",
    path: "/dev-docs/csharp",
    title: "C# / .NET SDK",
    description:
      "Using ExactEDI in .NET applications, including ASP.NET and streaming patterns.",
    file: "CSHARP_GUIDE.md",
    navLabel: "C# / .NET",
  },
  {
    id: "sdk",
    path: "/dev-docs/sdk",
    title: "SDK Overview",
    description:
      "Architecture, supported transactions, language bindings, and build-from-source.",
    file: "SDK_OVERVIEW.md",
    navLabel: "SDK Overview",
  },
  {
    id: "api-reference",
    path: "/dev-docs/api-reference",
    title: "C++ API Reference",
    description: "Complete C++ API reference for the ExactEDI SDK.",
    file: "API_REFERENCE.md",
    navLabel: "C++ API Reference",
  },
  {
    id: "c-api",
    path: "/dev-docs/c-api",
    title: "C API Reference",
    description: "C bindings and FFI surface for ExactEDI.",
    file: "C_API.md",
    navLabel: "C API",
  },
  {
    id: "cli",
    path: "/dev-docs/cli",
    title: "CLI Reference",
    description:
      "Command contracts for parse, validate, explain, normalize, and related CLI tools.",
    file: "cli_contracts.md",
    navLabel: "CLI Reference",
  },
  {
    id: "integration",
    path: "/dev-docs/integration",
    title: "Integration Guide",
    description:
      "Consuming JSONL and Facts JSON output in pipelines, warehouses, and downstream systems.",
    file: "INTEGRATION_GUIDE.md",
    navLabel: "Integration Guide",
  },
  {
    id: "facts-schema",
    path: "/dev-docs/facts-schema",
    title: "Facts JSON Schema",
    description: "PHI-safe analytical output schema for the explain command and Python SDK.",
    file: "facts_json_schema.md",
    navLabel: "Facts JSON Schema",
  },
  {
    id: "database",
    path: "/dev-docs/database",
    title: "Database Schema",
    description: "SQLite import schema and persistence patterns.",
    file: "DATABASE_SCHEMA.md",
    navLabel: "Database Schema",
  },
  {
    id: "x12-mapping",
    path: "/dev-docs/x12-mapping",
    title: "X12 Mapping Reference",
    description:
      "English-to-X12 vocabulary for SDK surfaces and validation diagnostics.",
    file: "x12-mapping/index.md",
    navLabel: "X12 Mapping",
  },
  {
    id: "x12-mappings",
    path: "/dev-docs/x12-mapping/mappings",
    title: "X12 Mappings",
    description:
      "English-to-X12 lookup for SDK classes, methods, and properties.",
    file: "x12-mapping/mappings.md",
    navLabel: "X12 Mappings",
  },
  {
    id: "x12-diagnostics",
    path: "/dev-docs/x12-mapping/diagnostics",
    title: "Validation Diagnostics",
    description:
      "Plain-English reference for every validation diagnostic the engine emits.",
    file: "x12-mapping/diagnostics.md",
    navLabel: "Validation Diagnostics",
  },
  {
    id: "licensing",
    path: "/dev-docs/licensing",
    title: "Licensing",
    description:
      "License file format, hardware binding, tier features, and troubleshooting.",
    file: "LICENSE_GUIDE.md",
    navLabel: "Licensing",
  },
  {
    id: "licensing-system",
    path: "/dev-docs/licensing-system",
    title: "Licensing System",
    description:
      "Ed25519 signatures, license generation workflow, and enforcement model.",
    file: "licensing.md",
  },
];

export const devDocPageById = Object.fromEntries(
  devDocPages.map((page) => [page.id, page])
) as Record<string, DevDocPage>;

export const devDocPageByPath = Object.fromEntries(
  devDocPages.map((page) => [page.path, page])
) as Record<string, DevDocPage>;

/** Pages shown in the main Developers nav dropdown */
export const devDocNavItems = devDocPages.filter((page) => page.navLabel);

export interface DevDocNavGroup {
  label: string;
  pageIds: string[];
}

/** Grouped items for the Developers nav dropdown (with dividers) */
export const devDocNavDropdownGroups: DevDocNavGroup[] = [
  {
    label: "Start here",
    pageIds: ["getting-started", "installation", "release-notes"],
  },
  {
    label: "SDKs",
    pageIds: ["python", "csharp", "sdk", "api-reference", "c-api"],
  },
  {
    label: "Reference",
    pageIds: [
      "cli",
      "integration",
      "facts-schema",
      "database",
      "x12-mapping",
      "licensing",
    ],
  },
];

export const devDocSidebarGroups: DevDocNavGroup[] = [
  {
    label: "Start here",
    pageIds: ["getting-started", "installation", "release-notes"],
  },
  {
    label: "Language SDKs",
    pageIds: ["python", "csharp", "sdk", "api-reference", "c-api"],
  },
  {
    label: "CLI & integration",
    pageIds: ["cli", "integration", "facts-schema", "database"],
  },
  {
    label: "X12 reference",
    pageIds: ["x12-mapping", "x12-mappings", "x12-diagnostics"],
  },
  {
    label: "Licensing",
    pageIds: ["licensing", "licensing-system"],
  },
];

export function getDevDocByPath(pathname: string): DevDocPage | undefined {
  if (devDocPageByPath[pathname]) {
    return devDocPageByPath[pathname];
  }
  const normalized = pathname.replace(/\/$/, "") || "/dev-docs";
  return devDocPageByPath[normalized];
}
