# Database Schema Reference

This document describes the SQLite database schema used by ExactEDI's import feature.

## Overview

The import feature provides persistent storage for parsed X12 data in a local SQLite database. All stored data is PHI-safe and contains only structural metadata, statistical summaries, and validation results. Patient identifiers, provider names, and other protected health information are never persisted.

### Purpose

The database enables:

- **Historical analysis** of EDI file characteristics over time
- **Error trending** across multiple file imports
- **Transaction statistics** for billing and remittance patterns
- **Adjustment code analysis** for 835 remittance files
- **Deduplication detection** via SHA-256 file hashing

### Typical Use Cases

**Quality Monitoring**
Track validation error rates over time to identify deteriorating data quality or partner configuration issues.

**Statistical Analysis**
Aggregate transaction volumes, charge amounts, and payment patterns across multiple file imports for trending and forecasting.

**Adjustment Code Reporting**
Analyze 835 remittance adjustment codes (CAS segments) to identify common denial reasons and payment adjustments.

**File Provenance**
Maintain an audit trail of processed files with cryptographic hashes to detect duplicate imports or file modifications.

## Schema Version

Current schema version: **1**

Schema migrations are applied automatically when opening a database with `run_migrations: true` (default).

## Table Definitions

### schema_version

Tracks applied schema migrations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `version` | INTEGER | PRIMARY KEY | Schema version number |
| `applied_at` | TEXT | NOT NULL | ISO 8601 timestamp when migration was applied |

**Example:**
```sql
version | applied_at
--------|---------------------
1       | 2026-01-13T19:30:00Z
```

### import_runs

Records metadata for each file import session.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique import run identifier |
| `source_file` | TEXT | NOT NULL | Original file path (filename only, no directory) |
| `sha256_hash` | TEXT | | SHA-256 hash of file contents (hex-encoded, 64 characters) |
| `file_size_bytes` | INTEGER | NOT NULL | File size in bytes |
| `imported_at` | TEXT | NOT NULL | ISO 8601 timestamp of import |
| `interchange_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of ISA/IEA envelopes |
| `group_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of GS/GE envelopes |
| `transaction_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of ST/SE transactions |
| `segment_count` | INTEGER | NOT NULL, DEFAULT 0 | Total segment count |
| `error_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of validation errors |
| `warning_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of validation warnings |
| `is_valid` | INTEGER | NOT NULL, DEFAULT 0 | 1 if file passed validation, 0 otherwise |

**Indexes:**
- `idx_import_runs_source` on `source_file`
- `idx_import_runs_hash` on `sha256_hash`

**Notes:**
- `source_file` stores only the filename, not the full path, to avoid exposing directory structures
- `sha256_hash` enables duplicate detection: `SELECT * FROM import_runs WHERE sha256_hash = ?`
- `is_valid` is a boolean stored as INTEGER (0 or 1) per SQLite conventions

**Example:**
```sql
id  | source_file       | sha256_hash                      | file_size_bytes | is_valid
----|-------------------|----------------------------------|-----------------|----------
1   | claims_batch.x12  | a3f5e2...                        | 524288          | 1
2   | remit_20260113.x12| 7b9c1d...                        | 1048576         | 1
```

### tx_summary

Stores per-transaction statistics. One row per ST/SE transaction set.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique transaction record ID |
| `run_id` | INTEGER | NOT NULL, FOREIGN KEY | References `import_runs(id)` |
| `transaction_type` | TEXT | NOT NULL | Transaction set identifier: "837P", "837I", "837D", "835", etc. |
| `control_number` | TEXT | NOT NULL | ST02/SE02 control number |
| `start_segment` | INTEGER | NOT NULL | Zero-indexed segment position of ST |
| `end_segment` | INTEGER | NOT NULL | Zero-indexed segment position of SE |
| `segment_count` | INTEGER | NOT NULL | Number of segments in transaction (SE01 value) |
| `is_complete` | INTEGER | NOT NULL, DEFAULT 0 | 1 if SE segment present, 0 if missing |
| `counts_match` | INTEGER | NOT NULL, DEFAULT 0 | 1 if SE01 matches actual segment count, 0 if mismatch |
| `claim_count` | INTEGER | NOT NULL, DEFAULT 0 | Heuristic claim count (number of CLM/CLP segments) |
| `service_line_count` | INTEGER | NOT NULL, DEFAULT 0 | Service line count (SV1/SV2 segments for 837, SVC for 835) |
| `total_charge` | REAL | NOT NULL, DEFAULT 0.0 | Sum of billed amounts |
| `total_payment` | REAL | NOT NULL, DEFAULT 0.0 | Sum of paid amounts (835 only) |

**Indexes:**
- `idx_tx_summary_run` on `run_id`
- `idx_tx_summary_type` on `transaction_type`

**Foreign Key Constraints:**
- `run_id` references `import_runs(id)` with `ON DELETE CASCADE`

**Notes:**
- `transaction_type` is extracted from ST01 and refined using BHT segment data (e.g., "837P" vs "837I")
- `is_complete` and `counts_match` enable validation error analysis
- Financial fields (`total_charge`, `total_payment`) are stored as REAL (floating-point)
- For 837 files, `total_payment` is typically 0.0 (claims, not remittances)

**Example:**
```sql
id | run_id | transaction_type | control_number | claim_count | total_charge
---|--------|------------------|----------------|-------------|-------------
1  | 1      | 837P             | 0001           | 25          | 12500.00
2  | 1      | 837P             | 0002           | 30          | 18750.50
3  | 2      | 835              | 0001           | 120         | 0.00
```

### errors

Validation errors and warnings encountered during file processing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique error record ID |
| `run_id` | INTEGER | NOT NULL, FOREIGN KEY | References `import_runs(id)` |
| `severity` | TEXT | NOT NULL | "error" or "warning" |
| `code` | TEXT | NOT NULL | Error code identifier (e.g., "MISSING_SE", "SEGMENT_COUNT_MISMATCH") |
| `message` | TEXT | NOT NULL | Human-readable error description |
| `segment_index` | INTEGER | NOT NULL, DEFAULT 0 | Zero-indexed segment position where error occurred |
| `segment_tag` | TEXT | | Segment identifier (e.g., "ST", "SE", "CLM") |

**Indexes:**
- `idx_errors_run` on `run_id`
- `idx_errors_code` on `code`

**Foreign Key Constraints:**
- `run_id` references `import_runs(id)` with `ON DELETE CASCADE`

**Notes:**
- `severity` distinguishes between blocking errors and informational warnings
- `code` enables programmatic error filtering and trending
- `segment_index` corresponds to the zero-indexed segment position in the file

**Example:**
```sql
id | run_id | severity | code                     | message                                  | segment_index
---|--------|----------|--------------------------|------------------------------------------|---------------
1  | 1      | error    | MISSING_SE               | Transaction 0001 is missing SE           | 47
2  | 1      | error    | SEGMENT_COUNT_MISMATCH   | SE01=45, actual=44                       | 48
3  | 2      | warning  | CONTROL_NUMBER_GAP       | Gap in control numbers: 0002 -> 0004     | 150
```

### adjustments_835

Aggregated adjustment data from 835 remittance CAS segments. Only populated for 835 transaction types.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique adjustment record ID |
| `run_id` | INTEGER | NOT NULL, FOREIGN KEY | References `import_runs(id)` |
| `group_code` | TEXT | NOT NULL | CAS group code: "CO", "CR", "OA", "PI", "PR" |
| `group_name` | TEXT | NOT NULL | Human-readable group name |
| `reason_code` | TEXT | NOT NULL | CARC reason code (e.g., "1", "45", "97") |
| `occurrence_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of times this adjustment appeared |
| `total_amount` | REAL | NOT NULL, DEFAULT 0.0 | Sum of adjustment amounts |

**Indexes:**
- `idx_adjustments_run` on `run_id`
- `idx_adjustments_group` on `(group_code, reason_code)`

**Foreign Key Constraints:**
- `run_id` references `import_runs(id)` with `ON DELETE CASCADE`

**Notes:**
- Adjustment codes are aggregated per import run (not per transaction or claim)
- `group_code` values:
  - "CO" - Contractual Obligation
  - "CR" - Correction and Reversals
  - "OA" - Other Adjustments
  - "PI" - Payer Initiated Reductions
  - "PR" - Patient Responsibility
- `group_name` is populated from the CAS segment lookup table
- `reason_code` is the CARC (Claim Adjustment Reason Code)

**Example:**
```sql
id | run_id | group_code | group_name                  | reason_code | occurrence_count | total_amount
---|--------|------------|-----------------------------|----|------------------|-------------
1  | 2      | PR         | Patient Responsibility      | 1  | 45               | 3250.00
2  | 2      | CO         | Contractual Obligation      | 45 | 120              | 8900.50
3  | 2      | CR         | Correction and Reversals    | 97 | 3                | 150.00
```

## Table Relationships

### Entity-Relationship Diagram

```
import_runs (1) ----< (N) tx_summary
     |
     +-------------< (N) errors
     |
     +-------------< (N) adjustments_835
```

### Referential Integrity

All child tables use `ON DELETE CASCADE` foreign key constraints:

- Deleting an `import_runs` record automatically deletes all associated `tx_summary`, `errors`, and `adjustments_835` records
- SQLite foreign key enforcement is enabled via `PRAGMA foreign_keys = ON` (set automatically by ExactEDI)

### Query Implications

**Joining import runs with transactions:**
```sql
SELECT r.source_file, t.transaction_type, COUNT(*) as tx_count
FROM import_runs r
JOIN tx_summary t ON t.run_id = r.id
GROUP BY r.source_file, t.transaction_type;
```

**Finding all errors for a specific file:**
```sql
SELECT e.code, e.message, e.segment_index
FROM import_runs r
JOIN errors e ON e.run_id = r.id
WHERE r.source_file = 'claims_batch.x12';
```

## Common Query Examples

### Import History

**List all imports with summary statistics:**
```sql
SELECT
    id,
    source_file,
    imported_at,
    transaction_count,
    segment_count,
    error_count,
    CASE WHEN is_valid = 1 THEN 'Valid' ELSE 'Invalid' END as status
FROM import_runs
ORDER BY imported_at DESC;
```

**Find duplicate files by hash:**
```sql
SELECT sha256_hash, COUNT(*) as import_count, GROUP_CONCAT(source_file) as files
FROM import_runs
WHERE sha256_hash IS NOT NULL
GROUP BY sha256_hash
HAVING COUNT(*) > 1;
```

### Transaction Analysis

**Count transactions by type:**
```sql
SELECT transaction_type, COUNT(*) as count, SUM(claim_count) as total_claims
FROM tx_summary
GROUP BY transaction_type
ORDER BY count DESC;
```

**Average charges per claim by transaction type:**
```sql
SELECT
    transaction_type,
    COUNT(*) as transaction_count,
    ROUND(AVG(total_charge), 2) as avg_charge,
    ROUND(SUM(total_charge), 2) as total_charges
FROM tx_summary
WHERE claim_count > 0
GROUP BY transaction_type;
```

**Identify incomplete transactions:**
```sql
SELECT r.source_file, t.control_number, t.transaction_type
FROM tx_summary t
JOIN import_runs r ON r.id = t.run_id
WHERE t.is_complete = 0 OR t.counts_match = 0;
```

### Error Analysis

**Most common validation errors:**
```sql
SELECT code, COUNT(*) as occurrence_count, severity
FROM errors
GROUP BY code, severity
ORDER BY occurrence_count DESC
LIMIT 10;
```

**Error rates by file:**
```sql
SELECT
    r.source_file,
    r.segment_count,
    COUNT(e.id) as error_count,
    ROUND(COUNT(e.id) * 1.0 / r.segment_count * 100, 2) as error_rate_pct
FROM import_runs r
LEFT JOIN errors e ON e.run_id = r.id AND e.severity = 'error'
GROUP BY r.id
ORDER BY error_rate_pct DESC;
```

**Error trends over time:**
```sql
SELECT
    DATE(imported_at) as import_date,
    COUNT(DISTINCT r.id) as file_count,
    SUM(r.error_count) as total_errors,
    ROUND(AVG(r.error_count * 1.0 / r.segment_count) * 100, 2) as avg_error_rate
FROM import_runs r
WHERE imported_at >= DATE('now', '-30 days')
GROUP BY DATE(imported_at)
ORDER BY import_date;
```

### Adjustment Analysis (835 Remittances)

**Top denial reasons by total amount:**
```sql
SELECT
    group_code,
    group_name,
    reason_code,
    occurrence_count,
    ROUND(total_amount, 2) as total_amount,
    ROUND(total_amount / occurrence_count, 2) as avg_amount
FROM adjustments_835
ORDER BY total_amount DESC
LIMIT 20;
```

**Patient responsibility breakdown:**
```sql
SELECT
    reason_code,
    occurrence_count,
    ROUND(total_amount, 2) as total_amount,
    ROUND(total_amount * 100.0 / SUM(total_amount) OVER (), 2) as pct_of_total
FROM adjustments_835
WHERE group_code = 'PR'
ORDER BY total_amount DESC;
```

**Adjustment summary by group code:**
```sql
SELECT
    group_code,
    group_name,
    SUM(occurrence_count) as total_occurrences,
    ROUND(SUM(total_amount), 2) as total_amount
FROM adjustments_835
GROUP BY group_code, group_name
ORDER BY total_amount DESC;
```

### Combined Analysis

**File processing summary with error details:**
```sql
SELECT
    r.source_file,
    r.imported_at,
    r.transaction_count,
    r.segment_count,
    CASE WHEN r.is_valid = 1 THEN 'Valid' ELSE 'Invalid' END as status,
    COUNT(DISTINCT e.code) as unique_error_types,
    r.error_count as total_errors
FROM import_runs r
LEFT JOIN errors e ON e.run_id = r.id AND e.severity = 'error'
GROUP BY r.id
ORDER BY r.imported_at DESC;
```

**837 vs 835 comparison:**
```sql
SELECT
    SUBSTR(transaction_type, 1, 3) as tx_family,
    COUNT(*) as transaction_count,
    SUM(claim_count) as total_claims,
    SUM(service_line_count) as total_service_lines,
    ROUND(SUM(total_charge), 2) as total_charges,
    ROUND(SUM(total_payment), 2) as total_payments
FROM tx_summary
GROUP BY tx_family;
```

## Performance Optimization

### Index Usage

All common query patterns are covered by existing indexes:

- Lookups by `source_file`: Uses `idx_import_runs_source`
- Duplicate detection by hash: Uses `idx_import_runs_hash`
- Transaction filtering by type: Uses `idx_tx_summary_type`
- Error code trending: Uses `idx_errors_code`
- Adjustment grouping: Uses `idx_adjustments_group`

### Query Performance Tips

**Use covering indexes when possible:**
```sql
-- Good: Uses idx_tx_summary_type
SELECT transaction_type, COUNT(*) FROM tx_summary GROUP BY transaction_type;

-- Better: Add needed columns to reduce row lookups
CREATE INDEX idx_tx_type_charge ON tx_summary(transaction_type, total_charge);
```

**Avoid full table scans on large datasets:**
```sql
-- Inefficient for large tables
SELECT * FROM tx_summary WHERE total_charge > 1000;

-- Better: Filter by indexed run_id first
SELECT * FROM tx_summary
WHERE run_id IN (SELECT id FROM import_runs WHERE imported_at > '2026-01-01')
  AND total_charge > 1000;
```

**Use EXPLAIN QUERY PLAN to verify index usage:**
```sql
EXPLAIN QUERY PLAN
SELECT * FROM errors WHERE code = 'MISSING_SE';
-- Should show: SEARCH errors USING INDEX idx_errors_code (code=?)
```

### Write-Ahead Logging (WAL)

WAL mode is enabled by default (`journal_mode=WAL`), which provides:

- Better concurrency: Readers don't block writers
- Improved performance for write-heavy workloads
- Atomic commits across multiple tables

**Trade-off:** Creates additional `-wal` and `-shm` files alongside the database file.

**Checkpoint control:**
```sql
-- Manually checkpoint WAL to main database
PRAGMA wal_checkpoint(TRUNCATE);
```

### Vacuum and Maintenance

After deleting many import runs:

```sql
-- Reclaim disk space and rebuild indexes
VACUUM;

-- Analyze table statistics for query planner
ANALYZE;
```

## Schema Migration

ExactEDI automatically manages schema migrations when opening a database. The current schema version is tracked in the `schema_version` table.

### Manual Schema Inspection

**Check current schema version:**
```sql
SELECT version, applied_at FROM schema_version ORDER BY version DESC LIMIT 1;
```

**View table structure:**
```sql
.schema import_runs
.schema tx_summary
.schema errors
.schema adjustments_835
```

**List all indexes:**
```sql
SELECT name, tbl_name, sql
FROM sqlite_master
WHERE type = 'index' AND tbl_name NOT LIKE 'sqlite_%';
```

### Future Schema Versions

Schema migrations are applied sequentially. When schema version 2 is released, databases at version 1 will automatically upgrade when opened with `run_migrations: true`.

Migration scripts preserve all existing data and maintain backward compatibility for read operations.

## Data Retention

ExactEDI does not automatically delete old import records. Implement retention policies as needed:

**Delete imports older than 90 days:**
```sql
DELETE FROM import_runs
WHERE imported_at < DATE('now', '-90 days');
-- CASCADE deletes associated tx_summary, errors, and adjustments_835 records
```

**Archive old data:**
```sql
-- Export to separate database
ATTACH DATABASE 'archive_2025.db' AS archive;

INSERT INTO archive.import_runs
SELECT * FROM import_runs
WHERE imported_at BETWEEN '2025-01-01' AND '2025-12-31';

-- Repeat for tx_summary, errors, adjustments_835

-- Delete from main database
DELETE FROM import_runs
WHERE imported_at BETWEEN '2025-01-01' AND '2025-12-31';

DETACH DATABASE archive;
```

## Limitations

### No PHI Storage

By design, the database schema excludes all PHI fields:

**Not stored:**
- Patient names, dates of birth, SSNs
- Provider names and addresses (only NPIs)
- Specific diagnosis codes (only counts)
- Specific procedure codes (only counts)
- Claim-level detail beyond summary statistics

**Stored (PHI-safe):**
- Transaction counts and types
- Financial totals and averages
- Validation error types and frequencies
- Adjustment code aggregations

### Statistical Summaries Only

The schema stores aggregated transaction-level data, not segment-level detail. To analyze individual claims or service lines, parse the original X12 file using the `parse` or `explain` commands.

### No Real-Time Queries

The database is populated during import operations. Changes to source X12 files are not reflected in the database unless re-imported.

## Integration Examples

### Python

```python
import sqlite3

conn = sqlite3.connect('analytics.db')
cursor = conn.cursor()

# Find all 837P transactions with high charges
cursor.execute('''
    SELECT r.source_file, t.control_number, t.total_charge
    FROM tx_summary t
    JOIN import_runs r ON r.id = t.run_id
    WHERE t.transaction_type = '837P' AND t.total_charge > 10000
    ORDER BY t.total_charge DESC
''')

for row in cursor.fetchall():
    print(f"{row[0]}: Transaction {row[1]} - ${row[2]:,.2f}")

conn.close()
```

### Shell Script

```bash
#!/bin/bash
# Daily import and error report

db_path="analytics.db"
today=$(date +%Y-%m-%d)

# Import today's files
for file in /data/incoming/*.x12; do
    exactedi import "$file" --db "$db_path"
done

# Generate error report
sqlite3 "$db_path" <<EOF
SELECT
    code,
    COUNT(*) as count,
    GROUP_CONCAT(DISTINCT source_file) as files
FROM errors e
JOIN import_runs r ON r.id = e.run_id
WHERE DATE(r.imported_at) = '$today'
  AND severity = 'error'
GROUP BY code
ORDER BY count DESC;
EOF
```

## Support

For schema-related questions or feature requests:

- Professional tier: support@exactedi.com
- Enterprise tier: Use dedicated support channel
- Include database schema version and query examples when reporting issues
