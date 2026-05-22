# ExactEDI Python SDK Guide

Complete guide for using ExactEDI in Python applications.

## Installation

ExactEDI wheels are distributed through your customer portal — they are **not** published to PyPI. Two install paths depending on which release you're on:

### Pre-built wheel install (1.0.0-beta.4 and later)

Download the wheel for your platform (e.g. `exactedi-1.0.0b4-cp311-cp311-manylinux_2_17_x86_64.whl`) from the portal, then install it with `pip`:

```bash
# Core library (replace the filename with the wheel you downloaded)
pip install ./exactedi-1.0.0b4-<platform>.whl

# With pandas support
pip install "./exactedi-1.0.0b4-<platform>.whl[pandas]"

# All optional dependencies
pip install "./exactedi-1.0.0b4-<platform>.whl[all]"
```

Verify the install:

```bash
python -c "import exactedi; print(exactedi.version(), exactedi.license_status())"
# 1.0.0-beta.4 Trial
```

### Source install (1.0.0-beta.3 only)

Pre-built Python wheels are **not** bundled in the beta.3 distribution. Wheel builds are deferred to beta.4 (a CI artifact-pipeline gap, not a Python SDK issue — the binding itself is stable). To use the Python SDK in beta.3, install from source:

**Prerequisites:**

- Python 3.9+
- A C++20 toolchain on your platform:
    - Linux: `gcc` 10+ or `clang` 12+ (most modern distros)
    - macOS: Xcode Command Line Tools (`xcode-select --install`)
    - Windows: Visual Studio Build Tools 2022 with the C++ workload
- [CMake](https://cmake.org/) ≥ 3.21 and [Ninja](https://ninja-build.org/) on PATH

**Steps:**

1. Extract the ExactEDI source distribution (`exactedi-1.0.0-beta.3-src.tar.gz`) you received from your customer portal alongside the native libraries.
2. Drop the native library for your platform into a path the Python loader can find. The setup will look for it relative to the source tree:
    - Linux: `bindings/python/exactedi/libexactedi.so` (from `native-linux-x64`)
    - macOS: `bindings/python/exactedi/libexactedi.dylib` (from `native-macos-x64`)
    - Windows: `bindings/python/exactedi/exactedi.dll` (from `native-windows-x64`)
3. From a virtualenv, install in editable mode:

   ```bash
   cd bindings/python
   pip install -e .
   ```

   The `setup.py` will compile the pybind11 wrapper that links to the native library. First-time builds take 1-3 minutes depending on hardware.
4. Verify:

   ```bash
   python -c "import exactedi; print(exactedi.version(), exactedi.license_status())"
   # 1.0.0-beta.3 Trial
   ```

If the native library isn't found at runtime, set `EXACTEDI_NATIVE_LIB` to its absolute path before importing:

```bash
export EXACTEDI_NATIVE_LIB=/path/to/libexactedi.so
python -c "import exactedi; print(exactedi.version())"
```

Pre-built wheels will be the default install path from beta.4 onward — this source-install path is a one-release workaround, not a permanent expectation.

**Requirements:**
- Python 3.9+
- Linux, macOS, or Windows
- A valid ExactEDI license file from your customer portal

## Quick Start

```python
import exactedi

# Analyze a file
result = exactedi.analyze_file("claims.edi")

print(f"Transactions: {result.transaction_count}")
print(f"Valid: {result.is_valid}")

# Access PHI-safe facts
for tx in result.transactions:
    print(f"Type: {tx.type}")
    print(f"Claim ID: {tx.claim_id}")
    print(f"Total Charge: ${tx.total_charge:.2f}")
```

### Async Quick Start

```python
import asyncio
import exactedi

async def main():
    result = await exactedi.analyze_file_async("claims.edi")
    print(f"Transactions: {result.transaction_count}")

asyncio.run(main())
```

### Pandas Quick Start

```python
import exactedi

result = exactedi.analyze_file("claims.edi")
df = exactedi.to_dataframe(result)

print(df.groupby("type")["total_charge"].sum())
```

---

## Module Functions

### `analyze_file(path)`

Analyze an X12 file with default options.

```python
result = exactedi.analyze_file("claims.edi")
```

### `analyze_string(data)`

Analyze X12 content from a string.

```python
edi_content = open("claims.edi").read()
result = exactedi.analyze_string(edi_content)
```

### `analyze_bytes(data)`

Analyze X12 content from bytes.

```python
with open("claims.edi", "rb") as f:
    result = exactedi.analyze_bytes(f.read())
```

### `version()`

Get version string.

```python
print(exactedi.version())  # "1.0.0"
```

### `license_status()`

Get license status.

```python
print(exactedi.license_status())  # "Professional" or "Trial"
```

### `is_trial()`

Check if running in trial mode.

```python
if exactedi.is_trial():
    print("Running in trial mode")
```

---

## Analyzer Class

For more control, use the `Analyzer` class:

```python
analyzer = exactedi.Analyzer()

# Configure options
analyzer.set_strict_validation(True)
analyzer.set_extract_facts(True)
analyzer.set_max_transactions(100)
analyzer.set_continue_on_error(True)

# Analyze
result = analyzer.analyze_file("claims.edi")
```

### Methods

| Method | Description |
|--------|-------------|
| `analyze_file(path)` | Analyze file |
| `analyze_string(data)` | Analyze string |
| `analyze_bytes(data)` | Analyze bytes |
| `analyze_file_streaming(path, callback)` | Stream large files |
| `set_strict_validation(bool)` | Enable/disable strict validation |
| `set_extract_facts(bool)` | Enable/disable fact extraction |
| `set_max_transactions(int)` | Limit transactions (0 = unlimited) |
| `set_continue_on_error(bool)` | Continue after errors |

---

## AnalysisResult

The result object contains all analysis output.

```python
result = exactedi.analyze_file("claims.edi")

# Check validity
if result.is_valid:
    print("No validation errors")
else:
    print(f"{result.error_count} errors, {result.warning_count} warnings")

# Statistics
print(f"Bytes processed: {result.bytes_processed}")
print(f"Segments parsed: {result.segments_parsed}")
print(f"Transactions: {result.transaction_count}")
print(f"Time: {result.elapsed_seconds:.3f}s")

# Access transactions
for tx in result.transactions:
    print(tx.type, tx.claim_id)

# Export to JSON
json_str = result.to_json()
facts_json = result.facts_json()  # PHI-safe

# Convert to dict
data = result.to_dict()
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_valid` | `bool` | True if no errors |
| `error_count` | `int` | Number of errors |
| `warning_count` | `int` | Number of warnings |
| `bytes_processed` | `int` | Input size in bytes |
| `segments_parsed` | `int` | Total segments |
| `transaction_count` | `int` | Number of transactions |
| `elapsed_seconds` | `float` | Processing time |
| `transactions` | `list` | Transaction facts |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `to_json()` | `str` | Full JSON output |
| `facts_json()` | `str` | PHI-safe Facts JSON |
| `to_dict()` | `dict` | Python dictionary |

---

## TransactionFacts

Each transaction contains PHI-safe extracted facts.

```python
for tx in result.transactions:
    # Transaction identification
    print(tx.type)                   # "837P", "835", etc.
    print(tx.interchange_control)    # ISA control number
    print(tx.group_control)          # GS control number
    print(tx.transaction_control)    # ST control number

    # Claim information
    print(tx.claim_id)               # Claim reference
    print(tx.claim_status)           # Status code (835)
    print(tx.service_dates)          # List of dates

    # Financial
    print(tx.total_charge)           # Total billed
    print(tx.total_payment)          # Total paid (835)

    # Provider/Payer
    print(tx.payer_id)
    print(tx.payer_name)
    print(tx.billing_provider_npi)

    # Clinical (codes only, no PHI)
    print(tx.procedure_codes)        # CPT/HCPCS codes
    print(tx.diagnosis_codes)        # ICD-10 codes
    print(tx.place_of_service)
    print(tx.service_line_count)

    # Export
    print(tx.to_json())
    print(tx.to_dict())
```

---

## Async API

All analysis methods have async counterparts that run the C++ call in a
thread-pool executor, keeping the asyncio event loop unblocked.

### Module-level async functions

```python
import asyncio
import exactedi

async def main():
    # Async file analysis
    result = await exactedi.analyze_file_async("claims.edi")

    # Async string / bytes variants
    result = await exactedi.analyze_string_async(edi_content)
    result = await exactedi.analyze_bytes_async(edi_bytes)

asyncio.run(main())
```

### AsyncAnalyzer class

```python
import asyncio
import exactedi

async def main():
    analyzer = exactedi.AsyncAnalyzer()
    analyzer.set_strict_validation(True)
    analyzer.set_max_transactions(500)

    result = await analyzer.analyze_file("claims.edi")
    print(f"Transactions: {result.transaction_count}")

    # Streaming with AsyncAnalyzer
    def on_transaction(json_str, tx_type):
        print(f"Got {tx_type}")
        return True

    stats = await analyzer.analyze_file_streaming("large.edi", on_transaction)
    print(f"Done: {stats['transaction_count']} transactions")

asyncio.run(main())
```

### FastAPI integration

```python
from fastapi import FastAPI, UploadFile, HTTPException
import exactedi

app = FastAPI()
_analyzer = exactedi.AsyncAnalyzer()

@app.post("/analyze")
async def analyze(file: UploadFile):
    data = await file.read()
    try:
        result = await _analyzer.analyze_bytes(data)
        return {
            "valid": result.is_valid,
            "transaction_count": result.transaction_count,
            "transactions": [tx.to_dict() for tx in result.transactions],
        }
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## Pandas Integration

Requires the `[pandas]` extra: `pip install "./exactedi-X.Y.Z-<platform>.whl[pandas]"` (see [Installation](#installation)).

### Basic DataFrame conversion

```python
import exactedi

result = exactedi.analyze_file("claims.edi")

# One row per transaction
df = exactedi.to_dataframe(result)
print(df.columns.tolist())
# ['type', 'interchange_control', 'claim_id', 'total_charge', ...]

# Aggregate financials by transaction type
print(df.groupby("type")["total_charge"].sum())

# Top 10 procedure codes
print(
    df["procedure_codes"]
    .explode()
    .value_counts()
    .head(10)
)
```

### Explode list columns

Pass `expand_lists=True` to get one row per code instead of one row per
transaction — useful for code-frequency analysis:

```python
df_expanded = exactedi.to_dataframe(result, expand_lists=True)
# Each procedure_code, diagnosis_code, and service_date gets its own row
print(df_expanded["procedure_codes"].value_counts())
```

### Streaming into a DataFrame

For files too large to hold in memory, stream into a list and convert:

```python
import json
import pandas as pd
import exactedi

records = []

def collect(json_str, tx_type):
    records.append(json.loads(json_str))
    return True

analyzer = exactedi.Analyzer()
analyzer.analyze_file_streaming("huge.edi", collect)

df = pd.DataFrame(records)
print(df.groupby("type").size())
```

---

## Streaming Large Files

For files too large to fit in memory:

```python
import json

def process_transaction(json_str, tx_type):
    """Called for each transaction."""
    data = json.loads(json_str)
    print(f"Processing {tx_type}: {data.get('claim_id')}")

    # Save to database, send to queue, etc.
    save_to_database(data)

    return True  # Return False to stop early

analyzer = exactedi.Analyzer()
stats = analyzer.analyze_file_streaming("large.edi", process_transaction)

print(f"Processed {stats['transaction_count']} transactions")
print(f"Time: {stats['elapsed_seconds']:.2f}s")
```

---

## Error Handling

```python
try:
    result = exactedi.analyze_file("claims.edi")
except exactedi.ExactEDIError as e:
    print(f"Error: {e}")
except FileNotFoundError:
    print("File not found")
```

---

## Working with JSON Output

### Facts JSON (PHI-Safe)

```python
import json

result = exactedi.analyze_file("claims.edi")
facts = json.loads(result.facts_json())

print(f"File: {facts['file']['filename']}")
print(f"Transactions: {facts['counts']['transactions']}")

for tx in facts['transactions']:
    print(f"  {tx['type']}: {tx['claim_id']} - ${tx['total_charge']:.2f}")
```

### Integration with Pandas

```python
import pandas as pd
import exactedi

result = exactedi.analyze_file("claims.edi")

# Convert transactions to DataFrame
df = pd.DataFrame([tx.to_dict() for tx in result.transactions])

# Analyze
print(df.groupby('type')['total_charge'].sum())
print(df['procedure_codes'].explode().value_counts())
```

---

## Batch Processing

```python
import exactedi
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

def process_file(path):
    """Process a single file."""
    try:
        result = exactedi.analyze_file(str(path))
        return {
            'file': path.name,
            'transactions': result.transaction_count,
            'valid': result.is_valid,
            'total_charge': sum(tx.total_charge for tx in result.transactions)
        }
    except Exception as e:
        return {'file': path.name, 'error': str(e)}

# Process all .edi files in directory
files = list(Path("incoming").glob("*.edi"))

# Sequential
results = [process_file(f) for f in files]

# Parallel (4 workers)
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_file, files))

# Summary
for r in results:
    if 'error' in r:
        print(f"{r['file']}: ERROR - {r['error']}")
    else:
        print(f"{r['file']}: {r['transactions']} tx, ${r['total_charge']:.2f}")
```

---

## Flask Integration

```python
from flask import Flask, request, jsonify
import exactedi

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    data = file.read()

    try:
        result = exactedi.analyze_bytes(data)
        return jsonify({
            'valid': result.is_valid,
            'transaction_count': result.transaction_count,
            'facts': result.to_dict()
        })
    except exactedi.ExactEDIError as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()
```

---

## FastAPI Integration

```python
from fastapi import FastAPI, UploadFile, HTTPException
import exactedi

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile):
    data = await file.read()

    try:
        result = exactedi.analyze_bytes(data)
        return {
            "valid": result.is_valid,
            "transaction_count": result.transaction_count,
            "transactions": [tx.to_dict() for tx in result.transactions]
        }
    except exactedi.ExactEDIError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## Common Patterns

### Filter by Transaction Type

```python
result = exactedi.analyze_file("mixed.edi")

# Get only 837 claims
claims = [tx for tx in result.transactions if tx.type.startswith("837")]

# Get only 835 remittances
remittances = [tx for tx in result.transactions if tx.type == "835"]
```

### Aggregate Financials

```python
result = exactedi.analyze_file("claims.edi")

total_charges = sum(tx.total_charge for tx in result.transactions)
total_payments = sum(tx.total_payment for tx in result.transactions)

print(f"Total Charges: ${total_charges:,.2f}")
print(f"Total Payments: ${total_payments:,.2f}")
```

### Extract Procedure Codes

```python
result = exactedi.analyze_file("claims.edi")

all_codes = set()
for tx in result.transactions:
    all_codes.update(tx.procedure_codes)

print(f"Unique procedure codes: {sorted(all_codes)}")
```

---

## Performance Tips

1. **Reuse Analyzer instances** for multiple files
2. **Use streaming** for files over 100MB
3. **Process in parallel** using ThreadPoolExecutor
4. **Disable fact extraction** if only validating: `analyzer.set_extract_facts(False)`

---

## Troubleshooting

### ImportError: No module named '_exactedi'

The native library is missing. Reinstall the wheel from your customer portal:
```bash
pip uninstall exactedi
pip install ./exactedi-X.Y.Z-<platform>.whl
```

### License errors

Check license status:
```python
print(exactedi.license_status())
print(f"Trial: {exactedi.is_trial()}")
```

### Memory issues with large files

Use streaming:
```python
analyzer.analyze_file_streaming("large.edi", callback)
```

---

## See Also

- [SDK Overview](SDK_OVERVIEW.md)
- [C++ API Reference](API_REFERENCE.md)
- [Integration Guide](INTEGRATION_GUIDE.md)
- [Facts JSON Schema](facts_json_schema.md)
