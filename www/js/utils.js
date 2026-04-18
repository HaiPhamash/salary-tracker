/* =========================================================================
   Utils — toast, formatting, DOM helpers, currency lookups
   ========================================================================= */

function toast(msg, opts) {
  const t = document.getElementById('toast');
  if (!t) return;
  const duration = (opts && opts.duration) || 1400;
  const onClick  = opts && opts.onClick;
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.cursor = onClick ? 'pointer' : '';
  t.onclick = onClick || null;
  clearTimeout(t._t);
  t._t = setTimeout(() => {
    t.style.opacity = '0';
    t.onclick = null;
    t.style.cursor = '';
  }, duration);
}

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hapticLight() {
  try {
    if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Haptics) {
      Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
    }
  } catch (e) {}
}

function hapticMedium() {
  try {
    if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Haptics) {
      Capacitor.Plugins.Haptics.impact({ style: 'MEDIUM' });
    }
  } catch (e) {}
}

function getCapDialog() {
  if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Dialog) return Capacitor.Plugins.Dialog;
  return null;
}

async function confirmDialog(message, title) {
  const d = getCapDialog();
  if (d) {
    try {
      const res = await d.confirm({ title: title || 'Salary Tracker', message: String(message) });
      return !!res.value;
    } catch (e) { return false; }
  }
  return window.confirm(message);
}

async function alertDialog(message, title) {
  const d = getCapDialog();
  if (d) {
    try { await d.alert({ title: title || 'Salary Tracker', message: String(message) }); return; }
    catch (e) {}
  }
  window.alert(message);
}

async function promptDialog(message, title, defaultValue) {
  const d = getCapDialog();
  if (d) {
    try {
      const res = await d.prompt({
        title: title || 'Salary Tracker',
        message: String(message),
        inputText: String(defaultValue || '')
      });
      if (res.cancelled) return null;
      return res.value;
    } catch (e) { return null; }
  }
  const v = window.prompt(message, defaultValue || '');
  return v;
}

function getJob(id) {
  return jobs.find(j => j.id === id) || null;
}

function getFirstJob() {
  return jobs[0] || null;
}

function getShiftPay(shift) {
  return Number.isFinite(shift && shift.pay) ? shift.pay : 0;
}

function captureShiftJobMeta(shift, job) {
  if (!shift || !job) return;
  shift.jobName = job.name;
  shift.jobType = job.type;
  shift.jobIcon = job.icon;
  shift.jobColor = job.color;
}

function getShiftJobMeta(shift) {
  const job = getJob(shift.jobId);
  if (job) {
    return {
      id: job.id,
      name: job.name,
      type: job.type,
      icon: job.icon,
      color: job.color
    };
  }
  return {
    id: shift.jobId || null,
    name: shift.jobName || 'Archived job',
    type: shift.jobType || 'hourly',
    icon: shift.jobIcon || '🗂️',
    color: shift.jobColor || '#64748b'
  };
}

function pad2(v) {
  return String(v).padStart(2, '0');
}

function localYmd(date) {
  const d = date || new Date();
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}

function localYm(date) {
  return localYmd(date).slice(0, 7);
}

const PRIVACY_POLICY_URL = 'https://haiphamash.github.io/salary-tracker/privacy-policy.html';
const SUPPORT_URL = 'https://haiphamash.github.io/salary-tracker/support';

function getCurSym() {
  return (CURRENCIES.find(c => c.id === curCurrency) || CURRENCIES[0]).sym;
}

function getCurLabel() {
  return (CURRENCIES.find(c => c.id === curCurrency) || CURRENCIES[0]).label;
}

const LOW_DENOM_CURRENCIES = ['vnd', 'krw', 'inr', 'rub'];

function getLocale() {
  return (typeof LOCALE_MAP !== 'undefined' && LOCALE_MAP[curLang]) || undefined;
}

function fmtNumber(v) {
  try { return Number(v).toLocaleString(getLocale()); }
  catch (e) { return Number(v).toLocaleString(); }
}

function fmt(v) {
  const s = getCurSym();
  const n = Number(v) || 0;
  const threshold = LOW_DENOM_CURRENCIES.indexOf(curCurrency) >= 0 ? 10000000 : 1000000;
  if (n >= threshold) return s + (n / 1000000).toFixed(1) + 'M';
  return s + fmtNumber(n);
}

function fmtExact(v) {
  return getCurSym() + fmtNumber(Number(v) || 0);
}

function fmtDate(d) {
  const dt = new Date(d + 'T12:00:00');
  const t = L[curLang];
  return pad2(dt.getDate()) + '/' + pad2(dt.getMonth() + 1) + ' (' + t.days[dt.getDay()] + ')';
}

function set(id, v) {
  const e = document.getElementById(id);
  if (e) e.textContent = v;
}

function setPH(id, v) {
  const e = document.getElementById(id);
  if (e && v != null) e.placeholder = v;
}

function formatYmdWithDow(ymdStr) {
  if (!ymdStr) return '';
  const parts = ymdStr.split('-');
  if (parts.length !== 3) return ymdStr;
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  const days = (L[curLang] && L[curLang].days) || L.en.days;
  const dow = days[dt.getDay()] || '';
  return y + '/' + m + '/' + d + ' (' + dow + ')';
}

function syncDateDisplay(inputId, displayId) {
  const inp  = document.getElementById(inputId);
  const disp = document.getElementById(displayId);
  if (!inp || !disp) return;
  disp.textContent = formatYmdWithDow(inp.value);
}
