# ExactEDI SDK Overview

> **A high-performance X12 healthcare EDI parsing, validation, and analysis engine.**

ExactEDI SDK provides native libraries for processing HIPAA X12 EDI transactions in C++, C, Python, and .NET applications. Built for healthcare claims processing, analytics pipelines, and AI/ML integrations.

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-format Support** | 14 X12 transaction types recognized — 837P/I/D, 835, 270/271, 276/277, 277CA, 278, 820, 834, 999, TA1; loop-aware structural validation on 10 |
| **PHI-Safe Facts** | HIPAA Safe Harbor compliant fact extraction for LLM/analytics |
| **High Performance** | 200+ MB/s parsing throughput, streaming support for large files |
| **Memory-based I/O** | Process data from files, memory buffers, or streams |
| **Cross-platform** | Windows, Linux, macOS (x64 and ARM64) |
| **Multiple Language Bindings** | C++, C, Python (pybind11), .NET (P/Invoke) |

## Supported Transaction Types

The `TransactionType` enum recognizes 14 HIPAA X12 transaction types. Ten of
them also receive Tier-2 loop-aware structural validation — §2.3.1 loop nesting,
trigger segments, segment placement, and repeat-count caps.

| Code | Name | Loop-aware validation |
|------|------|-----------------------|
| **837P** | Professional Claim | Yes |
| **837I** | Institutional Claim | — |
| **837D** | Dental Claim | — |
| **835** | Remittance Advice | Yes |
| **270** | Eligibility Inquiry | Yes |
| **271** | Eligibility Response | Yes |
| **276** | Claim Status Request | Yes |
| **277** | Claim Status Response | Yes |
| **277CA** | Claim Acknowledgment | Yes |
| **278** | Health Care Services Review (Prior Auth) | Yes |
| **820** | Premium Payment | Yes |
| **834** | Benefit Enrollment | — |
| **999** | Implementation Acknowledgment | Yes |
| **TA1** | Interchange Acknowledgment | — |

## Quick Start

### C++ (Recommended for Performance)

```cpp
#include <exactedi/sdk/sdk.hpp>
#include <iostream>

int main() {
    // Quick analysis with default options
    auto result = exactedi::analyze_file("claims.edi");

    if (!result) {
        std::cerr << "Error: " << result.error().message() << "\n";
        return 1;
    }

    const auto& data = result.value();
    std::cout << "Transactions: " << data.transactions.size() << "\n";
    std::cout << "Valid: " << (data.is_valid() ? "Yes" : "No") << "\n";

    // Access PHI-safe facts
    for (const auto& tx : data.transactions) {
        std::cout << "Type: " << tx.type_string()
                  << ", Claim: " << tx.claim_id
                  << ", Charge: $" << tx.total_charge << "\n";
    }

    return 0;
}
```

### Python

```python
import exactedi

# Analyze a file
result = exactedi.analyze_file("claims.edi")
print(f"Found {result.transaction_count} transactions")

# Access transaction facts (PHI-safe)
for tx in result.transactions:
    print(f"Type: {tx.type}")
    print(f"Claim ID: {tx.claim_id}")
    print(f"Total Charge: ${tx.total_charge:.2f}")
```

### C# / .NET

```csharp
using ExactEDI;

// Analyze a file
using var result = ExactEDI.AnalyzeFile("claims.edi");
Console.WriteLine($"Found {result.TransactionCount} transactions");

// Access transaction facts (PHI-safe)
foreach (var tx in result.Transactions)
{
    Console.WriteLine($"Type: {tx.Type}");
    Console.WriteLine($"Claim ID: {tx.ClaimId}");
    Console.WriteLine($"Total Charge: ${tx.TotalCharge:F2}");
}
```

### C

```c
#include <exactedi/sdk/c_api.h>
#include <stdio.h>

int main() {
    // Create context with default options
    exactedi_context_t ctx = exactedi_create(NULL);

    // Analyze file
    exactedi_result_t result = NULL;
    if (exactedi_analyze_file(ctx, "claims.edi", &result) == EXACTEDI_OK) {
        // Get JSON output
        char* json = NULL;
        exactedi_result_to_facts_json(result, &json);
        printf("%s\n", json);

        exactedi_free_string(json);
        exactedi_result_free(result);
    } else {
        printf("Error: %s\n", exactedi_get_last_error());
    }

    exactedi_destroy(ctx);
    return 0;
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
├─────────────────────────────────────────────────────────────┤
│     Python SDK    │    .NET SDK     │       C/C++ SDK       │
│    (pybind11)     │   (P/Invoke)    │      (Native)         │
├─────────────────────────────────────────────────────────────┤
│                       C API Layer                            │
├─────────────────────────────────────────────────────────────┤
│                   ExactEDI Core Engine                       │
│  ┌──────────┬─────────────┬─────────────┬────────────┐      │
│  │ Tokenizer│  Validator  │   Facts     │   JSON     │      │
│  │          │             │  Extractor  │  Output    │      │
│  └──────────┴─────────────┴─────────────┴────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Input Sources

The SDK supports multiple input sources:

| Method | C++ | Python | .NET | C |
|--------|-----|--------|------|---|
| File path | `analyze_file()` | `analyze_file()` | `AnalyzeFile()` | `exactedi_analyze_file()` |
| String | `analyze_string()` | `analyze_string()` | `AnalyzeString()` | `exactedi_analyze_memory()` |
| Bytes/Memory | `analyze_memory()` | `analyze_bytes()` | `AnalyzeMemory()` | `exactedi_analyze_memory()` |
| Stream | `analyze_stream()` | - | - | - |
| Streaming callback | `analyze_file_streaming()` | `analyze_file_streaming()` | `AnalyzeFileStreaming()` | `exactedi_analyze_file_streaming()` |

## PHI-Safe Facts Output

ExactEDI extracts structured, de-identified facts from transactions that are safe for:
- AI/LLM processing (no PHI exposure)
- Analytics dashboards
- Compliance reporting
- Claim adjudication workflows

### What's Included (PHI-Safe)

- Transaction control numbers (ISA/GS/ST)
- Payer and provider NPIs
- Organization names (payers, providers)
- Service dates (not patient DOB)
- Diagnosis and procedure codes (ICD-10, CPT/HCPCS)
- Monetary amounts (charges, payments)
- Claim status codes

### What's Excluded (PHI)

- Patient names, dates of birth, addresses
- Medical record numbers (MRNs)
- Social Security Numbers
- Subscriber/member IDs
- Free-text descriptions
- Any direct patient identifiers

## Options and Configuration

```cpp
exactedi::AnalyzerOptions options;
options.strict_validation = true;      // Enforce envelope structure validation
options.extract_facts = true;          // Extract PHI-safe facts
options.include_raw_segments = false;  // Don't include raw segment data
options.max_transactions = 1000;       // Limit to first 1000 transactions
options.continue_on_error = true;      // Continue after validation errors

exactedi::Analyzer analyzer(options);
auto result = analyzer.analyze_file("claims.edi");
```

## Streaming Large Files

For files that don't fit in memory, use streaming callbacks:

```cpp
exactedi::Analyzer analyzer;
auto stats = analyzer.analyze_file_streaming("huge.edi",
    [](const exactedi::TransactionFacts& tx) {
        // Process each transaction individually
        std::cout << "Processing: " << tx.claim_id << "\n";
        return true;  // Continue processing (false to stop)
    });

std::cout << "Processed " << stats.transaction_count << " transactions\n";
```

## Validation Results

```cpp
auto result = exactedi::analyze_file("claims.edi");
if (result) {
    const auto& data = result.value();

    // Check overall validity
    if (data.is_valid()) {
        std::cout << "No validation errors\n";
    } else {
        std::cout << data.stats.error_count << " errors found\n";
    }

    // Iterate diagnostics
    for (const auto& diag : data.diagnostics) {
        std::cout << diag.severity_string() << ": "
                  << diag.message() << "\n";
    }
}
```

## JSON Output

The SDK can export results in multiple JSON formats:

### Facts JSON (PHI-Safe, for Analytics/LLM)

```cpp
auto facts = result.value().to_facts_json();
std::string json = facts.to_string(true);  // pretty-printed
```

Output structure:
```json
{
  "file": {
    "filename": "claims.edi",
    "file_size": 4096,
    "parse_timestamp": "2025-01-16T12:00:00Z"
  },
  "counts": {
    "interchanges": 1,
    "groups": 1,
    "transactions": 5,
    "segments": 156
  },
  "transactions": [
    {
      "type": "837P",
      "claim_id": "CLM001",
      "total_charge": 1500.00,
      "procedure_codes": ["99213", "99214"],
      "diagnosis_codes": ["Z23", "M54.5"]
    }
  ],
  "validation": {
    "errors": 0,
    "warnings": 0
  }
}
```

## Installation

### C++ (CMake)

```cmake
find_package(ExactEDI REQUIRED)
target_link_libraries(your_app PRIVATE ExactEDI::exactedi)
```

### Python

ExactEDI wheels are distributed through your customer portal (not PyPI):

```bash
pip install ./exactedi-X.Y.Z-<platform>.whl
```

### .NET

ExactEDI packages are distributed through your customer portal (not nuget.org):

```bash
# From the directory containing the downloaded .nupkg
dotnet add package ExactEDI --source .
```

### C

Link against `exactedi` library and include `<exactedi/sdk/c_api.h>`.

## Licensing

ExactEDI SDK is a commercial product. Features:

| License | Transactions/Day | Support | Price |
|---------|------------------|---------|-------|
| Trial | 100 | Community | Free |
| Professional | 10,000 | Email | Contact sales |
| Enterprise | Unlimited | Priority | Contact sales |

Check license status programmatically:

```cpp
// C++
std::cout << exactedi::license_status() << "\n";
```

```python
# Python
print(exactedi.license_status())
```

```csharp
// C#
Console.WriteLine(ExactEDI.LicenseStatus);
```

## Documentation

| Document | Description |
|----------|-------------|
| [API Reference](API_REFERENCE.md) | Complete C++ API reference |
| [C API](C_API.md) | C API documentation |
| [Python Guide](PYTHON_GUIDE.md) | Python SDK usage guide |
| [C# Guide](CSHARP_GUIDE.md) | .NET SDK usage guide |
| [Integration Guide](INTEGRATION_GUIDE.md) | Output format specifications |
| [Facts JSON Schema](facts_json_schema.md) | PHI-safe JSON output schema |

## Thread Safety

- Each `Analyzer` instance is independent and can be used from a single thread
- Multiple `Analyzer` instances can be created and used concurrently
- Global functions (`analyze_file()`, etc.) create temporary analyzers and are thread-safe
- Results are fully owned and can be passed between threads

## Error Handling

The SDK uses a `Result<T, Error>` pattern (C++) or exceptions (Python/.NET):

```cpp
// C++ - Check result
auto result = exactedi::analyze_file("claims.edi");
if (!result) {
    std::cerr << "Error: " << result.error().message() << "\n";
    return;
}
```

```python
# Python - Exceptions
try:
    result = exactedi.analyze_file("claims.edi")
except exactedi.ExactEDIError as e:
    print(f"Error: {e}")
```

```csharp
// C# - Exceptions
try
{
    using var result = ExactEDI.AnalyzeFile("claims.edi");
}
catch (ExactEDIException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

## Support

- **Documentation**: https://docs.exactedi.com
- **Email**: support@exactedi.com
- **Enterprise**: Dedicated Slack channel

Include sample input files and code snippets when reporting issues.
