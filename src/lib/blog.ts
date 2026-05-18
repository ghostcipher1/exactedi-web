import matter from "gray-matter";

export interface BlogPostMeta {
  slug: string;
  title: string;
  meta_description: string;
  excerpt: string;
  category: string;
  tags: string[];
  author_name: string;
  author_role: string;
  published_at: string;
  read_time_minutes: number;
  featured: boolean;
  status: string;
  cover_image?: string | null;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const modules = import.meta.glob("../../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parsePost(path: string, raw: string): BlogPost | null {
  const { data, content } = matter(raw);
  const slug =
    (typeof data.slug === "string" && data.slug) ||
    path.replace(/.*\//, "").replace(/\.md$/, "");

  if (data.status && data.status !== "published") return null;

  return {
    slug,
    title: String(data.title ?? slug),
    meta_description: String(data.meta_description ?? data.excerpt ?? ""),
    excerpt: String(data.excerpt ?? ""),
    category: String(data.category ?? "X12 EDI"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author_name: String(data.author_name ?? "ExactEDI Team"),
    author_role: String(data.author_role ?? ""),
    published_at: String(data.published_at ?? new Date().toISOString().slice(0, 10)),
    read_time_minutes: Number(data.read_time_minutes ?? 8),
    featured: Boolean(data.featured),
    status: String(data.status ?? "published"),
    cover_image: data.cover_image ? String(data.cover_image) : null,
    content: content.trim(),
  };
}

const allPosts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((p): p is BlogPost => p !== null)
  .sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

export function getAllPosts(): BlogPost[] {
  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return allPosts.filter((p) => p.slug !== slug).slice(0, limit);

  return allPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? 2 : 0;
      const bScore = b.category === current.category ? 2 : 0;
      const aTags = a.tags.filter((t) => current.tags.includes(t)).length;
      const bTags = b.tags.filter((t) => current.tags.includes(t)).length;
      return bScore + bTags - (aScore + aTags);
    })
    .slice(0, limit);
}
