import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  published_at: string;
  author_name: string;
  cover_image: string | null;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toUTCString();
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const siteUrl = url.searchParams.get("site") || "https://example.com";
  const cleanSiteUrl = siteUrl.replace(/\/$/, "");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response("Supabase credentials not configured", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, content, category, tags, published_at, author_name, cover_image")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return new Response(`Database error: ${error.message}`, { status: 500 });
  }

  const posts = (data || []) as BlogPost[];
  const now = new Date().toUTCString();

  let itemsXml = "";
  for (const post of posts) {
    const link = `${cleanSiteUrl}/blog/${post.slug}`;
    const description = escapeXml(post.excerpt || "");
    const pubDate = toRfc822(post.published_at);
    const category = escapeXml(post.category);
    const author = escapeXml(post.author_name);
    const tagsXml = (post.tags || [])
      .map((tag) => `<category>${escapeXml(tag)}</category>`)
      .join("");

    let enclosureXml = "";
    if (post.cover_image) {
      enclosureXml = `<enclosure url="${escapeXml(post.cover_image)}" type="image/jpeg" />`;
    }

    itemsXml += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <author>${author}</author>
      <category>${category}</category>
      ${tagsXml}
      ${enclosureXml}
    </item>`;
  }

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>ExactEDI Blog — X12 EDI, HIPAA Compliance &amp; Healthcare Data Processing</title>
    <link>${cleanSiteUrl}/blog</link>
    <description>Expert articles on X12 EDI transactions, HIPAA compliance, SNIP validation, healthcare data interoperability, and electronic claims processing. Practical guides for health tech teams.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${cleanSiteUrl}/blog-rss" rel="self" type="application/rss+xml" />
    <image>
      <url>https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/809878189b8e1bfb89d3e80f8fa851be.jpeg?ogv=85wfys</url>
      <title>ExactEDI Blog</title>
      <link>${cleanSiteUrl}/blog</link>
    </image>${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
