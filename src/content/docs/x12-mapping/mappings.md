# Technical X12 Mappings

This document maps the SDK's English-facing classes, methods, and properties to the underlying X12 concepts they represent.

> Looking for what a specific validation diagnostic means? See
> [diagnostics.md](diagnostics.md) — every code the engine emits is
> documented there in plain English plus X12 detail.

## Reading Guide

X12 names in this repo follow the standard envelope hierarchy:

- ISA / IEA: interchange envelope
- GS / GE: functional group envelope
- ST / SE: transaction set envelope
- Loops, segments, and elements: business content inside the transaction

Some SDK fields are direct projections of a single X12 element. Others are normalized or derived values, such as totals and counts.

## Class Mapping

| English class | X12 counterpart | Notes |
|---|---|---|
| `Analyzer` | File, buffer, or stream level X12 parser | Orchestrates analysis of one or more X12 transaction sets. |
| `AnalyzerOptions` | Parse and validation controls | Governs how strictly the X12 envelope and transaction content are processed. |
| `AnalysisResult` | Parsed interchange / group / transaction summary | Holds structure, counts, diagnostics, and extracted transactions. |
| `TransactionFacts` | PHI-safe X12 transaction snapshot | Normalized facts extracted from one transaction set. |
| `TransactionType` | X12 transaction classification | Maps to business transaction families: 837P/I/D (claims), 835 (remittance), 270/271 (eligibility), 276/277 (claim status), 277CA (claim acknowledgment), 278 (prior authorization), 820 (premium payment), 834 (benefit enrollment), 999 (implementation acknowledgment), TA1 (interchange acknowledgment). |

## Method Mapping

| English method | X12 counterpart | Notes |
|---|---|---|
| `analyze_file(path)` | Parse X12 from a file | Reads a file and builds interchange, group, and transaction facts. |
| `analyze_string(data)` | Parse X12 from a string | Same analysis path, but input is already in memory. |
| `analyze_memory(span)` / `analyze_bytes(data)` | Parse X12 from a memory buffer | Useful for embedded or streamed payloads. |
| `analyze_stream(stream)` | Parse X12 from an input stream | Stream-oriented ingestion of X12 content. |
| `analyze_file_streaming(path, callback)` | Transaction-by-transaction X12 extraction | Emits each transaction set as it is parsed. |
| `validate_file(path)` | X12 syntax / structural validation | Validates envelope and control-number consistency without returning facts. |
| `validate_string(data)` | X12 syntax / structural validation | String-based validation only. |
| `to_json()` / `to_dict()` | Serialize extracted X12 facts | Presentation layer only; no new X12 meaning. |
| `facts_json()` | Serialize PHI-safe transaction facts | Exports the normalized facts schema. |
| `set_strict_validation()` | Envelope and rule enforcement | Controls how aggressively the parser validates X12 structure. |
| `set_extract_facts()` | Fact extraction toggle | Enables or disables PHI-safe transaction extraction. |
| `set_max_transactions()` | Transaction-set processing limit | Caps how many ST/SE sets are processed. |
| `set_continue_on_error()` | Error recovery behavior | Controls whether parsing continues after validation failures. |

## Property Mapping

### Envelope and transaction controls

| English property | X12 counterpart | Notes |
|---|---|---|
| `type` | ST01 plus transaction-family refinement | Example values: 837P, 837I, 837D, 835, 270, 271, 276, 277, 277CA, 278, 820, 834, 999. (277 and 277CA both have ST01=277; disambiguated by ST03 / implementation reference.) |
| `interchange_control` | ISA13 / IEA02 | Interchange control number. |
| `group_control` | GS06 / GE02 | Functional group control number. |
| `transaction_control` | ST02 / SE02 | Transaction set control number. |
| `transaction_count` | Count of ST/SE transaction sets | Derived from parsed transaction sets. |
| `bytes_processed` | Input size | Derived from the source payload length. |
| `segments_parsed` | Parsed segment count | Count of segments encountered during parsing. |
| `is_valid` | Validation outcome | True when no blocking validation errors remain. |
| `error_count` | Validation error count | Derived from diagnostics. |
| `warning_count` | Validation warning count | Derived from diagnostics. |
| `elapsed_seconds` | Processing time | Runtime metric, not an X12 element. |

### 837 / 835 facts

| English property | X12 counterpart | Notes |
|---|---|---|
| `claim_id` | CLM01 (837) or CLP01 (835) | Primary claim identifier in the transaction. |
| `claim_status` | CLP02 | 835 claim status code. |
| `payer_id` | 2010BB loop NM109 | Payer identifier. |
| `payer_name` | 2010BB loop NM103 | Payer name. |
| `billing_provider_npi` | 2010AA loop NM109 | Billing provider NPI. |
| `place_of_service` | CLM05-1 (837P) or CLM05 (837I) | Service location indicator. |
| `original_reference` | REF / trace / control reference elements | Source varies by transaction family; it is a normalized reference value. |
| `patient_responsibility` | 835 payment responsibility amount | Computed from 835 payment detail. |

### Clinical and financial aggregates

| English property | X12 counterpart | Notes |
|---|---|---|
| `total_charge` | Aggregate charge from claim and service-line amounts | Derived value, typically accumulated from claim/service detail. |
| `total_payment` | Aggregate paid amount in 835 | Derived value from remittance payment detail. |
| `service_line_count` | Count of service line segments | Typically SV1 / SV2 for 837 and SVC for 835. |
| `procedure_codes` | SV1 / SV2 / SVC procedure code values | Context depends on transaction family. |
| `diagnosis_codes` | HI segment codes | Usually ICD-10 diagnosis codes in 837 transactions. |
| `service_dates` | DTP date values | Normalized date or date-range values from DTP segments. |

## Transaction-Family Notes

### 837 Professional / Institutional / Dental

| English concept | X12 counterpart | Notes |
|---|---|---|
| Claim identifier | CLM01 | Primary claim control reference. |
| Billing provider NPI | 2010AA NM109 | Submitted billing provider identifier. |
| Payer identity | 2010BB NM109 / NM103 | Payer identifier and payer name. |
| Diagnosis codes | HI | Clinical diagnosis codes attached to the claim. |
| Procedure codes | SV1 / SV2 | Service-line procedure codes. |
| Service dates | DTP | Claim or service-line date information. |

### 835 Remittance

| English concept | X12 counterpart | Notes |
|---|---|---|
| Claim identifier | CLP01 | Claim reference in the remittance advice. |
| Claim status | CLP02 | Status code for the claim outcome. |
| Payment amount | 835 payment detail | Summed into `total_payment`. |
| Patient responsibility | Payment responsibility detail | Summed into `patient_responsibility`. |
| Procedure codes | SVC | Service-level payment detail. |

## Practical Rule of Thumb

If the field is a control number, look at the envelope:

- ISA / IEA for interchange-level data
- GS / GE for functional-group-level data
- ST / SE for transaction-set-level data

If the field is business content, look at the transaction family and loop:

- 837 claims: CLM, NM1, HI, SV1, SV2, DTP, REF
- 835 remittance: CLP, SVC, CAS, NM1, DTP, REF
- 270/271 eligibility: HL, NM1, EQ (270 inquiry), EB (271 response), III, DTP
- 276/277 claim status: HL, NM1, TRN, SVC, STC, REF, DTP
- 277CA claim acknowledgment: HL, NM1, TRN, STC, SVC (service-line status), QTY, AMT
- 278 prior authorization: HL (UMO/Requester/Subscriber/Dependent/Patient Event/Service), NM1, UM, HSD, SV1/SV2/SV3, TOO, TRN
- 820 premium payment: BPR, TRN, N1, ENT, RMR, ADX, IT1, SAC, SLN
- 999 implementation acknowledgment: AK1, AK2, IK3, IK4, CTX, IK5, AK9

## Example

| English phrase | X12 mapping |
|---|---|
| patient NPI | NM109 in loop 2010BA where NM101 = IL |
| billing provider NPI | NM109 in loop 2010AA |
| payer name | NM103 in loop 2010BB |
| claim ID | CLM01 in 837 or CLP01 in 835 |
| service line count | number of SV1 / SV2 / SVC segments |

## Caveats

- Some fields are computed, not direct one-to-one element copies.
- Some values vary by transaction type, especially between 837 and 835.
- When a field name is normalized for SDK users, this document names the most likely X12 source rather than every possible source.
