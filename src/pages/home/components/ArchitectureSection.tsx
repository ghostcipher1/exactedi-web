export default function ArchitectureSection() {
  return (
    <section className="py-16 md:py-24 bg-stedi-gray-light">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-stedi-dark-text mb-4">
          Architecture
        </h2>
        <p className="text-sm text-stedi-gray-text mb-10 md:mb-14 max-w-2xl leading-relaxed">
          Python and .NET bindings over one core engine. Zero network dependencies. Licensed via the customer portal.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          {/* Your App */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-20 rounded-xl border-2 border-dashed border-stedi-gray-border flex items-center justify-center bg-white">
              <span className="text-sm font-medium text-stedi-dark-text">Your App</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-1">
            <div className="h-px w-8 md:w-12 bg-stedi-gray-border" />
            <i className="ri-arrow-right-line text-stedi-gray-text text-xs" />
          </div>

          {/* SDK Layer */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-40 rounded-xl border border-stedi-gray-border bg-white p-4 text-center">
              <p className="text-xs font-medium text-stedi-dark-text mb-2">SDK</p>
              <div className="flex flex-wrap justify-center gap-1">
                {["Python", ".NET"].map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-0.5 rounded-md bg-stedi-green-light text-xs font-medium text-stedi-dark-text"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-1">
            <div className="h-px w-8 md:w-12 bg-stedi-gray-border" />
            <i className="ri-arrow-right-line text-stedi-gray-text text-xs" />
          </div>

          {/* C API */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-16 rounded-xl border border-stedi-gray-border bg-white flex items-center justify-center">
              <span className="text-sm font-medium text-stedi-dark-text">C API</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-1">
            <div className="h-px w-8 md:w-12 bg-stedi-gray-border" />
            <i className="ri-arrow-right-line text-stedi-gray-text text-xs" />
          </div>

          {/* Core Engine */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-20 rounded-xl bg-stedi-dark flex items-center justify-center border border-white/10">
              <div className="text-center">
                <span className="text-sm font-bold text-white">Core Engine</span>
                <p className="text-[10px] text-gray-400 mt-0.5">streaming · zero network calls</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-stedi-gray-text">
            No network calls. No telemetry. No phone-home. The engine is fully self-contained.
          </p>
        </div>
      </div>
    </section>
  );
}