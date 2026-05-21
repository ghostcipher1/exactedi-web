import { devDocPages } from "./config";

const fileToPath = new Map<string, string>();

for (const page of devDocPages) {
  fileToPath.set(page.file, page.path);
  const basename = page.file.split("/").pop() ?? page.file;
  fileToPath.set(basename, page.path);
}

/** Map markdown filenames and relative paths to site routes */
const linkAliases: Record<string, string> = {
  "getting-started.md": "/dev-docs",
  "INSTALLATION.md": "/dev-docs/installation",
  "PYTHON_GUIDE.md": "/dev-docs/python",
  "CSHARP_GUIDE.md": "/dev-docs/csharp",
  "SDK_OVERVIEW.md": "/dev-docs/sdk",
  "API_REFERENCE.md": "/dev-docs/api-reference",
  "C_API.md": "/dev-docs/c-api",
  "cli_contracts.md": "/dev-docs/cli",
  "INTEGRATION_GUIDE.md": "/dev-docs/integration",
  "facts_json_schema.md": "/dev-docs/facts-schema",
  "DATABASE_SCHEMA.md": "/dev-docs/database",
  "LICENSE_GUIDE.md": "/dev-docs/licensing",
  "licensing.md": "/dev-docs/licensing-system",
  "x12-mapping/index.md": "/dev-docs/x12-mapping",
  "x12-mapping/mappings.md": "/dev-docs/x12-mapping/mappings",
  "x12-mapping/diagnostics.md": "/dev-docs/x12-mapping/diagnostics",
  "mappings.md": "/dev-docs/x12-mapping/mappings",
  "diagnostics.md": "/dev-docs/x12-mapping/diagnostics",
  "index.md": "/dev-docs/x12-mapping",
};

export function resolveDocLink(href: string | undefined): string | undefined {
  if (!href) return href;

  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return href;
  }

  if (href.startsWith("/")) {
    return href.split("#")[0];
  }

  const [pathPart, hash] = href.split("#");
  const clean = pathPart.replace(/^\.\//, "");

  if (linkAliases[clean]) {
    return hash ? `${linkAliases[clean]}#${hash}` : linkAliases[clean];
  }

  if (clean.startsWith("x12-mapping/")) {
    const mapped = linkAliases[clean];
    if (mapped) {
      return hash ? `${mapped}#${hash}` : mapped;
    }
  }

  if (clean.endsWith(".md")) {
    const basename = clean.split("/").pop() ?? clean;
    if (linkAliases[basename]) {
      return hash ? `${linkAliases[basename]}#${hash}` : linkAliases[basename];
    }
  }

  return href;
}
