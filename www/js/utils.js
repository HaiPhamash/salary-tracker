/* =========================================================================
   Utils — toast, formatting, DOM helpers, currency lookups
   ========================================================================= */

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.opacity = '0', 1400);
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

function fmt(v) {
  const s = getCurSym();
  if (v >= 1000000) return s + (v / 1000000).toFixed(1) + 'M';
  return s + v.toLocaleString();
}

function fmtDate(d) {
  const dt = new Date(d + 'T12:00:00');
  const t = L[curLang];
  return t.days[dt.getDay()] + ' ' + dt.getDate() + '/' + (dt.getMonth() + 1);
}

function set(id, v) {
  const e = document.getElementById(id);
  if (e) e.textContent = v;
}

function setPH(id, v) {
  const e = document.getElementById(id);
  if (e && v != null) e.placeholder = v;
}

function syncDateDisplay(inputId, displayId) {
  const inp  = document.getElementById(inputId);
  const disp = document.getElementById(displayId);
  if (!inp || !disp) return;
  const locale = LOCALE_MAP[curLang] || curLang;
  if (!inp.value) { disp.textContent = ''; return; }
  const dt = new Date(inp.value + 'T12:00:00');
  try {
    disp.textContent = dt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  } catch (e) {
    disp.textContent = inp.value;
  }
}
