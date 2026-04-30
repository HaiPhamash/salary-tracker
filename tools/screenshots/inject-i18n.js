#!/usr/bin/env node
/* Inject 53 missing keys × 7 languages into www/js/i18n.js
   Insert before the closing brace of each language block. */
const fs = require('fs');
const path = require('path');

const I18N_FILE = path.join(__dirname, '..', '..', 'www', 'js', 'i18n.js');
const ADDITIONS = require('./i18n-additions.json');

let src = fs.readFileSync(I18N_FILE, 'utf8');

const LANGS = ['ja', 'zh', 'th', 'pt', 'ru', 'ko', 'hi'];

function escStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

for (const lang of LANGS) {
  const additions = ADDITIONS[lang];
  if (!additions) continue;

  // Find this language's block and the next language's block
  const startRe = new RegExp(`\\n  ${lang}: \\{`);
  const startMatch = src.match(startRe);
  if (!startMatch) {
    console.error(`Cannot find ${lang}: { in file`);
    process.exit(1);
  }
  const blockStart = startMatch.index + startMatch[0].length;

  // Find the closing }, of this block (next is either another lang or end of L)
  // The block ends with "  }," (followed by newline + space + nextLang: {)
  // OR with "  }" (followed by newline + "};\n")
  const tail = src.slice(blockStart);
  // Match the first "  }," or "  }\n};" depending on whether more langs follow
  let endIdx = -1;
  const langs = ['vi', 'en', 'ja', 'zh', 'th', 'pt', 'ru', 'ko', 'hi'];
  for (const otherLang of langs) {
    if (otherLang === lang) continue;
    const re = new RegExp(`\\n  ${otherLang}: \\{`);
    const m = tail.match(re);
    if (m && m.index !== undefined) {
      if (endIdx === -1 || m.index < endIdx) endIdx = m.index;
    }
  }
  // Also handle end of L
  const endRe = /\n\};/;
  const endM = tail.match(endRe);
  if (endM && endM.index !== undefined) {
    if (endIdx === -1 || endM.index < endIdx) endIdx = endM.index;
  }
  if (endIdx === -1) {
    console.error(`Cannot find end of block for ${lang}`);
    process.exit(1);
  }

  // The block content goes from blockStart to blockStart+endIdx.
  // Find the actual closing "}" right before tail[endIdx]
  // Walking back from endIdx, find the closing brace
  const blockChunk = tail.slice(0, endIdx);
  // The last "  }," or "  }" within blockChunk closes the block
  // We want to insert before that closing "}".

  // Strategy: insert text immediately before the LAST line that contains only "  }," or "  }"
  const lines = blockChunk.split('\n');
  let insertLineIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (trimmed === '},' || trimmed === '}') {
      insertLineIdx = i;
      break;
    }
  }
  if (insertLineIdx === -1) {
    console.error(`Cannot find closing brace line for ${lang}`);
    process.exit(1);
  }

  // The previous content line should end with comma. Make sure.
  let prevLine = lines[insertLineIdx - 1] || '';
  // Trim trailing whitespace, ensure it ends with comma
  const prevTrimmed = prevLine.trimEnd();
  if (!prevTrimmed.endsWith(',')) {
    lines[insertLineIdx - 1] = prevTrimmed + ',';
  }

  // Build the new lines for additions
  const newLines = [];
  newLines.push(`    /* P0-2 i18n parity additions */`);
  for (const [key, val] of Object.entries(additions)) {
    newLines.push(`    ${key}: '${escStr(val)}',`);
  }
  // Remove trailing comma on the very last addition
  newLines[newLines.length - 1] = newLines[newLines.length - 1].replace(/,$/, '');

  // Insert before the closing brace line
  lines.splice(insertLineIdx, 0, ...newLines);

  const newBlock = lines.join('\n');
  src = src.slice(0, blockStart) + newBlock + tail.slice(endIdx);
}

fs.writeFileSync(I18N_FILE, src, 'utf8');
console.log(`Injected ${LANGS.length} languages × ${Object.keys(ADDITIONS.ja).length} keys`);
