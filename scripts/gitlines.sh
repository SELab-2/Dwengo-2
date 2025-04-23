#!/bin/bash

# Ensure that the user has provided a branch
if [ -z "$1" ]; then
  echo "Usage: $0 <branch> [username]"
  exit 1
fi

BRANCH=$1
USER=${2:-$(whoami)}  # If no username is provided, use the current user

git log --author="$USER" --shortstat "$BRANCH" | \
awk '/^ [0-9]/ { f += $1; i += $4; d += $6 } \
END { printf("%d files changed, %d insertions(+), %d deletions(-)\n", f, i, d) }'

