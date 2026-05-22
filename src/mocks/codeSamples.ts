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
result = engine.parse_file("claim_file.x12")

# Structured JSONL for pipelines
for segment in result.segments:
    print(segment.to_jsonl())

# Validate envelope / structure (SNIP Type 1)
report = engine.validate(result, snip_levels=[1])
print(report.diagnostics)  # deterministic — same input, same output`,
  },
  {
    language: "csharp",
    label: "C#",
    code: `using ExactEDI;

var engine = Engine.Create();
var result = await engine.ParseFileAsync("claim_file.x12");

// JSONL output for ETL
await foreach (var line in result.ToJsonlAsync())
    Console.WriteLine(line);

// SNIP Type 1 validation
var report = await engine.ValidateAsync(result, snipLevels: [1]);
Console.WriteLine(report.Diagnostics.Count);`,
  },
  {
    language: "cli",
    label: "CLI",
    code: `$ exactedi parse claim_file.x12 > segments.jsonl

$ exactedi validate claim_file.x12
SNIP-1 OK  |  0 envelope errors  |  deterministic output`,
  },
];
