#!/usr/bin/env bash
# session.sh — interactive capture session for one language
# Usage: ./tools/screenshots/session.sh <lang> [--start <key>]
#   lang: vi en ja zh th pt ru ko hi
#   --start <key>: resume from a specific key (skip earlier ones)
#
# Controls per shot:
#   ENTER  capture this shot
#   s      skip
#   r      retake (capture again, overwriting)
#   b      go back to previous key
#   q      quit
set -euo pipefail

LANG_CODE="${1:-}"
START_KEY=""
if [[ "${2:-}" == "--start" ]]; then START_KEY="${3:-}"; fi

if [[ -z "$LANG_CODE" ]]; then
  echo "Usage: $0 <lang> [--start <key>]" >&2
  echo "Languages: vi en ja zh th pt ru ko hi" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
INVENTORY="$ROOT/tools/screenshots/inventory.txt"
PNG_DIR="$ROOT/store/screenshots/iphone-14-pro-max/$LANG_CODE"
WEBP_DIR="$ROOT/www/img/guide/$LANG_CODE"
mkdir -p "$PNG_DIR" "$WEBP_DIR"

# Load inventory into arrays
KEYS=()
DESCS=()
while IFS='|' read -r K D; do
  [[ "$K" =~ ^# ]] && continue
  [[ -z "$K" ]] && continue
  KEYS+=("$K")
  DESCS+=("$D")
done < "$INVENTORY"

TOTAL=${#KEYS[@]}
echo ""
echo "═══════════════════════════════════════════════"
echo "  Capture session — language: $LANG_CODE"
echo "  Total shots: $TOTAL"
echo "  PNG output:  $PNG_DIR"
echo "  WebP output: $WEBP_DIR"
echo "═══════════════════════════════════════════════"
echo ""

i=0
if [[ -n "$START_KEY" ]]; then
  for ((j=0; j<TOTAL; j++)); do
    if [[ "${KEYS[$j]}" == "$START_KEY" ]]; then i=$j; break; fi
  done
fi

while [[ $i -lt $TOTAL ]]; do
  KEY="${KEYS[$i]}"
  DESC="${DESCS[$i]}"
  PNG="$PNG_DIR/$KEY.png"
  WEBP="$WEBP_DIR/$KEY.webp"
  EXISTS=""
  [[ -f "$PNG" ]] && EXISTS=" [already captured]"

  printf "\n[%2d/%d] %s%s\n" "$((i+1))" "$TOTAL" "$KEY" "$EXISTS"
  printf "       → %s\n" "$DESC"
  printf "       [ENTER=capture] [s=skip] [b=back] [q=quit] > "
  read -r ANSWER || ANSWER="q"

  case "$ANSWER" in
    [Qq])
      echo "Quit at index $i (key=$KEY). Resume with: --start $KEY"
      exit 0
      ;;
    [Ss])
      echo "       (skipped)"
      ((i++))
      ;;
    [Bb])
      if [[ $i -gt 0 ]]; then ((i--)); fi
      ;;
    *)
      xcrun simctl io booted screenshot "$PNG" >/dev/null 2>&1
      cwebp -q 80 -resize 645 0 "$PNG" -o "$WEBP" >/dev/null 2>&1
      echo "       ✓ saved"
      ((i++))
      ;;
  esac
done

echo ""
echo "═══════════════════════════════════════════════"
echo "  Done — language: $LANG_CODE"
echo "  Captured PNGs: $(ls -1 "$PNG_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ')"
echo "═══════════════════════════════════════════════"
