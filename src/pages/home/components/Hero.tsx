export default function Hero() {
  return (
    <section className="relative bg-stedi-dark overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-stedi-darker via-stedi-dark to-stedi-dark" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-stedi-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-stedi-green/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-32 pb-16 md:pt-40 md:pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stedi-green/10 border border-stedi-green/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-stedi-green animate-pulse" />
            <span className="text-xs font-medium text-stedi-green">Now in private beta</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            X12 EDI that stays on your hardware, never surprises you, and ships like a modern library.
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            ExactEDI is a native, self-contained engine for healthcare claims, remittance, and eligibility. Deterministic output. Zero network calls. Native libraries in C, C++, .NET, and Python.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/request-access"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors shadow-lg shadow-stedi-green/25 whitespace-nowrap"
            >
              Request beta access
              <i className="ri-arrow-right-line ml-2 text-xs" />
            </a>
            <a
              href="https://docs.exactedi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              Read the docs
            </a>
            <a
              href="/roadmap"
              className="px-6 py-3 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              See the validation roadmap
            </a>
          </div>
        </div>

        {/* Code visual — now shows explain, normalize, validate to emphasize abstraction + generation + determinism */}
        <div className="mt-14 md:mt-18 max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#0f1520]">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161d2d] border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-gray-500 font-mono">exactedi explain claims_837.x12 --output facts.json</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-gray-500">$ exactedi explain claims_837.x12 --output facts.json</div>
              <div className="mt-1">
                <span className="text-stedi-green">[PHI-safe facts]</span>
                <span className="text-gray-400">  8.6 KB/tx  </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">  readable field names  </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">  deterministic output</span>
              </div>
              <div className="mt-4 text-gray-500">$ exactedi normalize claims_837.x12 --output outbound.x12</div>
              <div className="mt-1">
                <span className="text-stedi-green">[reconstructed]</span>
                <span className="text-gray-400">  from_facts.json  </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">  SNIP-7 rules applied  </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">  valid envelope</span>
              </div>
              <div className="mt-4 text-gray-500">$ exactedi validate claims_837.x12 --snip 1,3</div>
              <div className="mt-1">
                <span className="text-stedi-green">SNIP-1 OK</span>
                <span className="text-gray-500">  |  </span>
                <span className="text-stedi-green">SNIP-3 OK</span>
                <span className="text-gray-500">  |  </span>
                <span className="text-stedi-green">0 diagnostics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}