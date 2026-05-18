import { useEffect, useRef, useState } from "react";

function ExactEDILogo({ scrolled }: { scrolled: boolean }) {
  return (
    <img
      src="https://static.readdy.ai/image/79fc7dd2a0cd90090657252ea6cd81d4/8c61ba98ef22aa6dcd2220b725f673ab.svg"
      alt="ExactEDI"
      className={`h-9 w-auto transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
    />
  );
}

type NavItem =
  | { label: string; href: string; external?: boolean }
  | { label: string; children: { label: string; href: string; external?: boolean }[] };

const navLinks: NavItem[] = [
  { label: "Product", href: "#" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Security", href: "/security" },
  {
    label: "Developers",
    children: [
      { label: "Dev docs", href: "/dev-docs", external: false },
    ],
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <a href="/" className="flex items-center">
          <ExactEDILogo scrolled={scrolled} />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            if ("children" in item) {
              return (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 ${textColor} cursor-pointer`}
                  >
                    {item.label}
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`ri-arrow-down-s-line text-xs transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-stedi-gray-border py-1 z-50">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          target={child.external ? "_blank" : undefined}
                          rel={child.external ? "noopener noreferrer" : undefined}
                          className="flex items-center px-3 py-2 text-sm text-stedi-dark-text hover:bg-stedi-gray hover:text-stedi-blue transition-colors"
                        >
                          {child.label}
                          {child.external && (
                            <div className="w-4 h-4 flex items-center justify-center ml-auto">
                              <i className="ri-external-link-line text-xs text-stedi-gray-text" />
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-black/5 ${textColor}`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <a
            href="/request-access"
            className="px-4 py-2 text-sm font-medium rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors whitespace-nowrap shadow-sm"
          >
            Request beta access
            <i className="ri-arrow-right-line ml-1 text-xs" />
          </a>
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
            if ("children" in item) {
              return (
                <div key={item.label} className="space-y-1">
                  <span className="block px-3 py-2 text-sm font-medium text-stedi-dark-text rounded-md">
                    {item.label}
                  </span>
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noopener noreferrer" : undefined}
                        className="flex items-center px-3 py-2 text-sm text-stedi-gray-text rounded-md hover:bg-stedi-gray"
                      >
                        {child.label}
                        {child.external && (
                          <div className="w-4 h-4 flex items-center justify-center ml-auto">
                            <i className="ri-external-link-line text-xs text-stedi-gray-text" />
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="block px-3 py-2 text-sm font-medium text-stedi-dark-text rounded-md hover:bg-stedi-gray"
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-2 border-t border-stedi-gray-border">
            <a
              href="/request-access"
              className="block px-4 py-2 text-sm font-medium rounded-full bg-stedi-green text-white text-center"
            >
              Request beta access
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}