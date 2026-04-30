#!/usr/bin/env bash
# cap.sh — capture one screenshot
# Usage: ./tools/screenshots/cap.sh <lang> <key>
#   lang: vi en ja zh th pt ru ko hi
#   key:  one of the keys in inventory.txt (e.g. home-dashboard)
set -euo pipefail

LANG_CODE="${1:-}"
KEY="${2:-}"

if [[ -z "$LANG_CODE" || -z "$KEY" ]]; then
  echo "Usage: $0 <lang> <key>" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PNG_DIR="$ROOT/store/screenshots/iphone-14-pro-max/$LANG_CODE"
WEBP_DIR="$ROOT/www/img/guide/$LANG_CODE"
mkdir -p "$PNG_DIR" "$WEBP_DIR"

PNG="$PNG_DIR/$KEY.png"
WEBP="$WEBP_DIR/$KEY.webp"

xcrun simctl io booted screenshot "$PNG" >/dev/null 2>&1
cwebp -q 80 -resize 645 0 "$PNG" -o "$WEBP" >/dev/null 2>&1
echo "✓ $LANG_CODE/$KEY"
