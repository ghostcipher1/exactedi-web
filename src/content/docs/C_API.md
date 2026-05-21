# ExactEDI C API Reference

C-compatible API for FFI bindings and cross-language integration.

## Header

```c
#include <exactedi/sdk/c_api.h>
```

## Quick Start

```c
#include <exactedi/sdk/c_api.h>
#include <stdio.h>

int main() {
    // Create context
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
    }

    exactedi_destroy(ctx);
    return 0;
}
```

---

## Types

### Handles

```c
typedef struct exactedi_context* exactedi_context_t;  // Analysis context
typedef struct exactedi_result* exactedi_result_t;    // Analysis result
```

### Status Codes

```c
typedef enum exactedi_status {
    EXACTEDI_OK = 0,
    EXACTEDI_ERROR_INVALID_ARGUMENT,
    EXACTEDI_ERROR_FILE_NOT_FOUND,
    EXACTEDI_ERROR_FILE_READ,
    EXACTEDI_ERROR_FILE_WRITE,
    EXACTEDI_ERROR_PARSE_FAILED,
    EXACTEDI_ERROR_VALIDATION_FAILED,
    EXACTEDI_ERROR_OUT_OF_MEMORY,
    EXACTEDI_ERROR_LICENSE,
    EXACTEDI_ERROR_INTERNAL
} exactedi_status_t;
```

### Transaction Types

```c
typedef enum exactedi_transaction_type {
    EXACTEDI_TX_UNKNOWN = 0,
    EXACTEDI_TX_837P = 1,   // Professional claim
    EXACTEDI_TX_837I = 2,   // Institutional claim
    EXACTEDI_TX_837D = 3,   // Dental claim
    EXACTEDI_TX_835 = 4,    // Remittance advice
    EXACTEDI_TX_277 = 5,    // Claim status
    EXACTEDI_TX_999 = 6,    // Acknowledgment
    EXACTEDI_TX_270 = 7,    // Eligibility inquiry
    EXACTEDI_TX_271 = 8     // Eligibility response
} exactedi_transaction_type_t;
```

### Options

```c
typedef struct exactedi_options {
    int strict_validation;      // Enable strict validation (default: 1)
    int extract_facts;          // Extract PHI-safe facts (default: 1)
    int include_raw_segments;   // Include raw segments (default: 0)
    size_t max_transactions;    // Max transactions (0 = unlimited)
    int continue_on_error;      // Continue after errors (default: 1)
} exactedi_options_t;
```

### Statistics

```c
typedef struct exactedi_stats {
    size_t bytes_processed;
    size_t segments_parsed;
    uint32_t interchange_count;
    uint32_t group_count;
    uint32_t transaction_count;
    size_t error_count;
    size_t warning_count;
    double elapsed_seconds;
} exactedi_stats_t;
```

---

## Context Lifecycle

### `exactedi_create()`

Create a new analysis context.

```c
exactedi_context_t exactedi_create(const exactedi_options_t* options);
```

**Parameters:**
- `options` - Configuration options (NULL for defaults)

**Returns:** Context handle, or NULL on error

### `exactedi_destroy()`

Destroy an analysis context.

```c
void exactedi_destroy(exactedi_context_t ctx);
```

### `exactedi_options_init()`

Initialize options with defaults.

```c
void exactedi_options_init(exactedi_options_t* options);
```

---

## Analysis Functions

### `exactedi_analyze_file()`

Analyze an X12 file.

```c
exactedi_status_t exactedi_analyze_file(
    exactedi_context_t ctx,
    const char* file_path,
    exactedi_result_t* out_result);
```

### `exactedi_analyze_memory()`

Analyze X12 data from memory.

```c
exactedi_status_t exactedi_analyze_memory(
    exactedi_context_t ctx,
    const void* data,
    size_t data_len,
    exactedi_result_t* out_result);
```

### `exactedi_validate_file()`

Validate without fact extraction.

```c
exactedi_status_t exactedi_validate_file(
    exactedi_context_t ctx,
    const char* file_path,
    exactedi_stats_t* out_stats);
```

### `exactedi_validate_memory()`

Validate memory buffer.

```c
exactedi_status_t exactedi_validate_memory(
    exactedi_context_t ctx,
    const void* data,
    size_t data_len,
    exactedi_stats_t* out_stats);
```

---

## Result Access

### `exactedi_result_get_stats()`

```c
exactedi_status_t exactedi_result_get_stats(
    exactedi_result_t result,
    exactedi_stats_t* out_stats);
```

### `exactedi_result_is_valid()`

```c
int exactedi_result_is_valid(exactedi_result_t result);
```

Returns 1 if valid (no errors), 0 otherwise.

### `exactedi_result_transaction_count()`

```c
size_t exactedi_result_transaction_count(exactedi_result_t result);
```

### `exactedi_result_transaction_type()`

```c
exactedi_transaction_type_t exactedi_result_transaction_type(
    exactedi_result_t result,
    size_t index);
```

### `exactedi_result_to_json()`

```c
exactedi_status_t exactedi_result_to_json(
    exactedi_result_t result,
    char** out_json);
```

**Note:** Caller must free with `exactedi_free_string()`.

### `exactedi_result_to_facts_json()`

```c
exactedi_status_t exactedi_result_to_facts_json(
    exactedi_result_t result,
    char** out_json);
```

PHI-safe Facts JSON output.

### `exactedi_result_transaction_json()`

```c
exactedi_status_t exactedi_result_transaction_json(
    exactedi_result_t result,
    size_t index,
    char** out_json);
```

### `exactedi_result_free()`

```c
void exactedi_result_free(exactedi_result_t result);
```

---

## Streaming Analysis

### Callback Type

```c
typedef int (*exactedi_transaction_callback_t)(
    const char* transaction_json,
    exactedi_transaction_type_t transaction_type,
    void* user_data);
```

Return non-zero to continue, 0 to stop.

### `exactedi_analyze_file_streaming()`

```c
exactedi_status_t exactedi_analyze_file_streaming(
    exactedi_context_t ctx,
    const char* file_path,
    exactedi_transaction_callback_t callback,
    void* user_data,
    exactedi_stats_t* out_stats);
```

**Example:**

```c
int my_callback(const char* json, exactedi_transaction_type_t type, void* data) {
    printf("Transaction type %d: %s\n", type, json);
    return 1;  // Continue
}

exactedi_stats_t stats;
exactedi_analyze_file_streaming(ctx, "large.edi", my_callback, NULL, &stats);
```

---

## Memory Management

### `exactedi_free_string()`

Free strings allocated by ExactEDI.

```c
void exactedi_free_string(char* str);
```

---

## Error Handling

### `exactedi_get_last_error()`

```c
const char* exactedi_get_last_error(void);
```

Thread-local error message.

### `exactedi_clear_error()`

```c
void exactedi_clear_error(void);
```

### `exactedi_status_message()`

```c
const char* exactedi_status_message(exactedi_status_t status);
```

---

## Version & License

### `exactedi_version()`

```c
const char* exactedi_version(void);
```

### `exactedi_version_components()`

```c
void exactedi_version_components(int* major, int* minor, int* patch);
```

### `exactedi_has_feature()`

```c
int exactedi_has_feature(const char* feature_name);
```

### `exactedi_license_status()`

```c
const char* exactedi_license_status(void);
```

### `exactedi_set_license_path()`

```c
exactedi_status_t exactedi_set_license_path(const char* path);
```

---

## Complete Example

```c
#include <exactedi/sdk/c_api.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <edi-file>\n", argv[0]);
        return 1;
    }

    // Initialize options
    exactedi_options_t options;
    exactedi_options_init(&options);
    options.strict_validation = 1;

    // Create context
    exactedi_context_t ctx = exactedi_create(&options);
    if (!ctx) {
        fprintf(stderr, "Failed to create context\n");
        return 1;
    }

    // Analyze file
    exactedi_result_t result = NULL;
    exactedi_status_t status = exactedi_analyze_file(ctx, argv[1], &result);

    if (status != EXACTEDI_OK) {
        fprintf(stderr, "Error: %s\n", exactedi_get_last_error());
        exactedi_destroy(ctx);
        return 1;
    }

    // Get statistics
    exactedi_stats_t stats;
    exactedi_result_get_stats(result, &stats);

    printf("Bytes: %zu\n", stats.bytes_processed);
    printf("Segments: %zu\n", stats.segments_parsed);
    printf("Transactions: %u\n", stats.transaction_count);
    printf("Errors: %zu\n", stats.error_count);
    printf("Valid: %s\n", exactedi_result_is_valid(result) ? "Yes" : "No");

    // Get Facts JSON
    char* json = NULL;
    if (exactedi_result_to_facts_json(result, &json) == EXACTEDI_OK) {
        printf("\n%s\n", json);
        exactedi_free_string(json);
    }

    // Cleanup
    exactedi_result_free(result);
    exactedi_destroy(ctx);

    return 0;
}
```

## See Also

- [SDK Overview](SDK_OVERVIEW.md)
- [C++ API Reference](API_REFERENCE.md)
- [Python Guide](PYTHON_GUIDE.md)
- [C# Guide](CSHARP_GUIDE.md)
