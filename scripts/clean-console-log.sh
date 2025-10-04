#!/bin/bash

# Console Log Cleanup Script
# Removes Statsig-related entries and stack traces from console log files
# Usage: ./scripts/clean-console-log.sh [log-file-path]

set -e

# Default log file if none provided
LOG_FILE="${1:-/private/tmp/claude.content-script.log}"

# Check if log file exists
if [[ ! -f "$LOG_FILE" ]]; then
    echo "Error: Log file '$LOG_FILE' not found"
    exit 1
fi

# Create backup
BACKUP_FILE="${LOG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$LOG_FILE" "$BACKUP_FILE"
echo "Created backup: $BACKUP_FILE"

# Count original lines
ORIGINAL_LINES=$(wc -l < "$LOG_FILE")
echo "Original log file: $ORIGINAL_LINES lines"

# Clean the log file by removing:
# 1. Statsig-related entries (explicit mentions, script files, stack traces)
# 2. All stack traces (lines containing " @ ")
# 3. Orphaned Promise.then statements
# 4. Various stack trace patterns

grep -v -E "(statsig|6365-925babc8014a1a1d\.js|9122-4eb9092e09e088b6\.js|^[a-f0-9]+-[a-f0-9]+\.js:[0-9]+$|^[a-zA-Z0-9_]+ @ [a-f0-9]+-[a-f0-9]+\.js:[0-9]+$|^Promise\.then$|^\(anonymous\) @ [a-f0-9]+-[a-f0-9]+\.js:[0-9]+$|at [a-f0-9]+-[a-f0-9]+\.js:[0-9]+:[0-9]+|at [a-zA-Z0-9_]+ \([a-f0-9]+-[a-f0-9]+\.js:[0-9]+:[0-9]+\)|[a-zA-Z0-9_]+ @ [a-f0-9]+-[a-f0-9]+\.js:[0-9]+| @ )" "$LOG_FILE" > "${LOG_FILE}.cleaned"

# Replace original with cleaned version
mv "${LOG_FILE}.cleaned" "$LOG_FILE"

# Count final lines
FINAL_LINES=$(wc -l < "$LOG_FILE")
REMOVED_LINES=$((ORIGINAL_LINES - FINAL_LINES))

echo "Cleaned log file: $FINAL_LINES lines"
echo "Removed: $REMOVED_LINES lines"
echo "Reduction: $(( (REMOVED_LINES * 100) / ORIGINAL_LINES ))%"

# Verify no Statsig patterns remain
REMAINING_STATSIG=$(grep -i -E "(statsig|6365-925babc8014a1a1d\.js|9122-4eb9092e09e088b6\.js)" "$LOG_FILE" | wc -l)
REMAINING_STACK_TRACES=$(grep " @ " "$LOG_FILE" | wc -l)

if [[ $REMAINING_STATSIG -eq 0 && $REMAINING_STACK_TRACES -eq 0 ]]; then
    echo "✅ Cleanup successful - no Statsig entries or stack traces remaining"
else
    echo "⚠️  Warning: $REMAINING_STATSIG Statsig entries and $REMAINING_STACK_TRACES stack traces still present"
fi

echo "Log cleanup complete!"
