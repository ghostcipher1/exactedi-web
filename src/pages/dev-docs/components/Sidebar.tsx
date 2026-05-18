import { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Getting Started",
    items: [
      { label: "Before you start", href: "#before-you-start" },
      { label: "Step 1 — Install", href: "#step-1-install" },
      { label: "Step 2 — Parse from CLI", href: "#step-2-parse" },
      { label: "Step 3 — Validate structure", href: "#step-3-validate" },
      { label: "Step 4 — Extract PHI-safe facts", href: "#step-4-extract" },
      { label: "Step 5 — Python SDK", href: "#step-5-python" },
      { label: "Step 6 — Pandas analytics", href: "#step-6-pandas" },
      { label: "Validation coverage", href: "#validation-coverage" },
      { label: "What to read next", href: "#what-to-read-next" },
    ],
  },
  {
    label: "Installing ExactEDI",
    items: [
      { label: "System Requirements", href: "#system-requirements" },
      { label: "Linux Installation", href: "#linux-installation" },
      { label: "Windows Installation", href: "#windows-installation" },
      { label: "macOS Installation", href: "#macos-installation" },
      { label: "Binary Layout", href: "#binary-layout" },
      { label: "License File Setup", href: "#license-file-setup" },
      { label: "First-Run Verification", href: "#first-run-verification" },
      { label: "Common Installation Issues", href: "#common-installation-issues" },
      { label: "Environment Variables", href: "#environment-variables-reference" },
      { label: "Uninstallation", href: "#uninstallation" },
      { label: "Next Steps", href: "#installation-next-steps" },
      { label: "Support", href: "#installation-support" },
    ],
  },
  {
    label: "Integrating ExactEDI",
    items: [
      { label: "Overview", href: "#overview" },
      { label: "JSONL Output Format", href: "#jsonl-output-format" },
      { label: "Facts JSON Format", href: "#facts-json-format" },
      { label: "Integration Examples", href: "#integration-examples" },
      { label: "CLI Integration Patterns", href: "#cli-integration-patterns" },
      { label: "Error Handling", href: "#error-handling" },
      { label: "Performance Considerations", href: "#performance-considerations" },
      { label: "API Contract Guarantees", href: "#api-contract-guarantees" },
      { label: "Compliance and PHI Handling", href: "#compliance-and-phi-handling" },
      { label: "Support", href: "#integration-support" },
    ],
  },
  {
    label: "ExactEDI with Python",
    items: [
      { label: "Installation", href: "#installation" },
      { label: "Quick Start", href: "#quick-start" },
      { label: "Module Functions", href: "#module-functions" },
      { label: "Analyzer Class", href: "#analyzer-class" },
      { label: "AnalysisResult", href: "#analysis-result" },
      { label: "TransactionFacts", href: "#transaction-facts" },
      { label: "Async API", href: "#async-api" },
      { label: "Pandas Integration", href: "#pandas-integration" },
      { label: "Streaming Large Files", href: "#streaming-large-files" },
      { label: "Error Handling", href: "#error-handling" },
      { label: "Working with JSON Output", href: "#working-with-json-output" },
      { label: "Batch Processing", href: "#batch-processing" },
      { label: "Flask Integration", href: "#flask-integration" },
      { label: "FastAPI Integration", href: "#fastapi-integration" },
      { label: "Common Patterns", href: "#common-patterns" },
      { label: "Performance Tips", href: "#performance-tips" },
      { label: "Troubleshooting", href: "#troubleshooting" },
      { label: "See Also", href: "#see-also" },
    ],
  },
  {
    label: "ExactEDI with C-Sharp",
    items: [],
  },
  {
    label: "ExactEDI SDK Overview",
    items: [],
  },  
  {
    label: "Licensing ExactEDI",
    items: [],
  },
];

function Sidebar() {
  const [activeHash, setActiveHash] = useState("#before-you-start");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Getting Started"])
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      if (prev.has(label)) {
        return new Set<string>();
      }
      return new Set<string>([label]);
    });
  };

  const handleClick = (href: string) => {
    setActiveHash(href);
    const el = document.querySelector(href);
    if (el) {
      const navOffset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <aside className="w-[250px] shrink-0 hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        {sidebarGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const hasItems = group.items.length > 0;
          return (
            <div key={group.label} className="mb-4">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wider rounded-md transition-colors cursor-pointer ${
                  isExpanded
                    ? "text-stedi-dark-text"
                    : "text-stedi-gray-text hover:text-stedi-dark-text"
                }`}
              >
                <span>{group.label}</span>
                {hasItems && (
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i
                      className={`ri-arrow-down-s-line text-sm transition-transform ${
                        isExpanded ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </div>
                )}
              </button>
              {isExpanded && hasItems && (
                <ul className="space-y-0.5 mt-1">
                  {group.items.map((item) => {
                    const isActive = activeHash === item.href;
                    return (
                      <li key={item.href}>
                        <button
                          type="button"
                          onClick={() => handleClick(item.href)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                            isActive
                              ? "bg-stedi-green-light text-stedi-green font-medium"
                              : "text-stedi-gray-text hover:text-stedi-dark-text hover:bg-stedi-gray"
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;