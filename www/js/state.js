/* =========================================================================
   State — currencies, default data, runtime variables, persistence
   ========================================================================= */

const LOCALE_MAP = {
  vi: 'vi-VN', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN', th: 'th-TH',
  pt: 'pt-BR', ru: 'ru-RU', ko: 'ko-KR', hi: 'hi-IN'
};

const CURRENCIES = [
  { id: 'jpy', sym: '¥',  label: 'JPY (¥)',  name: '日本円' },
  { id: 'vnd', sym: '₫',  label: 'VND (₫)',  name: 'Tiếng Việt' },
  { id: 'usd', sym: '$',  label: 'USD ($)',  name: 'US Dollar' },
  { id: 'cny', sym: '¥',  label: 'CNY (¥)',  name: '人民币' },
  { id: 'thb', sym: '฿',  label: 'THB (฿)',  name: 'Thai Baht' },
  { id: 'brl', sym: 'R$', label: 'BRL (R$)', name: 'Real Brasileiro' },
  { id: 'rub', sym: '₽',  label: 'RUB (₽)',  name: 'Рубль' },
  { id: 'krw', sym: '₩',  label: 'KRW (₩)',  name: '한국 원' },
  { id: 'inr', sym: '₹',  label: 'INR (₹)',  name: 'Indian Rupee' }
];

let jobs = [];
let shifts = [];
let shiftTemplates = [];
let expenses = [];
let expenseCategories = [];
let recurringExpenses = [];

let nextJobId = 1, nextShiftId = 1, nextTemplateId = 1;
let nextExpenseId = 1, nextExpenseCategoryId = 1, nextRecurringExpenseId = 1;
let curLang = 'vi', curPage = 'home', curPeriod = 'week';
let pickedIcon = '🍜', pickedColor = '#1a2f5e';
let pickedExpenseCategoryIcon = '🍽️', pickedExpenseCategoryColor = '#ef4444';
let filterJobId = null;
let editAlws = [];
let editDeds = [];
let otIsOn = false;
let curCurrency = 'jpy';
let userName = '';
let monthlyGoal = 0;
let curJobType = 'hourly';
let calViewMode = 'grid';
let calCursor = null;
let calSelectedDate = null;
let editShiftId = null;
let homeExpandedDates = {};
let reportWeekCursor = null;
let reportMonthCursor = null;
let reportMonthWindowStart = null;
let reportQuarterYear = null;
let reportQuarterIndex = null;
let reportYearCursor = null;
let editExpenseId = null;
let editExpenseCategoryId = null;
let editRecurringExpenseId = null;

let profiles = [];
let activeProfileId = null;
let jpPayrollProfile = null;

const LS_LEGACY    = 'strack_v3';
const OB_KEY       = 'strack_ob';
const PROFILES_KEY = 'strack_profiles';
const ACTIVE_KEY   = 'strack_active';
const DATA_PREFIX  = 'strack_data_';

const DEFAULT_EXPENSE_CATEGORY_SEEDS = [
  { key: 'food',          icon: '🍽️', color: '#ef4444' },
  { key: 'transport',     icon: '🚆', color: '#2563eb' },
  { key: 'home',          icon: '🏠', color: '#0f766e' },
  { key: 'shopping',      icon: '🛒', color: '#d97706' },
  { key: 'health',        icon: '🏥', color: '#db2777' },
  { key: 'education',     icon: '📚', color: '#7c3aed' },
  { key: 'entertainment', icon: '🎮', color: '#0891b2' },
  { key: 'family',        icon: '👪', color: '#16a34a' },
  { key: 'other',         icon: '📌', color: '#64748b' }
];

const DEFAULT_EXPENSE_CATEGORY_NAMES = {
  vi: ['Ăn uống', 'Đi lại', 'Nhà cửa', 'Mua sắm', 'Sức khỏe', 'Học tập', 'Giải trí', 'Gia đình', 'Khác'],
  en: ['Food', 'Transport', 'Home', 'Shopping', 'Health', 'Education', 'Entertainment', 'Family', 'Other'],
  ja: ['食費', '交通', '住居', '買い物', '健康', '学習', '娯楽', '家族', 'その他'],
  zh: ['餐饮', '交通', '住房', '购物', '健康', '学习', '娱乐', '家庭', '其他'],
  th: ['อาหาร', 'เดินทาง', 'บ้าน', 'ช้อปปิ้ง', 'สุขภาพ', 'การเรียน', 'บันเทิง', 'ครอบครัว', 'อื่นๆ'],
  pt: ['Alimentação', 'Transporte', 'Casa', 'Compras', 'Saúde', 'Educação', 'Lazer', 'Família', 'Outros'],
  ru: ['Еда', 'Транспорт', 'Дом', 'Покупки', 'Здоровье', 'Учёба', 'Развлечения', 'Семья', 'Другое'],
  ko: ['식비', '교통', '주거', '쇼핑', '건강', '학습', '엔터테인먼트', '가족', '기타'],
  hi: ['भोजन', 'यातायात', 'घर', 'खरीदारी', 'स्वास्थ्य', 'शिक्षा', 'मनोरंजन', 'परिवार', 'अन्य']
};

function getDefaultExpenseCategoryIndex(key) {
  return DEFAULT_EXPENSE_CATEGORY_SEEDS.findIndex(seed => seed.key === key);
}

function getDefaultExpenseCategoryName(key, lang) {
  const index = getDefaultExpenseCategoryIndex(key);
  if (index < 0) return '';
  const labels = DEFAULT_EXPENSE_CATEGORY_NAMES[lang] || DEFAULT_EXPENSE_CATEGORY_NAMES.en;
  return labels[index] || DEFAULT_EXPENSE_CATEGORY_NAMES.en[index] || '';
}

function isDefaultExpenseCategoryName(key, name) {
  if (!key || !name) return false;
  return Object.values(DEFAULT_EXPENSE_CATEGORY_NAMES).some(labels => {
    const index = getDefaultExpenseCategoryIndex(key);
    return index >= 0 && labels[index] === name;
  });
}

function getExpenseCategoryDisplayName(category) {
  if (!category) return '';
  if (category.key && category.userModified !== true) {
    return getDefaultExpenseCategoryName(category.key, curLang) || category.name || '';
  }
  return category.name || '';
}

function createDefaultExpenseCategories(lang) {
  const labels = DEFAULT_EXPENSE_CATEGORY_NAMES[lang] || DEFAULT_EXPENSE_CATEGORY_NAMES.en;
  return DEFAULT_EXPENSE_CATEGORY_SEEDS.map((seed, index) => ({
    id: nextExpenseCategoryId++,
    key: seed.key,
    name: labels[index] || DEFAULT_EXPENSE_CATEGORY_NAMES.en[index],
    icon: seed.icon,
    color: seed.color,
    userModified: false,
    createdAt: Date.now()
  }));
}

function resetFinanceData() {
  expenses = [];
  expenseCategories = [];
  recurringExpenses = [];
  nextExpenseId = 1;
  nextExpenseCategoryId = 1;
  nextRecurringExpenseId = 1;
  editExpenseId = null;
  editExpenseCategoryId = null;
  editRecurringExpenseId = null;
  ensureFinanceData();
}

function ensureFinanceData() {
  let changed = false;
  if (!Array.isArray(expenses)) { expenses = []; changed = true; }
  if (!Array.isArray(expenseCategories)) { expenseCategories = []; changed = true; }
  if (!Array.isArray(recurringExpenses)) { recurringExpenses = []; changed = true; }

  if (!expenseCategories.length) {
    expenseCategories = createDefaultExpenseCategories(curLang);
    changed = true;
  }

  const maxExpenseId = expenses.reduce((m, item) => Math.max(m, Number(item.id) || 0), 0);
  const maxCategoryId = expenseCategories.reduce((m, item) => Math.max(m, Number(item.id) || 0), 0);
  const maxRecurringId = recurringExpenses.reduce((m, item) => Math.max(m, Number(item.id) || 0), 0);
  if (!nextExpenseId || nextExpenseId <= maxExpenseId) { nextExpenseId = maxExpenseId + 1; changed = true; }
  if (!nextExpenseCategoryId || nextExpenseCategoryId <= maxCategoryId) { nextExpenseCategoryId = maxCategoryId + 1; changed = true; }
  if (!nextRecurringExpenseId || nextRecurringExpenseId <= maxRecurringId) { nextRecurringExpenseId = maxRecurringId + 1; changed = true; }

  expenses.forEach(item => {
    const before = JSON.stringify(item);
    item.amount = Math.max(0, Math.round(Number(item.amount) || 0));
    item.date = item.date || (typeof localYmd === 'function' ? localYmd() : '');
    const category = expenseCategories.find(c => c.id === item.categoryId) || expenseCategories[0] || null;
    if (category) {
      if (!item.categoryName) item.categoryName = getExpenseCategoryDisplayName(category) || category.name;
      if (!item.categoryIcon) item.categoryIcon = category.icon;
      if (!item.categoryColor) item.categoryColor = category.color;
      if (!item.categoryId) item.categoryId = category.id;
    }
    if (!item.createdAt) item.createdAt = Date.now();
    if (before !== JSON.stringify(item)) changed = true;
  });

  recurringExpenses.forEach(item => {
    const before = JSON.stringify(item);
    item.amount = Math.max(0, Math.round(Number(item.amount) || 0));
    item.dayOfMonth = Math.min(31, Math.max(1, parseInt(item.dayOfMonth, 10) || 1));
    item.startDate = item.startDate || (typeof localYmd === 'function' ? localYmd() : '');
    item.active = item.active !== false;
    const category = expenseCategories.find(c => c.id === item.categoryId) || expenseCategories[0] || null;
    if (category && !item.categoryId) item.categoryId = category.id;
    if (!item.createdAt) item.createdAt = Date.now();
    if (before !== JSON.stringify(item)) changed = true;
  });

  expenseCategories.forEach(category => {
    const before = JSON.stringify(category);
    if (category.key && category.userModified !== true) {
      category.userModified = !isDefaultExpenseCategoryName(category.key, category.name);
    }
    if (before !== JSON.stringify(category)) changed = true;
  });

  return changed;
}

function hydrateStoredData() {
  let changed = false;
  shifts.forEach(shift => {
    const job = jobs.find(j => j.id === shift.jobId) || null;
    if (job) {
      if (!shift.jobName)  { shift.jobName = job.name; changed = true; }
      if (!shift.jobType)  { shift.jobType = job.type; changed = true; }
      if (!shift.jobIcon)  { shift.jobIcon = job.icon; changed = true; }
      if (!shift.jobColor) { shift.jobColor = job.color; changed = true; }
      if (typeof calcShiftPay === 'function') {
        const recomputed = calcShiftPay(shift, job).total;
        if (shift.pay !== recomputed) {
          shift.pay = recomputed;
          changed = true;
        }
      }
    }
  });
  return changed;
}

function persistActiveProfileDataSilently() {
  if (!activeProfileId) return;
  try {
    localStorage.setItem(DATA_PREFIX + activeProfileId, JSON.stringify({
      jobs, shifts, shiftTemplates,
      expenses, expenseCategories, recurringExpenses,
      nextJobId, nextShiftId, nextTemplateId,
      nextExpenseId, nextExpenseCategoryId, nextRecurringExpenseId,
      curCurrency, calViewMode, monthlyGoal, jpPayrollProfile
    }));
  } catch (e) {}
}

function loadProfiles() {
  try { profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]'); } catch (e) { profiles = []; }
  activeProfileId = localStorage.getItem(ACTIVE_KEY) || null;

  if (profiles.length === 0) {
    const legacy = localStorage.getItem(LS_LEGACY);
    if (legacy) {
      try {
        const d = JSON.parse(legacy);
        const id = 'p_legacy_' + Date.now();
        const p = {
          id, name: d.userName || 'User', lang: d.curLang || 'vi',
          createdAt: Date.now(), lastActiveAt: Date.now()
        };
        profiles.push(p);
        activeProfileId = id;
        localStorage.setItem(DATA_PREFIX + id, JSON.stringify({
          jobs: d.jobs || [],
          shifts: d.shifts || [],
          shiftTemplates: d.shiftTemplates || [],
          expenses: [],
          expenseCategories: [],
          recurringExpenses: [],
          nextJobId: d.nextJobId || 1,
          nextShiftId: d.nextShiftId || 1,
          nextTemplateId: d.nextTemplateId || 1,
          nextExpenseId: 1,
          nextExpenseCategoryId: 1,
          nextRecurringExpenseId: 1,
          curCurrency: d.curCurrency || 'jpy',
          calViewMode: d.calViewMode || 'grid',
          monthlyGoal: Number(d.monthlyGoal) || 0,
          jpPayrollProfile: d.jpPayrollProfile || null
        }));
        localStorage.removeItem(LS_LEGACY);
        saveProfiles();
      } catch (e) {}
    }
  }
}

function saveProfiles() {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    if (activeProfileId) localStorage.setItem(ACTIVE_KEY, activeProfileId);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch (e) {}
}

function loadProfileData() {
  if (!activeProfileId) {
    jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1; monthlyGoal = 0; jpPayrollProfile = null;
    resetFinanceData();
    return false;
  }
  const p = profiles.find(x => x.id === activeProfileId);
  if (p) { userName = p.name; curLang = p.lang || curLang; }
  try {
    const d = JSON.parse(localStorage.getItem(DATA_PREFIX + activeProfileId) || 'null');
    if (!d) {
      jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1; monthlyGoal = 0; jpPayrollProfile = null;
      resetFinanceData();
      return false;
    }
    jobs            = d.jobs            || [];
    shifts          = d.shifts          || [];
    shiftTemplates  = d.shiftTemplates  || [];
    expenses        = d.expenses        || [];
    expenseCategories = d.expenseCategories || [];
    recurringExpenses = d.recurringExpenses || [];
    nextJobId       = d.nextJobId       || 1;
    nextShiftId     = d.nextShiftId     || 1;
    nextTemplateId  = d.nextTemplateId  || (shiftTemplates.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1);
    nextExpenseId   = d.nextExpenseId   || (expenses.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1);
    nextExpenseCategoryId = d.nextExpenseCategoryId || (expenseCategories.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1);
    nextRecurringExpenseId = d.nextRecurringExpenseId || (recurringExpenses.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1);
    curCurrency     = d.curCurrency     || curCurrency;
    calViewMode     = d.calViewMode     || 'grid';
    monthlyGoal     = Number(d.monthlyGoal) || 0;
    jpPayrollProfile = d.jpPayrollProfile || null;
    const financeChanged = ensureFinanceData();
    if (hydrateStoredData() || financeChanged) persistActiveProfileDataSilently();
    return true;
  } catch (e) {
    jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1; monthlyGoal = 0; jpPayrollProfile = null;
    resetFinanceData();
    return false;
  }
}

function save(opts) {
  if (!activeProfileId) return;
  try {
    localStorage.setItem(DATA_PREFIX + activeProfileId, JSON.stringify({
      jobs, shifts, shiftTemplates,
      expenses, expenseCategories, recurringExpenses,
      nextJobId, nextShiftId, nextTemplateId,
      nextExpenseId, nextExpenseCategoryId, nextRecurringExpenseId,
      curCurrency, calViewMode, monthlyGoal, jpPayrollProfile
    }));
    const p = profiles.find(x => x.id === activeProfileId);
    if (p) {
      p.name = userName || p.name;
      p.lang = curLang;
      p.lastActiveAt = Date.now();
    }
    saveProfiles();
    if (opts && opts.toast) toast('💾');
  } catch (e) {}
}

function createProfile(name, lang) {
  const id = 'p_' + Date.now();
  const p = { id, name: name || 'User', lang: lang || 'vi', createdAt: Date.now(), lastActiveAt: Date.now() };
  profiles.push(p);
  activeProfileId = id;
  userName = p.name;
  curLang  = p.lang;
  curCurrency = 'jpy';

  jobs = [];
  shifts = [];
  shiftTemplates = [];
  nextJobId = 1;
  nextShiftId = 1;
  nextTemplateId = 1;
  monthlyGoal = 0;
  jpPayrollProfile = null;
  resetFinanceData();
  save();
  return p;
}

function switchProfile(id) {
  const p = profiles.find(x => x.id === id);
  if (!p) return false;
  activeProfileId = id;
  saveProfiles();
  loadProfileData();
  return true;
}

function deleteProfile(id) {
  try { localStorage.removeItem(DATA_PREFIX + id); } catch (e) {}
  profiles = profiles.filter(p => p.id !== id);
  if (activeProfileId === id) {
    activeProfileId = profiles.length ? profiles[0].id : null;
    if (activeProfileId) loadProfileData();
    else { jobs = []; shifts = []; userName = ''; jpPayrollProfile = null; resetFinanceData(); }
  }
  saveProfiles();
}

async function clearData() {
  const msg = (typeof L !== 'undefined' && L[curLang] && L[curLang].confirmClear) || 'Delete all data?';
  if (!(await confirmDialog(msg))) return;
  jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1; monthlyGoal = 0; jpPayrollProfile = null;
  resetFinanceData();
  save();
  location.reload();
}
