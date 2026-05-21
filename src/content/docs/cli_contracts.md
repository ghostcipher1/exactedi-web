# ExactEDI CLI Command Contracts

This document defines the verifiable contracts for each ExactEDI CLI command. These contracts are **stable guarantees** - breaking them is a major version change.

## Global Exit Codes

| Code | Meaning | When |
|------|---------|------|
| `0`  | Success | Command completed successfully |
| `1`  | Error   | File not found, parse error, license error, I/O error |
| `2`  | Validation failure | `validate` only: file parsed but has structural errors |

## Global Options (all commands)

```
--verbose, -v       Enable debug-level logging
--quiet, -q         Suppress info messages (errors only)
--log-file <path>   Write detailed logs to file
--help, -h          Show command help
```

---

## `parse <file>`

**Purpose:** Parse X12 file and emit JSONL segment stream.

### Contract

| Aspect | Guarantee |
|--------|-----------|
| **Output destination** | stdout by default, file with `--output` |
| **Output format** | JSONL (one JSON object per line) |
| **Exit code 0** | File parsed successfully (may include warnings) |
| **Exit code 1** | File not found, parse error, I/O error |
| **Determinism** | Same input always produces identical output |
| **Streaming** | Segments emitted as parsed (low memory) |

### JSONL Schema (v1.0)

Each line is a JSON object with guaranteed fields:

```json
{
  "seg": "string",           // REQUIRED: Segment ID (e.g., "ISA", "NM1")
  "elem": ["string", ...],   // REQUIRED: Array of element values
  "pos": {                   // OPTIONAL: Present unless --no-position
    "byte": 0,               // Byte offset in source file
    "idx": 0                 // Zero-based segment index
  },
  "isa_ctrl": "string",      // OPTIONAL: ISA13 control number (within interchange)
  "gs_ctrl": "string",       // OPTIONAL: GS06 control number (within group)
  "st_ctrl": "string"        // OPTIONAL: ST02 control number (within transaction)
}
```

**Schema version header** (with `--schema-version`):

```json
{"_schema":"exactedi-jsonl","_version":"1.0.0","_engine":"1.2.3"}
```

### Options

```
--output, -o <path>    Write output to file instead of stdout
--stdout               Force stdout output (explicit, useful in scripts)
--max-errors <N>       Stop after N parse errors (default: unlimited)
                       Use 1 for fail-fast, 0 for unlimited
--schema-version       Emit schema version as first record
--no-position          Omit position information from output
--no-envelope          Omit envelope context (isa_ctrl, gs_ctrl, st_ctrl)
```

### Examples

```bash
# Basic usage - stdout
exactedi parse claims.edi

# Write to file
exactedi parse claims.edi --output claims.jsonl

# Fail-fast mode
exactedi parse claims.edi --max-errors 1

# With schema header for downstream consumers
exactedi parse claims.edi --schema-version > claims.jsonl

# Pipe to jq for filtering
exactedi parse claims.edi | jq 'select(.seg == "NM1")'
```

---

## `validate <file>`

**Purpose:** Validate X12 file structural integrity.

### Contract

| Aspect | Guarantee |
|--------|-----------|
| **Output destination** | stdout by default, file with `--report` |
| **Output format** | Human-readable text (default) or JSON |
| **Exit code 0** | File is valid (no errors, may have warnings) |
| **Exit code 1** | File not found, I/O error, or unrecoverable parse error |
| **Exit code 2** | File parsed but has validation errors |
| **Diagnostic ordering** | Deterministic: sorted by byte offset, then severity |
| **Strictness** | Configurable via `--strict` flag |

### Text Output Format

```
File: claims.edi
Valid: Yes|No
Segments: <count>
Interchanges: <count>
Groups: <count>
Transactions: <count>
Errors: <count>
Warnings: <count>

Diagnostics:
  [ERROR] <code>: <message> at byte <offset>
  [WARN]  <code>: <message> at byte <offset>
```

### JSON Output Schema (v1.0)

```json
{
  "_schema": "exactedi-validation",
  "_version": "1.0.0",
  "file": "string",
  "valid": true|false,
  "summary": {
    "segments": 0,
    "interchanges": 0,
    "groups": 0,
    "transactions": 0,
    "errors": 0,
    "warnings": 0
  },
  "diagnostics": [
    {
      "severity": "error"|"warning",
      "code": "string",
      "message": "string",
      "byte_offset": 0,
      "segment_index": 0
    }
  ]
}
```

### Strictness Levels

| Mode | Behavior |
|------|----------|
| Default | Tolerant of common real-world deviations |
| `--strict` | Enforce exact X12 spec compliance |

**Strict mode enables:**
- Exact segment count verification (SE01, GE01, IEA01)
- Control number matching (ST02/SE02, GS06/GE02, ISA13/IEA02)
- Required segment presence validation

### Options

```
--strict               Enable strict validation mode
--json                 Output as JSON (deprecated, use --format json)
--format <fmt>         Output format: text (default), json
--report <path>        Write report to file
--max-errors <N>       Stop after N errors (default: unlimited)
```

### Examples

```bash
# Basic validation
exactedi validate claims.edi

# Strict mode with JSON output
exactedi validate claims.edi --strict --format json

# Write JSON report to file
exactedi validate claims.edi --format json --report validation.json

# CI/CD integration - fail-fast
exactedi validate claims.edi --strict --max-errors 1
```

---

## `explain <file>`

**Purpose:** Generate PHI-safe Facts JSON summary for analytics and LLM integration.

### Contract

| Aspect | Guarantee |
|--------|-----------|
| **Output destination** | stdout by default, file with `--output` |
| **Output format** | Facts JSON (schema v1.0.0) |
| **Exit code 0** | Facts generated successfully |
| **Exit code 1** | File not found, parse error, I/O error |
| **PHI safety** | HIPAA Safe Harbor compliant - no identifiers |
| **Determinism** | Same input always produces identical output |

### PHI Safety Guarantees

**Included (Safe Harbor compliant):**
- File hash, size, timestamp
- Delimiter characters
- Envelope counts (ISA/GS/ST counts)
- Transaction type counts (837P/837I/837D/835)
- Validation error/warning codes
- CAS group/reason code summaries
- Procedure/diagnosis code statistics (counts only)
- Structural anomaly flags

**Never included:**
- Patient names, DOB, SSN, MRN
- Member IDs, subscriber IDs
- Provider names (NM1 names)
- Free-text fields
- Raw EDI content
- Address information

### Facts JSON Schema (v1.0.0)

See [facts_json_schema.md](facts_json_schema.md) for complete schema.

Root structure:
```json
{
  "schema_version": "1.0.0",
  "engine_version": "1.2.3",
  "file_metadata": { ... },
  "delimiters": { ... },
  "envelope_counts": { ... },
  "transaction_counts": { ... },
  "validation_summary": { ... },
  "cas_summaries": [ ... ],
  "claim_service_counts": { ... },
  "anomalies": { ... }
}
```

### Options

```
--output, -o <path>    Write output to file instead of stdout
--compact              Compact JSON (no pretty-printing)
--phi-audit            Generate PHI audit trail showing what was excluded
```

### PHI Audit Mode (`--phi-audit`)

When enabled, generates an additional audit section showing:
- Count of PHI fields detected and excluded
- Categories of excluded data
- Audit timestamp

```json
{
  "phi_audit": {
    "audit_timestamp": "2024-01-15T10:30:00Z",
    "excluded_counts": {
      "patient_names": 5,
      "member_ids": 5,
      "dates_of_birth": 5,
      "addresses": 3
    },
    "safe_harbor_compliant": true
  }
}
```

### Examples

```bash
# Generate facts to stdout
exactedi explain claims.edi

# Write to file
exactedi explain claims.edi --output claims_facts.json

# With PHI audit trail
exactedi explain claims.edi --phi-audit --output claims_facts.json

# Compact output for APIs
exactedi explain claims.edi --compact
```

---

## `import <file> --db <sqlite>`

**Purpose:** Import parsed X12 data into SQLite database.

### Contract

| Aspect | Guarantee |
|--------|-----------|
| **Database** | SQLite 3.x compatible |
| **Exit code 0** | Import completed successfully |
| **Exit code 1** | File error, database error, import failure |
| **Atomicity** | Transaction-based with configurable batch size |
| **Schema version** | Tracked in database |
| **Duplicates** | Each import creates new entry; caller manages deduplication |

### Database Schema (v1.0)

```sql
-- Imported files
CREATE TABLE files (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    imported_at TEXT NOT NULL,
    facts_json TEXT
);

-- Segments
CREATE TABLE segments (
    id INTEGER PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(id),
    segment_index INTEGER NOT NULL,
    segment_id TEXT NOT NULL,
    elements TEXT NOT NULL,  -- JSON array
    byte_offset INTEGER,
    isa_control TEXT,
    gs_control TEXT,
    st_control TEXT
);

-- Indexes
CREATE INDEX idx_segments_file ON segments(file_id);
CREATE INDEX idx_segments_id ON segments(segment_id);
```

### Options

```
--db, -d <path>        SQLite database file (required)
--batch-size <N>       Segments per transaction (default: 1000)
--schema-version       Print schema version and exit
--help, -h             Show help message
```

### Examples

```bash
# Basic import
exactedi import claims.edi --db warehouse.db

# Batch import with larger transactions
exactedi import claims.edi --db warehouse.db --batch-size 5000

# Check schema version
exactedi import --schema-version
```

---

## `normalize <file> --out <dir>`

**Purpose:** Parse X12 file and output normalized structured files.

### Contract

| Aspect | Guarantee |
|--------|-----------|
| **Output** | Directory containing normalized files |
| **Exit code 0** | Normalization completed successfully |
| **Exit code 1** | File error, output error |
| **Determinism** | Same input always produces identical output |

### Normalization Modes

| Mode | Description | Output Files |
|------|-------------|--------------|
| `full` (default) | JSONL segments + Facts JSON | `{name}.jsonl`, `{name}_facts.json` |
| `segments` | JSONL segments only | `{name}.jsonl` |
| `split-transactions` | One file per transaction | `{name}_tx_{ctrl}.jsonl` |

### Output File Naming

```
Input: /path/to/claims.edi
Output directory: /output/

Mode: full (default)
  /output/claims.jsonl
  /output/claims_facts.json

Mode: split-transactions
  /output/claims_tx_0001.jsonl
  /output/claims_tx_0002.jsonl
  ...
  /output/claims_manifest.json  # Index of all transactions
```

### Manifest Schema (split-transactions mode)

```json
{
  "source_file": "claims.edi",
  "source_size": 12345,
  "transaction_count": 5,
  "transactions": [
    {
      "control_number": "0001",
      "type": "837",
      "output_file": "claims_tx_0001.jsonl",
      "segment_count": 45
    }
  ]
}
```

### Options

```
--out, -o <dir>        Output directory (required)
--mode <mode>          Normalization mode: full, segments, split-transactions
--schema-version       Include schema version headers in output
```

### Examples

```bash
# Default: JSONL + Facts JSON
exactedi normalize claims.edi --out ./normalized/

# Segments only
exactedi normalize claims.edi --out ./normalized/ --mode segments

# Split by transaction
exactedi normalize claims.edi --out ./normalized/ --mode split-transactions
```

---

## Version Compatibility

### Schema Version Policy

- **Major version**: Breaking changes to output structure
- **Minor version**: New optional fields (backward compatible)
- **Patch version**: Bug fixes only

### Current Versions

| Schema | Version | Status |
|--------|---------|--------|
| JSONL | 1.0.0 | Stable |
| Facts JSON | 1.0.0 | Stable |
| Validation JSON | 1.0.0 | Stable |
| SQLite Schema | 1.0 | Stable |

---

## Error Codes Reference

### Parse Errors (P-xxx)

| Code | Description |
|------|-------------|
| P-001 | Invalid ISA segment (missing or malformed) |
| P-002 | Delimiter detection failed |
| P-003 | Unexpected end of file |
| P-004 | Segment too long |
| P-005 | Invalid character in segment |

### Validation Errors (V-xxx)

| Code | Description |
|------|-------------|
| V-001 | Missing required segment |
| V-002 | Segment count mismatch (SE01) |
| V-003 | Group count mismatch (GE01) |
| V-004 | Interchange count mismatch (IEA01) |
| V-005 | Control number mismatch |
| V-006 | Unclosed envelope |
| V-007 | Unexpected segment |

### Validation Warnings (W-xxx)

| Code | Description |
|------|-------------|
| W-001 | Non-standard delimiter |
| W-002 | Empty transaction set |
| W-003 | Duplicate control number |
| W-004 | Segment count approximate |

---

## CI/CD Integration

### Exit Code Summary

```bash
# Validate before processing
exactedi validate claims.edi --strict
if [ $? -eq 0 ]; then
    echo "Valid"
elif [ $? -eq 1 ]; then
    echo "Error (file/parse issue)"
elif [ $? -eq 2 ]; then
    echo "Invalid (structural issues)"
fi
```

### JSON Output for Automation

```bash
# Parse JSON output for downstream processing
result=$(exactedi validate claims.edi --format json)
valid=$(echo "$result" | jq -r '.valid')
errors=$(echo "$result" | jq -r '.summary.errors')
```
