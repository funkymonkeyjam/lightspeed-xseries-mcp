#!/bin/bash
# deploy-to-live.sh
# Deploys the built Lightspeed MCP server from the dev repo to the live location.
#
# Dev repo:  /Users/scottwallace/CIO Projects/lightspeed-xseries-mcp
# Live:      /Users/scottwallace/CIO Projects/MCP Servers/lightspeed-xseries-mcp
#
# Usage: ./deploy-to-live.sh
#
# What it does:
#   1. Builds the dev repo (npm run build)
#   2. Syncs runtime artifacts to the live location
#   3. Removes dev-only files from the live location

set -euo pipefail

DEV_DIR="/Users/scottwallace/CIO Projects/lightspeed-xseries-mcp"
LIVE_DIR="/Users/scottwallace/CIO Projects/MCP Servers/lightspeed-xseries-mcp"

echo "=== Lightspeed MCP Server: Deploy to Live ==="
echo "Dev:  $DEV_DIR"
echo "Live: $LIVE_DIR"
echo

# Step 1: Build
echo "--- Building dev repo ---"
cd "$DEV_DIR"
npm run build
echo

# Step 2: Ensure live directory exists
mkdir -p "$LIVE_DIR"

# Step 3: Sync runtime artifacts
echo "--- Syncing runtime artifacts to live ---"
rsync -av --delete \
  --include='dist/***' \
  --include='node_modules/***' \
  --include='package.json' \
  --include='package-lock.json' \
  --include='README.md' \
  --include='docs/***' \
  --exclude='*' \
  "$DEV_DIR/" "$LIVE_DIR/"
echo

# Step 4: Remove dev-only files from live
echo "--- Cleaning dev-only files from live ---"
cd "$LIVE_DIR"
rm -rf .git src tsconfig.json .gitignore .npmignore Makefile .DS_Store
echo "Removed: .git, src, tsconfig.json, .gitignore, .npmignore, Makefile, .DS_Store"
echo

# Step 5: Verify
echo "--- Verification ---"
echo "Live commit reference:"
cat "$LIVE_DIR/dist/index.js" | head -1 || echo "(no dist/index.js found)"
echo
echo "Live directory contents:"
ls -1 "$LIVE_DIR"
echo
echo "=== Deploy complete ==="
