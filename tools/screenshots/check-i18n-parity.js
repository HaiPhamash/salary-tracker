#!/usr/bin/env node
/* Compare i18n keys across all 9 languages. Find keys missing in some languages. */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', '..', 'www', 'js', 'i18n.js');
const src = fs.readFileSync(file, 'utf8');

// Extract const L = { ... };
const m = src.match(/const L = (\{[\s\S]*?\n\});\n/);
if (!m) { console.error('Cannot find L object'); process.exit(1); }

const L = eval('(' + m[1] + ')');
const langs = Object.keys(L);
console.log('Languages found:', langs.join(', '));

const allKeys = new Set();
const keysByLang = {};
for (const lang of langs) {
  keysByLang[lang] = new Set(Object.keys(L[lang]));
  for (const k of keysByLang[lang]) allKeys.add(k);
}

console.log(`\nTotal unique keys: ${allKeys.size}`);
console.log('Keys per language:');
for (const lang of langs) console.log(`  ${lang}: ${keysByLang[lang].size}`);

console.log('\n=== Missing keys by language (vs union) ===');
let totalMissing = 0;
for (const lang of langs) {
  const missing = [...allKeys].filter(k => !keysByLang[lang].has(k));
  if (missing.length === 0) continue;
  totalMissing += missing.length;
  console.log(`\n${lang} (${missing.length} missing):`);
  missing.slice(0, 20).forEach(k => console.log('  - ' + k));
  if (missing.length > 20) console.log('  ... and ' + (missing.length - 20) + ' more');
}
console.log(`\nTotal missing entries: ${totalMissing}`);

// Also: keys with empty/null values
console.log('\n=== Keys with empty values per lang ===');
for (const lang of langs) {
  const empty = Object.entries(L[lang]).filter(([k,v]) => v === '' || v == null);
  if (empty.length) {
    console.log(`  ${lang}: ${empty.length} empty keys: ${empty.map(([k])=>k).slice(0,10).join(', ')}${empty.length>10?', …':''}`);
  }
}
