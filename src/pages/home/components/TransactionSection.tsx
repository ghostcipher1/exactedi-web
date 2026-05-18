const bullets = [
  "Generate ERAs",
  "Ingest claims",
  "Generate claim statuses",
  "Submit benefit enrollments",
];

const transactions = [
  { code: "837", name: "Health Care Claim" },
  { code: "835", name: "Health Care Claim Payment/Advice" },
  { code: "277", name: "Health Care Information Status Notification" },
  { code: "276", name: "Health Care Claim Status Request" },
  { code: "834S", name: "Benefit Enrollment and Maintenance" },
];

export default function TransactionSection() {
  return (
    <section className="py-16 md:py-24 bg-stedi-gray-light">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-stedi-dark-text mb-12 md:mb-16">
          Any transaction, any partner
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 space-y-4">
            {bullets.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-check-line text-stedi-green text-lg" />
                </div>
                <span className="text-sm font-medium text-stedi-dark-text">{item}</span>
              </div>
            ))}

            <div className="pt-6">
              <h4 className="text-sm font-semibold text-stedi-dark-text mb-1">
                Complete HIPAA X12 Support
              </h4>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-stedi-green hover:underline"
              >
                Browse HIPAA specs
                <i className="ri-arrow-right-line text-xs" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-stedi-gray-border p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <div className="text-center md:text-left">
                  <p className="text-xs text-stedi-gray-text mb-3">Payers / partners / EHR / RCM systems</p>
                  <div className="space-y-2">
                    {["837", "835", "277", "276", "834"].map((code) => (
                      <div key={code} className="flex items-center gap-3">
                        <i className="ri-arrow-left-right-line text-stedi-gray-text text-xs" />
                        <span className="text-sm font-mono font-medium text-stedi-dark-text bg-stedi-gray px-2 py-0.5 rounded">
                          {code}
                        </span>
                        <i className="ri-arrow-left-right-line text-stedi-gray-text text-xs" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block h-px w-12 bg-stedi-gray-border" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 rounded-xl bg-stedi-green flex items-center justify-center">
                      <span className="text-white font-bold text-xs text-center leading-tight px-1">Exact<br/>EDI</span>
                    </div>
                  </div>
                  <div className="hidden md:block h-px w-12 bg-stedi-gray-border" />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stedi-gray-text">Webhooks</span>
                    <i className="ri-arrow-right-line text-stedi-gray-text text-xs" />
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-arrow-left-line text-stedi-gray-text text-xs" />
                    <span className="text-xs text-stedi-gray-text">API</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-stedi-gray-text mb-1">Your system</p>
                  <div className="w-14 h-14 rounded-lg border-2 border-dashed border-stedi-gray-border flex items-center justify-center">
                    <i className="ri-server-line text-stedi-gray-text" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-stedi-dark-text mb-4">
                Common transaction sets
              </h4>
              <div className="flex flex-wrap gap-2">
                {transactions.map((tx) => (
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
        </div>
      </div>
    </section>
  );
}