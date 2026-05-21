# ExactEDI Facts JSON Schema (v1.0.0)

## Purpose

The ExactEDI Facts JSON is a **deterministic, PHI-safe summary** of an EDI file designed for:

1. **LLM Contract** - Safe input for AI explanation layers (ExactEDI Insights)
2. **Analytics Pipeline** - Structured data for reporting and dashboards
3. **Quality Assurance** - Validation status and anomaly detection

## PHI Safety Constraints

The Facts JSON is designed to be **HIPAA Safe Harbor compliant** by explicitly excluding:

- Patient names, DOB, addresses
- Medical Record Numbers (MRN)
- Social Security Numbers
- Subscriber/Member IDs
- Account numbers
- Free-text fields (notes, descriptions)
- Raw EDI content

**Safe to include:**
- Control numbers (interchange, group, transaction)
- Payer and provider identifiers (NPI, organization names)
- Service dates (not patient DOB)
- Procedure and diagnosis codes (ICD-10, CPT, HCPCS)
- Monetary amounts (charges, payments)
- Structural metadata (counts, envelope info)

---

## Schema Fields

### Root Object

| Field | Type | Description |
|-------|------|-------------|
| `schema_version` | string | Schema version (e.g., "1.0.0") |
| `engine_version` | string | ExactEDI Engine version that produced this output |
| `file_metadata` | object | File identification and metadata |
| `delimiters` | object | X12 delimiter specification |
| `envelope_counts` | object | ISA/GS/ST structure counts |
| `transaction_counts` | object | Transaction type breakdown |
| `validation_summary` | object | Error/warning summary |
| `cas_summaries` | array | CAS adjustment summaries (835 only) |
| `claim_service_counts` | object | High-level claim/service counts |
| `structural_anomalies` | object | Detected anomalies |

---

### `file_metadata`

| Field | Type | Description |
|-------|------|-------------|
| `sha256_hash` | string | SHA-256 hash of file content for integrity |
| `file_size_bytes` | integer | File size in bytes |
| `source_filename` | string | Original filename (no path) |
| `parse_timestamp` | string | ISO 8601 UTC timestamp of parse |

---

### `delimiters`

| Field | Type | Description |
|-------|------|-------------|
| `element_separator` | string | Element separator (typically "*") |
| `component_separator` | string | Component separator (typically ":") |
| `segment_terminator` | string | Segment terminator (typically "~") |
| `repetition_separator` | string | Repetition separator from ISA11 |

---

### `envelope_counts`

| Field | Type | Description |
|-------|------|-------------|
| `interchange_count` | integer | Number of ISA/IEA pairs |
| `group_count` | integer | Number of GS/GE pairs |
| `transaction_count` | integer | Number of ST/SE pairs |
| `total_segments` | integer | Total segment count in file |

---

### `transaction_counts`

| Field | Type | Description |
|-------|------|-------------|
| `claim_837p` | integer | Professional claim count |
| `claim_837i` | integer | Institutional claim count |
| `claim_837d` | integer | Dental claim count |
| `remittance_835` | integer | Remittance advice count |
| `other` | integer | Unsupported/unknown transaction types |

---

### `validation_summary`

| Field | Type | Description |
|-------|------|-------------|
| `error_count` | integer | Total error count |
| `warning_count` | integer | Total warning count |
| `error_codes` | array[string] | Unique error codes encountered |
| `warning_codes` | array[string] | Unique warning codes encountered |

**Common error codes:**
- `ISA_NOT_FIRST` - ISA is not the first segment
- `MISSING_SE` - Transaction missing closing SE
- `MISSING_GE` - Group missing closing GE
- `MISSING_IEA` - Interchange missing closing IEA
- `ST_SE_MISMATCH` - ST02 != SE02
- `GS_GE_MISMATCH` - GS06 != GE02
- `ISA_IEA_MISMATCH` - ISA13 != IEA02
- `SEGMENT_COUNT_MISMATCH` - SE01 != actual count
- `TRANSACTION_COUNT_MISMATCH` - GE01 != actual count
- `GROUP_COUNT_MISMATCH` - IEA01 != actual count
- `NESTED_ST` - ST inside ST without SE
- `NESTED_GS` - GS inside GS without GE
- `NESTED_ISA` - ISA inside ISA without IEA

---

### `cas_summaries` (835 only)

Array of CAS group summaries. Only present for 835 remittance files.

| Field | Type | Description |
|-------|------|-------------|
| `group_code` | string | CAS group code (CO, CR, OA, PI, PR) |
| `group_name` | string | Human-readable group name |
| `reason_counts` | object | Map of reason_code -> occurrence count |

**CAS Group Codes:**
- `CO` - Contractual Obligations
- `CR` - Correction and Reversal
- `OA` - Other Adjustments
- `PI` - Payor Initiated Reductions
- `PR` - Patient Responsibility

---

### `claim_service_counts`

Heuristic counts based on segment analysis. May not be exact.

| Field | Type | Description |
|-------|------|-------------|
| `claim_count` | integer | Approximate claim count (CLM/CLP segments) |
| `service_line_count` | integer | Approximate service lines (SV1/SV2/SVC) |
| `diagnosis_code_count` | integer | Unique diagnosis codes found |
| `procedure_code_count` | integer | Unique procedure codes found |

---

### `structural_anomalies`

| Field | Type | Description |
|-------|------|-------------|
| `has_envelope_errors` | boolean | Missing/mismatched envelope pairs |
| `has_control_number_mismatch` | boolean | Mismatched control numbers |
| `has_segment_count_mismatch` | boolean | SE01/GE01/IEA01 count errors |
| `has_unsupported_transactions` | boolean | Non-837/835 transaction types |
| `anomaly_descriptions` | array[string] | Brief anomaly descriptions |

---

## How ExactEDI Engine Populates Facts

The ExactEDI Engine populates the Facts JSON deterministically through these steps:

1. **File Metadata**
   - Hash is computed from raw file bytes (SHA-256)
   - File size read from filesystem
   - Timestamp is UTC at parse completion

2. **Delimiter Detection**
   - Read from fixed ISA positions (bytes 3, 104, 105)
   - ISA11 provides repetition separator

3. **Envelope Tracking**
   - EnvelopeTracker state machine processes ISA/IEA, GS/GE, ST/SE
   - Counts accumulated as segments processed
   - Diagnostics emitted for structural violations

4. **Transaction Type Detection**
   - ST01 examined for transaction identifier
   - Implementation reference (ST03) may refine type (837P vs 837I)

5. **CAS Extraction (835 only)**
   - CAS segments scanned for group code + reason codes
   - Counts aggregated by group and reason

6. **Claim/Service Counting (Heuristic)**
   - CLM segments counted for 837
   - CLP segments counted for 835
   - SV1/SV2 (837) and SVC (835) counted for service lines
   - Codes extracted from composite elements when parseable

7. **Anomaly Detection**
   - Based on validation diagnostics
   - Flags set based on diagnostic categories

---

## Example Usage

```cpp
#include <exactedi/output/facts_schema.hpp>

// Build facts from parsed data
exactedi::facts::ExactEDIFacts facts;
facts.schema_version = exactedi::facts::FACTS_SCHEMA_VERSION;
facts.engine_version = "1.0.0";

// Populate from EnvelopeTracker and ValidationResult
facts.envelope_counts.interchange_count = tracker.interchanges().size();
facts.envelope_counts.group_count = tracker.groups().size();
facts.envelope_counts.transaction_count = tracker.transactions().size();
facts.envelope_counts.total_segments = tracker.segment_count();

// Output JSON
std::string json = facts.to_json_string(true);  // pretty-printed
```

---

## Versioning

The schema follows semantic versioning:
- **Major**: Breaking changes to field names or structure
- **Minor**: New optional fields added
- **Patch**: Documentation or clarification updates

Consumers should check `schema_version` and handle unknown fields gracefully.
