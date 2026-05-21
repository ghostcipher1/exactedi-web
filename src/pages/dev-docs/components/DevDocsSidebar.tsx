import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  devDocSidebarGroups,
  devDocPageById,
  type DevDocPage,
} from "@/lib/dev-docs/config";
import { extractHeadings, type DocHeading } from "@/lib/dev-docs/headings";

interface DevDocsSidebarProps {
  currentPage: DevDocPage;
  content: string;
}

export default function DevDocsSidebar({
  currentPage,
  content,
}: DevDocsSidebarProps) {
  const location = useLocation();
  const [activeHash, setActiveHash] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(devDocSidebarGroups.map((g) => g.label))
  );

  const headings = extractHeadings(content).filter((h) => h.level <= 3);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [location.pathname]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const scrollToHeading = (heading: DocHeading) => {
    const el = document.getElementById(heading.id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
      window.history.replaceState(null, "", `#${heading.id}`);
      setActiveHash(`#${heading.id}`);
    }
  };

  return (
    <aside className="w-[250px] shrink-0 hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-6">
        <nav aria-label="Documentation sections">
          {devDocSidebarGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.label);
            return (
              <div key={group.label} className="mb-3">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wider rounded-md transition-colors cursor-pointer text-stedi-gray-text hover:text-stedi-dark-text"
                >
                  <span>{group.label}</span>
                  <i
                    className={`ri-arrow-down-s-line text-sm transition-transform ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>
                {isExpanded && (
                  <ul className="space-y-0.5 mt-1">
                    {group.pageIds.map((pageId) => {
                      const page = devDocPageById[pageId];
                      if (!page?.navLabel) return null;
                      const isActive = page.path === currentPage.path;
                      return (
                        <li key={pageId}>
                          <Link
                            to={page.path}
                            className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                              isActive
                                ? "bg-stedi-green-light text-stedi-green font-medium"
                                : "text-stedi-gray-text hover:text-stedi-dark-text hover:bg-stedi-gray"
                            }`}
                          >
                            {page.navLabel}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {headings.length > 0 && (
          <div className="pt-4 border-t border-stedi-gray-border">
            <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-stedi-gray-text uppercase">
              On this page
            </p>
            <ul className="space-y-0.5">
              {headings.map((heading) => {
                const hash = `#${heading.id}`;
                const isActive = activeHash === hash;
                return (
                  <li key={heading.id}>
                    <button
                      type="button"
                      onClick={() => scrollToHeading(heading)}
                      className={`w-full text-left rounded-md transition-colors cursor-pointer ${
                        heading.level === 3 ? "pl-6 pr-3" : "px-3"
                      } py-1.5 text-sm ${
                        isActive
                          ? "text-stedi-green font-medium"
                          : "text-stedi-gray-text hover:text-stedi-dark-text"
                      }`}
                    >
                      {heading.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
