# ExactEDI C++ API Reference

Complete reference for the ExactEDI C++ SDK.

## Header Files

| Header | Description |
|--------|-------------|
| `<exactedi/sdk/sdk.hpp>` | **Umbrella header** - includes everything |
| `<exactedi/sdk/analyzer.hpp>` | Analyzer class and result types |
| `<exactedi/sdk/c_api.h>` | C API (for FFI bindings) |

For most use cases, include only the umbrella header:

```cpp
#include <exactedi/sdk/sdk.hpp>
```

---

## Convenience Functions

### `analyze_file()`

```cpp
[[nodiscard]] Result<AnalysisResult, Error> analyze_file(
    const std::filesystem::path& path);
```

Quick analysis of a file with default options.

### `analyze_string()`

```cpp
[[nodiscard]] Result<AnalysisResult, Error> analyze_string(
    std::string_view data);
```

Quick analysis of string data with default options.

### `validate_file()`

```cpp
[[nodiscard]] Result<AnalysisResult, Error> validate_file(
    const std::filesystem::path& path);
```

Quick validation without fact extraction.

---

## Class: `Analyzer`

High-level X12 EDI analyzer - the primary SDK entry point.

### Constructors

```cpp
Analyzer();
explicit Analyzer(AnalyzerOptions options);
```

### Analysis Methods

| Method | Description |
|--------|-------------|
| `analyze_file(path)` | Analyze an X12 file |
| `analyze_memory(span)` | Analyze from memory buffer |
| `analyze_string(data)` | Analyze from string |
| `analyze_stream(stream)` | Analyze from input stream |
| `analyze_file_streaming(path, callback)` | Stream large files with callback |
| `validate_file(path)` | Validate only (no facts) |
| `validate_string(data)` | Validate string only |

### Streaming Callback

```cpp
using TransactionCallback = std::function<bool(const TransactionFacts&)>;

auto stats = analyzer.analyze_file_streaming("huge.edi",
    [](const TransactionFacts& tx) {
        process(tx);
        return true;  // Continue (false to stop)
    });
```

---

## Struct: `AnalyzerOptions`

```cpp
struct AnalyzerOptions {
    bool strict_validation = true;      // Enforce envelope validation
    bool extract_facts = true;          // Extract PHI-safe facts
    bool include_raw_segments = false;  // Include raw segments
    size_t max_transactions = 0;        // Limit (0 = unlimited)
    bool allow_unknown_transactions = false;
    bool continue_on_error = true;      // Continue after errors
};
```

---

## Struct: `AnalysisResult`

```cpp
struct AnalysisResult {
    AnalysisStats stats;
    std::vector<TransactionFacts> transactions;
    std::vector<Diagnostic> diagnostics;
    std::vector<Segment> raw_segments;

    bool is_valid() const noexcept;
    bool has_transactions() const noexcept;
    std::vector<Diagnostic> errors() const;
    std::vector<Diagnostic> warnings() const;

    // Transaction-type accessors
    std::vector<const TransactionFacts*>
        transactions_of_type(TransactionType type) const;
    std::vector<const TransactionFacts*> claims() const;         // 837P/I/D combined
    std::vector<const TransactionFacts*> remittances() const;    // 835
    std::vector<const TransactionFacts*> claim_statuses() const; // 277
    std::vector<const TransactionFacts*> acknowledgments() const;// 999

    // Output
    facts::ExactEDIFacts to_facts_json() const;                  // LLM/analytics
    std::string to_json_string(bool pretty = true) const;
};
```

---

## Struct: `AnalysisStats`

```cpp
struct AnalysisStats {
    size_t bytes_processed;
    size_t segments_parsed;
    uint32_t interchange_count;
    uint32_t group_count;
    uint32_t transaction_count;
    size_t error_count;
    size_t warning_count;
    double elapsed_seconds;
};
```

---

## Struct: `TransactionFacts`

PHI-safe extracted facts from a transaction. Defined in
`<exactedi/analysis/facts_extractor.hpp>`. Per-transaction sub-facts are
populated only when the corresponding transaction type is detected; check
the `std::optional` slot before reading.

```cpp
struct TransactionFacts {
    TransactionType type = TransactionType::Unknown;

    // Control numbers (for tracing)
    std::string interchange_control;
    std::string group_control;
    std::string transaction_control;

    // Common claim / remittance fields (PHI-safe)
    std::vector<std::string> service_dates;
    std::string payer_id;
    std::string payer_name;
    std::string billing_provider_npi;
    std::string rendering_provider_npi;
    std::string claim_id;
    std::string original_reference;
    double total_charge = 0.0;
    double total_payment = 0.0;
    double patient_responsibility = 0.0;
    std::vector<std::string> procedure_codes;     // CPT / HCPCS
    std::vector<std::string> diagnosis_codes;     // ICD-10
    std::string place_of_service;
    std::string claim_status;                     // 835
    uint32_t service_line_count = 0;

    // Financial balancing (837 claims and 835 remittance)
    BalancingResult balancing;

    // Per-transaction-type sub-facts (populated only when type matches)
    std::optional<Eligibility270Facts>             eligibility_270;
    std::optional<EligibilityResponse271Facts>     eligibility_response_271;
    std::optional<ClaimStatusRequest276Facts>      claim_status_request_276;
    std::optional<ClaimStatus277Facts>             claim_status_277;
    std::optional<ClaimAcknowledgment277CAFacts>   claim_ack_277ca;
    std::optional<PriorAuthorization278Facts>      prior_auth_278;
    std::optional<BenefitEnrollment834Facts>       enrollment_834;
    std::optional<PremiumPayment820Facts>          premium_payment_820;
    std::optional<Acknowledgment999Facts>          acknowledgment_999;

    nlohmann::json to_json() const;
};
```

---

## Enum: `TransactionType`

Defined in `<exactedi/analysis/transaction_type.hpp>`. Covers all common
HIPAA X12 5010 transactions.

```cpp
enum class TransactionType {
    Unknown,                 // Unrecognized or unsupported
    Claim837P,               // 837P Professional   (005010X222A1)
    Claim837I,               // 837I Institutional  (005010X223A3)
    Claim837D,               // 837D Dental         (005010X224A3)
    Remittance835,           // 835 Remittance      (005010X221A1)
    Eligibility270,          // 270 Eligibility Inquiry  (005010X279A1)
    EligibilityResponse271,  // 271 Eligibility Response (005010X279A1)
    ClaimStatusRequest276,   // 276 Claim Status Request  (005010X212)
    ClaimStatus277,          // 277 Claim Status Response (005010X214)
    ClaimAcknowledgment277CA,// 277CA Claim Acknowledgment (005010X214)
    PriorAuthorization278,   // 278 Health Care Services Review (005010X217)
    PremiumPayment820,       // 820 Premium Payment (005010X218)
    BenefitEnrollment834,    // 834 Benefit Enrollment (005010X220A1)
    Acknowledgment999,       // 999 Implementation Ack (005010X231A1)
    InterchangeAckTA1        // TA1 Interchange Ack (interchange-level, not ST/SE)
};
```

---

## Template: `Result<T, E>`

```cpp
auto result = exactedi::analyze_file("claims.edi");
if (result) {
    const auto& data = result.value();
} else {
    std::cerr << result.error().message() << "\n";
}
```

---

## Complete Example

```cpp
#include <exactedi/sdk/sdk.hpp>
#include <iostream>

int main() {
    exactedi::AnalyzerOptions opts;
    opts.strict_validation = true;

    exactedi::Analyzer analyzer(opts);
    auto result = analyzer.analyze_file("claims.edi");

    if (!result) {
        std::cerr << "Error: " << result.error().message() << "\n";
        return 1;
    }

    const auto& data = result.value();
    std::cout << "Transactions: " << data.transactions.size() << "\n";

    for (const auto& tx : data.transactions) {
        std::cout << exactedi::transaction_type_code(tx.type) << ": "
                  << tx.claim_id << " $" << tx.total_charge << "\n";
    }

    return 0;
}
```

## See Also

- [SDK Overview](SDK_OVERVIEW.md)
- [C API Reference](C_API.md)
- [Python Guide](PYTHON_GUIDE.md)
- [C# Guide](CSHARP_GUIDE.md)
