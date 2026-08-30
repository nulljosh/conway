#!/bin/bash
# Deploy the web surface to Cloudflare Pages. Stages only the web files so the
# Xcode projects (which Pages would happily upload) stay out of the bundle.
set -euo pipefail
cd "$(dirname "$0")/.."
BUILD=$(mktemp -d)
cp index.html play.html privacy.html life.js icon.svg _headers "$BUILD/"
npx --yes wrangler@latest pages deploy "$BUILD" --project-name conway --branch main --commit-dirty=true
rm -rf "$BUILD"
