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
            <span className="text-xs font-medium text-stedi-green">Early access — beta 1.0.x</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Catch malformed claims before a payer does.
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            ExactEDI is a high-performance library that parses and validates 837 claims
            and 835 remittances with SNIP-aware structural and monetary validation — entirely on your
            infrastructure, with zero network calls.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/request-access"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors shadow-lg shadow-stedi-green/25 whitespace-nowrap"
            >
              Request early access
              <i className="ri-arrow-right-line ml-2 text-xs" />
            </a>
            <a
              href="/dev-docs"
              className="px-6 py-3 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              Read the docs
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
              <span className="ml-2 text-xs text-gray-500 font-mono">exactedi parse claim_file.x12 &gt; segments.jsonl</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-gray-500">$ exactedi parse claim_file.x12 &gt; segments.jsonl</div>
              <div className="mt-4 text-gray-400">{`{`}</div>
              <div className="text-gray-400 pl-4">&quot;transaction_set&quot;: &quot;837&quot;,</div>
              <div className="text-gray-400 pl-4">&quot;segments&quot;: 142,</div>
              <div className="text-gray-400 pl-4">&quot;validation&quot;: {`{`} <span className="text-stedi-green">&quot;snip_1&quot;: &quot;pass&quot;</span> {`}`}</div>
              <div className="text-gray-400">{`}`}</div>
              <div className="mt-4 text-gray-500">$ exactedi validate claim_file.x12</div>
              <div className="mt-1">
                <span className="text-stedi-green">SNIP-1 OK</span>
                <span className="text-gray-500">  |  </span>
                <span className="text-gray-400">0 envelope errors</span>
                <span className="text-gray-500">  |  </span>
                <span className="text-gray-400">deterministic output</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}