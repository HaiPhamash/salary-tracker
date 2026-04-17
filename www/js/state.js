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

const DEFAULT_JOBS = [
  {
    id: 1, name: 'Nhà hàng Sakura', type: 'hourly', rate: 1550,
    otThreshold: 8, otMultiplier: 1.25, otType: 'multiplier', workDays: 22,
    allowances: [
      { name: '交通費', amount: 500, per: 'day' },
      { name: '食事代', amount: 300, per: 'day' }
    ],
    icon: '🍜', color: '#1a2f5e'
  },
  {
    id: 2, name: 'Kombini FamilyMart', type: 'daily', rate: 8500,
    otThreshold: 8, otMultiplier: 1.25, otType: 'multiplier', workDays: 22,
    allowances: [{ name: '交通費', amount: 300, per: 'day' }],
    icon: '🏪', color: '#e85d04'
  },
  {
    id: 3, name: 'IT Support ABC', type: 'monthly', rate: 220000,
    otThreshold: 8, otMultiplier: 1.35, otType: 'manual', workDays: 22,
    allowances: [
      { name: '住宅手当', amount: 10000, per: 'month' },
      { name: '食事代',   amount: 5000,  per: 'month' }
    ],
    icon: '💻', color: '#8b5cf6'
  }
];

const DEFAULT_SHIFTS = [
  { id: 1, date: '2026-04-15', start: '09:00', end: '19:00', breakMin: 60, hours: 9,  regularH: 8, otH: 1, isOT: false, manualOT: 0,    pay: 16163, jobId: 1, note: '' },
  { id: 2, date: '2026-04-15', start: '',      end: '',      breakMin: 0,  hours: 0,  regularH: 0, otH: 0, isOT: true,  manualOT: 0,    pay: 11925, jobId: 2, note: '祝日' },
  { id: 3, date: '2026-04-14', start: '09:00', end: '22:00', breakMin: 60, hours: 12, regularH: 8, otH: 4, isOT: false, manualOT: 0,    pay: 19840, jobId: 1, note: '残業あり' },
  { id: 4, date: '2026-04-12', start: '',      end: '',      breakMin: 0,  hours: 0,  regularH: 0, otH: 0, isOT: true,  manualOT: 3000, pay: 13000, jobId: 3, note: '土曜日出勤' },
  { id: 5, date: '2026-04-11', start: '09:00', end: '18:00', breakMin: 60, hours: 8,  regularH: 8, otH: 0, isOT: false, manualOT: 0,    pay: 14950, jobId: 1, note: '' },
  { id: 6, date: '2026-04-10', start: '',      end: '',      breakMin: 0,  hours: 0,  regularH: 0, otH: 0, isOT: false, manualOT: 0,    pay: 9100,  jobId: 2, note: '' },
  { id: 7, date: '2026-04-09', start: '08:00', end: '20:00', breakMin: 60, hours: 11, regularH: 8, otH: 3, isOT: false, manualOT: 0,    pay: 17988, jobId: 1, note: '残業' },
  { id: 8, date: '2026-04-08', start: '',      end: '',      breakMin: 0,  hours: 0,  regularH: 0, otH: 0, isOT: false, manualOT: 0,    pay: 9100,  jobId: 2, note: '' }
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

let profiles = [];
let activeProfileId = null;

const LS_LEGACY    = 'strack_v3';
const OB_KEY       = 'strack_ob';
const PROFILES_KEY = 'strack_profiles';
const ACTIVE_KEY   = 'strack_active';
const DATA_PREFIX  = 'strack_data_';

function snapshotDefaultShift(shift, job) {
  return {
    ...shift,
    jobName: job ? job.name : shift.jobName,
    jobType: job ? job.type : shift.jobType,
    jobIcon: job ? job.icon : shift.jobIcon,
    jobColor: job ? job.color : shift.jobColor
  };
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

  if (profiles.length === 1) {
    jobs = DEFAULT_JOBS.map(j => ({ ...j, allowances: j.allowances.map(a => ({ ...a })) }));
    shifts = DEFAULT_SHIFTS.map(s => snapshotDefaultShift(s, jobs.find(j => j.id === s.jobId) || null));
    shiftTemplates = [];
    nextJobId = 4; nextShiftId = 9; nextTemplateId = 1;
  } else {
    jobs = []; shifts = []; shiftTemplates = []; nextJobId = 1; nextShiftId = 1; nextTemplateId = 1;
  }
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
