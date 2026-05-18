import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";
import NewsletterForm from "@/components/feature/NewsletterForm";
import { Link } from "react-router-dom";
import { getAllPosts, type BlogPost } from "@/lib/blog";

const siteUrl = (import.meta.env.VITE_SITE_URL as string) || "https://exactedi.com";
const rssUrl = `${siteUrl}/blog-rss?site=${encodeURIComponent(siteUrl)}`;

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "ExactEDI Blog — X12 EDI, HIPAA Compliance & Healthcare Data Processing",
  description:
    "Expert articles on X12 EDI transactions, HIPAA compliance, SNIP validation, healthcare data interoperability, and electronic claims processing.",
  url: `${siteUrl}/blog`,
  publisher: {
    "@type": "Organization",
    name: "ExactEDI",
    url: siteUrl,
  },
};

const categories = ["All", "X12 EDI", "HIPAA Compliance", "Healthcare Billing", "Healthcare IT"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-stedi-dark-text rounded px-0.5">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-stedi-gray-border bg-white overflow-hidden hover:border-stedi-green/30 transition-colors"
    >
      <div className="h-44 bg-stedi-gray-light overflow-hidden relative">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-stedi-green-light">
              <i className="ri-article-line text-xl text-stedi-green" />
            </div>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-stedi-green-light text-xs font-medium text-stedi-green">
            {post.category}
          </span>
          <span className="text-xs text-stedi-gray-text">{post.read_time_minutes} min read</span>
        </div>
        <h3 className="text-base font-semibold text-stedi-dark-text mb-2 leading-snug group-hover:text-stedi-green transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-stedi-gray-text leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>
        <div className="pt-3 border-t border-stedi-gray-border flex items-center justify-between">
          <span className="text-xs text-stedi-gray-text">{formatDate(post.published_at)}</span>
          <span className="text-xs font-medium text-stedi-green flex items-center gap-1">
            Read more
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-line" />
            </div>
          </span>
        </div>
      </div>
    </Link>
  );
}

const allPosts = getAllPosts();

export default function BlogPage() {
  const [error] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [allPosts, searchQuery]);

  const filteredPosts = useMemo(() => {
    let result = allPosts;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [allPosts, activeCategory, searchQuery]);

  const featuredPosts = useMemo(() => allPosts.filter((p) => p.featured), [allPosts]);
  const regularPosts = useMemo(() => filteredPosts.filter((p) => !p.featured), [filteredPosts]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0;
      if (suggestions[idx]) {
        window.location.href = `/blog/${suggestions[idx].slug}`;
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, [showSuggestions, suggestions, activeSuggestionIndex]);

  return (
    <>
      <SEO
        title="ExactEDI Blog — X12 EDI, HIPAA Compliance & Healthcare Data Processing Articles"
        description="Expert articles on X12 EDI transactions, HIPAA compliance, SNIP validation, healthcare data interoperability, and electronic claims processing."
        canonicalPath="/blog"
        keywords="X12 EDI blog, HIPAA compliance articles, healthcare data processing, SNIP validation guide, EDI 837, EDI 835"
        jsonLd={blogJsonLd}
      />
      <link rel="alternate" type="application/rss+xml" title="ExactEDI Blog RSS Feed" href={rssUrl} />

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-stedi-dark">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stedi-green/10 border border-stedi-green/20">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-pencil-line text-xs text-stedi-green" />
                </div>
                <span className="text-xs font-medium text-stedi-green">ExactEDI Blog</span>
              </div>
              <a
                href={rssUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Subscribe to RSS feed"
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-rss-line" />
                </div>
                RSS Feed
              </a>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              X12 EDI &amp; Healthcare Data Insights
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl leading-relaxed">
              Expert articles on HIPAA compliance, SNIP validation, electronic claims processing,
              and healthcare data interoperability. Practical guides for health tech teams.
            </p>
          </div>
        </section>

        {/* Search + Filters */}
        <section className="py-6 md:py-8 border-b border-stedi-gray-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-start md:justify-between">
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-stedi-dark text-white"
                        : "bg-stedi-gray-light text-stedi-gray-text hover:bg-stedi-gray-border"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div ref={searchRef} className="relative max-w-sm w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-stedi-gray-text">
                  <i className="ri-search-line text-sm" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    setActiveSuggestionIndex(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search articles..."
                  className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-stedi-gray-text hover:text-stedi-dark-text"
                  >
                    <i className="ri-close-line text-sm" />
                  </button>
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-stedi-gray-border shadow-lg overflow-hidden z-50">
                    <div className="px-3 py-2 text-xs font-medium text-stedi-gray-text bg-stedi-gray-light border-b border-stedi-gray-border">
                      {suggestions.length} result{suggestions.length !== 1 ? "s" : ""} found
                    </div>
                    <ul>
                      {suggestions.map((post, idx) => (
                        <li key={post.slug}>
                          <a
                            href={`/blog/${post.slug}`}
                            className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                              idx === activeSuggestionIndex
                                ? "bg-stedi-green-light"
                                : "hover:bg-stedi-gray-light"
                            }`}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                          >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-stedi-green/10 shrink-0 mt-0.5">
                              <i className="ri-article-line text-sm text-stedi-green" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-stedi-dark-text truncate">
                                {highlightMatch(post.title, searchQuery)}
                              </p>
                              <p className="text-xs text-stedi-gray-text line-clamp-1 mt-0.5">
                                {highlightMatch(post.excerpt, searchQuery)}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="px-2 py-0.5 rounded-full bg-stedi-green-light text-[10px] font-medium text-stedi-green">
                                  {post.category}
                                </span>
                                <span className="text-[10px] text-stedi-gray-text">
                                  {post.read_time_minutes} min read
                                </span>
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="px-4 py-2 text-[10px] text-stedi-gray-text bg-stedi-gray-light border-t border-stedi-gray-border flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded bg-white border border-stedi-gray-border text-[10px] font-mono">↑↓</kbd>
                        Navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded bg-white border border-stedi-gray-border text-[10px] font-mono">Enter</kbd>
                        Open
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded bg-white border border-stedi-gray-border text-[10px] font-mono">Esc</kbd>
                        Close
                      </span>
                    </div>
                  </div>
                )}

                {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-stedi-gray-border shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-6 text-center">
                      <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3 rounded-full bg-stedi-gray-light">
                        <i className="ri-search-line text-lg text-stedi-gray-text" />
                      </div>
                      <p className="text-sm text-stedi-gray-text">
                        No articles found for "{searchQuery}"
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="mt-2 text-xs font-medium text-stedi-green hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {!error && featuredPosts.length > 0 && activeCategory === "All" && !searchQuery && (
          <section className="py-10 md:py-14">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-lg md:text-xl font-bold text-stedi-dark-text mb-6 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-star-fill text-sm text-stedi-green" />
                </div>
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {featuredPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Articles */}
        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-lg md:text-xl font-bold text-stedi-dark-text mb-6">
              {searchQuery ? `Search Results (${filteredPosts.length})` : "All Articles"}
            </h2>


            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3 rounded-full bg-red-100">
                  <i className="ri-error-warning-line text-lg text-red-500" />
                </div>
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 text-sm font-medium rounded-lg bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!error && filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 rounded-full bg-stedi-gray-light">
                  <i className="ri-search-line text-xl text-stedi-gray-text" />
                </div>
                <p className="text-sm text-stedi-gray-text">No articles found matching your criteria.</p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-sm font-medium text-stedi-green hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {!error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {regularPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-12 md:py-16 bg-stedi-gray-light border-t border-stedi-gray-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-stedi-dark-text mb-2">
                  Stay ahead of healthcare EDI
                </h2>
                <p className="text-sm text-stedi-gray-text leading-relaxed max-w-md">
                  Get new articles on X12 EDI, HIPAA compliance, and healthcare data interoperability
                  delivered straight to your inbox. No spam, unsubscribe anytime.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <NewsletterForm
                  variant="boxed"
                  buttonLabel="Subscribe"
                  successMessage="Welcome aboard! Check your inbox for confirmation."
                />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}