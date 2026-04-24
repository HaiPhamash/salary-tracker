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

/* -------- Period allowance aggregation --------
   Monthly allowances (job.allowances[].per === 'month') live outside of
   shift.pay and are pro-rated by days within any requested date range,
   starting from the job's activation date. */

function getJobActivationYmd(job) {
  if (job && job.createdAt) {
    return localYmd(new Date(job.createdAt));
  }
  if (!job) return null;
  let earliest = null;
  for (const s of shifts) {
    if (s.jobId === job.id && (!earliest || s.date < earliest)) earliest = s.date;
  }
  return earliest;
}

function daysInMonth(year, month1to12) {
  return new Date(year, month1to12, 0).getDate();
}

function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

function daysInYear(y) {
  return isLeapYear(y) ? 366 : 365;
}

function daysBetweenInclusive(fromYmd, toYmd) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return 0;
  const a = new Date(fromYmd + 'T12:00:00');
  const b = new Date(toYmd   + 'T12:00:00');
  return Math.round((b - a) / 86400000) + 1;
}

/* For each calendar month overlapping [fromYmd, toYmd], invoke cb(ctx).
   ctx = { ym, year, month, dim, monthStart, monthEnd, effStart, effEnd, days }
   activationYmd: if provided, clips effStart to activation (skip months fully before). */
function iterateMonthsInRange(fromYmd, toYmd, activationYmd, cb) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return;
  const [fy, fm] = fromYmd.split('-').map(Number);
  const [ty, tm] = toYmd.split('-').map(Number);
  let year = fy, month = fm;

  while (year < ty || (year === ty && month <= tm)) {
    const dim = daysInMonth(year, month);
    const ym = year + '-' + pad2(month);
    const monthStart = ym + '-01';
    const monthEnd   = ym + '-' + pad2(dim);

    if (!activationYmd || monthEnd >= activationYmd) {
      let effStart = fromYmd > monthStart ? fromYmd : monthStart;
      if (activationYmd && activationYmd > effStart) effStart = activationYmd;
      const effEnd = toYmd < monthEnd ? toYmd : monthEnd;
      if (effStart <= effEnd) {
        const startD = parseInt(effStart.slice(8, 10), 10);
        const endD   = parseInt(effEnd.slice(8, 10), 10);
        cb({ ym, year, month, dim, monthStart, monthEnd, effStart, effEnd, days: endD - startD + 1 });
      }
    }
    month++;
    if (month > 12) { month = 1; year++; }
  }
}

/* For each calendar year overlapping [fromYmd, toYmd], invoke cb(ctx).
   ctx = { year, yearStart, yearEnd, effStart, effEnd, days, diy } */
function iterateYearsInRange(fromYmd, toYmd, activationYmd, cb) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return;
  const fy = parseInt(fromYmd.slice(0, 4), 10);
  const ty = parseInt(toYmd.slice(0, 4), 10);

  for (let year = fy; year <= ty; year++) {
    const yearStart = year + '-01-01';
    const yearEnd   = year + '-12-31';
    if (activationYmd && yearEnd < activationYmd) continue;

    let effStart = fromYmd > yearStart ? fromYmd : yearStart;
    if (activationYmd && activationYmd > effStart) effStart = activationYmd;
    const effEnd = toYmd < yearEnd ? toYmd : yearEnd;
    if (effStart > effEnd) continue;
    cb({
      year, yearStart, yearEnd, effStart, effEnd,
      days: daysBetweenInclusive(effStart, effEnd),
      diy: daysInYear(year)
    });
  }
}

function getJobMonthlyAllowanceSum(job) {
  if (!job || !job.allowances) return 0;
  return job.allowances.filter(a => a.per === 'month').reduce((s, a) => s + (a.amount || 0), 0);
}

function getJobYearlyAllowanceSum(job) {
  if (!job || !job.allowances) return 0;
  return job.allowances.filter(a => a.per === 'year').reduce((s, a) => s + (a.amount || 0), 0);
}

/* Aggregates both `per: 'month'` AND `per: 'year'` allowances (day allowances
   stay inside shift.pay). Name kept for backwards compatibility. */
function getMonthlyAllowanceForRange(fromYmd, toYmd, jobIdFilter) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return 0;
  const jobsList = jobIdFilter ? jobs.filter(j => j.id === jobIdFilter) : jobs;
  let total = 0;

  for (const job of jobsList) {
    const monAlw = getJobMonthlyAllowanceSum(job);
    const yrAlw  = getJobYearlyAllowanceSum(job);
    if (!monAlw && !yrAlw) continue;
    const activation = getJobActivationYmd(job);
    if (!activation) continue;

    if (monAlw) {
      iterateMonthsInRange(fromYmd, toYmd, activation, ctx => {
        total += Math.round(monAlw * ctx.days / ctx.dim);
      });
    }
    if (yrAlw) {
      iterateYearsInRange(fromYmd, toYmd, activation, ctx => {
        total += Math.round(yrAlw * ctx.days / ctx.diy);
      });
    }
  }
  return total;
}

function getMonthlyAllowanceForDay(ymd, jobIdFilter) {
  return getMonthlyAllowanceForRange(ymd, ymd, jobIdFilter);
}

/* Per-job breakdown for a range: returns [{jobId, jobName, jobIcon, jobColor, items:[{name, amount}], total}, ...].
   Only jobs with monthly allowances active within the range are returned. */
function getMonthlyAllowanceBreakdown(fromYmd, toYmd, jobIdFilter) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return [];
  const jobsList = jobIdFilter ? jobs.filter(j => j.id === jobIdFilter) : jobs;
  const result = [];

  for (const job of jobsList) {
    const periodicItems = (job.allowances || [])
      .filter(a => (a.per === 'month' || a.per === 'year') && (a.amount || 0) > 0);
    if (!periodicItems.length) continue;
    const activation = getJobActivationYmd(job);
    if (!activation) continue;

    let monthRatio = 0;
    iterateMonthsInRange(fromYmd, toYmd, activation, ctx => {
      monthRatio += ctx.days / ctx.dim;
    });
    let yearRatio = 0;
    iterateYearsInRange(fromYmd, toYmd, activation, ctx => {
      yearRatio += ctx.days / ctx.diy;
    });

    const items = periodicItems.map(a => {
      const ratio = a.per === 'year' ? yearRatio : monthRatio;
      return { name: a.name || '', amount: Math.round((a.amount || 0) * ratio), per: a.per };
    }).filter(it => it.amount > 0);

    const total = items.reduce((s, it) => s + it.amount, 0);
    if (total <= 0) continue;

    result.push({
      jobId: job.id,
      jobName: job.name,
      jobIcon: job.icon,
      jobColor: job.color,
      items,
      total
    });
  }

  return result;
}

/* -------- Deductions ----------------------------------------------------
   job.deductions = [{ name, amount, per: 'day'|'month'|'year',
                       valueType: 'fixed'|'percent',
                       startDate?: 'YYYY-MM-DD', endDate?: 'YYYY-MM-DD' }]
   For 'fixed': amount pro-rated by days across range.
   For 'percent': applied to the JOB's gross (shift.pay + monthly allowance)
                  within each period unit intersecting the range, pro-rated. */

function getJobGrossForRange(jobId, fromYmd, toYmd) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return 0;
  const jobShifts = shifts.filter(s => s.jobId === jobId && s.date >= fromYmd && s.date <= toYmd);
  const shiftGross = jobShifts.reduce((a, s) => a + (s.pay || 0), 0);
  const monAlw = getMonthlyAllowanceForRange(fromYmd, toYmd, jobId);
  return shiftGross + monAlw;
}

function computeDeductionItemAmount(job, ded, fromYmd, toYmd) {
  if (!ded) return 0;
  const effFrom = (ded.startDate && ded.startDate > fromYmd) ? ded.startDate : fromYmd;
  const effTo   = (ded.endDate   && ded.endDate   < toYmd)   ? ded.endDate   : toYmd;
  if (!effFrom || !effTo || effFrom > effTo) return 0;

  const activation = getJobActivationYmd(job);
  if (activation && activation > effTo) return 0;
  const activeFrom = (activation && activation > effFrom) ? activation : effFrom;

  const amount = Number(ded.amount) || 0;
  if (amount <= 0) return 0;
  const per = ded.per || 'month';
  const valueType = ded.valueType || 'fixed';

  if (valueType === 'percent') {
    const pct = amount / 100;
    let total = 0;
    if (per === 'day') {
      total = pct * getJobGrossForRange(job.id, activeFrom, effTo);
    } else if (per === 'month') {
      iterateMonthsInRange(activeFrom, effTo, null, ctx => {
        const monthGross = getJobGrossForRange(job.id, ctx.monthStart, ctx.monthEnd);
        total += pct * monthGross * (ctx.days / ctx.dim);
      });
    } else if (per === 'year') {
      iterateYearsInRange(activeFrom, effTo, null, ctx => {
        const yearGross = getJobGrossForRange(job.id, ctx.yearStart, ctx.yearEnd);
        total += pct * yearGross * (ctx.days / ctx.diy);
      });
    }
    return Math.round(total);
  }

  // fixed
  if (per === 'day') {
    return Math.round(amount * daysBetweenInclusive(activeFrom, effTo));
  } else if (per === 'month') {
    let total = 0;
    iterateMonthsInRange(activeFrom, effTo, null, ctx => {
      total += amount * ctx.days / ctx.dim;
    });
    return Math.round(total);
  } else if (per === 'year') {
    let total = 0;
    iterateYearsInRange(activeFrom, effTo, null, ctx => {
      total += amount * ctx.days / ctx.diy;
    });
    return Math.round(total);
  }
  return 0;
}

function getDeductionsForRange(fromYmd, toYmd, jobIdFilter) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return 0;
  const jobsList = jobIdFilter ? jobs.filter(j => j.id === jobIdFilter) : jobs;
  let total = 0;
  for (const job of jobsList) {
    const deds = job.deductions || [];
    for (const ded of deds) {
      total += computeDeductionItemAmount(job, ded, fromYmd, toYmd);
    }
  }
  return total;
}

function getDeductionsBreakdown(fromYmd, toYmd, jobIdFilter) {
  if (!fromYmd || !toYmd || fromYmd > toYmd) return [];
  const jobsList = jobIdFilter ? jobs.filter(j => j.id === jobIdFilter) : jobs;
  const result = [];

  for (const job of jobsList) {
    const deds = job.deductions || [];
    if (!deds.length) continue;
    const items = [];
    for (const ded of deds) {
      const amt = computeDeductionItemAmount(job, ded, fromYmd, toYmd);
      if (amt <= 0) continue;
      items.push({
        name: ded.name || '',
        amount: amt,
        valueType: ded.valueType || 'fixed',
        per: ded.per || 'month',
        rawAmount: Number(ded.amount) || 0
      });
    }
    if (!items.length) continue;
    result.push({
      jobId: job.id,
      jobName: job.name,
      jobIcon: job.icon,
      jobColor: job.color,
      items,
      total: items.reduce((s, it) => s + it.amount, 0)
    });
  }
  return result;
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
  const abs = Math.abs(n);
  const threshold = LOW_DENOM_CURRENCIES.indexOf(curCurrency) >= 0 ? 10000000 : 1000000;
  const sign = n < 0 ? '−' : '';
  if (abs >= threshold) return sign + s + (abs / 1000000).toFixed(1) + 'M';
  return sign + s + fmtNumber(abs);
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

function setNegClass(id, isNeg) {
  const e = document.getElementById(id);
  if (e) e.classList.toggle('is-neg', !!isNeg);
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
