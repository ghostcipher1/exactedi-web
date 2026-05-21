# ExactEDI Licensing System

This document describes the ExactEDI licensing system, including license file format, signature verification, and the license generation workflow.

## Overview

ExactEDI uses Ed25519 digital signatures to verify license authenticity. Each license file is cryptographically signed with a private key, and the signature is verified against a public key embedded in the binary.

### Security Model

- **Enforcement + Deterrence**: Not unbreakable DRM, but strong enough to prevent casual bypass
- **Offline-first**: All verification happens locally with no network calls
- **Signed licenses**: Ed25519 signatures ensure license integrity and authenticity
- **Graceful degradation**: Falls back to trial mode when no valid license is found

## License Tiers

| Tier | Features | Limits |
|------|----------|--------|
| **Trial** | parse, validate, explain | 14 days, 10 files/session |
| **Standard** | + normalize | Unlimited |
| **Professional** | + import, batch | Unlimited |
| **Enterprise** | + api, custom | Unlimited, custom terms |

## License File Format

License files (`.lic`) consist of two parts:

1. **Line 1**: Base64-encoded Ed25519 signature (64 bytes → ~88 characters)
2. **Lines 2+**: JSON payload (the signed content)

### Example License File

```
dGhpc2lzYWJhc2U2NGVuY29kZWRzaWduYXR1cmVoZXJl...==
{
  "license_id": "550e8400-e29b-41d4-a716-446655440000",
  "tier": "professional",
  "organization": "Example Corp",
  "email": "admin@example.com",
  "issued_at": 1704067200,
  "expires_at": 1735689600,
  "max_files_per_session": 0,
  "version": "1.*",
  "features": ["parse", "validate", "explain", "normalize", "import", "batch"]
}
```

### JSON Payload Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `license_id` | string | Yes | Unique license identifier (UUID format) |
| `tier` | string | Yes | One of: `trial`, `standard`, `professional`, `enterprise` |
| `organization` | string | No | Licensee organization name |
| `email` | string | No | Licensee contact email |
| `issued_at` | int64 | No | Issue timestamp (Unix epoch seconds) |
| `expires_at` | int64 | No | Expiration timestamp (0 = never expires) |
| `max_files_per_session` | uint32 | No | Per-session file limit (0 = unlimited) |
| `version` | string | No | Engine version constraint (e.g., "1.*") |
| `features` | array | No | Explicit feature list (overrides tier defaults) |

### Feature Names

- `parse` - Parse X12 to JSONL
- `validate` - Validate X12 structure
- `explain` - Generate Facts JSON
- `normalize` - Combined parse + facts
- `import` - SQLite database import
- `batch` - Batch file processing
- `api` - API/SDK integration
- `custom` - Custom output formats

## License File Search Order

ExactEDI searches for license files in this order:

1. Path specified via `--license <path>` CLI option
2. `EXACTEDI_LICENSE` environment variable
3. `./exactedi.lic` (current directory)
4. `%APPDATA%/ExactEDI/license.lic` (Windows)
5. `~/.exactedi/license.lic` (Unix-like)

## Signature Verification

### Algorithm

- **Algorithm**: Ed25519 (RFC 8032)
- **Key size**: 256-bit (32-byte public key, 64-byte secret key)
- **Signature size**: 64 bytes
- **Library**: libsodium

### Verification Process

1. Read license file, split into signature (line 1) and payload (remaining lines)
2. Base64-decode the signature to 64 bytes
3. Verify signature against payload using embedded public key
4. If valid, parse JSON payload and check expiration
5. If invalid or expired, fall back to trial mode

### Embedded Public Key

The public key is compiled into the binary at build time. See `src/exactedi/licensing/signature.cpp`:

```cpp
constexpr PublicKey EMBEDDED_PUBLIC_KEY = {{
    0x01, 0x02, 0x03, ...  // 32 bytes
}};
```

**Important**: Replace the placeholder key with your production public key before release!

## License Generation Workflow

### Prerequisites

1. Build the `license-gen` tool (in `tools/license-gen/`)
2. Ensure libsodium is available

### Generate a Keypair

```bash
cd tools/bin
./license-gen --generate-keypair
```

This creates:
- `keypair.public` - Public key (embed in binary)
- `keypair.secret` - Secret key (KEEP SECURE!)

### Update the Embedded Public Key

Copy the generated public key into `src/exactedi/licensing/signature.cpp`:

```cpp
constexpr PublicKey EMBEDDED_PUBLIC_KEY = {{
    // Paste the C++ array format output from license-gen
}};
```

Rebuild the ExactEDI binary.

### Create a License

1. Create a sample template:
   ```bash
   ./license-gen --create-sample
   ```

2. Edit `license.json` with customer details

3. Sign the license:
   ```bash
   ./license-gen --sign license.json
   ```

4. Distribute `license.lic` to the customer

### Verify a License

```bash
./license-gen --verify license.lic
```

## Trial Mode

When no valid license is found, ExactEDI operates in trial mode:

- **Duration**: 14 days from first use
- **File limit**: 10 files per session
- **Features**: parse, validate, explain

Trial state is tracked in:
- Windows: `%APPDATA%/ExactEDI/.exactedi_trial`
- Unix: `~/.exactedi/.exactedi_trial`

## Error Messages

| Status | Message | Resolution |
|--------|---------|------------|
| `LicenseStatus::Valid` | License valid | None needed |
| `LicenseStatus::Trial` | Trial mode active | Purchase license |
| `LicenseStatus::Expired` | License has expired | Renew license |
| `LicenseStatus::Invalid` | Signature verification failed | Re-download license |
| `LicenseStatus::Corrupted` | License file malformed | Re-download license |
| `LicenseStatus::NotFound` | No license file found | Install license |

## Security Best Practices

1. **Protect the secret key**: Never commit `keypair.secret` to version control
2. **Rotate keys periodically**: Generate new keypairs for major releases
3. **Monitor license usage**: Track license IDs to detect unauthorized sharing
4. **Time-limit licenses**: Use `expires_at` to ensure regular renewal
5. **Version constraints**: Use `version` field to limit license to specific releases

## Building the License Tool

```bash
cd tools/license-gen
cmake -B build -S . --preset=default
cmake --build build
```

The tool will be output to `tools/bin/license-gen`.
