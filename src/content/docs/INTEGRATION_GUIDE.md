# Integration Guide

This guide describes how to consume ExactEDI output in downstream systems, ETL pipelines, and analytics platforms.

## Overview

ExactEDI provides three primary output formats for integration:

| Format | Command | Use Case |
|--------|---------|----------|
| **JSONL** | `parse` | Segment-level streaming data for detailed analysis |
| **Facts JSON** | `explain` | PHI-safe transaction summaries for analytics and AI |
| **SQLite** | `import` | Persistent storage for historical analysis |

This guide focuses on JSONL and Facts JSON formats. For SQLite integration, see [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

## JSONL Output Format (parse command)

The `parse` command outputs line-delimited JSON (JSONL), with one JSON object per segment.

### File Layout

Each line is a complete JSON object representing a single X12 segment. Files can be processed incrementally without loading the entire dataset into memory.

```
{"seg":"ISA","elem":[...],"pos":{...}}
{"seg":"GS","elem":[...],"pos":{...}}
{"seg":"ST","elem":[...],"pos":{...}}
...
{"seg":"SE","elem":[...],"pos":{...}}
{"seg":"GE","elem":[...],"pos":{...}}
{"seg":"IEA","elem":[...],"pos":{...}}
```

### Record Structure

Each JSONL record contains three fields:

| Field | Type | Description |
|-------|------|-------------|
| `seg` | string | Segment identifier (ISA, GS, ST, CLM, CLP, etc.) |
| `elem` | array | Array of element values (strings) in segment order |
| `pos` | object | Position metadata |

### Position Metadata

The `pos` object provides location information for traceability:

| Field | Type | Description |
|-------|------|-------------|
| `idx` | integer | Zero-indexed segment position in file |
| `byte` | integer | Byte offset of segment start |

### Element Array

The `elem` array contains segment elements in their original order, preserving:

- Leading/trailing whitespace (for fixed-length fields like ISA)
- Empty elements (represented as empty strings)
- Component separators (embedded in element strings, not split)

**Example ISA Segment:**
```json
{
  "seg": "ISA",
  "elem": [
    "00",
    "          ",
    "00",
    "          ",
    "ZZ",
    "PAYER835       ",
    "ZZ",
    "PROVIDER835    ",
    "230220",
    "1100",
    "^",
    "00501",
    "000000005",
    "0",
    "P",
    ":"
  ],
  "pos": {
    "byte": 0,
    "idx": 0
  }
}
```

**Example CLM Segment (837P Claim):**
```json
{
  "seg": "CLM",
  "elem": [
    "CLM0001",
    "1500.00",
    "",
    "",
    "11:B:1",
    "Y",
    "A",
    "Y",
    "Y"
  ],
  "pos": {
    "byte": 2048,
    "idx": 42
  }
}
```

### Streaming Characteristics

**Memory Efficiency:**
JSONL output is streamed line-by-line. Files of any size can be processed with constant memory usage by reading one line at a time.

**Deterministic Ordering:**
Segments appear in the exact order they occur in the source X12 file.

**No Lookahead:**
Each segment is output immediately after parsing. No buffering or transaction grouping occurs.

### Common Use Cases

**Filter Specific Segments:**
Extract only CLM (claim header) segments for claim-level analysis.

**Transaction Boundary Detection:**
Identify ST/SE pairs to group segments into transactions.

**Element Extraction:**
Parse specific element positions for targeted data extraction (e.g., NPI from NM109).

## Facts JSON Format (explain command)

The `explain` command outputs a single JSON object containing PHI-safe summaries of the entire file.

### Schema Version

Current schema: **1.0.0**

The `schema_version` field in the output indicates the format version. Consumers should validate this field and handle unknown versions gracefully.

### Root Object Structure

```json
{
  "file": { /* file metadata */ },
  "counts": { /* envelope counts */ },
  "transactions": [ /* transaction summaries */ ],
  "validation": { /* error/warning summary */ }
}
```

### File Metadata

```json
{
  "file": {
    "filename": "enhanced_835.x12",
    "file_size": 663,
    "parse_timestamp": "2026-01-14T00:59:31Z"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filename` | string | Yes | Original filename (no path) |
| `file_size` | integer | Yes | File size in bytes |
| `parse_timestamp` | string | Yes | ISO 8601 UTC timestamp when file was parsed |

### Envelope Counts

```json
{
  "counts": {
    "interchanges": 1,
    "groups": 1,
    "transactions": 1,
    "segments": 16
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `interchanges` | integer | Yes | Number of ISA/IEA envelope pairs |
| `groups` | integer | Yes | Number of GS/GE envelope pairs |
| `transactions` | integer | Yes | Number of ST/SE transaction sets |
| `segments` | integer | Yes | Total segment count |

### Transaction Summaries

The `transactions` array contains one object per transaction set (ST/SE pair):

```json
{
  "transactions": [
    {
      "type": "835",
      "claim_id": "CLM0001",
      "claim_status": "1",
      "group_control": "5",
      "interchange_control": "000000005",
      "transaction_control": "0005",
      "original_reference": "TRC0987654321",
      "payer_id": "MEGAPAYER123",
      "payer_name": "MEGA INSURANCE",
      "billing_provider_npi": "1112223333",
      "total_charge": 1250.0,
      "total_payment": 600.0,
      "patient_responsibility": 650.0,
      "service_line_count": 2,
      "procedure_codes": ["99213", "99214"]
    }
  ]
}
```

#### Common Transaction Fields

| Field | Type | Tx Types | Description |
|-------|------|----------|-------------|
| `type` | string | All | Transaction type: "837P", "837I", "837D", "835" |
| `transaction_control` | string | All | ST02/SE02 control number |
| `group_control` | string | All | GS06/GE02 control number |
| `interchange_control` | string | All | ISA13/IEA02 control number |
| `claim_id` | string | All | CLM01 (837) or CLP01 (835) |
| `total_charge` | number | All | Sum of billed amounts |
| `total_payment` | number | 835 | Sum of paid amounts (0.0 for 837) |
| `patient_responsibility` | number | 835 | Patient responsibility amount |
| `service_line_count` | integer | All | Number of service lines (SV1/SV2/SVC) |

#### 837-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| `billing_provider_npi` | string | NPI from 2010AA loop NM109 |
| `payer_id` | string | Payer identifier from 2010BB loop NM109 |
| `payer_name` | string | Payer name from 2010BB loop NM103 |
| `place_of_service` | string | CLM05-1 (837P) or CLM05 (837I) |
| `diagnosis_codes` | array[string] | ICD-10 codes from HI segments |
| `procedure_codes` | array[string] | CPT/HCPCS codes from SV1/SV2 segments |
| `service_dates` | array[string] | Date ranges from DTP segments (YYYYMMDD-YYYYMMDD) |
| `original_reference` | string | REF segment reference numbers |

#### 835-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| `claim_status` | string | CLP02 status code ("1" = processed as primary, "2" = processed as secondary, etc.) |
| `original_reference` | string | Patient control number or trace number |
| `procedure_codes` | array[string] | Procedure codes from SVC segments |

### Validation Summary

```json
{
  "validation": {
    "errors": 0,
    "warnings": 0
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `errors` | integer | Yes | Count of validation errors |
| `warnings` | integer | Yes | Count of validation warnings |

When errors or warnings are present, a `diagnostics` array is added:

```json
{
  "validation": {
    "errors": 1,
    "warnings": 0
  },
  "diagnostics": [
    "[ERROR] SEGMENT_COUNT_MISMATCH: SE01=11, actual=10 (segment #11, byte offset 486)"
  ]
}
```

### Optional Fields

The following fields appear only when relevant data is present:

- `diagnosis_codes` - Only for 837 transactions with HI segments
- `procedure_codes` - Only when SV1/SV2/SVC segments contain parseable codes
- `service_dates` - Only when DTP segments are present
- `diagnostics` - Only when errors or warnings exist

### PHI Safety

Facts JSON excludes all protected health information:

**Not Included:**
- Patient names, dates of birth, addresses
- Medical record numbers (MRNs)
- Social Security Numbers
- Subscriber/member IDs
- Account numbers
- Free-text descriptions

**Included (PHI-safe):**
- Control numbers (ISA/GS/ST)
- Payer and provider NPIs
- Organization names (payers, providers)
- Service dates (not patient DOB)
- Diagnosis and procedure codes
- Monetary amounts

### Versioning Considerations

The schema follows semantic versioning:

- **Major version change (2.0.0):** Breaking changes, field renames, structure changes
- **Minor version change (1.1.0):** New optional fields added
- **Patch version change (1.0.1):** Documentation updates, no schema changes

**Backward Compatibility:**
Consumers should ignore unknown fields to remain compatible with minor and patch updates.

**Version Detection:**
Check the `schema_version` field (if present) or inspect the structure:

```python
facts = json.loads(facts_json)
schema_version = facts.get("schema_version", "1.0.0")

if schema_version.startswith("1."):
    # Compatible with 1.x schema
    process_v1_facts(facts)
else:
    # Unknown schema version
    raise ValueError(f"Unsupported schema version: {schema_version}")
```

## Integration Examples

### Python: Processing JSONL Output

**Streaming Segment Parser:**

```python
import json
import sys

def process_jsonl(file_path):
    """Process JSONL output line-by-line with constant memory usage."""

    segment_counts = {}

    with open(file_path, 'r') as f:
        for line_num, line in enumerate(f, 1):
            try:
                record = json.loads(line)

                seg_id = record['seg']
                segment_counts[seg_id] = segment_counts.get(seg_id, 0) + 1

                # Process specific segments
                if seg_id == 'CLM':
                    claim_id = record['elem'][0]
                    charge = float(record['elem'][1])
                    print(f"Claim {claim_id}: ${charge:.2f}")

                elif seg_id == 'CLP':
                    claim_id = record['elem'][0]
                    status = record['elem'][1]
                    payment = float(record['elem'][3])
                    print(f"Payment {claim_id}: ${payment:.2f} (status {status})")

            except json.JSONDecodeError as e:
                print(f"Error parsing line {line_num}: {e}", file=sys.stderr)
            except (KeyError, IndexError, ValueError) as e:
                print(f"Error processing line {line_num}: {e}", file=sys.stderr)

    print("\nSegment Counts:")
    for seg_id, count in sorted(segment_counts.items()):
        print(f"  {seg_id}: {count}")

# Usage
process_jsonl('claims.jsonl')
```

**Extract Transactions:**

```python
import json

def extract_transactions(jsonl_path):
    """Group segments by transaction (ST/SE pairs)."""

    transactions = []
    current_tx = None

    with open(jsonl_path, 'r') as f:
        for line in f:
            record = json.loads(line)
            seg_id = record['seg']

            if seg_id == 'ST':
                # Start new transaction
                current_tx = {
                    'type': record['elem'][0],
                    'control': record['elem'][1],
                    'segments': [record]
                }
            elif seg_id == 'SE':
                # End transaction
                if current_tx:
                    current_tx['segments'].append(record)
                    transactions.append(current_tx)
                    current_tx = None
            elif current_tx:
                # Add segment to current transaction
                current_tx['segments'].append(record)

    return transactions

# Usage
transactions = extract_transactions('claims.jsonl')
for tx in transactions:
    print(f"Transaction {tx['control']} (type {tx['type']}): {len(tx['segments'])} segments")
```

**Filter and Transform:**

```python
import json
import sys

def extract_npis(jsonl_path, output_csv):
    """Extract provider NPIs from NM1 segments."""

    with open(jsonl_path, 'r') as infile, open(output_csv, 'w') as outfile:
        outfile.write("segment_index,entity_type,npi\n")

        for line in infile:
            record = json.loads(line)

            if record['seg'] == 'NM1':
                elem = record['elem']

                # NM108 = ID code qualifier, NM109 = ID code
                if len(elem) >= 9 and elem[7] == 'XX':
                    entity_type = elem[0]  # NM101
                    npi = elem[8]          # NM109
                    idx = record['pos']['idx']

                    outfile.write(f"{idx},{entity_type},{npi}\n")

# Usage
extract_npis('claims.jsonl', 'npis.csv')
```

### Python: Processing Facts JSON

**Basic Analysis:**

```python
import json

def analyze_facts(facts_path):
    """Analyze Facts JSON for summary statistics."""

    with open(facts_path, 'r') as f:
        facts = json.load(f)

    print(f"File: {facts['file']['filename']}")
    print(f"Size: {facts['file']['file_size']:,} bytes")
    print(f"Parsed: {facts['file']['parse_timestamp']}")
    print()

    counts = facts['counts']
    print(f"Segments: {counts['segments']:,}")
    print(f"Transactions: {counts['transactions']}")
    print(f"Groups: {counts['groups']}")
    print(f"Interchanges: {counts['interchanges']}")
    print()

    validation = facts['validation']
    print(f"Errors: {validation['errors']}")
    print(f"Warnings: {validation['warnings']}")

    if 'diagnostics' in facts:
        print("\nDiagnostics:")
        for diag in facts['diagnostics']:
            print(f"  {diag}")
    print()

    # Analyze transactions
    total_charge = 0.0
    total_payment = 0.0

    for tx in facts.get('transactions', []):
        tx_type = tx['type']
        charge = tx.get('total_charge', 0.0)
        payment = tx.get('total_payment', 0.0)

        total_charge += charge
        total_payment += payment

        print(f"{tx_type} Transaction {tx['transaction_control']}:")
        print(f"  Claim ID: {tx.get('claim_id', 'N/A')}")
        print(f"  Charge: ${charge:,.2f}")
        print(f"  Payment: ${payment:,.2f}")

        if 'procedure_codes' in tx:
            print(f"  Procedures: {', '.join(tx['procedure_codes'])}")

    print()
    print(f"Totals: ${total_charge:,.2f} charged, ${total_payment:,.2f} paid")

# Usage
analyze_facts('facts.json')
```

**ETL Pipeline Integration:**

```python
import json
import psycopg2
from datetime import datetime

def load_facts_to_postgres(facts_path, db_conn):
    """Load Facts JSON into PostgreSQL data warehouse."""

    with open(facts_path, 'r') as f:
        facts = json.load(f)

    cursor = db_conn.cursor()

    # Insert file record
    cursor.execute("""
        INSERT INTO edi_files (filename, file_size, parsed_at, segment_count, is_valid)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """, (
        facts['file']['filename'],
        facts['file']['file_size'],
        facts['file']['parse_timestamp'],
        facts['counts']['segments'],
        facts['validation']['errors'] == 0
    ))

    file_id = cursor.fetchone()[0]

    # Insert transactions
    for tx in facts.get('transactions', []):
        cursor.execute("""
            INSERT INTO transactions (
                file_id, tx_type, control_number, claim_id,
                total_charge, total_payment, service_line_count
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            file_id,
            tx['type'],
            tx['transaction_control'],
            tx.get('claim_id'),
            tx.get('total_charge', 0.0),
            tx.get('total_payment', 0.0),
            tx.get('service_line_count', 0)
        ))

    db_conn.commit()
    cursor.close()

# Usage
conn = psycopg2.connect("dbname=warehouse user=etl")
load_facts_to_postgres('facts.json', conn)
conn.close()
```

### JavaScript/Node.js: Processing JSONL

**Streaming Parser:**

```javascript
const fs = require('fs');
const readline = require('readline');

async function processJSONL(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const segmentCounts = {};
  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;

    try {
      const record = JSON.parse(line);
      const segId = record.seg;

      segmentCounts[segId] = (segmentCounts[segId] || 0) + 1;

      // Process specific segments
      if (segId === 'CLM') {
        const claimId = record.elem[0];
        const charge = parseFloat(record.elem[1]);
        console.log(`Claim ${claimId}: $${charge.toFixed(2)}`);
      }

    } catch (err) {
      console.error(`Error parsing line ${lineNum}: ${err.message}`);
    }
  }

  console.log('\nSegment Counts:');
  Object.entries(segmentCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([seg, count]) => console.log(`  ${seg}: ${count}`));
}

// Usage
processJSONL('claims.jsonl');
```

### JavaScript/Node.js: Processing Facts JSON

**Summary Report:**

```javascript
const fs = require('fs');

function analyzeFacts(factsPath) {
  const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

  console.log(`File: ${facts.file.filename}`);
  console.log(`Size: ${facts.file.file_size.toLocaleString()} bytes`);
  console.log(`Parsed: ${facts.file.parse_timestamp}\n`);

  console.log(`Segments: ${facts.counts.segments.toLocaleString()}`);
  console.log(`Transactions: ${facts.counts.transactions}`);
  console.log(`Validation: ${facts.validation.errors} errors, ${facts.validation.warnings} warnings\n`);

  // Aggregate by transaction type
  const byType = {};

  for (const tx of facts.transactions || []) {
    const type = tx.type;

    if (!byType[type]) {
      byType[type] = {
        count: 0,
        totalCharge: 0,
        totalPayment: 0
      };
    }

    byType[type].count++;
    byType[type].totalCharge += tx.total_charge || 0;
    byType[type].totalPayment += tx.total_payment || 0;
  }

  console.log('Transaction Summary:');
  for (const [type, stats] of Object.entries(byType)) {
    console.log(`  ${type}: ${stats.count} transactions`);
    console.log(`    Charges: $${stats.totalCharge.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    console.log(`    Payments: $${stats.totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
  }
}

// Usage
analyzeFacts('facts.json');
```

## Command-Line Integration Patterns

### Shell Pipeline Processing

**Extract segment counts:**
```bash
exactedi parse file.x12 | jq -r '.seg' | sort | uniq -c
```

**Filter CLM segments:**
```bash
exactedi parse file.x12 | jq 'select(.seg == "CLM")'
```

**Convert JSONL to CSV:**
```bash
exactedi parse file.x12 | \
  jq -r '[.seg, .pos.idx, .pos.byte] | @csv' > segments.csv
```

**Validate and extract facts in one pipeline:**
```bash
exactedi validate file.x12 && \
  exactedi explain file.x12 | jq '.transactions[] | {claim: .claim_id, charge: .total_charge}'
```

### Batch Processing

**Process directory of files:**
```bash
#!/bin/bash
for file in /data/incoming/*.x12; do
  base=$(basename "$file" .x12)

  # Parse to JSONL
  exactedi parse "$file" > "/data/parsed/${base}.jsonl"

  # Extract facts
  exactedi explain "$file" > "/data/facts/${base}.json"

  # Import to database
  exactedi import "$file" --db /data/analytics.db
done
```

**Parallel processing with GNU parallel:**
```bash
find /data/incoming -name "*.x12" | \
  parallel -j 4 "exactedi explain {} > /data/facts/{/.}.json"
```

## Error Handling

### JSONL Parse Errors

ExactEDI outputs all parseable segments before encountering errors. Error messages are written to stderr, not stdout.

**Example error handling:**
```bash
# Separate stdout (JSONL) and stderr (errors)
exactedi parse file.x12 > segments.jsonl 2> parse_errors.log

# Check exit code
if [ $? -ne 0 ]; then
  echo "Parse failed. See parse_errors.log"
fi
```

**Python error handling:**
```python
import subprocess
import sys

result = subprocess.run(
    ['exactedi', 'parse', 'file.x12'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

if result.returncode == 0:
    for line in result.stdout.splitlines():
        record = json.loads(line)
        # Process record
else:
    print(f"Parse failed: {result.stderr}", file=sys.stderr)
    sys.exit(1)
```

### Facts JSON Validation Errors

When validation errors exist, the Facts JSON still outputs successfully but includes error details:

```python
facts = json.load(open('facts.json'))

if facts['validation']['errors'] > 0:
    print("File has validation errors:")
    for diag in facts.get('diagnostics', []):
        print(f"  {diag}")

    # Decide whether to process anyway or reject
    if facts['validation']['errors'] > 10:
        raise ValueError("Too many errors, rejecting file")
```

## Performance Considerations

### Memory Usage

**JSONL (parse):**
- Memory usage: 5-10 MB regardless of file size
- Output is streamed line-by-line
- Suitable for multi-gigabyte files

**Facts JSON (explain):**
- Memory usage: Proportional to transaction count
- Entire JSON object built in memory
- For 1 GB files with 100,000+ transactions, expect 10-20 GB RAM usage

**Recommendation:**
Use `parse` for large files when only segment-level data is needed. Use `explain` for files under 500 MB or when transaction summaries are required.

### Processing Throughput

Tested on AMD EPYC 7763 (single-threaded):

| File Size | Segments | parse Output Time | explain Output Time |
|-----------|----------|-------------------|---------------------|
| 50 MB | 280,000 | 8.2 sec | 10.5 sec |
| 200 MB | 1,120,000 | 32.5 sec | 45.2 sec |
| 1 GB | 6,544,197 | 3m 24s | 4m 15s |

**Optimization tips:**
- Process files in parallel using multiple ExactEDI instances
- Use `parse` for filtering before heavy processing
- Consider splitting large files by interchange (ISA/IEA) before processing

## API Contract Guarantees

### JSONL Format Stability

The JSONL output format is stable:

- Fields `seg`, `elem`, and `pos` will always be present
- Field names and structure will not change
- New fields may be added in future versions (ignore unknown fields)

### Facts JSON Schema Evolution

The Facts JSON schema follows semantic versioning:

- Minor version updates (1.x) add optional fields only
- Major version updates (2.0) may rename or restructure fields
- Consumers should check `schema_version` field

### Output Encoding

All output is UTF-8 encoded. Non-ASCII characters in X12 data are preserved as-is.

### Decimal Precision

Monetary amounts in Facts JSON use IEEE 754 double-precision floating-point. For financial calculations requiring exact decimal arithmetic, convert to fixed-point representations:

```python
from decimal import Decimal

total_charge = Decimal(str(tx['total_charge']))
```

## Compliance and PHI Handling

### HIPAA Considerations

**JSONL Output:**
- Contains raw X12 segment data
- May include PHI (patient names, SSNs, addresses in specific segments)
- Treat as PHI and apply appropriate safeguards

**Facts JSON Output:**
- Designed to be PHI-safe by excluding patient identifiers
- Contains only aggregated statistics and codes
- Still subject to organizational policies (some orgs treat all EDI-derived data as PHI)

**Recommendation:**
Apply the same security controls to all ExactEDI output as you would to source X12 files until organizational data governance reviews Facts JSON for PHI content.

### Audit Logging

For compliance, log ExactEDI invocations:

```bash
#!/bin/bash
LOG="/var/log/exactedi/audit.log"

echo "$(date -Iseconds) - User: $(whoami) - File: $1" >> "$LOG"
exactedi parse "$1"
```

## Support

For integration questions:

- Professional tier: support@exactedi.com
- Enterprise tier: Dedicated Slack channel
- Documentation: https://docs.exactedi.com

Include sample input/output files and code snippets when reporting integration issues.
