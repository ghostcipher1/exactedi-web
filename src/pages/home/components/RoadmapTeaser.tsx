import { snipLevels, supportedTransactions } from "@/mocks/snipRoadmap";

export default function RoadmapTeaser() {
  return (
    <section className="py-16 md:py-24 bg-stedi-gray-light">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-stedi-dark-text mb-2">
              Validation roadmap
            </h2>
            <p className="text-sm text-stedi-gray-text max-w-2xl leading-relaxed">
              Shipping in beta.4: SNIP Types 1–3 (structural, loop structure on ten
              transaction types, monetary balancing), PHI-safe extraction, CLI. GA target:
              element-level IG rules. Planned: external code sets (SNIP Type 5) and X12 generation.
            </p>
          </div>
          <a
            href="/roadmap"
            className="inline-flex items-center gap-1 text-sm font-medium text-stedi-green hover:underline whitespace-nowrap"
          >
            See the full roadmap
            <i className="ri-arrow-right-line text-xs" />
          </a>
        </div>

        {/* SNIP matrix teaser — show first 4 rows */}
        <div className="rounded-xl border border-stedi-gray-border bg-white overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stedi-gray-border bg-stedi-gray-light">
                  <th className="text-left py-3 px-4 text-xs font-medium text-stedi-gray-text">SNIP</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-stedi-gray-text">What it covers</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-stedi-gray-text">Beta</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-stedi-gray-text">GA target</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-stedi-gray-text">v1.x</th>
                </tr>
              </thead>
              <tbody>
                {snipLevels.slice(0, 4).map((row, i) => (
                  <tr key={i} className="border-b border-stedi-gray-border last:border-0">
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-stedi-dark-text">{row.level}</span>
                      <span className="text-xs text-stedi-gray-text ml-1">{row.name}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-stedi-gray-text">{row.what}</td>
                    <td className="py-3 px-4 text-center">
                      {row.beta === "✓" ? (
                        <i className="ri-check-line text-stedi-green" />
                      ) : (
                        <span className="text-stedi-gray-text">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.ga === "✓" ? (
                        <i className="ri-check-line text-stedi-green" />
                      ) : (
                        <span className="text-stedi-gray-text">{row.ga}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.v1x === "✓" ? (
                        <i className="ri-check-line text-stedi-green" />
                      ) : (
                        <span className="text-stedi-gray-text">{row.v1x}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supported transactions */}
        <div>
          <h4 className="text-sm font-semibold text-stedi-dark-text mb-3">
            Supported transaction types (beta)
          </h4>
          <div className="flex flex-wrap gap-2">
            {supportedTransactions.map((tx) => (
              <div
                key={tx.code}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-stedi-gray-border text-sm"
              >
                <span className="font-mono font-medium text-stedi-dark-text">{tx.code}</span>
                <span className="text-stedi-gray-text">{tx.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}