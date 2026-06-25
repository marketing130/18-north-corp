#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install serve for local static site preview
if ! command -v serve &>/dev/null; then
  npm install -g serve --quiet
fi
