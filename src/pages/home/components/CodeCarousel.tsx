import { useState } from "react";
import { codeSamples } from "@/mocks/codeSamples";

const colors: Record<string, string> = {
  cpp: "#C586C0",
  python: "#C586C0",
  csharp: "#C586C0",
  cli: "#D4D4D4",
};

const tabBg: Record<string, string> = {
  cpp: "bg-blue-500/20 text-blue-300",
  python: "bg-yellow-500/20 text-yellow-300",
  csharp: "bg-purple-500/20 text-purple-300",
  cli: "bg-gray-500/20 text-gray-300",
};

export default function CodeCarousel() {
  const [active, setActive] = useState(0);
  const sample = codeSamples[active];

  return (
    <section className="py-16 md:py-24 bg-stedi-dark">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          How it works
        </h2>
        <p className="text-base text-gray-400 mb-8 max-w-2xl leading-relaxed">
          CLI-first. Parse and validate on your hardware, emit structured JSON / JSONL for
          pipelines — not a hosted API, not a cloud service.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {codeSamples.map((s, i) => (
            <button
              key={s.language}
              onClick={() => setActive(i)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                i === active
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0f1520]">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161d2d] border-b border-white/10">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tabBg[sample.language]}`}>
              {sample.label}
            </span>
            <span className="text-xs text-gray-600 font-mono ml-auto">
              example.{sample.language === "csharp" ? "cs" : sample.language === "cli" ? "sh" : sample.language}
            </span>
          </div>
          <div className="p-5 overflow-x-auto">
            <pre className="text-sm font-mono leading-6 text-gray-300">
              <code>{sample.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}