const codeLines = [
  { num: 1, content: [
    { text: "async", color: "#C586C0" },
    { text: " function ", color: "#D4D4D4" },
    { text: "sendTransaction", color: "#DCDCAA" },
    { text: "(", color: "#D4D4D4" },
    { text: "partnershipId", color: "#9CDCFE" },
    { text: ", ", color: "#D4D4D4" },
    { text: "transactionSettingId", color: "#9CDCFE" },
    { text: ", ", color: "#D4D4D4" },
    { text: "transactionData", color: "#9CDCFE" },
    { text: ") {", color: "#D4D4D4" },
  ]},
  { num: 2, content: [{ text: "  try {", color: "#C586C0" }] },
  { num: 3, content: [
    { text: "    const ", color: "#569CD6" },
    { text: "response", color: "#9CDCFE" },
    { text: " = ", color: "#D4D4D4" },
    { text: "await", color: "#C586C0" },
    { text: " ", color: "#D4D4D4" },
    { text: "fetch", color: "#DCDCAA" },
    { text: "(", color: "#D4D4D4" },
  ]},
  { num: 4, content: [
    { text: "      ", color: "#D4D4D4" },
    { text: "'https://core.us.stedi.com/2023-08-01/partnerships/'", color: "#CE9178" },
    { text: " + ", color: "#D4D4D4" },
    { text: "partnershipId", color: "#9CDCFE" },
    { text: " + ", color: "#D4D4D4" },
    { text: "'/transactions/'", color: "#CE9178" },
    { text: " + ", color: "#D4D4D4" },
    { text: "transactionSettingId", color: "#9CDCFE" },
  ]},
  { num: 5, content: [{ text: "      {", color: "#D4D4D4" }] },
  { num: 6, content: [
    { text: "        method: ", color: "#9CDCFE" },
    { text: "'post'", color: "#CE9178" },
    { text: ",", color: "#D4D4D4" },
  ]},
  { num: 7, content: [
    { text: "        headers: {", color: "#9CDCFE" },
  ]},
  { num: 8, content: [
    { text: "          'Content-Type': ", color: "#9CDCFE" },
    { text: "'application/json'", color: "#CE9178" },
    { text: ",", color: "#D4D4D4" },
  ]},
  { num: 9, content: [
    { text: "          Accept: ", color: "#9CDCFE" },
    { text: "'application/json'", color: "#CE9178" },
    { text: ",", color: "#D4D4D4" },
  ]},
  { num: 10, content: [
    { text: "          Authorization: ", color: "#9CDCFE" },
    { text: "'Key ' + env.apiKey", color: "#CE9178" },
    { text: ",", color: "#D4D4D4" },
  ]},
  { num: 11, content: [{ text: "        },", color: "#D4D4D4" }] },
  { num: 12, content: [
    { text: "        data: ", color: "#9CDCFE" },
    { text: "transactionData", color: "#9CDCFE" },
    { text: ",", color: "#D4D4D4" },
  ]},
  { num: 13, content: [{ text: "      }", color: "#D4D4D4" }] },
  { num: 14, content: [{ text: "    );", color: "#D4D4D4" }] },
  { num: 15, content: [{ text: "", color: "#D4D4D4" }] },
  { num: 16, content: [
    { text: "    console", color: "#9CDCFE" },
    { text: ".", color: "#D4D4D4" },
    { text: "log", color: "#DCDCAA" },
    { text: "(", color: "#D4D4D4" },
    { text: "response", color: "#9CDCFE" },
    { text: ".", color: "#D4D4D4" },
    { text: "data", color: "#9CDCFE" },
    { text: ");", color: "#D4D4D4" },
  ]},
  { num: 17, content: [{ text: "  } catch (error) {", color: "#C586C0" }] },
  { num: 18, content: [
    { text: "    console", color: "#9CDCFE" },
    { text: ".", color: "#D4D4D4" },
    { text: "error", color: "#DCDCAA" },
    { text: "(", color: "#D4D4D4" },
    { text: "error", color: "#9CDCFE" },
    { text: ");", color: "#D4D4D4" },
  ]},
  { num: 19, content: [{ text: "  }", color: "#D4D4D4" }] },
  { num: 20, content: [{ text: "}", color: "#D4D4D4" }] },
];

export default function ApiSection() {
  return (
    <section className="py-16 md:py-24 bg-stedi-dark">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Deliver EDI with one API call
            </h2>
            <p className="text-base text-gray-400 mb-6 leading-relaxed">
              Generate valid EDI, and reliably deliver it with a single request. EDI config is managed on Stedi to keep your integration simple.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors"
            >
              Read the docs
              <i className="ri-arrow-right-line text-xs" />
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1E1E1E]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#252526] border-b border-white/10">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-javascript-line text-yellow-400 text-sm" />
              </div>
              <span className="text-xs text-gray-400 font-mono">sendERA.js</span>
            </div>
            <div className="flex">
              <div className="py-3 px-3 bg-[#1E1E1E] border-r border-white/5 select-none">
                {codeLines.map((line) => (
                  <div
                    key={line.num}
                    className="text-xs text-gray-600 font-mono text-right leading-6"
                  >
                    {line.num}
                  </div>
                ))}
              </div>
              <div className="py-3 px-3 overflow-x-auto">
                {codeLines.map((line) => (
                  <div key={line.num} className="text-xs font-mono leading-6 whitespace-pre">
                    {line.content.map((part, i) => (
                      <span key={i} style={{ color: part.color }}>
                        {part.text}
                      </span>
                    ))}
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