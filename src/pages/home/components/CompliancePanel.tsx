export default function CompliancePanel() {
  return (
    <section className="py-16 md:py-24 bg-stedi-gray-light">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-stedi-dark-text mb-10 md:mb-14">
          Compliance &amp; Security
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <div className="rounded-xl border border-stedi-gray-border bg-white p-6">
            <div className="w-10 h-10 flex items-center justify-center mb-3 rounded-lg bg-stedi-green-light">
              <i className="ri-shield-check-line text-stedi-green text-lg" />
            </div>
            <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">HIPAA Safe Harbor</h4>
            <p className="text-xs text-stedi-gray-text leading-relaxed">
              Fact-extractor output is de-identified per Safe Harbor. Scoped claim — applies to structured analytical data only.
            </p>
          </div>

          <div className="rounded-xl border border-stedi-gray-border bg-white p-6">
            <div className="w-10 h-10 flex items-center justify-center mb-3 rounded-lg bg-stedi-green-light">
              <i className="ri-server-line text-stedi-green text-lg" />
            </div>
            <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">On-premises</h4>
            <p className="text-xs text-stedi-gray-text leading-relaxed">
              Runs entirely on your hardware. Air-gapped deployments supported. No cloud dependency.
            </p>
          </div>

          <div className="rounded-xl border border-stedi-gray-border bg-white p-6">
            <div className="w-10 h-10 flex items-center justify-center mb-3 rounded-lg bg-stedi-green-light">
              <i className="ri-fingerprint-line text-stedi-green text-lg" />
            </div>
            <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">Deterministic</h4>
            <p className="text-xs text-stedi-gray-text leading-relaxed">
              Same input → same output. Bit-for-bit reproducible. Critical for audit trails and regulatory review.
            </p>
          </div>

          <div className="rounded-xl border border-stedi-gray-border bg-white p-6">
            <div className="w-10 h-10 flex items-center justify-center mb-3 rounded-lg bg-stedi-green-light">
              <i className="ri-wifi-off-line text-stedi-green text-lg" />
            </div>
            <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">No telemetry</h4>
            <p className="text-xs text-stedi-gray-text leading-relaxed">
              No phone-home. No analytics beacons. License verification is fully offline. Your data never leaves the process.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-stedi-gray-border bg-white p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg bg-stedi-green-light">
              <i className="ri-file-list-3-line text-stedi-green text-lg" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">What we do not claim</h4>
              <p className="text-xs text-stedi-gray-text leading-relaxed">
                ExactEDI is not currently a full SNIP 2-7 conformance suite (see{" "}
                <a href="/roadmap" className="text-stedi-green hover:underline">roadmap</a>
                ). We do not claim SOC 2 or HITRUST certification at this time. We are not a substitute for an AMA CPT license — bundled code sets cover ICD-10, HCPCS, CARC, RARC, taxonomy, and POS; CPT is BYO (customer supplies their licensed copy).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}