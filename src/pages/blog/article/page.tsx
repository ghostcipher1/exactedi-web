import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import BlogMarkdown from "@/components/BlogMarkdown";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";
import NotFound from "@/pages/NotFound";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!slug || !post) {
    return <NotFound />;
  }

  const related = getRelatedPosts(post.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      "@type": "Organization",
      name: post.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: "ExactEDI",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <SEO
        title={`${post.title} — ExactEDI Blog`}
        description={post.meta_description || post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        keywords={post.tags.join(", ")}
        ogImage={post.cover_image || undefined}
        ogType="article"
        jsonLd={articleJsonLd}
      />
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-stedi-dark">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
            >
              <i className="ri-arrow-left-line text-xs" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-stedi-green/10 border border-stedi-green/20 text-xs font-medium text-stedi-green">
                {post.category}
              </span>
              <span className="text-xs text-gray-500">{formatDate(post.published_at)}</span>
              <span className="text-xs text-gray-500">{post.read_time_minutes} min read</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-stedi-green/20">
                <i className="ri-user-line text-sm text-stedi-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{post.author_name}</p>
                <p className="text-xs text-gray-500">{post.author_role}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <BlogMarkdown content={post.content} />

            {post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stedi-gray-border">
                <p className="text-sm font-medium text-stedi-dark-text mb-3">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-stedi-gray-light text-sm text-stedi-gray-text border border-stedi-gray-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-5 rounded-xl border border-stedi-gray-border bg-stedi-gray-light flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-stedi-green/10 shrink-0">
                <i className="ri-user-line text-lg text-stedi-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stedi-dark-text">{post.author_name}</p>
                <p className="text-sm text-stedi-gray-text mt-1 leading-relaxed">
                  {post.author_role} at ExactEDI. We publish practical guides to help healthcare
                  technology teams navigate X12 EDI, HIPAA compliance, and data interoperability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="py-10 md:py-14 bg-stedi-gray-light border-t border-stedi-gray-border">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-lg md:text-xl font-bold text-stedi-dark-text mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/blog/${r.slug}`}
                    className="group flex flex-col rounded-xl border border-stedi-gray-border bg-white p-5 hover:border-stedi-green/30 transition-colors"
                  >
                    <span className="px-2.5 py-1 rounded-full bg-stedi-green-light text-xs font-medium text-stedi-green w-fit mb-3">
                      {r.category}
                    </span>
                    <h3 className="text-sm font-semibold text-stedi-dark-text mb-2 leading-snug group-hover:text-stedi-green transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="mt-auto pt-3 border-t border-stedi-gray-border flex items-center justify-between">
                      <span className="text-xs text-stedi-gray-text">
                        {formatDate(r.published_at)}
                      </span>
                      <span className="text-xs text-stedi-gray-text">
                        {r.read_time_minutes} min
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}
