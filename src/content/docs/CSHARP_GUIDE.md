# ExactEDI .NET SDK Guide

Complete guide for using ExactEDI in .NET applications.

## Installation

ExactEDI is distributed through your customer portal — it is **not** published to nuget.org. Download the `ExactEDI.X.Y.Z.nupkg` package from the portal, then install it from a local feed:

```bash
# From the directory containing the downloaded .nupkg
dotnet add package ExactEDI --source .
```

Alternatively, point your project at a local NuGet feed in `nuget.config`:

```xml
<configuration>
  <packageSources>
    <add key="exactedi-local" value="/path/to/portal-downloads" />
  </packageSources>
</configuration>
```

Then `dotnet add package ExactEDI` will resolve from that local source.

**Requirements:**
- .NET 6.0+ or .NET Standard 2.1
- Windows, Linux, or macOS (x64, ARM64)
- A valid ExactEDI license file from your customer portal

## Quick Start

```csharp
using ExactEDI;

// Analyze a file
using var result = ExactEDI.AnalyzeFile("claims.edi");

Console.WriteLine($"Transactions: {result.TransactionCount}");
Console.WriteLine($"Valid: {result.IsValid}");

// Access PHI-safe facts
foreach (var tx in result.Transactions)
{
    Console.WriteLine($"Type: {tx.Type}");
    Console.WriteLine($"Claim ID: {tx.ClaimId}");
    Console.WriteLine($"Total Charge: ${tx.TotalCharge:F2}");
}
```

---

## Static Methods

### `ExactEDI.AnalyzeFile()`

Analyze an X12 file with default options.

```csharp
using var result = ExactEDI.AnalyzeFile("claims.edi");
```

### `ExactEDI.AnalyzeString()`

Analyze X12 content from a string.

```csharp
string content = File.ReadAllText("claims.edi");
using var result = ExactEDI.AnalyzeString(content);
```

### `ExactEDI.AnalyzeMemory()`

Analyze X12 content from bytes.

```csharp
byte[] data = File.ReadAllBytes("claims.edi");
using var result = ExactEDI.AnalyzeMemory(data);
```

### `ExactEDI.Version`

```csharp
Console.WriteLine(ExactEDI.Version);  // "1.0.0"
```

### `ExactEDI.LicenseStatus`

```csharp
Console.WriteLine(ExactEDI.LicenseStatus);  // "Professional"
```

### `ExactEDI.SetLicensePath()`

```csharp
ExactEDI.SetLicensePath("/path/to/license.lic");
```

---

## Analyzer Class

For more control, use the `Analyzer` class:

```csharp
using var analyzer = new Analyzer
{
    StrictValidation = true,
    ExtractFacts = true,
    MaxTransactions = 100,
    ContinueOnError = true
};

using var result = analyzer.AnalyzeFile("claims.edi");
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `StrictValidation` | `bool` | `true` | Enforce envelope validation |
| `ExtractFacts` | `bool` | `true` | Extract PHI-safe facts |
| `MaxTransactions` | `ulong` | `0` | Limit transactions (0 = unlimited) |
| `ContinueOnError` | `bool` | `true` | Continue after errors |

### Methods

| Method | Description |
|--------|-------------|
| `AnalyzeFile(path)` | Analyze file |
| `AnalyzeString(data)` | Analyze string |
| `AnalyzeMemory(byte[])` | Analyze byte array |
| `AnalyzeMemory(ReadOnlySpan<byte>)` | Analyze span |
| `ValidateFile(path)` | Validate only |
| `AnalyzeFileStreaming(path, callback)` | Stream large files |

---

## AnalysisResult

The result object contains all analysis output. **Always dispose with `using`.**

```csharp
using var result = ExactEDI.AnalyzeFile("claims.edi");

// Check validity
if (result.IsValid)
{
    Console.WriteLine("No validation errors");
}
else
{
    Console.WriteLine($"{result.Stats.ErrorCount} errors");
}

// Statistics
Console.WriteLine($"Bytes: {result.Stats.BytesProcessed}");
Console.WriteLine($"Segments: {result.Stats.SegmentsParsed}");
Console.WriteLine($"Transactions: {result.TransactionCount}");
Console.WriteLine($"Time: {result.Stats.ElapsedSeconds:F3}s");

// Access transactions
foreach (var tx in result.Transactions)
{
    Console.WriteLine($"{tx.Type}: {tx.ClaimId}");
}

// Export to JSON
string json = result.ToJson();
string factsJson = result.FactsJson();  // PHI-safe
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `IsValid` | `bool` | True if no errors |
| `TransactionCount` | `int` | Number of transactions |
| `Transactions` | `IReadOnlyList<TransactionFacts>` | Transaction facts |
| `Stats` | `AnalysisStats` | Processing statistics |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `ToJson()` | `string` | Full JSON output |
| `FactsJson()` | `string` | PHI-safe Facts JSON |

---

## AnalysisStats

```csharp
var stats = result.Stats;

Console.WriteLine($"Bytes: {stats.BytesProcessed}");
Console.WriteLine($"Segments: {stats.SegmentsParsed}");
Console.WriteLine($"Interchanges: {stats.InterchangeCount}");
Console.WriteLine($"Groups: {stats.GroupCount}");
Console.WriteLine($"Transactions: {stats.TransactionCount}");
Console.WriteLine($"Errors: {stats.ErrorCount}");
Console.WriteLine($"Warnings: {stats.WarningCount}");
Console.WriteLine($"Time: {stats.ElapsedSeconds:F3}s");
```

---

## TransactionFacts

Each transaction contains PHI-safe extracted facts.

```csharp
foreach (var tx in result.Transactions)
{
    // Transaction identification
    Console.WriteLine(tx.Type);                // "837P", "835", etc.
    Console.WriteLine(tx.InterchangeControl);  // ISA control number
    Console.WriteLine(tx.GroupControl);        // GS control number
    Console.WriteLine(tx.TransactionControl);  // ST control number

    // Claim information
    Console.WriteLine(tx.ClaimId);
    Console.WriteLine(tx.ClaimStatus);         // 835 only
    Console.WriteLine(string.Join(", ", tx.ServiceDates));

    // Financial
    Console.WriteLine($"Charge: ${tx.TotalCharge:F2}");
    Console.WriteLine($"Payment: ${tx.TotalPayment:F2}");

    // Provider/Payer
    Console.WriteLine(tx.PayerId);
    Console.WriteLine(tx.PayerName);
    Console.WriteLine(tx.BillingProviderNpi);

    // Clinical (codes only, no PHI)
    Console.WriteLine(string.Join(", ", tx.ProcedureCodes));
    Console.WriteLine(string.Join(", ", tx.DiagnosisCodes));
    Console.WriteLine(tx.PlaceOfService);
    Console.WriteLine(tx.ServiceLineCount);

    // Export
    Console.WriteLine(tx.ToJson());
}
```

---

## TransactionType Enum

```csharp
public enum TransactionType
{
    Unknown = 0,
    Claim837P = 1,
    Claim837I = 2,
    Claim837D = 3,
    Remittance835 = 4,
    ClaimStatus277 = 5,
    Acknowledgment999 = 6
}
```

---

## Streaming Large Files

For files too large to fit in memory:

```csharp
using var analyzer = new Analyzer();

var stats = analyzer.AnalyzeFileStreaming("large.edi", (json, type) =>
{
    Console.WriteLine($"Processing {type}");

    // Parse JSON
    using var doc = JsonDocument.Parse(json);
    var claimId = doc.RootElement.GetProperty("claim_id").GetString();

    // Save to database, etc.
    SaveToDatabase(claimId, json);

    return true;  // Continue (false to stop)
});

Console.WriteLine($"Processed {stats.TransactionCount} transactions");
```

---

## Error Handling

```csharp
try
{
    using var result = ExactEDI.AnalyzeFile("claims.edi");
    // Process result
}
catch (ExactEDIException ex)
{
    Console.WriteLine($"EDI Error: {ex.Message}");
    Console.WriteLine($"Status: {ex.Status}");
}
catch (FileNotFoundException)
{
    Console.WriteLine("File not found");
}
```

### ExactEDIException

```csharp
public class ExactEDIException : Exception
{
    public Status Status { get; }
}

public enum Status
{
    Ok = 0,
    InvalidArgument,
    FileNotFound,
    FileRead,
    FileWrite,
    ParseFailed,
    ValidationFailed,
    OutOfMemory,
    License,
    Internal
}
```

---

## ASP.NET Core Integration

### Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
public class EdiController : ControllerBase
{
    [HttpPost("analyze")]
    public IActionResult Analyze(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        using var stream = new MemoryStream();
        file.CopyTo(stream);

        try
        {
            using var result = ExactEDI.AnalyzeMemory(stream.ToArray());

            return Ok(new
            {
                Valid = result.IsValid,
                TransactionCount = result.TransactionCount,
                Transactions = result.Transactions.Select(tx => new
                {
                    tx.Type,
                    tx.ClaimId,
                    tx.TotalCharge,
                    tx.TotalPayment
                })
            });
        }
        catch (ExactEDIException ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}
```

### Minimal API Example

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/analyze", async (IFormFile file) =>
{
    using var stream = new MemoryStream();
    await file.CopyToAsync(stream);

    try
    {
        using var result = ExactEDI.AnalyzeMemory(stream.ToArray());
        return Results.Ok(new
        {
            result.IsValid,
            result.TransactionCount,
            Facts = result.FactsJson()
        });
    }
    catch (ExactEDIException ex)
    {
        return Results.BadRequest(new { Error = ex.Message });
    }
});

app.Run();
```

---

## Dependency Injection

```csharp
// Register as singleton (Analyzer is reusable)
builder.Services.AddSingleton<Analyzer>(sp =>
{
    return new Analyzer
    {
        StrictValidation = true,
        ExtractFacts = true
    };
});

// Use in controller
public class ClaimsController : ControllerBase
{
    private readonly Analyzer _analyzer;

    public ClaimsController(Analyzer analyzer)
    {
        _analyzer = analyzer;
    }

    [HttpPost]
    public IActionResult Process(IFormFile file)
    {
        // Use _analyzer
    }
}
```

---

## Common Patterns

### Filter by Transaction Type

```csharp
using var result = ExactEDI.AnalyzeFile("mixed.edi");

// Get only 837 claims
var claims = result.Transactions
    .Where(tx => tx.Type.ToString().StartsWith("Claim837"))
    .ToList();

// Get only 835 remittances
var remittances = result.Transactions
    .Where(tx => tx.Type == TransactionType.Remittance835)
    .ToList();
```

### Aggregate Financials

```csharp
using var result = ExactEDI.AnalyzeFile("claims.edi");

var totalCharges = result.Transactions.Sum(tx => tx.TotalCharge);
var totalPayments = result.Transactions.Sum(tx => tx.TotalPayment);

Console.WriteLine($"Total Charges: ${totalCharges:N2}");
Console.WriteLine($"Total Payments: ${totalPayments:N2}");
```

### Group by Type

```csharp
using var result = ExactEDI.AnalyzeFile("mixed.edi");

var byType = result.Transactions
    .GroupBy(tx => tx.Type)
    .Select(g => new
    {
        Type = g.Key,
        Count = g.Count(),
        TotalCharge = g.Sum(tx => tx.TotalCharge)
    });

foreach (var group in byType)
{
    Console.WriteLine($"{group.Type}: {group.Count} tx, ${group.TotalCharge:N2}");
}
```

### LINQ to JSON

```csharp
using System.Text.Json;

using var result = ExactEDI.AnalyzeFile("claims.edi");
var factsJson = result.FactsJson();

using var doc = JsonDocument.Parse(factsJson);
var transactions = doc.RootElement.GetProperty("transactions");

foreach (var tx in transactions.EnumerateArray())
{
    var type = tx.GetProperty("type").GetString();
    var charge = tx.GetProperty("total_charge").GetDecimal();
    Console.WriteLine($"{type}: ${charge:N2}");
}
```

---

## Batch Processing

```csharp
var files = Directory.GetFiles("incoming", "*.edi");

// Sequential
foreach (var file in files)
{
    using var result = ExactEDI.AnalyzeFile(file);
    Console.WriteLine($"{Path.GetFileName(file)}: {result.TransactionCount} tx");
}

// Parallel
Parallel.ForEach(files, file =>
{
    using var result = ExactEDI.AnalyzeFile(file);
    Console.WriteLine($"{Path.GetFileName(file)}: {result.TransactionCount} tx");
});
```

---

## Platform-Specific Notes

### Native Library Loading

The NuGet package includes native libraries for all platforms:
- `runtimes/win-x64/native/exactedi.dll`
- `runtimes/win-arm64/native/exactedi.dll`
- `runtimes/linux-x64/native/libexactedi.so`
- `runtimes/linux-arm64/native/libexactedi.so`
- `runtimes/osx-x64/native/libexactedi.dylib`
- `runtimes/osx-arm64/native/libexactedi.dylib`

### Self-Contained Deployment

Native libraries are automatically included in self-contained publishes:

```bash
dotnet publish -r win-x64 --self-contained
dotnet publish -r linux-x64 --self-contained
```

---

## Performance Tips

1. **Reuse Analyzer instances** - Create once, use many times
2. **Use streaming** for files over 100MB
3. **Process in parallel** with `Parallel.ForEach`
4. **Disable fact extraction** if only validating
5. **Always dispose** results with `using`

---

## Troubleshooting

### DllNotFoundException

The native library is missing. Ensure the NuGet package is properly installed and the correct runtime is available.

### License errors

```csharp
Console.WriteLine(ExactEDI.LicenseStatus);
ExactEDI.SetLicensePath("/path/to/license.lic");
```

### Memory issues

Use streaming for large files or set `MaxTransactions` to limit processing.

---

## See Also

- [SDK Overview](SDK_OVERVIEW.md)
- [C++ API Reference](API_REFERENCE.md)
- [Integration Guide](INTEGRATION_GUIDE.md)
- [Facts JSON Schema](facts_json_schema.md)
