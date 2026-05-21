# Installation Guide

This guide covers installation and initial configuration of ExactEDI for Linux and Windows environments.

## System Requirements

### Operating System

**Linux**
- Distribution: Any modern Linux distribution (RHEL 8+, Ubuntu 20.04+, Debian 11+)
- Architecture: x86_64 (64-bit Intel/AMD)
- Kernel: 3.10 or newer
- glibc: 2.17 or newer (RHEL 7+) or 2.31+ (Ubuntu 20.04+)

**Windows**
- Version: Windows Server 2016+ or Windows 10/11
- Architecture: x64 (64-bit)
- No additional runtime dependencies required

**macOS**
- Version: macOS 12 (Monterey) or newer
- Architecture: arm64 (Apple Silicon) or x86_64 (Intel)

### Hardware

**Minimum Configuration**
- CPU: Single core, 1 GHz
- RAM: 512 MB
- Disk: 100 MB free space

**Recommended for Production**
- CPU: 4+ cores, 2.5 GHz or higher
- RAM: 16 GB (8 GB minimum)
- Disk: 10 GB free space for binary, logs, and temporary output files

### Performance Considerations

ExactEDI uses **constant memory for parse and validate** (~5 MB regardless of file size — the parser uses a 64 KB sliding window). The `explain` and `normalize` commands retain per-transaction facts in memory by default and so scale linearly with transaction count (~8.6 KB per transaction after the 1.0.0-beta.2 fact-extraction refactor).

| File size | Typical transactions | Parse / Validate | Explain / Normalize (default) | Explain / Normalize (streaming API) |
|---|---|---|---|---|
| < 100 MB | < 10,000 | ~5 MB | ~100 MB | ~5 MB |
| 100-500 MB | 10,000-50,000 | ~5 MB | ~100-450 MB | ~5 MB |
| 500 MB - 1 GB | 50,000-100,000 | ~5 MB | ~450-900 MB | ~5 MB |
| > 1 GB | > 100,000 | ~5 MB | ~1 GB+ (proportional) | ~5 MB |

For files where the default `explain`/`normalize` profile is too large for your environment, use the **streaming API** (`Analyzer::analyze_file_streaming` in C++ / `analyze_file_streaming` in Python) — it delivers each transaction's facts to a callback and frees them immediately, keeping peak memory at the parse-only ~5 MB regardless of file size.

For batch-mode jobs that need the full `AnalysisResult` in memory and process multi-gigabyte files, provision RAM sized to **~10 KB × expected transaction count** with reasonable headroom.

Numbers above are approximate ranges from the 1.0.0-beta.2 benchmark suite on an AMD Ryzen 7 5700G; see [../benchmarks/README.md](../benchmarks/README.md) for measured throughput and per-mode peak RSS across the same fixtures.

## Installation

ExactEDI is distributed as a statically-linked binary with no external dependencies. Installation requires only extracting the binary to a location accessible by your user account or system path.

### Linux Installation

**Step 1: Download and Extract**

```bash
# Download the distribution archive (replace URL with actual download location)
wget https://downloads.exactedi.com/exactedi-linux-x64-v1.0.0.tar.gz

# Verify checksum (optional but recommended)
sha256sum exactedi-linux-x64-v1.0.0.tar.gz
# Compare output with published checksum

# Extract to temporary directory
tar -xzf exactedi-linux-x64-v1.0.0.tar.gz
cd exactedi-linux-x64-v1.0.0
```

**Step 2: Install Binary**

For single-user installation:

```bash
# Create local binary directory if it doesn't exist
mkdir -p ~/.local/bin

# Copy binary
cp bin/exactedi ~/.local/bin/

# Ensure ~/.local/bin is in PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

For system-wide installation (requires root):

```bash
# Copy binary to system path
sudo cp bin/exactedi /usr/local/bin/

# Set ownership and permissions
sudo chown root:root /usr/local/bin/exactedi
sudo chmod 755 /usr/local/bin/exactedi
```

**Step 3: Verify Installation**

```bash
# Check version
exactedi --version

# Expected output:
# ExactEDI Engine v1.0.0

# Run help
exactedi --help

# Expected output should show command list
```

### Windows Installation

**Step 1: Download and Extract**

1. Download `exactedi-windows-x64-v1.0.0.zip` from your distribution source
2. Verify the file checksum (optional):
   ```powershell
   Get-FileHash exactedi-windows-x64-v1.0.0.zip -Algorithm SHA256
   ```
3. Extract the archive to a permanent location:
   ```powershell
   Expand-Archive -Path exactedi-windows-x64-v1.0.0.zip -DestinationPath C:\Program Files\ExactEDI
   ```

**Step 2: Add to System PATH**

Option A: User-level PATH (no admin required):

```powershell
# Add to user PATH
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$userPath;C:\Program Files\ExactEDI\bin", "User")

# Restart PowerShell for changes to take effect
```

Option B: System-level PATH (requires administrator):

```powershell
# Run PowerShell as Administrator
# Add to system PATH
$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
[Environment]::SetEnvironmentVariable("Path", "$systemPath;C:\Program Files\ExactEDI\bin", "Machine")

# Restart PowerShell for changes to take effect
```

**Step 3: Verify Installation**

Open a new PowerShell or Command Prompt window:

```powershell
# Check version
exactedi --version

# Expected output:
# ExactEDI Engine v1.0.0

# Run help
exactedi --help
```

### macOS Installation

**Step 1: Download and Extract**

```bash
# Download for Apple Silicon
curl -O https://downloads.exactedi.com/exactedi-macos-arm64-v1.0.0.tar.gz

# Or for Intel Macs
curl -O https://downloads.exactedi.com/exactedi-macos-x64-v1.0.0.tar.gz

# Extract
tar -xzf exactedi-macos-*.tar.gz
cd exactedi-macos-*
```

**Step 2: Install Binary**

```bash
# Copy to local bin
sudo cp bin/exactedi /usr/local/bin/

# Set permissions
sudo chmod 755 /usr/local/bin/exactedi
```

**Step 3: Handle macOS Gatekeeper**

On first run, macOS may block the binary:

```bash
# Remove quarantine attribute
xattr -d com.apple.quarantine /usr/local/bin/exactedi

# Or allow via System Preferences:
# System Preferences > Security & Privacy > General > "Allow apps downloaded from: App Store and identified developers"
```

**Step 4: Verify Installation**

```bash
exactedi --version
```

## Binary Layout

After installation, the ExactEDI directory structure contains:

```
exactedi-linux-x64-v1.0.0/
├── bin/
│   └── exactedi              # Main executable
├── docs/
│   ├── INSTALLATION.md       # This file
│   ├── getting-started.md    # 5-minute happy path walkthrough
│   ├── LICENSE_GUIDE.md      # License installation guide
│   ├── cli_contracts.md      # CLI reference
│   └── facts_json_schema.md
├── samples/
│   ├── sample_837p.x12       # Happy-path professional claim (synthetic, no PHI)
│   ├── sample_835.x12        # Happy-path remittance (synthetic, no PHI)
│   ├── sample_malformed.x12  # Intentionally broken — to demo diagnostic output
│   └── README.md             # Sample file descriptions
├── LICENSE.txt               # Software license terms
└── README.md                 # Product overview
```

Only the `bin/exactedi` binary is required for operation. Documentation and bundled samples are provided for reference and to support the [Getting Started guide](getting-started.md). The samples are synthetic — no real PHI, provider, or payer data — and can be redistributed freely as part of evaluation.

If you installed via `make install` rather than the portal tarball, the samples land at `$CMAKE_INSTALL_PREFIX/share/exactedi/samples/` (typically `/usr/local/share/exactedi/samples/`).

## License File Setup

ExactEDI searches for license files in the following order:

1. Path specified via `--license` option: `exactedi --license /path/to/license.lic parse file.x12`
2. Environment variable: `$EXACTEDI_LICENSE` (Linux/macOS) or `%EXACTEDI_LICENSE%` (Windows)
3. Current working directory: `./exactedi.lic`
4. User home directory: `~/.exactedi/license.lic` (Linux/macOS) or `%USERPROFILE%\.exactedi\license.lic` (Windows)
5. System directory: `/etc/exactedi/license.lic` (Linux only)

### Linux License Installation

**Option 1: User-Specific License**

```bash
# Create directory
mkdir -p ~/.exactedi

# Copy license file
cp license.lic ~/.exactedi/

# Set permissions (user read/write only)
chmod 600 ~/.exactedi/license.lic
```

**Option 2: System-Wide License (Multi-User)**

```bash
# Create directory (requires root)
sudo mkdir -p /etc/exactedi

# Copy license
sudo cp license.lic /etc/exactedi/

# Set permissions (readable by all users)
sudo chmod 644 /etc/exactedi/license.lic
```

**Option 3: Environment Variable**

```bash
# Add to ~/.bashrc or ~/.bash_profile
echo 'export EXACTEDI_LICENSE=/opt/licenses/exactedi.lic' >> ~/.bashrc
source ~/.bashrc
```

### Windows License Installation

**Option 1: User Profile**

```powershell
# Create directory
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.exactedi"

# Copy license
Copy-Item license.lic "$env:USERPROFILE\.exactedi\"
```

**Option 2: Environment Variable**

```powershell
# User-level environment variable
[Environment]::SetEnvironmentVariable("EXACTEDI_LICENSE", "C:\ProgramData\ExactEDI\license.lic", "User")

# Or system-level (requires administrator)
[Environment]::SetEnvironmentVariable("EXACTEDI_LICENSE", "C:\ProgramData\ExactEDI\license.lic", "Machine")
```

### File Permissions

**Linux/macOS:**
- User-specific: `600` (read/write for owner only)
- System-wide: `644` (read-only for all users, writable by root)

**Windows:**
- No special permissions required
- For shared environments, use NTFS permissions to restrict access

### Example Directory Structures

**Single-User Development Environment (Linux):**
```
/home/username/
├── .bashrc
├── .exactedi/
│   └── license.lic          # User-specific license
└── .local/
    └── bin/
        └── exactedi       # User-installed binary
```

**Multi-User Production Environment (Linux):**
```
/usr/local/bin/
└── exactedi               # System binary

/etc/exactedi/
└── license.lic              # Shared license

/var/log/exactedi/         # Centralized logs (optional)
```

**Windows Workstation:**
```
C:\Program Files\ExactEDI\
└── bin\
    └── exactedi.exe

C:\Users\username\.exactedi\
└── license.lic
```

## First-Run Verification

After installation and license setup, verify the system is operational.

### Test 1: Version Check

```bash
exactedi --version
```

**Expected Output:**
```
ExactEDI Engine v1.0.0
```

If this fails, verify:
- Binary is in PATH: `which exactedi` (Linux/macOS) or `where exactedi` (Windows)
- Binary has execute permissions: `ls -l $(which exactedi)` (should show `-rwxr-xr-x`)

### Test 2: License Status

```bash
exactedi license
```

**Expected Output (with valid license):**
```
License: Professional
Organization: Your Organization Name
Expires: 2027-12-31
Features: parse, validate, explain, normalize, import
```

**Expected Output (trial mode):**
```
Trial Mode: 14 days remaining, 10 files remaining
```

If license is not recognized:
- Verify file exists: `ls -l ~/.exactedi/license.lic`
- Check environment variable: `echo $EXACTEDI_LICENSE`
- Validate file integrity: `exactedi license` should show specific error if file is corrupted

### Test 3: Parse Sample File

Create a minimal test file:

```bash
cat > test.x12 << 'EOF'
ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *230115*0900*^*00501*000000001*0*P*:~
GS*HC*SENDER*RECEIVER*20230115*0900*1*X*005010X222A1~
ST*837*0001*005010X222A1~
SE*1*0001~
GE*1*1~
IEA*1*000000001~
EOF
```

Run validation:

```bash
exactedi validate test.x12
```

**Expected Output:**
```
File: "test.x12"
Valid: Yes
Segments: 6
Interchanges: 1
Groups: 1
Transactions: 1
Errors: 0
Warnings: 0
```

### Test 4: Parse to JSONL

```bash
exactedi parse test.x12
```

**Expected Output:**
```json
{"seg":"ISA","elem":["00","          ","00","          ","ZZ","SENDER         ","ZZ","RECEIVER       ","230115","0900","^","00501","000000001","0","P",":"],"pos":{"idx":0,"byte":0}}
{"seg":"GS","elem":["HC","SENDER","RECEIVER","20230115","0900","1","X","005010X222A1"],"pos":{"idx":1,"byte":107}}
{"seg":"ST","elem":["837","0001","005010X222A1"],"pos":{"idx":2,"byte":160}}
{"seg":"SE","elem":["1","0001"],"pos":{"idx":3,"byte":187}}
{"seg":"GE","elem":["1","1"],"pos":{"idx":4,"byte":199}}
{"seg":"IEA","elem":["1","000000001"],"pos":{"idx":5,"byte":207}}
```

If any test fails, see the Troubleshooting section below.

## Common Installation Issues

### Binary Not Found After Installation

**Symptom:**
```
bash: exactedi: command not found
```

**Resolution:**
- Verify binary location: `ls -l /usr/local/bin/exactedi`
- Check PATH: `echo $PATH` should include `/usr/local/bin`
- Restart terminal to reload PATH
- Use absolute path temporarily: `/usr/local/bin/exactedi --version`

### Permission Denied (Linux/macOS)

**Symptom:**
```
bash: /usr/local/bin/exactedi: Permission denied
```

**Resolution:**
```bash
# Check current permissions
ls -l /usr/local/bin/exactedi

# Add execute permission
sudo chmod 755 /usr/local/bin/exactedi
```

### License File Not Found

**Symptom:**
```
Trial Mode: 14 days remaining, 10 files remaining
```
(When you expect a valid license to be loaded)

**Resolution:**
```bash
# Verify file exists
ls -l ~/.exactedi/license.lic

# Check file is readable
cat ~/.exactedi/license.lic
# First line should be base64-encoded signature
# Remaining lines should be valid JSON

# Test with explicit path
exactedi --license ~/.exactedi/license.lic license
```

### License Signature Verification Failed

**Symptom:**
```
Error: License file signature verification failed
```

**Resolution:**
- Verify file was not corrupted during transfer
- Re-download license from provider
- Check file encoding (should be UTF-8, not UTF-16)
- Ensure no extra whitespace or line ending changes: `file license.lic` should show ASCII text
- Contact support for license reissue

### macOS "Unidentified Developer" Warning

**Symptom:**
macOS blocks execution with security warning.

**Resolution:**
```bash
# Remove quarantine attribute
xattr -d com.apple.quarantine /usr/local/bin/exactedi

# Or via System Preferences
# Navigate to: System Preferences > Security & Privacy > General
# Click "Allow" next to the blocked application message
```

### Windows SmartScreen Warning

**Symptom:**
Windows Defender SmartScreen prevents execution.

**Resolution:**
1. Click "More info" on the warning dialog
2. Click "Run anyway"
3. For silent deployment, add exclusion in Windows Defender

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `EXACTEDI_LICENSE` | Path to license file | `/opt/licenses/exactedi.lic` |
| `EXACTEDI_LOG_FILE` | Path for detailed logs | `/var/log/exactedi/app.log` |

All environment variables are optional. Command-line flags take precedence over environment variables.

## Uninstallation

### Linux/macOS

```bash
# Remove binary
sudo rm /usr/local/bin/exactedi

# Remove user configuration (optional)
rm -rf ~/.exactedi

# Remove system configuration (optional)
sudo rm -rf /etc/exactedi
```

### Windows

```powershell
# Remove installation directory
Remove-Item -Recurse -Force "C:\Program Files\ExactEDI"

# Remove user configuration (optional)
Remove-Item -Recurse -Force "$env:USERPROFILE\.exactedi"

# Remove from PATH (reverse of installation steps)
# User PATH:
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newPath = ($userPath -split ';' | Where-Object { $_ -ne 'C:\Program Files\ExactEDI\bin' }) -join ';'
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")
```

## Next Steps

- **License Management:** See [LICENSE_GUIDE.md](LICENSE_GUIDE.md) for license troubleshooting and renewal
- **CLI Reference:** See [cli_contracts.md](cli_contracts.md) for complete command documentation
- **Integration:** See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for consuming ExactEDI output in data pipelines
- **Database Schema:** See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for SQLite import feature documentation

## Support

For installation issues:
- Professional tier: support@exactedi.com
- Enterprise tier: Use dedicated support channel
- Include output of `exactedi --version` and operating system details in support requests
