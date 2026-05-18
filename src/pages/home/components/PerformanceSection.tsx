import { benchmarks, benchmarkCaveat } from "@/mocks/performance";

export default function PerformanceSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-stedi-dark-text mb-4">
          Predictable performance. Reproducible results. Every run, on any hardware.
        </h2>
        <p className="text-sm text-stedi-gray-text mb-10 md:mb-14 max-w-3xl leading-relaxed">
          ExactEDI is deterministic: the same input produces the same output with the same diagnostics, every single run. Two reference benchmarks measured on identical fixtures so you can verify behavior on your own machines.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {benchmarks.map((b) => (
            <div key={b.cpu} className="rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-6 md:p-8">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-stedi-dark-text">{b.cpu}</h4>
                <p className="text-xs text-stedi-gray-text">{b.cpuDetail}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stedi-gray-border">
                      <th className="text-left py-2 pr-4 text-xs font-medium text-stedi-gray-text">Operation</th>
                      <th className="text-left py-2 pr-4 text-xs font-medium text-stedi-gray-text">Throughput</th>
                      <th className="text-left py-2 pr-4 text-xs font-medium text-stedi-gray-text">Wall</th>
                      <th className="text-left py-2 text-xs font-medium text-stedi-gray-text">Peak memory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r.operation} className="border-b border-stedi-gray-border last:border-0">
                        <td className="py-3 pr-4 font-medium text-stedi-dark-text">{r.operation}</td>
                        <td className="py-3 pr-4 font-mono text-stedi-green font-medium">{r.throughput}</td>
                        <td className="py-3 pr-4 font-mono text-stedi-dark-text">{r.wall}</td>
                        <td className="py-3 font-mono text-stedi-dark-text">{r.peakMemory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-stedi-gray-text italic">{benchmarkCaveat}</p>

        <div className="mt-10 rounded-xl border border-stedi-gray-border bg-stedi-gray-light p-6 md:p-8">
          <h4 className="text-sm font-semibold text-stedi-dark-text mb-2">Determinism you can verify</h4>
          <p className="text-sm text-stedi-gray-text leading-relaxed">
            On the same fixture, same build, same machine, ExactEDI produces{" "}
            <span className="text-stedi-dark-text font-semibold">identical output</span>{" "}
            across runs. No stochastic noise. No non-deterministic garbage collection. Bit-for-bit reproducible segments, facts, and diagnostics — critical for audit trails and regulatory review. Numbers and methodology in{" "}
            <a href="/dev-docs" className="text-stedi-green hover:underline">developer documentation</a>.
          </p>
        </div>
      </div>
    </section>
  );
}