/**
 * Builds static HTML documents for every /dev-docs route.
 *
 * The React app still handles client-side navigation after load, but these
 * generated files make View Source contain the real documentation article,
 * metadata, canonical URL, OpenGraph tags, and internal documentation links.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createJiti } from "jiti";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const siteUrl = (process.env.VITE_SITE_URL || "https://exactedi.com").replace(
  /\/$/,
  ""
);
const ogImage =
  "https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/809878189b8e1bfb89d3e80f8fa851be.jpeg?ogv=85wfys";

const jiti = createJiti(root);
const {
  devDocPages,
  devDocSidebarGroups,
  devDocPageById,
} = await jiti.import("./src/lib/dev-docs/config.ts");
const { extractHeadings, slugifyHeading } = await jiti.import(
  "./src/lib/dev-docs/headings.ts"
);

const indexTemplate = readFileSync(join(outDir, "index.html"), "utf8");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripLeadingTitle(markdown) {
  return markdown.replace(/^#\s+[^\n]+\n+/, "");
}

function headingText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return headingText(children.props?.children ?? "");
  }
  return String(children ?? "");
}

const linkAliases = Object.fromEntries(
  devDocPages.flatMap((page) => {
    const basename = page.file.split("/").pop() ?? page.file;
    return [
      [page.file, page.path],
      [basename, page.path],
    ];
  })
);

function resolveDocLink(href) {
  if (!href) return href;
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  ) {
    return href;
  }
  if (href.startsWith("/")) return href.split("#")[0];

  const [pathPart, hash] = href.split("#");
  const clean = pathPart.replace(/^\.\//, "");
  const mapped = linkAliases[clean] ?? linkAliases[clean.split("/").pop()];
  if (mapped) return hash ? `${mapped}#${hash}` : mapped;
  return href;
}

function renderMarkdown(content) {
  return renderToStaticMarkup(
    createElement(
      "article",
      {
        className:
          "prose prose-sm md:prose-base max-w-none prose-headings:text-stedi-dark-text prose-p:text-stedi-gray-text prose-strong:text-stedi-dark-text prose-a:text-stedi-green prose-a:no-underline hover:prose-a:underline prose-li:text-stedi-gray-text prose-ul:my-4 prose-ol:my-4 prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-0 prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-28 prose-h3:text-base md:prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-28 prose-h4:text-sm prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2 prose-table:border prose-table:border-stedi-gray-border prose-th:bg-stedi-gray-light prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-medium prose-th:text-stedi-dark-text prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-stedi-gray-text prose-code:text-stedi-dark-text prose-code:bg-stedi-gray prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent",
      },
      createElement(ReactMarkdown, {
        remarkPlugins: [remarkGfm],
        components: {
          a: ({ href, children }) => {
            const resolved = resolveDocLink(href);
            const isExternal = /^https?:\/\//.test(resolved ?? "");
            return createElement(
              "a",
              {
                href: resolved,
                className: "text-stedi-green hover:underline",
                ...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {}),
              },
              children
            );
          },
          h2: ({ children }) =>
            createElement(
              "h2",
              {
                id: slugifyHeading(headingText(children)),
                className: "scroll-mt-28",
              },
              children
            ),
          h3: ({ children }) =>
            createElement(
              "h3",
              {
                id: slugifyHeading(headingText(children)),
                className: "scroll-mt-28",
              },
              children
            ),
          pre: ({ children }) =>
            createElement(
              "pre",
              {
                className:
                  "rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 overflow-x-auto not-prose",
              },
              children
            ),
          code: ({ className, children, node: _node, ...props }) => {
            const isBlock = className?.includes("language-");
            return createElement(
              "code",
              {
                className: isBlock
                  ? `${className} text-xs md:text-sm text-gray-300 font-mono block whitespace-pre`
                  : "px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs font-mono",
                ...props,
              },
              children
            );
          },
        },
        children: content,
      })
    )
  );
}

function renderNavbar() {
  return `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stedi-gray-border shadow-sm">
      <div class="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <a href="/" class="flex items-center">
          <img src="https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/8c61ba98ef22aa6dcd2220b725f673ab.svg" alt="ExactEDI" class="h-9 w-auto" />
        </a>
        <div class="hidden md:flex items-center gap-1">
          <a href="/product" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 text-stedi-dark-text">Product</a>
          <a href="/roadmap" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 text-stedi-dark-text">Roadmap</a>
          <a href="/pricing" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 text-stedi-dark-text">Pricing</a>
          <a href="/blog" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 text-stedi-dark-text">Blog</a>
          <a href="/security" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 text-stedi-dark-text">Security</a>
          <a href="/dev-docs" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 text-stedi-dark-text">Developers</a>
        </div>
        <a href="/request-access" class="hidden md:inline-flex px-4 py-2 text-sm font-medium rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors whitespace-nowrap shadow-sm">Request early access <i class="ri-arrow-right-line ml-1 text-xs"></i></a>
      </div>
    </nav>`;
}

function renderSidebar(currentPage, content) {
  const headings = extractHeadings(content).filter((h) => h.level <= 3);
  const groups = devDocSidebarGroups
    .map((group) => {
      const links = group.pageIds
        .map((pageId) => {
          const page = devDocPageById[pageId];
          if (!page?.navLabel) return "";
          const active = page.path === currentPage.path;
          return `<li><a href="${page.path}" class="block px-3 py-1.5 text-sm rounded-md transition-colors ${
            active
              ? "bg-stedi-green-light text-stedi-green font-medium"
              : "text-stedi-gray-text hover:text-stedi-dark-text hover:bg-stedi-gray"
          }">${escapeHtml(page.navLabel)}</a></li>`;
        })
        .join("");

      return `<div class="mb-3">
        <p class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wider rounded-md text-stedi-gray-text">${escapeHtml(group.label)}</p>
        <ul class="space-y-0.5 mt-1">${links}</ul>
      </div>`;
    })
    .join("");

  const headingLinks = headings
    .map((heading) => {
      const padding = heading.level === 3 ? "pl-6 pr-3" : "px-3";
      return `<li><a href="#${heading.id}" class="block rounded-md transition-colors ${padding} py-1.5 text-sm text-stedi-gray-text hover:text-stedi-dark-text">${escapeHtml(
        heading.text
      )}</a></li>`;
    })
    .join("");

  return `<aside class="w-[250px] shrink-0 hidden lg:block">
    <div class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-6">
      <nav aria-label="Documentation sections">${groups}</nav>
      ${
        headings.length
          ? `<div class="pt-4 border-t border-stedi-gray-border">
              <p class="px-3 mb-2 text-xs font-semibold tracking-wider text-stedi-gray-text uppercase">On this page</p>
              <ul class="space-y-0.5">${headingLinks}</ul>
            </div>`
          : ""
      }
    </div>
  </aside>`;
}

function renderFooter() {
  return `<footer class="bg-stedi-gray-light border-t border-stedi-gray-border">
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <img src="https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/8c61ba98ef22aa6dcd2220b725f673ab.svg" alt="ExactEDI" class="h-9 w-auto" />
          <p class="mt-4 text-sm font-medium text-stedi-dark-text">contact@exactedi.com</p>
          <p class="text-sm text-stedi-gray-text">ExactEDI, Inc.</p>
        </div>
        <p class="text-xs text-stedi-gray-text max-w-xl leading-relaxed">ExactEDI is a licensed library — on-premises, zero network calls. Not a SaaS, cloud API, or clearinghouse. Beta software — see the validation roadmap for current SNIP coverage.</p>
      </div>
      <div class="mt-8 pt-6 border-t border-stedi-gray-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p class="text-xs text-stedi-gray-text">&copy; ${new Date().getFullYear()} ExactEDI, Inc. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="/dev-docs" class="text-xs text-stedi-gray-text hover:text-stedi-green">Documentation</a>
          <a href="/roadmap" class="text-xs text-stedi-gray-text hover:text-stedi-green">Roadmap</a>
          <a href="/security" class="text-xs text-stedi-gray-text hover:text-stedi-green">Security</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderStaticPage(page, content) {
  const articleHtml = renderMarkdown(content);
  return `<main class="min-h-screen bg-white">
    ${renderNavbar()}
    <section class="pt-28 pb-10 md:pt-36 md:pb-14 bg-stedi-dark">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="ri-book-open-line text-stedi-green text-sm"></i>
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-stedi-green">Documentation</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">${escapeHtml(
          page.title
        )}</h1>
        <p class="text-base text-gray-400 max-w-2xl leading-relaxed">${escapeHtml(
          page.description
        )}</p>
      </div>
    </section>
    <section class="py-10 md:py-14">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="flex gap-10">
          ${renderSidebar(page, content)}
          <div class="flex-1 min-w-0 max-w-3xl">${articleHtml}</div>
        </div>
      </div>
    </section>
    ${renderFooter()}
  </main>`;
}

function renderMeta(page) {
  const title = `${page.title} — ExactEDI Developer Documentation`;
  const canonical = `${siteUrl}${page.path}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "TechArticle"],
    name: title,
    description: page.description,
    url: canonical,
  };

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="keywords" content="ExactEDI documentation, X12 EDI developer guide, EDI parsing API, healthcare EDI" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="ExactEDI" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
    <script id="exactedi-json-ld" type="application/ld+json">${JSON.stringify(
      jsonLd
    ).replace(/</g, "\\u003c")}</script>`;
}

function injectHtml(template, page, content) {
  const meta = renderMeta(page);
  const appHtml = renderStaticPage(page, content);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, meta)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

let rendered = 0;

for (const page of devDocPages) {
  const raw = readFileSync(join(root, "src", "content", "docs", page.file), "utf8");
  const content = stripLeadingTitle(raw);
  const html = injectHtml(indexTemplate, page, content);

  const relative = page.path.replace(/^\//, "");
  const targetDir = join(outDir, relative);
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, "index.html"), html, "utf8");
  rendered += 1;
}

console.log(`Prerendered ${rendered} dev-doc pages → out/dev-docs`);
