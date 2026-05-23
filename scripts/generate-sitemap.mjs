/**
 * Regenerates public/sitemap.xml from routes, dev docs, blog posts, and use cases.
 * Run before `vite build` so static hosting serves an up-to-date sitemap.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(root);

const { devDocPages } = await jiti.import("./src/lib/dev-docs/config.ts");
const { useCases } = await jiti.import("./src/mocks/useCases.ts");

const siteUrl = (process.env.VITE_SITE_URL || "https://exactedi.com").replace(
  /\/$/,
  ""
);
const lastmod = new Date().toISOString().slice(0, 10);

/** @type {{ path: string; changefreq: string; priority: string }[]} */
const entries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/product", changefreq: "monthly", priority: "0.9" },
  { path: "/pricing", changefreq: "weekly", priority: "0.8" },
  { path: "/roadmap", changefreq: "weekly", priority: "0.8" },
  { path: "/security", changefreq: "monthly", priority: "0.8" },
  { path: "/request-access", changefreq: "weekly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.9" },
];

for (const page of devDocPages) {
  entries.push({
    path: page.path,
    changefreq: "weekly",
    priority: page.id === "getting-started" ? "0.85" : "0.75",
  });
}

for (const uc of useCases) {
  entries.push({
    path: `/use-cases/${uc.slug}`,
    changefreq: "monthly",
    priority: "0.7",
  });
}

const blogDir = join(root, "content", "blog");
for (const file of readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
  const raw = readFileSync(join(blogDir, file), "utf8");
  const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!fmMatch) continue;

  const fm = fmMatch[1];
  const status = /^\s*status:\s*(\S+)/m.exec(fm)?.[1];
  if (status && status !== "published") continue;

  const slug =
    /^\s*slug:\s*(\S+)/m.exec(fm)?.[1] ?? file.replace(/\.md$/, "");
  const featured = /^\s*featured:\s*true/m.test(fm);

  entries.push({
    path: `/blog/${slug}`,
    changefreq: "monthly",
    priority: featured ? "0.8" : "0.7",
  });
}

const seen = new Set();
const unique = entries.filter((e) => {
  if (seen.has(e.path)) return false;
  seen.add(e.path);
  return true;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (e) => `  <url>
    <loc>${siteUrl}${e.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public", "sitemap.xml"), xml, "utf8");
console.log(`Wrote sitemap with ${unique.length} URLs → public/sitemap.xml`);
