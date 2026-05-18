export interface CodeSample {
  language: string;
  label: string;
  code: string;
}

export const codeSamples: CodeSample[] = [
  {
    language: "python",
    label: "Python",
    code: `import exactedi

engine = exactedi.Engine()

# --- Explain: X12 → structured English for your code and LLMs ---
result = engine.parse_file("claims_837.x12")
facts = engine.explain(result)
facts.to_json("facts.json")
#  "submitter": {"name": "Acme Medical", "npi": "[REDACTED]"}

# --- Normalize: structured data → valid outbound X12 ---
outbound = engine.normalize(
    facts,
    trading_partner_config="partner_a.json",
    ack_required=True,
)
outbound.write_x12("outbound_837.x12")

# --- Validate: deterministic diagnostics, same input → same output ---
report = engine.validate(result, snip_levels=[1, 3])
print(report.diagnostics)  # [] on clean files, always reproducible`,
  },
  {
    language: "csharp",
    label: "C#",
    code: `using ExactEDI;

var engine = Engine.Create();

// Explain: turn 837s into structured, redacted facts
var result = await engine.ParseFileAsync("claims_837.x12");
var facts = await engine.ExplainAsync(result);
await facts.WriteJsonAsync("facts.json");
//  "Claims": [{ "ChargeAmount": 1250.00, "ServiceDate": "2026-04-15" }]

// Normalize: generate compliant outbound from validated facts
var outbound = await engine.NormalizeAsync(
    facts,
    tradingPartnerConfig: "partner_a.json",
    ackRequired: true
);
await outbound.WriteX12Async("outbound_837.x12");

// Validate: deterministic, byte-precise diagnostics
var report = await engine.ValidateAsync(result, snipLevels: [1, 3]);
Console.WriteLine(report.Diagnostics.Count);`,
  },
  {
    language: "cpp",
    label: "C++",
    code: `#include <exactedi/engine.hpp>

int main() {
    auto engine = exactedi::Engine::create();

    // Explain: readable facts with source-mapped provenance
    auto result = engine->parse_file("claims_837.x12");
    auto facts = engine->explain(result);
    facts.write_json("facts.json");

    // Normalize: build outbound from facts + trading-partner rules
    auto outbound = engine->normalize(
        facts,
        "partner_a.json",
        true /* ack_required */
    );
    outbound.write_x12("outbound_837.x12");

    // Validate: reproducible SNIP diagnostics every run
    auto report = engine->validate(result, {1, 3});
    std::cout << report.diagnostics.size() << " issues\n";

    return 0;
}`,
  },
  {
    language: "cli",
    label: "CLI",
    code: `$ exactedi explain claims_837.x12 --output facts.json
[PHI-safe facts]  8.6 KB/tx  |  readable field names  |  deterministic output

$ exactedi normalize facts.json --partner partner_a.json --output outbound_837.x12
[reconstructed]  from structured facts  |  SNIP-7 rules applied  |  valid envelope

$ exactedi validate outbound_837.x12 --snip 1,3
SNIP-1 OK  |  SNIP-3 OK  |  0 diagnostics`,
  },
];