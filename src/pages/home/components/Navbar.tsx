import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  devDocNavDropdownGroups,
  devDocPageById,
} from "@/lib/dev-docs/config";

function ExactEDILogo({ scrolled }: { scrolled: boolean }) {
  return (
    <img
      src="https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/8c61ba98ef22aa6dcd2220b725f673ab.svg"
      alt="ExactEDI"
      className={`h-9 w-auto transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
    />
  );
}

type NavLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

type NavItem =
  | NavLinkItem
  | { label: string; groups: typeof devDocNavDropdownGroups };

const navLinks: NavItem[] = [
  { label: "Product", href: "#" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Security", href: "/security" },
  {
    label: "Developers",
    groups: devDocNavDropdownGroups,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const textColor = scrolled ? "text-stedi-dark-text" : "text-white";
  const bgClass = scrolled
    ? "bg-white/95 backdrop-blur-sm border-b border-stedi-gray-border shadow-sm"
    : "bg-transparent";

  const renderDevelopersDropdown = () => (
    <div className="absolute top-full left-0 mt-1 w-56 max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-lg border border-stedi-gray-border py-1 z-50">
      {devDocNavDropdownGroups.map((group, groupIndex) => (
        <div key={group.label}>
          {groupIndex > 0 && (
            <div className="my-1 border-t border-stedi-gray-border" />
          )}
          {group.pageIds.map((pageId) => {
            const page = devDocPageById[pageId];
            if (!page?.navLabel) return null;
            return (
              <Link
                key={pageId}
                to={page.path}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-3 py-2 text-sm text-stedi-dark-text hover:bg-stedi-gray hover:text-stedi-green transition-colors"
              >
                {page.navLabel}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderDevelopersMobile = () => (
    <div className="pl-4 space-y-1">
      {devDocNavDropdownGroups.map((group) =>
        group.pageIds.map((pageId) => {
          const page = devDocPageById[pageId];
          if (!page?.navLabel) return null;
          return (
            <Link
              key={pageId}
              to={page.path}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-stedi-gray-text rounded-md hover:bg-stedi-gray"
            >
              {page.navLabel}
            </Link>
          );
        })
      )}
    </div>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <Link to="/" className="flex items-center">
          <ExactEDILogo scrolled={scrolled} />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            if ("groups" in item) {
              return (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 ${textColor} cursor-pointer`}
                  >
                    {item.label}
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i
                        className={`ri-arrow-down-s-line text-xs transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {dropdownOpen && renderDevelopersDropdown()}
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 ${textColor}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/request-access"
            className="px-4 py-2 text-sm font-medium rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors whitespace-nowrap shadow-sm"
          >
            Request early access
            <i className="ri-arrow-right-line ml-1 text-xs" />
          </Link>
        </div>

        <button
          className={`md:hidden p-2 rounded-md ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`ri-${mobileOpen ? "close" : "menu"}-line text-lg`} />
          </div>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stedi-gray-border px-4 py-4 space-y-2">
          {navLinks.map((item) => {
            if ("groups" in item) {
              return (
                <div key={item.label} className="space-y-1">
                  <span className="block px-3 py-2 text-sm font-medium text-stedi-dark-text rounded-md">
                    {item.label}
                  </span>
                  {renderDevelopersMobile()}
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stedi-dark-text rounded-md hover:bg-stedi-gray"
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-stedi-gray-border">
            <Link
              to="/request-access"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 text-sm font-medium rounded-full bg-stedi-green text-white text-center"
            >
              Request early access
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
