# License Guide

This guide explains how to install, verify, and troubleshoot ExactEDI license files.

## Overview

ExactEDI uses cryptographically signed license files for authentication and feature access control. License verification is performed entirely offline with no network connectivity required. When no valid license is present, the software operates in trial mode with limited features and a 14-day evaluation period.

## License File Format

License files use the `.lic` extension and consist of two components:

1. **Signature line** - Base64-encoded Ed25519 digital signature (line 1)
2. **JSON payload** - License metadata including organization, tier, expiration, and enabled features (lines 2+)

Example license file structure:

```
dGhpc2lzYWJhc2U2NGVuY29kZWRzaWduYXR1cmVoZXJl...==
{
  "license_id": "550e8400-e29b-41d4-a716-446655440000",
  "tier": "professional",
  "organization": "Acme Healthcare Systems",
  "email": "admin@acme.com",
  "issued_at": 1704067200,
  "expires_at": 1767225600,
  "features": ["parse", "validate", "explain", "normalize", "import"]
}
```

License files must not be modified. Any changes to the JSON payload invalidate the cryptographic signature and cause verification to fail.

## Installing a License File

### Supported Installation Locations

ExactEDI searches for license files in the following order:

1. **Command-line argument:** `--license /path/to/license.lic`
2. **Environment variable:** `EXACTEDI_LICENSE`
3. **Current directory:** `./exactedi.lic`
4. **User home directory:**
   - Linux/macOS: `~/.exactedi/license.lic`
   - Windows: `%USERPROFILE%\.exactedi\license.lic`
5. **System directory (Linux only):** `/etc/exactedi/license.lic`

The first valid license file found is used. If no license file is found, trial mode is activated.

### Installation Methods

#### Method 1: User Home Directory (Recommended)

This method is suitable for single-user installations or development environments.

**Linux/macOS:**
```bash
# Create configuration directory
mkdir -p ~/.exactedi

# Copy license file
cp license.lic ~/.exactedi/

# Set restrictive permissions
chmod 600 ~/.exactedi/license.lic

# Verify installation
exactedi license
```

**Windows:**
```powershell
# Create configuration directory
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.exactedi"

# Copy license file
Copy-Item license.lic "$env:USERPROFILE\.exactedi\"

# Verify installation
exactedi license
```

#### Method 2: Environment Variable

Use this method when managing multiple licenses or deploying in containerized environments.

**Linux/macOS:**
```bash
# Set environment variable for current session
export EXACTEDI_LICENSE=/opt/licenses/exactedi.lic

# Verify
exactedi license

# Make permanent by adding to shell profile
echo 'export EXACTEDI_LICENSE=/opt/licenses/exactedi.lic' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell):**
```powershell
# User-level environment variable
[Environment]::SetEnvironmentVariable("EXACTEDI_LICENSE", "C:\Licenses\exactedi.lic", "User")

# System-level (requires administrator)
[Environment]::SetEnvironmentVariable("EXACTEDI_LICENSE", "C:\ProgramData\ExactEDI\license.lic", "Machine")

# Restart PowerShell and verify
exactedi license
```

**Windows (Command Prompt):**
```cmd
REM User-level
setx EXACTEDI_LICENSE "C:\Licenses\exactedi.lic"

REM Restart Command Prompt and verify
exactedi license
```

#### Method 3: System-Wide Installation (Multi-User)

Use this method for shared server environments where multiple users need access to the same license.

**Linux:**
```bash
# Create system directory
sudo mkdir -p /etc/exactedi

# Copy license file
sudo cp license.lic /etc/exactedi/

# Set permissions (readable by all users)
sudo chmod 644 /etc/exactedi/license.lic

# Verify as non-root user
exactedi license
```

**Windows:**
Not applicable. Use environment variable method with Machine scope for system-wide deployment.

#### Method 4: Command-Line Argument

Use this method for testing or when processing files with different license tiers.

```bash
# Specify license per-command
exactedi --license /path/to/license.lic parse input.x12

# Works with any command
exactedi --license ./professional.lic import data.x12 --db analytics.db
```

### File Integrity

After installation, verify the license file was not corrupted:

```bash
# File should be readable ASCII text
file ~/.exactedi/license.lic
# Expected: ASCII text

# First line should be base64-encoded (no spaces or special characters except =)
head -n 1 ~/.exactedi/license.lic
# Expected: Long alphanumeric string ending with = or ==

# Remaining lines should be valid JSON
tail -n +2 ~/.exactedi/license.lic | python3 -m json.tool
# Expected: Formatted JSON output with no errors
```

## Checking License Status

### Basic Status Check

```bash
exactedi license
```

**Output (Valid License):**
```
License: Professional
Organization: Acme Healthcare Systems
Expires: 2026-12-31
Features: parse, validate, explain, normalize, import
```

**Output (Trial Mode):**
```
Trial Mode: 14 days remaining, 10 files remaining
```

**Output (Expired License):**
```
License: Expired
Organization: Acme Healthcare Systems
Expired: 2025-12-31 (13 days ago)
Trial Mode: 14 days remaining, 10 files remaining
```

### License Status Fields

| Field | Description |
|-------|-------------|
| **License** | License tier (Trial, Professional, Enterprise) or status (Expired, Invalid) |
| **Organization** | Licensed organization name |
| **Expires** | License expiration date (YYYY-MM-DD format) |
| **Expired** | Days since expiration (only shown for expired licenses) |
| **Features** | Comma-separated list of enabled features |
| **Trial Mode** | Trial status when no valid license is active |

### Feature Availability

| Feature | Trial | Professional | Enterprise |
|---------|-------|--------------|------------|
| `parse` | Yes | Yes | Yes |
| `validate` | Yes | Yes | Yes |
| `explain` | Yes | Yes | Yes |
| `normalize` | No | Yes | Yes |
| `import` | No | Yes | Yes |
| `batch` | No | Yes | Yes |
| `api` | No | No | Yes |
| `custom` | No | No | Yes |

### Verbose License Information

For detailed license metadata:

```bash
exactedi license --verbose
```

**Output:**
```
License ID: 550e8400-e29b-41d4-a716-446655440000
Tier: Professional
Organization: Acme Healthcare Systems
Contact: admin@acme.com
Issued: 2024-01-01
Expires: 2026-12-31 (365 days remaining)
Version Constraint: 1.*
Features: parse, validate, explain, normalize, import, batch
Status: Valid
License Path: /home/user/.exactedi/license.lic
```

## Troubleshooting License Errors

### Error: No License File Found

**Symptom:**
Software operates in trial mode when you expect a valid license to be active.

**Output:**
```
Trial Mode: 14 days remaining, 10 files remaining
```

**Diagnosis:**

Check where ExactEDI is looking for the license:

```bash
# Enable verbose mode to see license search paths
exactedi --verbose license
```

**Output:**
```
[DEBUG] Checking license path: --license argument (not provided)
[DEBUG] Checking license path: EXACTEDI_LICENSE environment variable (not set)
[DEBUG] Checking license path: ./exactedi.lic (not found)
[DEBUG] Checking license path: /home/user/.exactedi/license.lic (not found)
[DEBUG] Checking license path: /etc/exactedi/license.lic (not found)
[INFO] No license file found, entering trial mode
```

**Resolution:**

1. Verify the license file exists:
   ```bash
   ls -l ~/.exactedi/license.lic
   ```

2. If the file is in a different location, use an environment variable:
   ```bash
   export EXACTEDI_LICENSE=/actual/path/to/license.lic
   exactedi license
   ```

3. If the file does not exist, re-download from your license provider or contact support.

### Error: License Signature Verification Failed

**Symptom:**
License file exists but is rejected as invalid.

**Output:**
```
Error: License file signature verification failed
License may be corrupted or tampered with
```

**Diagnosis:**

This error indicates the JSON payload does not match the cryptographic signature, which occurs when:
- File was modified after signing
- File was corrupted during transfer
- File encoding was changed (e.g., UTF-16 instead of UTF-8)
- Extra whitespace or line endings were added

Check file integrity:

```bash
# Verify file is plain ASCII text
file ~/.exactedi/license.lic
# Expected: ASCII text

# Check for encoding issues
hexdump -C ~/.exactedi/license.lic | head -n 5
# First line should contain only Base64 characters (A-Z, a-z, 0-9, +, /, =)

# Validate JSON structure (lines 2+)
tail -n +2 ~/.exactedi/license.lic | python3 -m json.tool
# Should output formatted JSON with no errors
```

**Resolution:**

1. **Re-download the license file** from your original source. File transfers via email or messaging apps can corrupt binary data.

2. **Verify file transfer method:**
   - Use `scp`, `sftp`, or direct HTTPS download
   - Avoid copying through text editors or word processors
   - Do not copy-paste license content into a new file

3. **Check file line endings:**
   ```bash
   # Convert to Unix line endings if necessary
   dos2unix ~/.exactedi/license.lic
   ```

4. If the problem persists, contact support with the license ID (visible in the JSON payload) to request a reissue.

### Error: License Expired

**Symptom:**
License file is valid but the expiration date has passed.

**Output:**
```
License: Expired
Organization: Acme Healthcare Systems
Expired: 2025-12-31 (45 days ago)
Trial Mode: 14 days remaining, 10 files remaining
```

**Resolution:**

1. **Contact your license provider** to renew the license. Provide your organization name and current license ID.

2. **Temporary workaround:** The software automatically falls back to trial mode when a license expires. You can continue using core features (parse, validate, explain) until a renewed license is installed.

3. **After receiving the renewed license:**
   ```bash
   # Replace expired license
   cp renewed_license.lic ~/.exactedi/license.lic

   # Verify new expiration date
   exactedi license
   ```

### Error: Feature Not Available

**Symptom:**
Command fails with a feature restriction message.

**Output:**
```
Error: Feature 'import' is not available with your current license.
This feature requires a Professional or Enterprise license.
```

**Diagnosis:**

Your current license tier does not include the requested feature.

Check your license tier and enabled features:

```bash
exactedi license
```

**Resolution:**

1. **Verify the feature list** matches your expected license tier:
   - Trial: parse, validate, explain
   - Professional: adds normalize, import, batch
   - Enterprise: adds api, custom

2. **If features are missing from a paid license:**
   - Verify the license file is the latest version from your provider
   - Check the `features` array in the JSON payload:
     ```bash
     tail -n +2 ~/.exactedi/license.lic | grep -A 1 '"features"'
     ```
   - Contact support if the license tier is incorrect

3. **To upgrade your license tier:**
   - Contact sales to upgrade from Trial to Professional or Enterprise
   - Install the new license file after purchase

### Error: License File Corrupted

**Symptom:**
License file cannot be parsed.

**Output:**
```
Error: License file is malformed or corrupted
Unable to parse JSON payload
```

**Diagnosis:**

The JSON payload in the license file is not valid JSON syntax.

Validate the JSON structure:

```bash
# Extract and validate JSON (skip signature line)
tail -n +2 ~/.exactedi/license.lic | python3 -m json.tool
```

**Common Errors:**
```
Expecting ',' delimiter: line 5 column 3 (char 123)
```
Indicates malformed JSON (missing comma, extra comma, or syntax error).

**Resolution:**

1. **Do not attempt to fix the JSON manually.** Modifying the payload invalidates the signature.

2. **Re-download the original license file** from your provider.

3. **If re-downloading fails, contact support** with:
   - Your organization name
   - License ID (if visible in the corrupted file)
   - Error message from JSON validation

### Warning: License Expires Soon

**Symptom:**
License is valid but approaching expiration.

**Output:**
```
License: Professional
Organization: Acme Healthcare Systems
Expires: 2026-02-15 (30 days remaining)
Warning: License expires in 30 days. Contact your provider to renew.
```

**Resolution:**

1. **Contact your license provider** at least 14 days before expiration to arrange renewal.

2. **Monitor expiration status** in automated workflows:
   ```bash
   # Check license status in scripts
   if exactedi license | grep -q "Warning:"; then
       echo "License renewal required" | mail -s "ExactEDI License Alert" admin@example.com
   fi
   ```

3. **After renewal:**
   - Replace the old license file with the renewed version
   - Verify the new expiration date: `exactedi license`

## License File Security

### File Permissions

License files do not contain sensitive data (no credentials or keys), but restrict access to prevent accidental modification.

**Linux/macOS:**
```bash
# User-only read/write
chmod 600 ~/.exactedi/license.lic

# Multi-user environments (read-only for all users)
sudo chmod 644 /etc/exactedi/license.lic
```

**Windows:**
No specific permissions required. Use NTFS ACLs if restricting access in shared environments.

### Backup Recommendations

Store a backup copy of your license file in a secure location:

```bash
# Backup to encrypted storage
cp ~/.exactedi/license.lic /secure/backup/exactedi-license-2026.lic

# For multi-server deployments, store in configuration management
# (Ansible, Puppet, Chef, etc.)
```

### Sharing Licenses

License files are organization-specific and should not be shared outside your organization. Each license includes:
- Organization name
- Contact email
- License ID (used for support and renewal tracking)

Distributing license files to unauthorized parties violates license terms and may result in license revocation.

## Trial Mode

When no valid license is found, ExactEDI operates in trial mode with the following restrictions:

| Aspect | Limitation |
|--------|-----------|
| **Duration** | 14 days from first use |
| **File Limit** | 10 files per session |
| **Features** | parse, validate, explain only |
| **File Size** | No limit |

Trial state is tracked in a local file:
- Linux/macOS: `~/.exactedi/.exactedi_trial`
- Windows: `%USERPROFILE%\.exactedi\.exactedi_trial`

To reset the trial period (for re-evaluation after significant updates):
```bash
# Remove trial state file
rm ~/.exactedi/.exactedi_trial

# Trial counter resets on next invocation
exactedi license
```

Note: Trial resets are intended for legitimate re-evaluation only. Continuous trial resets without purchasing a license violates terms of use.

## Frequently Asked Questions

### Can I use one license on multiple machines?

License terms vary by tier:
- **Professional:** Single-user license, one active installation per user
- **Enterprise:** Multi-user license, terms specified in contract

Refer to your license agreement or contact sales for multi-server deployments.

### Does the license require internet access?

No. All license verification is performed offline using cryptographic signatures. ExactEDI never contacts external servers for license validation.

### What happens when my license expires?

The software automatically falls back to trial mode, allowing continued use of core features (parse, validate, explain) for 14 days. Advanced features (normalize, import) become unavailable immediately upon expiration.

### Can I transfer my license to a different machine?

Yes. License files are portable and can be copied to any machine. Simply install the license file using the standard installation methods on the new machine.

For concurrent use on multiple machines, refer to your license agreement or contact sales.

### How do I upgrade from Trial to Professional?

1. Purchase a Professional license from your sales representative
2. Receive the signed `.lic` file via email or download portal
3. Install the license using the methods described in this guide
4. Verify the upgrade: `exactedi license`

The trial state file is ignored once a valid paid license is installed.

### Can I downgrade my license tier?

License downgrades are handled on a case-by-case basis. Contact support to request a tier change and receive a new license file.

## Support

For license-related issues:

**Professional Tier:**
- Email: support@exactedi.com
- Include: License ID, organization name, error messages

**Enterprise Tier:**
- Use dedicated support channel
- Faster response SLA per contract terms

**Sales and Licensing:**
- Email: licensing@exactedi.com
- For: Purchases, renewals, tier upgrades, multi-server licensing

When contacting support, include:
1. Output of `exactedi --version`
2. Output of `exactedi license --verbose`
3. Operating system and version
4. Relevant error messages or logs
