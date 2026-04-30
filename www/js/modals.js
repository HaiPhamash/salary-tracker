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
  set('todayExpenseLbl', txt('todayExpenseLbl', 'Chi hôm nay'));
  set('todayRemainLbl', txt('todayRemainLbl', 'Còn lại'));
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
  set('btnDayNewExpense', txt('cal_newExpense', 'Thêm chi tiêu'));

  set('otBoxTit', t.otBoxTit); set('otToggleLbl', t.otToggleLbl); set('lbl_otamt', t.lbl_otamt);

  set('tabW', t.tabW); set('tabM', t.tabM); set('tabQ', t.tabQ); set('tabY', t.tabY);
  set('chartTit', t.chartTit); set('detTit', t.detTit);
  set('rIncomeLbl', txt('incomeLbl', 'Thu nhập'));
  set('rExpenseLbl', txt('expenseLbl', 'Chi tiêu'));
  set('rRemainLbl', txt('remainingLbl', 'Còn lại'));
  set('rExpenseBreakdownTit', txt('expenseBreakdownTit', 'Chi tiêu theo danh mục'));
  set('rExpenseDetailsTit', txt('expenseDetailsTit', 'Chi tiết chi tiêu'));

  set('sgJobs', t.sgJobs); set('btnAddJob', t.btnAddJob);
  set('sgExpenses', txt('sgExpenses', 'CHI TIÊU'));
  set('sExpenseCategories', txt('sExpenseCategories', 'Danh mục chi tiêu'));
  set('sExpenseCategoriesV', txt('sExpenseCategoriesV', 'Thêm, sửa, xoá'));
  set('sRecurringExpenses', txt('sRecurringExpenses', 'Chi tiêu định kỳ'));
  set('sRecurringExpensesV', txt('sRecurringExpensesV', 'Hàng tháng'));
  set('sgApp', t.sgApp); set('sLang', t.sLang); set('sLangV', t.sLangV);
  set('sCur', t.sCur); set('sCurV', getCurLabel());
  if (typeof applyJpPayrollCopy === 'function') applyJpPayrollCopy();
  set('sGuide', t.sGuide || 'How to use');
  set('sGuideV', t.sGuideV || 'Open step-by-step guide');
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
  set('sdivAlw', t.sdivAlw); set('opt_day', t.opt_day); set('opt_month', t.opt_month); set('opt_year', t.opt_year);
  set('sdivIcon', t.sdivIcon); set('btnSaveJob', t.btnSaveJob);
  set('lbl_wdays', t.lbl_wdays);

  set('sdivDed', t.sdivDed || 'DEDUCTIONS');
  set('opt_dedvt_fixed',   t.opt_dedvt_fixed   || 'Fixed amount');
  set('opt_dedvt_percent', t.opt_dedvt_percent || '% of gross');
  set('opt_dedp_day',   t.opt_day   || '/day');
  set('opt_dedp_month', t.opt_month || '/month');
  set('opt_dedp_year',  t.opt_year  || '/year');
  set('lbl_dedValid', t.lbl_dedValid || 'Limit validity period');
  set('lbl_dedFrom',  t.lbl_dedFrom  || 'From');
  set('lbl_dedTo',    t.lbl_dedTo    || 'To');
  set('btn_addDed',   t.btn_addDed   || '+ Add deduction');

  set('expenseMT', txt('expenseMT_add', 'Thêm chi tiêu'));
  set('lbl_expense_date', txt('expenseDateLbl', 'Ngày'));
  set('lbl_expense_amount', txt('expenseAmountLbl', 'Số tiền'));
  set('lbl_expense_category', txt('expenseCategoryLbl', 'Danh mục'));
  set('lbl_expense_note', txt('expenseNoteLbl', 'Ghi chú'));
  set('btnSaveExpense', txt('btnSaveExpense', 'Lưu chi tiêu'));
  set('expenseCatMT', txt('expenseCatMT', 'Danh mục chi tiêu'));
  set('expenseCatFormTit', txt('expenseCatFormTit_add', 'Thêm danh mục'));
  set('lbl_expense_cat_name', txt('expenseCatNameLbl', 'Tên danh mục'));
  set('btnSaveExpenseCategory', txt('btnSaveExpenseCategory', 'Lưu danh mục'));
  set('recurringExpenseMT', txt('recurringExpenseMT', 'Chi tiêu định kỳ'));
  set('recurringExpenseFormTit', txt('recurringExpenseFormTit_add', 'Thêm khoản hàng tháng'));
  set('lbl_recurring_amount', txt('expenseAmountLbl', 'Số tiền'));
  set('lbl_recurring_category', txt('expenseCategoryLbl', 'Danh mục'));
  set('lbl_recurring_day', txt('recurringDayLbl', 'Ngày hàng tháng'));
  set('lbl_recurring_start', txt('recurringStartLbl', 'Bắt đầu'));
  set('lbl_recurring_note', txt('expenseNoteLbl', 'Ghi chú'));
  set('btnSaveRecurringExpense', txt('btnSaveRecurringExpense', 'Lưu định kỳ'));

  setPH('inp_jn',   t.phJobName);
  setPH('inp_alwn', t.phAlwName);
  setPH('inp_dedn', t.phDedName);
  setPH('inp_note', t.phNote);
  setPH('ob_name',  t.phObName);
  setPH('inp_expense_amount', txt('expenseAmountPh', '0'));
  setPH('inp_expense_note', txt('expenseNotePh', 'VD: Ăn trưa, tiền tàu...'));
  setPH('inp_expense_cat_name', txt('expenseCatNamePh', 'VD: Ăn uống'));
  setPH('inp_recurring_amount', txt('expenseAmountPh', '0'));
  setPH('inp_recurring_note', txt('recurringNotePh', 'VD: Tiền nhà, điện thoại...'));

  syncDateDisplay('inp_date', 'disp_date');
  syncDateDisplay('inp_date_end', 'disp_date_end');
  syncDateDisplay('inp_date_daily', 'disp_date_daily');
  syncDateDisplay('inp_expense_date', 'disp_expense_date');
  syncDateDisplay('inp_recurring_start', 'disp_recurring_start');

  renderHomeStats();
  renderShifts();
  if (curPage === 'report')   renderReport(curPeriod);
  if (curPage === 'settings') {
    renderJobCards();
    updateExpenseSettingsSummary();
  }
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

/* -------- Custom date picker -------- */

let _dpTargetInputId  = null;
let _dpTargetDisplayId = null;
let _dpOnChange       = null;
let _dpCursor         = null;
let _dpSelected       = null;

function openDatePicker(inputId, displayId, onChange) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  _dpTargetInputId   = inputId;
  _dpTargetDisplayId = displayId || null;
  _dpOnChange        = onChange  || null;
  _dpSelected        = inp.value || localYmd();
  _dpCursor          = _dpSelected.slice(0, 7);
  const t = L[curLang] || L.en;
  set('dpTit',       t.dpTit       || 'Select date');
  set('dpCancelBtn', t.dpCancel    || 'Cancel');
  set('dpTodayBtn',  t.dpToday     || 'Today');
  renderDpCalendar();
  document.getElementById('moDatePicker').classList.add('show');
}

function closeDatePicker() {
  document.getElementById('moDatePicker').classList.remove('show');
  _dpTargetInputId   = null;
  _dpTargetDisplayId = null;
  _dpOnChange        = null;
}

function renderDpCalendar() {
  const t = L[curLang] || L.en;
  if (!_dpCursor) _dpCursor = localYmd().slice(0, 7);
  const [y, m] = _dpCursor.split('-').map(Number);

  const monthName = (t.months && t.months[m - 1]) || String(m);
  const lbl = (t.cal_monthYearTpl || '{y} / {m}')
    .replace('{y}', y)
    .replace('{m}', monthName);
  set('dpMonthLbl', lbl);

  const days = t.days || L.en.days;
  document.getElementById('dpWeekdays').innerHTML = days.map((d, i) =>
    '<div class="' + (i === 0 ? 'dp-sun' : i === 6 ? 'dp-sat' : '') + '">' + d + '</div>'
  ).join('');

  const first = new Date(y, m - 1, 1);
  const leading = first.getDay();
  const start = new Date(y, m - 1, 1 - leading);
  const today = localYmd();

  let html = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const date = ymd(d);
    const inMonth = d.getMonth() === (m - 1);
    const dow = d.getDay();
    const cls = ['dp-cell'];
    if (!inMonth) cls.push('muted');
    if (dow === 0) cls.push('sun');
    if (dow === 6) cls.push('sat');
    if (date === today) cls.push('today');
    if (date === _dpSelected) cls.push('selected');
    html += '<div class="' + cls.join(' ') + '" onclick="dpPick(\'' + date + '\')">' + d.getDate() + '</div>';
  }
  document.getElementById('dpGrid').innerHTML = html;
}

function dpShiftMonth(delta) {
  _dpCursor = monthShift(_dpCursor, delta);
  renderDpCalendar();
}

function dpGoToday() {
  const today = localYmd();
  _dpCursor = today.slice(0, 7);
  dpPick(today);
}

function dpPick(date) {
  _dpSelected = date;
  const inp = document.getElementById(_dpTargetInputId);
  if (inp) {
    inp.value = date;
  }
  if (_dpTargetInputId && _dpTargetDisplayId) {
    syncDateDisplay(_dpTargetInputId, _dpTargetDisplayId);
  }
  const cb = _dpOnChange;
  closeDatePicker();
  if (cb) cb(date);
}

/* -------- Day sheet & shift form -------- */

let _daySheetDate = null;

function openDaySheet(date) {
  if (!jobs.length) {
    toast((L[curLang] && L[curLang].needJobFirst) || 'Create your first workplace before adding shifts.');
    goPage('settings');
    openGuideModal();
    return;
  }
  _daySheetDate = date || calSelectedDate || localYmd();
  calSelectedDate = _daySheetDate;
  const t = L[curLang];
  const dStr = formatYmdWithDow(_daySheetDate);
  set('daySheetTit', (t.cal_addFor || 'Add shift for {d}').replace('{d}', dStr));
  set('btnDayNewShift', t.cal_newShift || 'New shift');
  set('btnDayNewExpense', txt('cal_newExpense', 'Thêm chi tiêu'));
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
          <div class="tpl-row-name">${esc(job.icon)} ${esc(job.name)}</div>
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

async function deleteTemplate(id) {
  const t = L[curLang];
  const msg = t.cal_delTpl || 'Delete this template?';
  if (!(await confirmDialog(msg))) return;
  shiftTemplates = shiftTemplates.filter(x => x.id !== id);
  save();
  hapticMedium();
  renderDaySheetTemplates();
}

function openShiftForm() {
  if (!jobs.length) {
    closeDaySheet();
    toast((L[curLang] && L[curLang].needJobFirst) || 'Create your first workplace before adding shifts.');
    goPage('settings');
    openAddJob();
    return;
  }
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

/* -------- Expense form, categories, monthly recurring -------- */

function updateExpenseSettingsSummary() {
  set('sExpenseCategoriesV', expenseCategories.length + ' ' + txt('expenseCategoriesUnit', 'danh mục'));
  set('sRecurringExpensesV', recurringExpenses.length + ' ' + txt('monthlyItemsUnit', 'khoản hàng tháng'));
}

function refreshFinanceViews() {
  renderCalendar();
  renderHomeStats();
  if (curPage === 'report') renderReport(curPeriod);
  if (curPage === 'settings') {
    renderJobCards();
    updateExpenseSettingsSummary();
  }
}

function fillExpenseCategorySelect(selectId, selectedId) {
  if (typeof ensureFinanceData === 'function') ensureFinanceData();
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = expenseCategories.map(category =>
    `<option value="${category.id}">${esc(category.icon)} ${esc(getExpenseCategoryDisplayName(category))}</option>`
  ).join('');
  const target = selectedId || (expenseCategories[0] && expenseCategories[0].id);
  if (target) sel.value = String(target);
}

function openExpenseForm(date) {
  closeDaySheet();
  if (typeof ensureFinanceData === 'function') ensureFinanceData();
  editExpenseId = null;
  const t = L[curLang] || {};
  set('expenseMT', txt('expenseMT_add', 'Thêm chi tiêu'));
  const editInput = document.getElementById('editExpenseId');
  if (editInput) editInput.value = '';
  const targetDate = date || _daySheetDate || calSelectedDate || localYmd();
  const dateInput = document.getElementById('inp_expense_date');
  if (dateInput) dateInput.value = targetDate;
  const amountInput = document.getElementById('inp_expense_amount');
  if (amountInput) amountInput.value = '';
  const noteInput = document.getElementById('inp_expense_note');
  if (noteInput) noteInput.value = '';
  fillExpenseCategorySelect('inp_expense_category');
  syncDateDisplay('inp_expense_date', 'disp_expense_date');
  set('btnSaveExpense', t.btnSaveExpense || txt('btnSaveExpense', 'Lưu chi tiêu'));
  document.getElementById('moExpense').classList.add('show');
}

function closeExpenseForm() {
  document.getElementById('moExpense').classList.remove('show');
  editExpenseId = null;
}

function openEditExpense(id) {
  const expense = expenses.find(item => item.id === id);
  if (!expense) return;
  editExpenseId = id;
  const editInput = document.getElementById('editExpenseId');
  if (editInput) editInput.value = String(id);
  set('expenseMT', txt('expenseMT_edit', 'Sửa chi tiêu'));
  const dateInput = document.getElementById('inp_expense_date');
  if (dateInput) dateInput.value = expense.date || localYmd();
  const amountInput = document.getElementById('inp_expense_amount');
  if (amountInput) amountInput.value = String(getExpenseAmount(expense) || '');
  const noteInput = document.getElementById('inp_expense_note');
  if (noteInput) noteInput.value = expense.note || '';
  fillExpenseCategorySelect('inp_expense_category', expense.categoryId);
  syncDateDisplay('inp_expense_date', 'disp_expense_date');
  document.getElementById('moExpense').classList.add('show');
}

function saveExpense() {
  const t = L[curLang] || {};
  const editId = parseInt(document.getElementById('editExpenseId').value, 10) || 0;
  const date = document.getElementById('inp_expense_date').value || localYmd();
  const amount = Math.round(Number(document.getElementById('inp_expense_amount').value) || 0);
  const categoryId = parseInt(document.getElementById('inp_expense_category').value, 10) || 0;
  const category = getExpenseCategory(categoryId) || getFirstExpenseCategory();
  const note = (document.getElementById('inp_expense_note').value || '').trim();

  if (!amount || amount <= 0 || !category) {
    toast(t.expenseInvalid || txt('expenseInvalid', 'Nhập số tiền và danh mục hợp lệ'));
    return;
  }

  const existing = editId ? expenses.find(item => item.id === editId) : null;
  const expense = existing || {
    id: nextExpenseId++,
    source: 'manual',
    createdAt: Date.now()
  };
  expense.date = date;
  expense.amount = amount;
  expense.note = note;
  captureExpenseCategoryMeta(expense, category);
  if (!existing) expenses.push(expense);

  closeExpenseForm();
  save({ toast: true });
  hapticMedium();
  calSelectedDate = date;
  calCursor = date.slice(0, 7);
  refreshFinanceViews();
}

async function delExpense(id) {
  const msg = txt('confirmDelExpense', 'Xoá khoản chi này?');
  if (!(await confirmDialog(msg))) return;
  const idx = expenses.findIndex(item => item.id === id);
  if (idx < 0) return;
  const removed = expenses[idx];
  expenses.splice(idx, 1);
  save();
  hapticMedium();
  refreshFinanceViews();
  const undoLbl = txt('undoLbl', 'Undo');
  toast('🗑️ ' + txt('deletedLbl', 'Deleted') + ' · ' + undoLbl, {
    duration: 5000,
    onClick: () => {
      expenses.splice(idx, 0, removed);
      save();
      refreshFinanceViews();
    }
  });
}

function openExpenseCategoriesModal() {
  if (typeof ensureFinanceData === 'function') ensureFinanceData();
  set('expenseCatMT', txt('expenseCatMT', 'Danh mục chi tiêu'));
  resetExpenseCategoryForm();
  renderExpenseCategoryList();
  document.getElementById('moExpenseCategories').classList.add('show');
}

function closeExpenseCategoriesModal() {
  document.getElementById('moExpenseCategories').classList.remove('show');
  editExpenseCategoryId = null;
}

function resetExpenseCategoryForm() {
  editExpenseCategoryId = null;
  const editInput = document.getElementById('editExpenseCategoryId');
  if (editInput) editInput.value = '';
  const nameInput = document.getElementById('inp_expense_cat_name');
  if (nameInput) nameInput.value = '';
  pickedExpenseCategoryIcon = '🍽️';
  pickedExpenseCategoryColor = '#ef4444';
  set('expenseCatFormTit', txt('expenseCatFormTit_add', 'Thêm danh mục'));
  refreshExpenseCategoryPickers();
}

function refreshExpenseCategoryPickers() {
  document.querySelectorAll('#expenseIconPicker span').forEach(el => {
    el.classList.toggle('selected', el.dataset.icon === pickedExpenseCategoryIcon);
  });
  document.querySelectorAll('#expenseColorPicker .color-swatch').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === pickedExpenseCategoryColor);
  });
}

function renderExpenseCategoryList() {
  const el = document.getElementById('expenseCategoryList');
  if (!el) return;
  if (!expenseCategories.length) {
    el.innerHTML = `<div class="recent-empty">${txt('noExpenseCategories', 'Chưa có danh mục')}</div>`;
    return;
  }
  el.innerHTML = expenseCategories.map(category => {
    const used = expenses.filter(item => item.categoryId === category.id).length;
    const categoryName = getExpenseCategoryDisplayName(category);
    return `<div class="expense-row">
      <div class="expense-row-icon" style="background:${category.color};">${esc(category.icon)}</div>
      <div class="expense-row-main">
        <div class="expense-row-title">${esc(categoryName)}</div>
        <div class="expense-row-sub">${used} ${txt('expensesUnit', 'khoản chi')}</div>
      </div>
      <div class="expense-row-actions">
        <button class="icon-btn" onclick="editExpenseCategory(${category.id})">✏️</button>
        <button class="icon-btn" onclick="deleteExpenseCategory(${category.id})" style="color:var(--red);">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

function editExpenseCategory(id) {
  const category = getExpenseCategory(id);
  if (!category) return;
  editExpenseCategoryId = id;
  const editInput = document.getElementById('editExpenseCategoryId');
  if (editInput) editInput.value = String(id);
  const nameInput = document.getElementById('inp_expense_cat_name');
  if (nameInput) nameInput.value = getExpenseCategoryDisplayName(category);
  pickedExpenseCategoryIcon = category.icon;
  pickedExpenseCategoryColor = category.color;
  set('expenseCatFormTit', txt('expenseCatFormTit_edit', 'Sửa danh mục'));
  refreshExpenseCategoryPickers();
}

function selExpenseCategoryIcon(el) {
  pickedExpenseCategoryIcon = el.dataset.icon;
  refreshExpenseCategoryPickers();
}

function selExpenseCategoryColor(el) {
  pickedExpenseCategoryColor = el.dataset.color;
  refreshExpenseCategoryPickers();
}

function saveExpenseCategory() {
  const t = L[curLang] || {};
  const editId = parseInt(document.getElementById('editExpenseCategoryId').value, 10) || 0;
  const name = (document.getElementById('inp_expense_cat_name').value || '').trim();
  if (!name) {
    toast(t.expenseCategoryInvalid || txt('expenseCategoryInvalid', 'Nhập tên danh mục'));
    return;
  }

  let category = editId ? getExpenseCategory(editId) : null;
  if (category) {
    category.name = name;
    category.icon = pickedExpenseCategoryIcon;
    category.color = pickedExpenseCategoryColor;
    category.userModified = !(category.key && isDefaultExpenseCategoryName(category.key, name));
  } else {
    category = {
      id: nextExpenseCategoryId++,
      name,
      icon: pickedExpenseCategoryIcon,
      color: pickedExpenseCategoryColor,
      userModified: true,
      createdAt: Date.now()
    };
    expenseCategories.push(category);
  }

  expenses.forEach(item => {
    if (item.categoryId === category.id) captureExpenseCategoryMeta(item, category);
  });
  save({ toast: true });
  hapticLight();
  resetExpenseCategoryForm();
  renderExpenseCategoryList();
  fillExpenseCategorySelect('inp_expense_category');
  fillExpenseCategorySelect('inp_recurring_category');
  refreshFinanceViews();
}

async function deleteExpenseCategory(id) {
  const category = getExpenseCategory(id);
  if (!category) return;
  if (expenseCategories.length <= 1) {
    toast(txt('expenseCategoryMin', 'Cần ít nhất một danh mục'));
    return;
  }
  const msg = txt('confirmDelExpenseCategory', 'Xoá danh mục này? Các khoản chi sẽ chuyển sang danh mục khác.');
  if (!(await confirmDialog(msg))) return;
  const fallback = expenseCategories.find(item => item.id !== id && item.key === 'other') ||
    expenseCategories.find(item => item.id !== id);
  if (!fallback) return;

  expenses.forEach(item => {
    if (item.categoryId === id) captureExpenseCategoryMeta(item, fallback);
  });
  recurringExpenses.forEach(item => {
    if (item.categoryId === id) item.categoryId = fallback.id;
  });
  expenseCategories = expenseCategories.filter(item => item.id !== id);
  save();
  hapticMedium();
  resetExpenseCategoryForm();
  renderExpenseCategoryList();
  refreshFinanceViews();
}

function openRecurringExpensesModal() {
  if (typeof ensureFinanceData === 'function') ensureFinanceData();
  generateDueMonthlyExpenses();
  set('recurringExpenseMT', txt('recurringExpenseMT', 'Chi tiêu định kỳ'));
  resetRecurringExpenseForm();
  renderRecurringExpenseList();
  document.getElementById('moRecurringExpenses').classList.add('show');
}

function closeRecurringExpensesModal() {
  document.getElementById('moRecurringExpenses').classList.remove('show');
  editRecurringExpenseId = null;
}

function resetRecurringExpenseForm() {
  editRecurringExpenseId = null;
  const editInput = document.getElementById('editRecurringExpenseId');
  if (editInput) editInput.value = '';
  const amountInput = document.getElementById('inp_recurring_amount');
  if (amountInput) amountInput.value = '';
  const dayInput = document.getElementById('inp_recurring_day');
  if (dayInput) dayInput.value = String(new Date().getDate());
  const startInput = document.getElementById('inp_recurring_start');
  if (startInput) startInput.value = localYmd();
  const noteInput = document.getElementById('inp_recurring_note');
  if (noteInput) noteInput.value = '';
  fillExpenseCategorySelect('inp_recurring_category');
  syncDateDisplay('inp_recurring_start', 'disp_recurring_start');
  set('recurringExpenseFormTit', txt('recurringExpenseFormTit_add', 'Thêm khoản hàng tháng'));
}

function renderRecurringExpenseList() {
  const el = document.getElementById('recurringExpenseList');
  if (!el) return;
  if (!recurringExpenses.length) {
    el.innerHTML = `<div class="recent-empty">${txt('noRecurringExpenses', 'Chưa có khoản định kỳ')}</div>`;
    return;
  }
  el.innerHTML = recurringExpenses.map(item => {
    const category = getExpenseCategory(item.categoryId) || getOtherExpenseCategory();
    const categoryName = getExpenseCategoryDisplayName(category);
    const activeText = item.active === false ? txt('pausedLbl', 'Tạm dừng') : txt('monthlyLbl', 'Hàng tháng');
    return `<div class="recurring-row">
      <div class="recurring-row-icon" style="background:${category.color};">${esc(category.icon)}</div>
      <div class="recurring-row-main">
        <div class="recurring-row-title">${fmt(item.amount)} · ${esc(categoryName)}</div>
        <div class="recurring-row-sub">${activeText} · ${txt('dayOfMonthShort', 'ngày')} ${item.dayOfMonth}${item.note ? ' · ' + esc(item.note) : ''}</div>
      </div>
      <div class="recurring-row-actions">
        <button class="icon-btn" onclick="editRecurringExpense(${item.id})">✏️</button>
        <button class="icon-btn" onclick="deleteRecurringExpense(${item.id})" style="color:var(--red);">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

function editRecurringExpense(id) {
  const item = recurringExpenses.find(x => x.id === id);
  if (!item) return;
  editRecurringExpenseId = id;
  const editInput = document.getElementById('editRecurringExpenseId');
  if (editInput) editInput.value = String(id);
  document.getElementById('inp_recurring_amount').value = String(item.amount || '');
  document.getElementById('inp_recurring_day').value = String(item.dayOfMonth || 1);
  document.getElementById('inp_recurring_start').value = item.startDate || localYmd();
  document.getElementById('inp_recurring_note').value = item.note || '';
  fillExpenseCategorySelect('inp_recurring_category', item.categoryId);
  syncDateDisplay('inp_recurring_start', 'disp_recurring_start');
  set('recurringExpenseFormTit', txt('recurringExpenseFormTit_edit', 'Sửa khoản hàng tháng'));
}

function saveRecurringExpense() {
  const amount = Math.round(Number(document.getElementById('inp_recurring_amount').value) || 0);
  const categoryId = parseInt(document.getElementById('inp_recurring_category').value, 10) || 0;
  const category = getExpenseCategory(categoryId) || getFirstExpenseCategory();
  const dayOfMonth = Math.min(31, Math.max(1, parseInt(document.getElementById('inp_recurring_day').value, 10) || 1));
  const startDate = document.getElementById('inp_recurring_start').value || localYmd();
  const note = (document.getElementById('inp_recurring_note').value || '').trim();
  const editId = parseInt(document.getElementById('editRecurringExpenseId').value, 10) || 0;

  if (!amount || amount <= 0 || !category) {
    toast(txt('expenseInvalid', 'Nhập số tiền và danh mục hợp lệ'));
    return;
  }

  const existing = editId ? recurringExpenses.find(item => item.id === editId) : null;
  const data = {
    amount,
    categoryId: category.id,
    dayOfMonth,
    startDate,
    note,
    active: true
  };
  if (existing) {
    Object.assign(existing, data);
  } else {
    recurringExpenses.push({
      id: nextRecurringExpenseId++,
      createdAt: Date.now(),
      ...data
    });
  }

  generateDueMonthlyExpenses();
  save({ toast: true });
  hapticMedium();
  resetRecurringExpenseForm();
  renderRecurringExpenseList();
  refreshFinanceViews();
}

async function deleteRecurringExpense(id) {
  const msg = txt('confirmDelRecurringExpense', 'Xoá khoản định kỳ này? Các khoản đã sinh vẫn được giữ lại.');
  if (!(await confirmDialog(msg))) return;
  recurringExpenses = recurringExpenses.filter(item => item.id !== id);
  save();
  hapticMedium();
  resetRecurringExpenseForm();
  renderRecurringExpenseList();
  refreshFinanceViews();
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
  renderHomeStats();
  renderShifts();
  renderCalendar();
  if (curPage === 'settings') renderJobCards();
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
  const sorted = shifts.slice().sort((a, b) => b.date.localeCompare(a.date));
  const rows = [[t.pdfDate, t.pdfJob, t.pdfStart, t.pdfEnd, t.pdfBreak, t.pdfHours, t.pdfOT + ' ' + t.pdfHours, t.pdfPay + '(' + sym + ')', t.pdfNote]];
  sorted.forEach(s => {
    const job = getShiftJobMeta(s);
    rows.push([s.date, job.name, s.start || '', s.end || '', s.breakMin || 0, s.hours || 0, s.otH || 0, getShiftPay(s), s.note || '']);
  });

  const gross = sorted.reduce((a, s) => a + getShiftPay(s), 0);
  const dates = sorted.map(s => s.date).sort();
  const fromYmd = dates[0] || localYmd();
  const toYmd   = dates[dates.length - 1] || localYmd();
  const alwTotal = getMonthlyAllowanceForRange(fromYmd, toYmd, null);
  const dedTotal = getDeductionsForRange(fromYmd, toYmd, null);
  const net = gross + alwTotal - dedTotal;
  const sortedExpenses = getExpensesForRange(fromYmd, toYmd, null)
    .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
  const expenseTotal = sortedExpenses.reduce((sum, item) => sum + getExpenseAmount(item), 0);
  const remaining = net - expenseTotal;

  rows.push([]);
  rows.push([(t.bdTitlePeriod || 'Period breakdown') + ' ' + fromYmd + ' -> ' + toYmd]);
  rows.push([t.bdGross || 'Shift income', '', '', '', '', '', '', gross, '']);

  getMonthlyAllowanceBreakdown(fromYmd, toYmd, null).forEach(b => {
    b.items.forEach(i => {
      rows.push([t.bdAlwMonth || 'Monthly allowance', b.jobName, i.name, '', '', '', '', i.amount, '']);
    });
  });
  if (alwTotal > 0) rows.push([t.bdAlwMonth || 'Monthly allowance', '', '', '', '', '', t.pdfTotal || 'Total', alwTotal, '']);

  getDeductionsBreakdown(fromYmd, toYmd, null).forEach(b => {
    b.items.forEach(i => {
      const lbl = i.name + (i.valueType === 'percent' ? ' (' + i.rawAmount + '%)' : '');
      rows.push([t.bdDed || 'Deductions', b.jobName, lbl, '', '', '', '', -i.amount, '']);
    });
  });
  if (dedTotal > 0) rows.push([t.bdDed || 'Deductions', '', '', '', '', '', t.pdfTotal || 'Total', -dedTotal, '']);

  rows.push([t.bdNet || t.bdTotal || 'Net', '', '', '', '', '', '', net, '']);
  if (expenseTotal > 0) rows.push([txt('expenseLbl', 'Chi tiêu'), '', '', '', '', '', '', -expenseTotal, '']);
  rows.push([txt('remainingLbl', 'Còn lại'), '', '', '', '', '', '', remaining, '']);

  if (sortedExpenses.length) {
    rows.push([]);
    rows.push([txt('expenseDetailsTit', 'Chi tiết chi tiêu')]);
    rows.push([t.pdfDate, txt('expenseCategoryLbl', 'Danh mục'), '', '', '', '', '', txt('expenseAmountLbl', 'Số tiền') + '(' + sym + ')', t.pdfNote]);
    sortedExpenses.forEach(item => {
      const category = getExpenseCategoryMeta(item);
      rows.push([item.date, category.name, '', '', '', '', '', -getExpenseAmount(item), item.note || '']);
    });
  }
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
  const gross = sortedShifts.reduce((s, sh) => s + getShiftPay(sh), 0);

  const dates = sortedShifts.map(s => s.date).sort();
  const fromYmd = dates[0] || localYmd();
  const toYmd   = dates[dates.length - 1] || localYmd();
  const alwTotal = getMonthlyAllowanceForRange(fromYmd, toYmd, null);
  const dedTotal = getDeductionsForRange(fromYmd, toYmd, null);
  const net = gross + alwTotal - dedTotal;
  const sortedExpenses = getExpensesForRange(fromYmd, toYmd, null)
    .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
  const expenseTotal = sortedExpenses.reduce((sum, item) => sum + getExpenseAmount(item), 0);
  const remaining = net - expenseTotal;

  const alwBreakdown = getMonthlyAllowanceBreakdown(fromYmd, toYmd, null);
  const dedBreakdown = getDeductionsBreakdown(fromYmd, toYmd, null);

  const rows  = sortedShifts.map(s => {
    const job = getShiftJobMeta(s);
    return `<tr>
      <td>${s.date}</td>
      <td>${esc(job.icon)} ${esc(job.name)}</td>
      <td>${s.start || '-'}</td>
      <td>${s.end || '-'}</td>
      <td>${s.hours || 0}h</td>
      <td>${s.otH > 0 ? s.otH + 'h ' + t.pdfOT : '-'}</td>
      <td style="text-align:right;font-weight:600;">${sym}${fmtNumber(getShiftPay(s))}</td>
      <td>${esc(s.note || '')}</td>
    </tr>`;
  }).join('');

  const alwDetail = alwBreakdown.map(b => `
    <tr>
      <td>${esc(b.jobIcon || '')} ${esc(b.jobName || '')}</td>
      <td>${b.items.map(i => esc(i.name)).join(', ')}</td>
      <td style="text-align:right;color:#16a34a;font-weight:600;">+${sym}${fmtNumber(b.total)}</td>
    </tr>`).join('');

  const dedDetail = dedBreakdown.map(b => `
    <tr>
      <td>${esc(b.jobIcon || '')} ${esc(b.jobName || '')}</td>
      <td>${b.items.map(i => esc(i.name) + (i.valueType === 'percent' ? ' (' + i.rawAmount + '%)' : '')).join(', ')}</td>
      <td style="text-align:right;color:#ef4444;font-weight:600;">−${sym}${fmtNumber(b.total)}</td>
    </tr>`).join('');

  const bdGrossLbl = t.bdGross || 'Shift income';
  const bdAlwLbl   = t.bdAlwMonth || 'Monthly allowance';
  const bdDedLbl   = t.bdDed || 'Deductions';
  const bdNetLbl   = t.bdNet || t.bdTotal || 'Net';
  const expenseLbl = txt('expenseLbl', 'Chi tiêu');
  const remainingLbl = txt('remainingLbl', 'Còn lại');

  const summarySection = `
    <div style="margin-bottom:18px;padding:14px 16px;background:#f0f4ff;border-radius:10px;font-size:14px;">
      <div style="font-size:11px;color:#6b7280;letter-spacing:.5px;margin-bottom:8px;">${esc((t.bdTitlePeriod || 'Period breakdown').toUpperCase())} — ${esc(fromYmd)} → ${esc(toYmd)}</div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;"><span>${esc(bdGrossLbl)}</span><span style="font-weight:600;">${sym}${fmtNumber(gross)}</span></div>
      ${alwTotal > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;color:#16a34a;"><span>${esc(bdAlwLbl)}</span><span style="font-weight:600;">+${sym}${fmtNumber(alwTotal)}</span></div>` : ''}
      ${dedTotal > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;color:#ef4444;"><span>${esc(bdDedLbl)}</span><span style="font-weight:600;">−${sym}${fmtNumber(dedTotal)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:8px 0 0;border-top:1px dashed #d1d5db;margin-top:6px;font-size:15px;font-weight:700;color:#1a2f5e;"><span>${esc(bdNetLbl)}</span><span>${sym}${fmtNumber(net)}</span></div>
      ${expenseTotal > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;color:#ef4444;"><span>${esc(expenseLbl)}</span><span style="font-weight:600;">−${sym}${fmtNumber(expenseTotal)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:8px 0 0;border-top:1px dashed #d1d5db;margin-top:6px;font-size:15px;font-weight:700;color:${remaining < 0 ? '#ef4444' : '#1a2f5e'};"><span>${esc(remainingLbl)}</span><span>${sym}${fmtNumber(remaining)}</span></div>
    </div>`;

  const detailTables = (alwDetail || dedDetail) ? `
    ${alwDetail ? `
      <h3 style="color:#16a34a;font-size:14px;margin:16px 0 6px;">${esc(bdAlwLbl)}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px;">
        <thead><tr style="background:#e8f5ee;color:#166534;">
          <th style="padding:6px 8px;text-align:left;">${esc(t.pdfJob)}</th>
          <th style="padding:6px 8px;text-align:left;">${esc(t.pdfItems || 'Items')}</th>
          <th style="padding:6px 8px;text-align:right;">${esc(t.pdfAmount || 'Amount')}</th>
        </tr></thead>
        <tbody>${alwDetail}</tbody>
      </table>` : ''}
    ${dedDetail ? `
      <h3 style="color:#ef4444;font-size:14px;margin:16px 0 6px;">${esc(bdDedLbl)}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px;">
        <thead><tr style="background:#fee2e2;color:#991b1b;">
          <th style="padding:6px 8px;text-align:left;">${esc(t.pdfJob)}</th>
          <th style="padding:6px 8px;text-align:left;">${esc(t.pdfItems || 'Items')}</th>
          <th style="padding:6px 8px;text-align:right;">${esc(t.pdfAmount || 'Amount')}</th>
        </tr></thead>
        <tbody>${dedDetail}</tbody>
      </table>` : ''}
  ` : '';

  const expenseRows = sortedExpenses.map(item => {
    const category = getExpenseCategoryMeta(item);
    return `<tr>
      <td>${item.date}</td>
      <td>${esc(category.icon)} ${esc(category.name)}</td>
      <td>${esc(item.note || '')}</td>
      <td style="text-align:right;color:#ef4444;font-weight:600;">−${sym}${fmtNumber(getExpenseAmount(item))}</td>
    </tr>`;
  }).join('');

  const expenseTable = expenseRows ? `
    <h3 style="color:#ef4444;font-size:14px;margin:16px 0 6px;">${esc(txt('expenseDetailsTit', 'Chi tiết chi tiêu'))}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px;">
      <thead><tr style="background:#fee2e2;color:#991b1b;">
        <th style="padding:6px 8px;text-align:left;">${esc(t.pdfDate)}</th>
        <th style="padding:6px 8px;text-align:left;">${esc(txt('expenseCategoryLbl', 'Danh mục'))}</th>
        <th style="padding:6px 8px;text-align:left;">${esc(t.pdfNote)}</th>
        <th style="padding:6px 8px;text-align:right;">${esc(txt('expenseAmountLbl', 'Số tiền'))}</th>
      </tr></thead>
      <tbody>${expenseRows}</tbody>
      <tfoot><tr style="background:#fff1f2;font-weight:700;">
        <td colspan="3" style="padding:8px;">${esc(t.pdfTotal)}</td>
        <td style="text-align:right;color:#ef4444;">−${sym}${fmtNumber(expenseTotal)}</td>
      </tr></tfoot>
    </table>` : '';

  const reportBody = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:20px;max-width:900px;margin:0 auto;">
      <h2 style="color:#1a2f5e;margin-bottom:4px;">💴 Salary Tracker — ${esc(userName || '')}</h2>
      <p style="color:#666;font-size:13px;margin-bottom:16px;">${t.pdfGenerated}: ${formatYmdWithDow(localYmd())} ${pad2(new Date().getHours())}:${pad2(new Date().getMinutes())} | ${t.pdfCurrency}: ${getCurLabel()}</p>

      ${summarySection}
      ${detailTables}
      ${expenseTable}

      <h3 style="color:#1a2f5e;font-size:14px;margin:16px 0 6px;">${esc(t.pdfShiftsTit || 'Shifts')}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:#1a2f5e;color:#fff;">
          <th style="padding:8px;text-align:left;">${t.pdfDate}</th><th>${t.pdfJob}</th><th>${t.pdfStart}</th><th>${t.pdfEnd}</th><th>${t.pdfHours}</th><th>${t.pdfOT}</th><th style="text-align:right;">${t.pdfPay}</th><th>${t.pdfNote}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr style="background:#f0f4ff;font-weight:700;font-size:14px;">
          <td colspan="6" style="padding:10px;">${t.pdfTotal} (${esc(bdGrossLbl)})</td>
          <td style="text-align:right;color:#1a2f5e;">${sym}${fmtNumber(gross)}</td>
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
  editDeds    = [];
  curJobType  = 'hourly';
  pickedIcon  = '🍜';
  pickedColor = '#1a2f5e';
  resetDedInputs();
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
  editAlws    = (j.allowances || []).map(a => ({ ...a }));
  editDeds    = (j.deductions || []).map(d => ({ ...d }));
  curJobType  = j.type;
  pickedIcon  = j.icon;
  pickedColor = j.color;
  resetDedInputs();
  refreshJobModal();
  document.getElementById('moJob').classList.add('show');
}

function resetDedInputs() {
  const dn = document.getElementById('inp_dedn'); if (dn) dn.value = '';
  const da = document.getElementById('inp_deda'); if (da) da.value = '';
  const dvt = document.getElementById('inp_dedvt'); if (dvt) dvt.value = 'fixed';
  const dp  = document.getElementById('inp_dedp');  if (dp)  dp.value  = 'month';
  const cv  = document.getElementById('chk_dedValid'); if (cv) cv.checked = false;
  const df  = document.getElementById('inp_dedFrom'); if (df) df.value = '';
  const dt  = document.getElementById('inp_dedTo');   if (dt) dt.value = '';
  const wrap = document.getElementById('dedDatesWrap'); if (wrap) wrap.style.display = 'none';
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
  renderDedList();
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

  el.innerHTML = editAlws.map((a, i) => {
    const perKey = a.per === 'day' ? 'opt_day' : a.per === 'year' ? 'opt_year' : 'opt_month';
    return `
    <div class="allowance-item">
      <div class="allowance-info">${esc(a.name)} — ${getCurSym()}${fmtNumber(a.amount)}
        <span>${t[perKey] || a.per}</span>
      </div>
      <button class="allowance-del" onclick="removeAlw(${i})">✕</button>
    </div>`;
  }).join('');
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

function toggleDedValidity(chk) {
  const wrap = document.getElementById('dedDatesWrap');
  if (wrap) wrap.style.display = chk && chk.checked ? 'flex' : 'none';
}

function renderDedList() {
  const t  = L[curLang] || {};
  const el = document.getElementById('dedList');
  if (!el) return;

  if (!editDeds.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px 0;">' + (t.noDeds || 'No deductions') + '</div>';
    return;
  }

  const sym = getCurSym();
  el.innerHTML = editDeds.map((d, i) => {
    const amtStr = d.valueType === 'percent' ? (d.amount + '%') : (sym + fmtNumber(d.amount));
    const perLbl = d.per === 'day'
      ? (t.opt_day   || '/day')
      : d.per === 'year'
        ? (t.opt_year  || '/year')
        : (t.opt_month || '/month');
    const range = (d.startDate || d.endDate)
      ? `<span class="d-meta">${esc((d.startDate || '') + ' → ' + (d.endDate || '∞'))}</span>`
      : '';
    return `
    <div class="deduction-item">
      <div class="deduction-info">
        <span class="d-name">${esc(d.name || '')}</span> — ${esc(amtStr)} ${esc(perLbl)}
        ${range}
      </div>
      <button class="deduction-del" onclick="removeDed(${i})">✕</button>
    </div>`;
  }).join('');
}

function addDed() {
  const t = L[curLang] || {};
  const name = (document.getElementById('inp_dedn').value || '').trim();
  const amt  = parseFloat(document.getElementById('inp_deda').value);
  const vt   = document.getElementById('inp_dedvt').value || 'fixed';
  const per  = document.getElementById('inp_dedp').value  || 'month';
  const validityChk = document.getElementById('chk_dedValid');
  const useRange = !!(validityChk && validityChk.checked);
  const startDate = useRange ? document.getElementById('inp_dedFrom').value || '' : '';
  const endDate   = useRange ? document.getElementById('inp_dedTo').value   || '' : '';

  if (!name || !Number.isFinite(amt) || amt <= 0) {
    toast(t.dedInvalid || 'Enter a name and a positive amount');
    return;
  }
  if (vt === 'percent' && amt > 100) {
    toast(t.dedPercentRange || 'Percent must be between 0 and 100');
    return;
  }
  if (startDate && endDate && startDate > endDate) {
    toast(t.dedDateRange || 'Invalid validity range');
    return;
  }

  editDeds.push({
    name, amount: amt, valueType: vt, per,
    startDate: startDate || undefined,
    endDate: endDate || undefined
  });
  resetDedInputs();
  renderDedList();
  hapticLight();
}

function removeDed(i) {
  editDeds.splice(i, 1);
  renderDedList();
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
    deductions: editDeds.map(d => ({ ...d })),
    icon: pickedIcon, color: pickedColor
  };

  if (editId) {
    const j = jobs.find(x => x.id === editId);
    if (j) {
      Object.assign(j, jdata);
      shifts.forEach(s => {
        if (s.jobId === j.id) {
          captureShiftJobMeta(s, j);
          s.pay = calcShiftPay(s, j).total;
        }
      });
    }
  } else {
    jobs.push({ id: nextJobId++, createdAt: Date.now(), ...jdata });
  }

  closeJob();
  save({ toast: true });
  hapticMedium();
  renderJobCards();
  fillJobSel();
  renderCalendar();
  renderShifts();
  renderHomeStats();
  if (curPage === 'report') renderReport(curPeriod);
}

async function delJob(id) {
  if (jobs.length <= 1) return;
  const t = L[curLang] || {};
  const usedByShift = shifts.some(s => s.jobId === id);
  const usedByTemplate = shiftTemplates.some(tp => tp.jobId === id);
  if (usedByShift || usedByTemplate) {
    await alertDialog(t.jobInUseMsg || 'Cannot delete a job that is used by shifts or templates.');
    return;
  }
  const msg = t.confirmDelJob || 'Delete this job?';
  if (!(await confirmDialog(msg))) return;
  const idx = jobs.findIndex(j => j.id === id);
  if (idx < 0) return;
  const removed = jobs[idx];
  jobs.splice(idx, 1);
  save();
  hapticMedium();
  renderJobCards();
  fillJobSel();
  const undoLbl = t.undoLbl || 'Undo';
  toast('🗑️ ' + (t.deletedLbl || 'Deleted') + ' · ' + undoLbl, {
    duration: 5000,
    onClick: () => {
      jobs.splice(idx, 0, removed);
      save();
      renderJobCards();
      fillJobSel();
    }
  });
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
        <div class="select-option-name">${esc(p.name)}</div>
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
  if (typeof generateDueMonthlyExpenses === 'function') generateDueMonthlyExpenses();
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
        <div class="select-option-name">${esc(p.name)}${isActive ? ' ✓' : ''}</div>
        <div class="select-option-sub">${langObj.f} ${langObj.n}</div>
      </div>
    </div>`;
  }).join('');
}

async function confirmDelProfile(id) {
  const p = profiles.find(x => x.id === id);
  if (!p) return;
  const t = L[curLang];
  const msg = (t.confirmDelProfile || 'Delete this user and all their data?') + '\n\n👤 ' + p.name;
  if (!(await confirmDialog(msg))) return;
  hapticMedium();
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
