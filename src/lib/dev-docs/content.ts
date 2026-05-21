import { devDocPages } from "./config";

const docModules = import.meta.glob("../../content/docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function moduleKeyForFile(file: string): string {
  return `../../content/docs/${file}`;
}

/** Remove the leading H1 — the page hero already shows the title */
function stripLeadingTitle(markdown: string): string {
  return markdown.replace(/^#\s+[^\n]+\n+/, "");
}

export function getDocContent(file: string): string | undefined {
  const raw = docModules[moduleKeyForFile(file)];
  return raw ? stripLeadingTitle(raw) : undefined;
}

export function getAllDocContents(): Record<string, string> {
  const contents: Record<string, string> = {};
  for (const page of devDocPages) {
    const content = getDocContent(page.file);
    if (content) {
      contents[page.id] = content;
    }
  }
  return contents;
}
