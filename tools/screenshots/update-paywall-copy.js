#!/usr/bin/env node
/* Replace user-facing "RevenueCat is not configured" copy with proper
   marketing/error text in all 9 languages.
   Run: node tools/screenshots/update-paywall-copy.js  */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', '..', 'www', 'js', 'jp-payroll-ui.js');

// New copy for each language
const COPY = {
  vi: {
    paywallBody: 'Mở khoá toàn bộ tính toán take-home, Nenkin, Shakai hoken và phân tích thuế chi tiết theo quy tắc 2026.',
    purchaseUnavailable: 'Cửa hàng tạm thời chưa sẵn sàng. Vui lòng thử lại sau ít phút.',
    restoreUnavailable: 'Khôi phục tạm thời chưa sẵn sàng. Vui lòng thử lại sau.'
  },
  en: {
    paywallBody: 'Unlock the full take-home calculation with Nenkin, Shakai hoken, and detailed tax breakdowns based on 2026 rules.',
    purchaseUnavailable: 'The store is not ready yet. Please try again in a moment.',
    restoreUnavailable: 'Restore is not ready yet. Please try again in a moment.'
  },
  ja: {
    paywallBody: '2026年ルールに基づく手取り計算と、年金、社会保険、税金の詳細な内訳をすべて利用できます。',
    purchaseUnavailable: 'ストアの準備ができていません。しばらくしてからお試しください。',
    restoreUnavailable: '復元の準備ができていません。しばらくしてからお試しください。'
  },
  zh: {
    paywallBody: '解锁基于 2026 年规则的完整到手收入计算，包含 Nenkin、Shakai hoken 和详细税费明细。',
    purchaseUnavailable: '商店尚未就绪，请稍后再试。',
    restoreUnavailable: '恢复尚未就绪，请稍后再试。'
  },
  th: {
    paywallBody: 'ปลดล็อกการคำนวณรายได้สุทธิแบบครบถ้วน พร้อม Nenkin, Shakai hoken และรายละเอียดภาษีตามกฎปี 2026',
    purchaseUnavailable: 'ร้านค้ายังไม่พร้อม โปรดลองอีกครั้งในอีกสักครู่',
    restoreUnavailable: 'การกู้คืนยังไม่พร้อม โปรดลองอีกครั้งในอีกสักครู่'
  },
  pt: {
    paywallBody: 'Desbloqueie o cálculo completo de salário líquido com Nenkin, Shakai hoken e detalhamento fiscal pelas regras de 2026.',
    purchaseUnavailable: 'A loja ainda não está pronta. Tente novamente em instantes.',
    restoreUnavailable: 'A restauração ainda não está pronta. Tente novamente em instantes.'
  },
  ru: {
    paywallBody: 'Разблокируйте полный расчёт зарплаты на руки с Nenkin, Shakai hoken и детальной разбивкой налогов по правилам 2026 года.',
    purchaseUnavailable: 'Магазин пока не готов. Попробуйте ещё раз через минуту.',
    restoreUnavailable: 'Восстановление пока не готово. Попробуйте ещё раз через минуту.'
  },
  ko: {
    paywallBody: '2026년 규칙 기반 실수령액 전체 계산과 Nenkin, Shakai hoken, 상세 세금 분석을 모두 사용하세요.',
    purchaseUnavailable: '스토어가 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.',
    restoreUnavailable: '복원이 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.'
  },
  hi: {
    paywallBody: '2026 नियमों पर आधारित पूर्ण टेक-होम गणना, Nenkin, Shakai hoken और विस्तृत कर विश्लेषण अनलॉक करें।',
    purchaseUnavailable: 'स्टोर अभी तैयार नहीं है। कुछ क्षण बाद पुनः प्रयास करें।',
    restoreUnavailable: 'रिस्टोर अभी तैयार नहीं है। कुछ क्षण बाद पुनः प्रयास करें।'
  }
};

let src = fs.readFileSync(FILE, 'utf8');
let count = 0;

function replaceInLangBlock(lang, key, newValue) {
  // Find this language's block: search for a quoted key within the language's section
  // Simpler: walk through file and find occurrences of `${key}: '...'` after the
  // language label.
  const langStart = src.indexOf(`  ${lang}: {`);
  if (langStart === -1) {
    console.error(`Cannot find lang block: ${lang}`);
    return false;
  }
  // Find end (next "  X: {" or "};" at column 0)
  const langs = ['vi', 'en', 'ja', 'zh', 'th', 'pt', 'ru', 'ko', 'hi'];
  let langEnd = src.length;
  for (const other of langs) {
    if (other === lang) continue;
    const idx = src.indexOf(`  ${other}: {`, langStart + 1);
    if (idx !== -1 && idx < langEnd) langEnd = idx;
  }
  const closeIdx = src.indexOf('\n};', langStart);
  if (closeIdx !== -1 && closeIdx < langEnd) langEnd = closeIdx;

  // In this slice, replace `${key}: '...'` (non-greedy, allow escapes)
  const slice = src.slice(langStart, langEnd);
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escapedKey}:\\s*)'((?:\\\\'|[^'])*)'`);
  if (!re.test(slice)) {
    console.error(`Cannot find ${lang}.${key}`);
    return false;
  }
  const newSlice = slice.replace(re, (_m, prefix) => `${prefix}'${newValue.replace(/'/g, "\\'")}'`);
  src = src.slice(0, langStart) + newSlice + src.slice(langEnd);
  count++;
  return true;
}

for (const lang of Object.keys(COPY)) {
  for (const key of Object.keys(COPY[lang])) {
    replaceInLangBlock(lang, key, COPY[lang][key]);
  }
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`Replaced ${count} entries across ${Object.keys(COPY).length} languages.`);
