/** Browser-safe frontmatter parser (no gray-matter / Node Buffer). */

export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const trimmed = raw.replace(/^\uFEFF/, "");
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: trimmed.trim() };
  }

  const data: Record<string, unknown> = {};
  const yamlBlock = match[1];
  const content = match[2].trim();

  for (const line of yamlBlock.split("\n")) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const colon = trimmedLine.indexOf(":");
    if (colon === -1) continue;

    const key = trimmedLine.slice(0, colon).trim();
    const rawValue = trimmedLine.slice(colon + 1).trim();
    data[key] = parseYamlValue(rawValue);
  }

  return { data, content };
}

function parseYamlValue(raw: string): unknown {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw === "null" || raw === "~") return null;

  if (/^-?\d+$/.test(raw)) return Number(raw);

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      return JSON.parse(raw.replace(/'/g, '"')) as unknown[];
    } catch {
      const inner = raw.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
    }
  }

  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1);
  }

  return raw;
}
