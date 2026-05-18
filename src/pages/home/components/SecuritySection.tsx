export default function SecuritySection() {
  return (
    <section className="py-16 md:py-24 bg-stedi-gray-light">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-stedi-dark-text text-center mb-12 md:mb-16">
          Secure &amp; reliable
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="rounded-xl border border-stedi-gray-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-stedi-green/10 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#1E6FEB" strokeWidth="2" />
                  <path d="M4 20c0-4 3.582-6 8-6s8 2 8 6" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-stedi-dark-text mb-1">
                  Role-based access
                </h4>
                <p className="text-sm text-stedi-gray-text leading-relaxed">
                  Let operational staff view data and redrive transactions without risking config changes.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-stedi-gray-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-stedi-green/10 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="11" width="12" height="10" rx="2" stroke="#1E6FEB" strokeWidth="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" stroke="#1E6FEB" strokeWidth="2" />
                  <circle cx="12" cy="16" r="1.5" fill="#1E6FEB" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-stedi-dark-text mb-1">
                  Multi-factor authentication
                </h4>
                <p className="text-sm text-stedi-gray-text leading-relaxed">
                  Ensure that only authenticated users can access critical APIs and data.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-stedi-gray-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-stedi-green/10 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l9 4.5v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12v-6L12 3z" stroke="#1E6FEB" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-stedi-dark-text mb-1">
                  HIPAA compliant
                </h4>
                <p className="text-sm text-stedi-gray-text leading-relaxed">
                  Process healthcare data with confidence using our HIPAA-compliant infrastructure.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-stedi-gray-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-stedi-green/10 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#1E6FEB" strokeWidth="2" />
                  <path d="M8 12l3 3 5-5" stroke="#1E6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-stedi-dark-text mb-1">
                  SOC 2 compliant
                </h4>
                <p className="text-sm text-stedi-gray-text leading-relaxed">
                  We're SOC 2 type 2 compliant. Access reports and learn more at <a href="#" className="text-stedi-green hover:underline">trust.exactedi.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}