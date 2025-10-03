# Console Log Cleanup Script

The `clean-console-log.sh` script removes noise from console log files by filtering out:

- **Statsig-related entries**: All mentions of "statsig", specific Statsig script files, and related stack traces
- **Stack traces**: All lines containing " @ " (function@file:line patterns)
- **Orphaned Promise.then statements**: Standalone Promise.then lines
- **Various stack trace patterns**: Hash-based filenames, anonymous functions, etc.

## Usage

```bash
# Clean the default log file
./scripts/clean-console-log.sh

# Clean a specific log file
./scripts/clean-console-log.sh /path/to/your/logfile.log
```

## Features

- **Automatic backup**: Creates timestamped backup before cleaning
- **Progress reporting**: Shows original vs final line counts and reduction percentage
- **Verification**: Confirms no Statsig entries or stack traces remain
- **Safe operation**: Creates backup before modifying original file

## Example Output

```
Created backup: /private/tmp/claude.content-script.log.backup.20251003_093650
Original log file: 6186 lines
Cleaned log file: 170 lines
Removed: 6016 lines
Reduction: 97%
✅ Cleanup successful - no Statsig entries or stack traces remaining
Log cleanup complete!
```

## What Gets Removed

- Lines containing "statsig" (case-insensitive)
- Lines referencing Statsig script files (6365-925babc8014a1a1d.js, 9122-4eb9092e09e088b6.js)
- All stack trace lines containing " @ "
- Orphaned "Promise.then" statements
- Various stack trace patterns with hash-based filenames
- Anonymous function references in stack traces

This typically reduces log files by 80-97% while preserving all meaningful console output.
