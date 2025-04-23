#!/usr/bin/env python3
import os
from collections import defaultdict

# Starting directory (default to current directory)
root_dir = input("Enter directory to scan (or press Enter for current dir): ") or "."

# Data structures
todos = []  # List of (file_path, line_num, preview)
file_lines = {}  # File path -> line count
dir_lines = defaultdict(int)  # Directory path -> total lines (including subdirs)

# Scan directory recursively
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        file_path = os.path.join(dirpath, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                file_lines[file_path] = len(lines)  # Count lines in file

                # Add to directory totals (including all parent dirs up to root)
                current_dir = dirpath
                while True:
                    dir_lines[current_dir] += len(lines)
                    parent_dir = os.path.dirname(current_dir)
                    if parent_dir == current_dir or (not parent_dir.startswith(root_dir.rstrip('/')) and parent_dir != root_dir.rstrip('/')):
                        break  # Stop when we reach the filesystem root or go above the specified root_dir
                    current_dir = parent_dir

                # Find TODOs
                for i, line in enumerate(lines, 1):
                    if "TODO" in line:
                        todos.append((file_path, i, line.strip()))
        except (IOError, UnicodeDecodeError):
            # Skip files that can't be read (e.g., binaries)
            continue

# Output TODOs
print("\n=== TODOs Found ===")
if todos:
    for file_path, line_num, preview in todos:
        print(f"{file_path}:{line_num} - {preview}")
else:
    print("No TODOs found.")

# Rank files by lines of code
print("\n=== Files by Lines of Code ===")
sorted_files = sorted(file_lines.items(), key=lambda x: x[1], reverse=True)
try:
    from tabulate import tabulate
    print(tabulate([[f, l] for f, l in sorted_files], headers=["File", "Lines"], tablefmt="simple"))
except ImportError:
    for file, lines in sorted_files:
        print(f"{file}: {lines}")

# Directory totals
print("\n=== Lines of Code by Directory ===")
sorted_dirs = sorted(dir_lines.items(), key=lambda x: x[1], reverse=True)
try:
    from tabulate import tabulate
    print(tabulate([[d, l] for d, l in sorted_dirs], headers=["Directory", "Total Lines"], tablefmt="simple"))
except ImportError:
    for dir, lines in sorted_dirs:
        print(f"{dir}: {lines}")

# Total lines of code
total_lines = sum(file_lines.values())
print(f"\nTotal lines of code: {total_lines}")
