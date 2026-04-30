#!/usr/bin/env node
/* Remap each step.visual in GUIDE_FULL_COPY across all 9 languages.
   The 12 steps in each language follow the same fixed order, so we replace
   the i-th `visual: '...'` occurrence per language block with NEW_VISUALS[i].
   Run from project root: node tools/screenshots/remap-visuals.js
*/
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', '..', 'www', 'js', 'guide.js');

// 12 steps × order matches the new guide content
const NEW_VISUALS = [
  'home-dashboard',     // 01 Tổng quan
  'home-recent',        // 02 Trang chủ
  'add-shift-form',     // 03 Thêm/sửa/xóa ca
  'add-list',           // 04 Lịch & danh sách
  'settings-job-edit',  // 05 Cấu hình nơi làm việc
  'expense-form',       // 06 Ghi chi tiêu hằng ngày
  'settings-categories',// 07 Cài đặt > Danh mục chi tiêu
  'settings-recurring', // 08 Cài đặt > Chi tiêu định kỳ
  'report-month',       // 09 Báo cáo
  'settings-root',      // 10 Tất cả phân mục Cài đặt
  'settings-language',  // 11 Chuyển đổi ngôn ngữ
  'jp-result'           // 12 Japan Take-home Plus
];

const LANGS = ['vi', 'en', 'ja', 'zh', 'th', 'pt', 'ru', 'ko', 'hi'];

let src = fs.readFileSync(FILE, 'utf8');

let totalReplaced = 0;

for (const lang of LANGS) {
  // Find the start of this language block: e.g. "  vi: {"
  const openRe = new RegExp(`\\n  ${lang}:\\s*\\{`);
  const startMatch = src.match(openRe);
  if (!startMatch) {
    console.error(`Cannot find language block: ${lang}`);
    process.exit(1);
  }
  const blockStart = startMatch.index + startMatch[0].length;

  // Determine block end: the next "\n  <next-lang>: {" or "\n};\n\nfunction"
  let blockEnd = src.length;
  for (const other of LANGS) {
    if (other === lang) continue;
    const nextRe = new RegExp(`\\n  ${other}:\\s*\\{`);
    const m = src.slice(blockStart).match(nextRe);
    if (m && m.index !== undefined) {
      blockEnd = Math.min(blockEnd, blockStart + m.index);
    }
  }
  // Also clamp to closing of GUIDE_FULL_COPY if still at end of file
  const tailRe = /\n\};\n\nfunction getGuideCopy/;
  const tailM = src.slice(blockStart).match(tailRe);
  if (tailM && tailM.index !== undefined) {
    blockEnd = Math.min(blockEnd, blockStart + tailM.index);
  }

  const block = src.slice(blockStart, blockEnd);
  let i = 0;
  const replaced = block.replace(/visual:\s*'([^']+)'/g, (m) => {
    if (i >= NEW_VISUALS.length) return m;
    const nv = NEW_VISUALS[i++];
    return `visual: '${nv}'`;
  });

  if (i !== NEW_VISUALS.length) {
    console.error(`[${lang}] expected ${NEW_VISUALS.length} visuals, found ${i}`);
    process.exit(1);
  }
  totalReplaced += i;
  src = src.slice(0, blockStart) + replaced + src.slice(blockEnd);
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`Replaced ${totalReplaced} visual fields across ${LANGS.length} languages.`);
