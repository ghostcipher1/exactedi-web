import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const JSON_LD_ID = "exactedi-json-ld";
const DEFAULT_OG_IMAGE =
  "https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/809878189b8e1bfb89d3e80f8fa851be.jpeg?ogv=85wfys";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string
): void {
  let element = document.querySelector(
    `meta[${attribute}="${key}"]`
  ) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function SEO({
  title,
  description,
  canonicalPath = "",
  keywords,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  jsonLd,
}: SEOProps) {
  const siteUrl =
    (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";
  const cleanSiteUrl = siteUrl.replace(/\/$/, "");
  const cleanPath = canonicalPath ? canonicalPath.replace(/^\//, "") : "";
  const canonical = cleanPath ? `${cleanSiteUrl}/${cleanPath}` : cleanSiteUrl;
  const ogImageUrl = ogImage || DEFAULT_OG_IMAGE;

  useEffect(() => {
    document.title = title;

    upsertMeta("name", "description", description);
    if (keywords) {
      upsertMeta("name", "keywords", keywords);
    }
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow"
    );

    let canonicalLink = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:site_name", "ExactEDI");
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("property", "og:image", ogImageUrl);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");

    upsertMeta("name", "twitter:card", twitterCard);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImageUrl);
    upsertMeta("name", "twitter:image:alt", title);

    const existingJsonLd = document.getElementById(JSON_LD_ID);
    if (jsonLd) {
      let script = existingJsonLd as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = JSON_LD_ID;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
    } else if (existingJsonLd) {
      existingJsonLd.remove();
    }
  }, [
    title,
    description,
    canonical,
    keywords,
    ogImageUrl,
    ogType,
    twitterCard,
    noindex,
    jsonLd,
  ]);

  return null;
}
