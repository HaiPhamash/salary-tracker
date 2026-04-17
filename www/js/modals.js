/* =========================================================================
   Modals — language, currency, job, export
   ========================================================================= */

/* -------- Language -------- */

function openLang() {
  const t = L[curLang];
  set('langMT', t.langMT);
  document.getElementById('langOpts').innerHTML = Object.entries(L).map(([k, v]) =>
    `<div class="select-option${k === curLang ? ' selected' : ''}" onclick="setLang('${k}')">
      <span class="select-option-flag">${v.f}</span>
      <div>
        <div class="select-option-name">${v.n}</div>
        <div class="select-option-sub">${v.nv}</div>
      </div>
      <span class="select-option-check">✓</span>
    </div>`
  ).join('');
  document.getElementById('moLang').classList.add('show');
}

function closeLang() {
  document.getElementById('moLang').classList.remove('show');
}

function setLang(lang) {
  curLang = lang;
  closeLang();
  save();
  applyLang();
}

function applyLang() {
  const t = L[curLang];
  const locale = LOCALE_MAP[curLang] || curLang;
  document.documentElement.lang = locale;
  document.querySelectorAll('input[type="date"], input[type="time"]').forEach(inp => {
    inp.setAttribute('lang', locale);
  });
  document.getElementById('lbtn').textContent = '🌐 ' + t.f;

  set('appSub', t.appSub);
  set('greetT', t.greet);
  set('greetName', userName ? userName + ' 👋' : '👋');

  set('todayLbl', t.todayLbl); set('wkLbl', t.wkLbl); set('moLbl', t.moLbl); set('yrLbl', t.yrLbl);
  set('statTit', t.statTit);   set('hrsL', t.hrsL);   set('otL', t.otL);
  set('jobsL', t.jobsL);       set('goalL', t.goalL);
  set('recTit', t.recTit);     set('addTit', t.addTit);

  set('lbl_job', t.lbl_job); set('lbl_date', t.lbl_date);
  set('lbl_start', t.cal_start || t.lbl_start);
  set('lbl_end',   t.cal_end   || t.lbl_end);
  set('lbl_brk',   t.cal_break || t.lbl_brk);
  set('lbl_date_daily', t.lbl_date);
  set('lbl_note', t.lbl_note);
  set('brkSuf', (t.cal_breakMinTpl || '{m} min').replace('{m}', '').trim() || 'min');
  set('calcLbl', t.calcLbl); set('btnSave', t.btnSave);
  set('shiftMT', editShiftId ? (t.cal_editTit || t.addTit) : (t.addTit || 'Add shift'));
  set('btnDayNewShift', t.cal_newShift || 'New shift');

  set('otBoxTit', t.otBoxTit); set('otToggleLbl', t.otToggleLbl); set('lbl_otamt', t.lbl_otamt);

  set('tabW', t.tabW); set('tabM', t.tabM); set('tabQ', t.tabQ); set('tabY', t.tabY);
  set('chartTit', t.chartTit); set('detTit', t.detTit);

  set('sgJobs', t.sgJobs); set('btnAddJob', t.btnAddJob);
  set('sgApp', t.sgApp); set('sLang', t.sLang); set('sLangV', t.sLangV);
  set('sCur', t.sCur); set('sCurV', getCurLabel());
  set('sPrivacy', t.sPrivacy || 'Privacy Policy');
  set('sPrivacyV', t.sPrivacyV || 'Open website');
  set('sSupport', t.sSupport || 'Support');
  set('sSupportV', t.sSupportV || 'FAQ & contact');
  set('sNotif', t.sNotif); set('sNotifV', t.sNotifV);
  set('sgData', t.sgData); set('sExp', t.sExp);
  set('sClear', t.sClear); set('sClearV', t.sClearV);

  set('navH', t.navH); set('navA', t.navA); set('navR', t.navR); set('navS', t.navS);

  set('sProfile', t.sProfile);
  set('sProfileV', userName || '—');
  set('sDelUser', t.sDelUser);
  set('sDelUserV', t.sDelUserV);

  set('tl_hourly', t.tl_hourly); set('tl_daily', t.tl_daily); set('tl_monthly', t.tl_monthly);
  set('lbl_jn', t.lbl_jn); set('sdivType', t.sdivType); set('sdivOT', t.sdivOT);
  set('lbl_otth', t.lbl_otth); set('lbl_otmul', t.lbl_otmul); set('lbl_ottype', t.lbl_ottype);
  set('opt_mul', t.opt_mul); set('opt_man', t.opt_man);
  set('sdivAlw', t.sdivAlw); set('opt_day', t.opt_day); set('opt_month', t.opt_month);
  set('sdivIcon', t.sdivIcon); set('btnSaveJob', t.btnSaveJob);
  set('lbl_wdays', t.lbl_wdays);

  setPH('inp_jn',   t.phJobName);
  setPH('inp_alwn', t.phAlwName);
  setPH('inp_note', t.phNote);
  setPH('ob_name',  t.phObName);

  syncDateDisplay('inp_date', 'disp_date');

  renderHomeStats();
  renderShifts();
  if (curPage === 'report')   renderReport(curPeriod);
  if (curPage === 'settings') renderJobCards();
  renderCalendar();
  updateRateLabel();
}

function openExternalUrl(url) {
  if (!url) return;
  const opened = window.open(url, '_blank', 'noopener');
  if (!opened) window.location.href = url;
}

function openPrivacyPolicy() {
  openExternalUrl(PRIVACY_POLICY_URL);
}

function openSupportPage() {
  openExternalUrl(SUPPORT_URL);
}

/* -------- Day sheet & shift form -------- */

let _daySheetDate = null;

function openDaySheet(date) {
  _daySheetDate = date || calSelectedDate || localYmd();
  calSelectedDate = _daySheetDate;
  const t = L[curLang];
  const dt = new Date(_daySheetDate + 'T12:00:00');
  const locale = LOCALE_MAP[curLang] || curLang;
  let dStr;
  try { dStr = dt.toLocaleDateString(locale, { month: 'long', day: 'numeric', weekday: 'short' }); }
  catch (e) { dStr = _daySheetDate; }
  set('daySheetTit', (t.cal_addFor || 'Add shift for {d}').replace('{d}', dStr));
  set('btnDayNewShift', t.cal_newShift || 'New shift');
  renderDaySheetTemplates();
  document.getElementById('moDay').classList.add('show');
}

function closeDaySheet() {
  document.getElementById('moDay').classList.remove('show');
}

function renderDaySheetTemplates() {
  const t = L[curLang];
  const el = document.getElementById('daySheetTemplates');
  const lbl = document.getElementById('daySheetHistLbl');
  if (!el || !lbl) return;
  if (!shiftTemplates.length) {
    lbl.style.display = 'none';
    el.innerHTML = '';
    return;
  }
  lbl.style.display = 'block';
  lbl.textContent = t.cal_fromHist || 'From history';
  const sorted = [...shiftTemplates].sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
  el.innerHTML = sorted.map(tpl => {
    const job = getJob(tpl.jobId);
    if (!job) return '';
    const delLbl = t.cal_swipeDel || 'Delete';
    return `<div class="swipe-row" data-tpl-id="${tpl.id}">
      <div class="swipe-row-del" onclick="event.stopPropagation();deleteTemplate(${tpl.id})">🗑️ ${delLbl}</div>
      <div class="swipe-row-inner">
        <div class="tpl-row" onclick="applyTemplate(${tpl.id})">
          <div class="tpl-row-time">${tpl.start} – ${tpl.end}</div>
          <div class="tpl-row-name">${job.icon} ${job.name}</div>
          <div class="tpl-row-icon">📌</div>
        </div>
      </div>
    </div>`;
  }).join('');
  attachSwipeHandlers(el);
}

function applyTemplate(tplId) {
  const tpl = shiftTemplates.find(x => x.id === tplId);
  if (!tpl || !_daySheetDate) return;
  const job = getJob(tpl.jobId);
  if (!job) return;

  const sh = {
    id: nextShiftId++,
    date: _daySheetDate,
    start: tpl.start,
    end:   tpl.end,
    breakMin: tpl.breakMin || 0,
    hours: 0, regularH: 0, otH: 0,
    isOT: false, manualOT: 0, pay: 0,
    jobId: tpl.jobId,
    note: ''
  };
  captureShiftJobMeta(sh, job);

  const sDate = new Date(_daySheetDate + 'T' + tpl.start + ':00');
  const eDate = new Date(_daySheetDate + 'T' + tpl.end + ':00');
  let m = (eDate - sDate) / 60000 - (tpl.breakMin || 0);
  if (m < 0) m += 1440;
  sh.hours = parseFloat((m / 60).toFixed(2));
  const r = calcHourly(sh.hours, job.rate, job.otThreshold, job.otMultiplier);
  sh.regularH = r.reg; sh.otH = r.ot;
  sh.pay = calcShiftPay(sh, job).total;

  shifts.push(sh);
  tpl.lastUsedAt = Date.now();
  save();

  closeDaySheet();
  calSelectedDate = sh.date;
  calCursor = sh.date.slice(0, 7);
  renderCalendar();
  renderShifts();
  renderHomeStats();
  toast('✅');
}

function deleteTemplate(id) {
  const t = L[curLang];
  const msg = t.cal_delTpl || 'Delete this template?';
  if (!confirm(msg)) return;
  shiftTemplates = shiftTemplates.filter(x => x.id !== id);
  save();
  renderDaySheetTemplates();
}

function openShiftForm() {
  closeDaySheet();
  editShiftId = null;
  const t = L[curLang];
  set('shiftMT', t.addTit || 'Add shift');
  const date = _daySheetDate || calSelectedDate || localYmd();
  const inpDate = document.getElementById('inp_date');
  const inpDateEnd = document.getElementById('inp_date_end');
  const inpDateDaily = document.getElementById('inp_date_daily');
  if (inpDate)      inpDate.value      = date;
  if (inpDateEnd)   inpDateEnd.value   = date;
  if (inpDateDaily) inpDateDaily.value = date;
  const inpStart = document.getElementById('inp_start');
  const inpEnd   = document.getElementById('inp_end');
  const inpBrk   = document.getElementById('inp_brk');
  if (inpStart) inpStart.value = '09:00';
  if (inpEnd)   inpEnd.value   = '18:00';
  if (inpBrk)   inpBrk.value   = 60;
  const noteEl = document.getElementById('inp_note');
  if (noteEl) noteEl.value = '';
  otIsOn = false;
  const tog = document.getElementById('togOT');
  if (tog) tog.className = 'toggle-switch';
  fillJobSel();
  syncDateDisplay('inp_date', 'disp_date');
  syncDateDisplay('inp_date_end', 'disp_date_end');
  syncDateDisplay('inp_date_daily', 'disp_date_daily');
  onJobChange();
  calcPrev();
  document.getElementById('moShift').classList.add('show');
}

function closeShiftForm() {
  document.getElementById('moShift').classList.remove('show');
  editShiftId = null;
}

function openEditShift(id) {
  const sh = shifts.find(s => s.id === id);
  if (!sh) return;
  const t = L[curLang];
  editShiftId = id;
  set('shiftMT', t.cal_editTit || 'Edit shift');

  fillJobSel();
  const sel = document.getElementById('inp_job');
  if (sel) sel.value = String(sh.jobId);
  const job = getJob(sh.jobId);
  if (!job) {
    toast('⚠️');
    closeShiftForm();
    return;
  }

  const inpDate = document.getElementById('inp_date');
  const inpDateEnd = document.getElementById('inp_date_end');
  const inpDateDaily = document.getElementById('inp_date_daily');
  if (inpDate)      inpDate.value      = sh.date;
  if (inpDateEnd)   inpDateEnd.value   = sh.date;
  if (inpDateDaily) inpDateDaily.value = sh.date;
  const inpStart = document.getElementById('inp_start');
  const inpEnd   = document.getElementById('inp_end');
  const inpBrk   = document.getElementById('inp_brk');
  if (inpStart) inpStart.value = sh.start || '09:00';
  if (inpEnd)   inpEnd.value   = sh.end   || '18:00';
  if (inpBrk)   inpBrk.value   = sh.breakMin || 0;
  const noteEl = document.getElementById('inp_note');
  if (noteEl) noteEl.value = sh.note || '';

  const otAmt = document.getElementById('inp_otamt');
  if (otAmt) otAmt.value = sh.manualOT || 0;

  syncDateDisplay('inp_date', 'disp_date');
  syncDateDisplay('inp_date_end', 'disp_date_end');
  syncDateDisplay('inp_date_daily', 'disp_date_daily');
  onJobChange();
  otIsOn = !!sh.isOT;
  const tog = document.getElementById('togOT');
  if (tog) tog.className = 'toggle-switch' + (otIsOn ? ' on' : '');
  if (job && job.type === 'monthly' && job.otType === 'manual' && otIsOn) {
    document.getElementById('monthly_ot_manual').style.display = 'block';
  }
  calcPrev();
  document.getElementById('moShift').classList.add('show');
}

/* -------- Currency -------- */

function openCurModal() {
  const t = L[curLang];
  set('curMT', t.curMT || 'Currency');
  document.getElementById('curOpts').innerHTML = CURRENCIES.map(c =>
    `<div class="select-option${c.id === curCurrency ? ' selected' : ''}" onclick="setCurrency('${c.id}')">
      <span class="select-option-flag" style="font-size:18px;">${c.sym}</span>
      <div>
        <div class="select-option-name">${c.label}</div>
        <div class="select-option-sub">${c.name}</div>
      </div>
      <span class="select-option-check">✓</span>
    </div>`
  ).join('');
  document.getElementById('moCur').classList.add('show');
}

function closeCurModal() {
  document.getElementById('moCur').classList.remove('show');
}

function setCurrency(id) {
  curCurrency = id;
  set('sCurV', getCurLabel());
  closeCurModal();
  save();
  renderShifts();
  if (curPage === 'report') renderReport(curPeriod);
}

/* -------- Export -------- */

function openExpModal() {
  const t = L[curLang];
  set('expMT',         t.expMT         || 'Export');
  set('expCSVTitle',   t.expCSVTitle   || 'Export CSV');
  set('expCSVDesc',    t.expCSVDesc    || 'Open with Excel, Google Sheets...');
  set('expPDFTitle',   t.expPDFTitle   || 'Export PDF');
  set('expPDFDesc',    t.expPDFDesc    || 'Print or save as PDF via browser');
  document.getElementById('moExp').classList.add('show');
}

function closeExpModal() {
  document.getElementById('moExp').classList.remove('show');
}

function isNativePlatform() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

async function saveAndShareNative(fileName, content, mimeType, dialogTitle) {
  const { Filesystem, Share } = window.Capacitor.Plugins;
  await Filesystem.writeFile({
    path: fileName,
    data: content,
    directory: 'CACHE',
    encoding: 'utf8'
  });
  const { uri } = await Filesystem.getUri({ path: fileName, directory: 'CACHE' });
  await Share.share({
    title: 'Salary Tracker',
    url: uri,
    dialogTitle
  });
}

function downloadBlob(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportCSV() {
  const sym  = getCurSym();
  const t    = L[curLang];
  const rows = [[t.pdfDate, t.pdfJob, t.pdfStart, t.pdfEnd, t.pdfBreak, t.pdfHours, t.pdfOT + ' ' + t.pdfHours, t.pdfPay + '(' + sym + ')', t.pdfNote]];
  shifts.slice().sort((a, b) => b.date.localeCompare(a.date)).forEach(s => {
    const job = getShiftJobMeta(s);
    rows.push([s.date, job.name, s.start || '', s.end || '', s.breakMin || 0, s.hours || 0, s.otH || 0, getShiftPay(s), s.note || '']);
  });
  const csv = '\uFEFF' + rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const fileName = 'salary-tracker-' + localYmd() + '.csv';

  closeExpModal();
  try {
    if (isNativePlatform()) {
      await saveAndShareNative(fileName, csv, 'text/csv', t.expShareCSV);
    } else {
      downloadBlob(fileName, csv, 'text/csv');
    }
    toast('📊 CSV ' + (isNativePlatform() ? t.expReady : t.expDownloaded) + '!');
  } catch (e) {
    toast('❌ ' + t.expFailed);
  }
}

async function exportPDF() {
  const sym = getCurSym();
  const t   = L[curLang];
  const sortedShifts = shifts.slice().sort((a, b) => b.date.localeCompare(a.date));
  const total = sortedShifts.reduce((s, sh) => s + getShiftPay(sh), 0);
  const rows  = sortedShifts.map(s => {
    const job = getShiftJobMeta(s);
    return `<tr>
      <td>${s.date}</td>
      <td>${job.icon} ${job.name}</td>
      <td>${s.start || '-'}</td>
      <td>${s.end || '-'}</td>
      <td>${s.hours || 0}h</td>
      <td>${s.otH > 0 ? s.otH + 'h ' + t.pdfOT : '-'}</td>
      <td style="text-align:right;font-weight:600;">${sym}${getShiftPay(s).toLocaleString()}</td>
      <td>${s.note || ''}</td>
    </tr>`;
  }).join('');

  const reportBody = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:20px;max-width:900px;margin:0 auto;">
      <h2 style="color:#1a2f5e;margin-bottom:4px;">💴 Salary Tracker — ${userName || ''}</h2>
      <p style="color:#666;font-size:13px;margin-bottom:16px;">${t.pdfGenerated}: ${new Date().toLocaleString()} | ${t.pdfCurrency}: ${getCurLabel()}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:#1a2f5e;color:#fff;">
          <th style="padding:8px;text-align:left;">${t.pdfDate}</th><th>${t.pdfJob}</th><th>${t.pdfStart}</th><th>${t.pdfEnd}</th><th>${t.pdfHours}</th><th>${t.pdfOT}</th><th style="text-align:right;">${t.pdfPay}</th><th>${t.pdfNote}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr style="background:#f0f4ff;font-weight:700;font-size:14px;">
          <td colspan="6" style="padding:10px;">${t.pdfTotal}</td>
          <td style="text-align:right;color:#1a2f5e;">${sym}${total.toLocaleString()}</td>
          <td></td>
        </tr></tfoot>
      </table>
    </div>`;

  closeExpModal();

  if (isNativePlatform()) {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Salary Report</title>
<style>@media print{@page{size:A4;margin:12mm}}body{margin:0}table td,table th{border:1px solid #ddd;padding:6px}</style>
</head><body>${reportBody}</body></html>`;
    const fileName = 'salary-report-' + localYmd() + '.html';
    try {
      await saveAndShareNative(fileName, html, 'text/html', t.expSharePDF);
      toast('📄 ' + t.expOpened);
    } catch (e) {
      toast('❌ ' + t.expFailed);
    }
    return;
  }

  document.getElementById('print-area').innerHTML = reportBody;
  setTimeout(() => window.print(), 200);
}

/* -------- Job editor -------- */

function openAddJob() {
  const t = L[curLang];
  document.getElementById('jobMT').textContent = t.jobMT_add;
  document.getElementById('editJobId').value = '';
  document.getElementById('inp_jn').value = '';
  document.getElementById('inp_jrate').value = '1550';
  document.getElementById('inp_otth').value = '8';
  document.getElementById('inp_otmul').value = '1.25';
  document.getElementById('inp_ottype').value = 'multiplier';
  document.getElementById('inp_wdays').value = '22';
  editAlws    = [];
  curJobType  = 'hourly';
  pickedIcon  = '🍜';
  pickedColor = '#1a2f5e';
  refreshJobModal();
  document.getElementById('moJob').classList.add('show');
}

function openEditJob(id) {
  const j = getJob(id);
  if (!j) return;
  const t = L[curLang];
  document.getElementById('jobMT').textContent = t.jobMT_edit + ': ' + j.name;
  document.getElementById('editJobId').value = id;
  document.getElementById('inp_jn').value = j.name;
  document.getElementById('inp_jrate').value = j.rate;
  document.getElementById('inp_otth').value = j.otThreshold;
  document.getElementById('inp_otmul').value = j.otMultiplier;
  document.getElementById('inp_ottype').value = j.otType || 'multiplier';
  document.getElementById('inp_wdays').value = j.workDays || 22;
  editAlws    = j.allowances.map(a => ({ ...a }));
  curJobType  = j.type;
  pickedIcon  = j.icon;
  pickedColor = j.color;
  refreshJobModal();
  document.getElementById('moJob').classList.add('show');
}

function closeJob() {
  document.getElementById('moJob').classList.remove('show');
}

function selType(el) {
  curJobType = el.dataset.type;
  document.querySelectorAll('.type-button').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  refreshJobTypeFields();
  updateRateLabel();
}

function refreshJobModal() {
  document.querySelectorAll('.type-button').forEach(b =>
    b.classList.toggle('active', b.dataset.type === curJobType)
  );
  refreshJobTypeFields();
  updateRateLabel();
  renderAlwList();
  document.querySelectorAll('#iconPicker span').forEach(s =>
    s.style.background = s.dataset.icon === pickedIcon ? '#eff2ff' : ''
  );
  document.querySelectorAll('.color-swatch').forEach(s =>
    s.classList.toggle('selected', s.dataset.color === pickedColor)
  );
}

function refreshJobTypeFields() {
  const isH = curJobType === 'hourly';
  const isM = curJobType === 'monthly';
  document.getElementById('fg_otth_wrap').style.display = isH ? 'block' : 'none';
  document.getElementById('fg_ottype').style.display    = isH ? 'none'  : 'block';
  document.getElementById('fg_wdays').style.display     = isM ? 'block' : 'none';
}

function updateRateLabel() {
  const t = L[curLang];
  set('lbl_jrate', t['lbl_jrate_' + curJobType]);
}

function renderAlwList() {
  const t  = L[curLang];
  const el = document.getElementById('alwList');
  if (!el) return;

  if (!editAlws.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px 0;">' + (t.noAlw || 'No allowances') + '</div>';
    return;
  }

  el.innerHTML = editAlws.map((a, i) => `
    <div class="allowance-item">
      <div class="allowance-info">${a.name} — ${getCurSym()}${a.amount.toLocaleString()}
        <span>${t[a.per === 'day' ? 'opt_day' : 'opt_month']}</span>
      </div>
      <button class="allowance-del" onclick="removeAlw(${i})">✕</button>
    </div>`).join('');
}

function addAlw() {
  const n = document.getElementById('inp_alwn').value.trim();
  const a = parseInt(document.getElementById('inp_alwa').value) || 0;
  const p = document.getElementById('inp_alwp').value;
  if (!n || !a) return;
  editAlws.push({ name: n, amount: a, per: p });
  document.getElementById('inp_alwn').value = '';
  document.getElementById('inp_alwa').value = '';
  renderAlwList();
}

function removeAlw(i) {
  editAlws.splice(i, 1);
  renderAlwList();
}

function selIcon(el) {
  document.querySelectorAll('#iconPicker span').forEach(s => s.style.background = '');
  el.style.background = '#eff2ff';
  pickedIcon = el.dataset.icon;
}

function selColor(el) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  pickedColor = el.dataset.color;
}

function saveJob() {
  const name = document.getElementById('inp_jn').value.trim();
  if (!name) return;
  const rate   = parseInt(document.getElementById('inp_jrate').value) || 1000;
  const otTh   = parseFloat(document.getElementById('inp_otth').value) || 8;
  const otMul  = parseFloat(document.getElementById('inp_otmul').value) || 1.25;
  const otType = document.getElementById('inp_ottype').value;
  const wDays  = parseInt(document.getElementById('inp_wdays').value) || 22;
  const editId = parseInt(document.getElementById('editJobId').value) || 0;

  const jdata = {
    name, type: curJobType, rate,
    otThreshold: otTh, otMultiplier: otMul, otType,
    workDays: wDays,
    allowances: editAlws.map(a => ({ ...a })),
    icon: pickedIcon, color: pickedColor
  };

  if (editId) {
    const j = jobs.find(x => x.id === editId);
    if (j) Object.assign(j, jdata);
  } else {
    jobs.push({ id: nextJobId++, ...jdata });
  }

  closeJob();
  save();
  renderJobCards();
  fillJobSel();
}

function delJob(id) {
  if (jobs.length <= 1) return;
  const usedByShift = shifts.some(s => s.jobId === id);
  const usedByTemplate = shiftTemplates.some(t => t.jobId === id);
  if (usedByShift || usedByTemplate) {
    alert((L[curLang] && L[curLang].jobInUseMsg) || 'Không thể xoá công việc đang được dùng trong ca làm hoặc mẫu ca.');
    return;
  }
  const msg = (L[curLang] && L[curLang].confirmDelJob) || 'Delete this job?';
  if (!confirm(msg)) return;
  jobs = jobs.filter(j => j.id !== id);
  save();
  renderJobCards();
  fillJobSel();
}

/* -------- Profiles -------- */

function openProfilesModal() {
  const t = L[curLang];
  set('profilesMT', t.profilesMT || 'Users');
  document.getElementById('btnAddProfile').textContent = t.profileAdd || '➕ Add User';
  renderProfilesList();
  document.getElementById('moProfiles').classList.add('show');
}

function closeProfilesModal() {
  document.getElementById('moProfiles').classList.remove('show');
}

function renderProfilesList() {
  const el = document.getElementById('profilesList');
  if (!el) return;
  if (!profiles.length) {
    el.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);">—</div>';
    return;
  }
  el.innerHTML = profiles.map(p => {
    const isActive = p.id === activeProfileId;
    const langObj = L[p.lang] || L.vi;
    return `<div class="select-option${isActive ? ' selected' : ''}" onclick="selectProfile('${p.id}')">
      <span class="select-option-flag">👤</span>
      <div>
        <div class="select-option-name">${p.name}</div>
        <div class="select-option-sub">${langObj.f} ${langObj.n}</div>
      </div>
      <span class="select-option-check">✓</span>
    </div>`;
  }).join('');
}

function selectProfile(id) {
  if (id === activeProfileId) {
    closeProfilesModal();
    return;
  }
  const p = profiles.find(x => x.id === id);
  if (!p) return;
  activeProfileId = id;
  userName = p.name;
  curLang  = p.lang || curLang;
  saveProfiles();
  loadProfileData();
  closeProfilesModal();
  fillJobSel();
  applyLang();
  renderShifts();
  if (curPage === 'report') renderReport(curPeriod);
  if (curPage === 'settings') renderJobCards();
  const welcome = (L[curLang] && L[curLang].welcome) || 'Welcome';
  toast('👋 ' + welcome + ', ' + userName + '!');
}

function addNewProfile() {
  closeProfilesModal();
  showOnboardingForNew();
}

/* -------- Delete Profile -------- */

function openDelProfileModal() {
  const t = L[curLang];
  set('delProfileMT', t.sDelUser || 'Delete User');
  renderDelProfileList();
  document.getElementById('moDelProfile').classList.add('show');
}

function closeDelProfileModal() {
  document.getElementById('moDelProfile').classList.remove('show');
}

function renderDelProfileList() {
  const el = document.getElementById('delProfileList');
  if (!el) return;
  if (!profiles.length) {
    el.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);">—</div>';
    return;
  }
  el.innerHTML = profiles.map(p => {
    const isActive = p.id === activeProfileId;
    const langObj = L[p.lang] || L.vi;
    return `<div class="select-option" onclick="confirmDelProfile('${p.id}')" style="cursor:pointer;">
      <span class="select-option-flag" style="font-size:20px;">❌</span>
      <div>
        <div class="select-option-name">${p.name}${isActive ? ' ✓' : ''}</div>
        <div class="select-option-sub">${langObj.f} ${langObj.n}</div>
      </div>
    </div>`;
  }).join('');
}

function confirmDelProfile(id) {
  const p = profiles.find(x => x.id === id);
  if (!p) return;
  const t = L[curLang];
  const msg = (t.confirmDelProfile || 'Delete this user and all their data?') + '\n\n👤 ' + p.name;
  if (!confirm(msg)) return;
  deleteProfile(id);
  if (!activeProfileId) {
    closeDelProfileModal();
    checkOnboarding();
    return;
  }
  fillJobSel();
  applyLang();
  renderShifts();
  if (curPage === 'settings') renderJobCards();
  renderDelProfileList();
}
