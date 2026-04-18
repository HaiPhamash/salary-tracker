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

let nextJobId = 1, nextShiftId = 1, nextTemplateId = 1;
let curLang = 'vi', curPage = 'home', curPeriod = 'week';
let pickedIcon = '🍜', pickedColor = '#1a2f5e';
let filterJobId = null;
let editAlws = [];
let otIsOn = false;
let curCurrency = 'jpy';
let userName = '';
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

let profiles = [];
let activeProfileId = null;

const LS_LEGACY    = 'strack_v3';
const OB_KEY       = 'strack_ob';
const PROFILES_KEY = 'strack_profiles';
const ACTIVE_KEY   = 'strack_active';
const DATA_PREFIX  = 'strack_data_';

function hydrateStoredData() {
  let changed = false;
  shifts.forEach(shift => {
    const job = jobs.find(j => j.id === shift.jobId) || null;
    if (job) {
      if (!shift.jobName)  { shift.jobName = job.name; changed = true; }
      if (!shift.jobType)  { shift.jobType = job.type; changed = true; }
      if (!shift.jobIcon)  { shift.jobIcon = job.icon; changed = true; }
      if (!shift.jobColor) { shift.jobColor = job.color; changed = true; }
      if (!Number.isFinite(shift.pay) && typeof calcShiftPay === 'function') {
        shift.pay = calcShiftPay(shift, job).total;
        changed = true;
      }
    }
  });
  return changed;
}

function persistActiveProfileDataSilently() {
  if (!activeProfileId) return;
  try {
    localStorage.setItem(DATA_PREFIX + activeProfileId, JSON.stringify({
      jobs, shifts, shiftTemplates, nextJobId, nextShiftId, nextTemplateId, curCurrency, calViewMode
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
          jobs: d.jobs || [], shifts: d.shifts || [],
          nextJobId: d.nextJobId || 1, nextShiftId: d.nextShiftId || 1,
          curCurrency: d.curCurrency || 'jpy'
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
    jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1;
    return false;
  }
  const p = profiles.find(x => x.id === activeProfileId);
  if (p) { userName = p.name; curLang = p.lang || curLang; }
  try {
    const d = JSON.parse(localStorage.getItem(DATA_PREFIX + activeProfileId) || 'null');
    if (!d) {
      jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1;
      return false;
    }
    jobs            = d.jobs            || [];
    shifts          = d.shifts          || [];
    shiftTemplates  = d.shiftTemplates  || [];
    nextJobId       = d.nextJobId       || 1;
    nextShiftId     = d.nextShiftId     || 1;
    nextTemplateId  = d.nextTemplateId  || (shiftTemplates.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1);
    curCurrency     = d.curCurrency     || curCurrency;
    calViewMode     = d.calViewMode     || 'grid';
    if (hydrateStoredData()) persistActiveProfileDataSilently();
    return true;
  } catch (e) {
    jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1;
    return false;
  }
}

function save() {
  if (!activeProfileId) return;
  try {
    localStorage.setItem(DATA_PREFIX + activeProfileId, JSON.stringify({
      jobs, shifts, shiftTemplates, nextJobId, nextShiftId, nextTemplateId, curCurrency, calViewMode
    }));
    const p = profiles.find(x => x.id === activeProfileId);
    if (p) {
      p.name = userName || p.name;
      p.lang = curLang;
      p.lastActiveAt = Date.now();
    }
    saveProfiles();
    toast('💾');
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
    else { jobs = []; shifts = []; userName = ''; }
  }
  saveProfiles();
}

function clearData() {
  const msg = (typeof L !== 'undefined' && L[curLang] && L[curLang].confirmClear) || 'Delete all data?';
  if (!confirm(msg)) return;
  jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1;
  save();
  location.reload();
}
