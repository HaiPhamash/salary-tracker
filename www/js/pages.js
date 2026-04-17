/* =========================================================================
   Pages — Home, Add Shift, Report, Settings rendering + form handlers
   ========================================================================= */

/* -------- Home -------- */

function renderHomeStats() {
  const t     = L[curLang];
  const now   = new Date();
  const today = localYmd(now);
  const yr    = String(now.getFullYear());
  const mo    = localYm(now);
  const wkAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const wkAgoStr = localYmd(wkAgo);

  const todayShifts = shifts.filter(s => s.date === today);
  const todayAmt    = todayShifts.reduce((a, s) => a + (s.pay || 0), 0);
  const wkAmt       = shifts.filter(s => s.date >= wkAgoStr && s.date <= today).reduce((a, s) => a + (s.pay || 0), 0);
  const moAmt       = shifts.filter(s => s.date.startsWith(mo)).reduce((a, s) => a + (s.pay || 0), 0);
  const yrAmt       = shifts.filter(s => s.date.startsWith(yr + '')).reduce((a, s) => a + (s.pay || 0), 0);
  const moHours     = shifts.filter(s => s.date.startsWith(mo)).reduce((a, s) => a + (s.hours || 0), 0);
  const moOT        = shifts.filter(s => s.date.startsWith(mo)).reduce((a, s) => a + (s.otH || 0), 0);
  const otCount     = todayShifts.filter(s => s.isOT || s.otH > 0).length;

  const sub = todayShifts.length
    ? todayShifts.length + ' ' + t.shiftsUnit + (otCount > 0 ? ' · ' + otCount + ' OT' : '')
    : '—';

  set('todayAmt', fmt(todayAmt));
  set('todaySub', sub);
  set('wkAmt',    fmt(wkAmt));
  set('moAmt',    fmt(moAmt));
  set('yrAmt',    fmt(yrAmt));
  set('hrsV',     moHours.toFixed(0) + 'h');
  set('otV',      moOT.toFixed(0) + 'h OT');
  set('jobsV',    jobs.length + ' ' + t.jobsL.toLowerCase());
  set('goalV',    '—');
}

function renderShifts() {
  const el = document.getElementById('shiftList');
  if (!el) return;
  const sorted = [...shifts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  el.innerHTML = sorted.map(s => {
    const job = getShiftJobMeta(s);
    const hasOT = s.otH > 0 || s.isOT;
    const otBadge = hasOT
      ? `<span class="ot-badge">OT${s.otH > 0 ? ' ' + s.otH + 'h' : ''}</span>`
      : '';

    return `<div class="shift-item">
      <div class="shift-avatar" style="background:${job.color};">${job.icon}</div>
      <div class="shift-meta">
        <div class="shift-date">${fmtDate(s.date)}
          <span class="job-tag" style="background:${job.color};">${job.name}</span>
        </div>
        <div class="shift-time">${s.start ? s.start + '–' + s.end + ' · ' + s.hours + 'h' : L[curLang]['type_' + job.type]}${otBadge}</div>
      </div>
      <div class="shift-pay">
        <div class="shift-pay-total">${fmt(getShiftPay(s))}</div>
      </div>
    </div>`;
  }).join('');
}

/* -------- Calendar (Add Shift page) -------- */

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function monthShift(cursor, delta) {
  const [y, m] = cursor.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function renderCalendar() {
  const root = document.getElementById('page-add');
  if (!root || !root.classList.contains('active') && curPage !== 'add') {
    // still render when user switches to the page; but if the page exists, render anyway
  }
  const grid = document.getElementById('calGrid');
  const list = document.getElementById('calList');
  const wk   = document.getElementById('calWeekdays');
  const lbl  = document.getElementById('calMonthLbl');
  if (!grid || !wk || !lbl) return;

  const t = L[curLang];
  if (!calCursor) calCursor = localYm();
  const [y, m] = calCursor.split('-').map(Number);

  // header label
  lbl.textContent = (t.cal_monthYearTpl || '{y} / {m}')
    .replace('{y}', y)
    .replace('{m}', (t.months && t.months[m - 1]) || m);

  // weekdays row (Sun first)
  wk.innerHTML = t.days.map((d, i) =>
    `<div class="${i === 0 ? 'wd-sun' : i === 6 ? 'wd-sat' : ''}">${d}</div>`
  ).join('');

  // view toggle buttons
  document.querySelectorAll('.cal-view-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === calViewMode);
  });

  if (calViewMode === 'list') {
    grid.style.display = 'none';
    document.querySelector('.cal-grid-wrap').style.display = 'none';
    list.style.display = 'block';
    renderCalList();
  } else {
    grid.style.display = '';
    document.querySelector('.cal-grid-wrap').style.display = '';
    list.style.display = 'none';
    renderCalGrid();
  }
  renderCalDayPanel();
}

function renderCalGrid() {
  const grid = document.getElementById('calGrid');
  if (!grid) return;
  const [y, m] = calCursor.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const leading = first.getDay();              // 0..6 (Sun..Sat)
  const start = new Date(y, m - 1, 1 - leading);
  const today = localYmd();

  // count shifts per date for this window
  const counts = {};
  shifts.forEach(s => { counts[s.date] = (counts[s.date] || 0) + 1; });

  let html = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const date = ymd(d);
    const inMonth = d.getMonth() === (m - 1);
    const dow = d.getDay();
    const cls = ['cal-cell'];
    if (!inMonth) cls.push('muted');
    if (dow === 0) cls.push('sun');
    if (dow === 6) cls.push('sat');
    if (date === today) cls.push('today');
    if (date === calSelectedDate) cls.push('selected');
    const n = counts[date] || 0;
    const dots = n > 0
      ? '<div class="cal-dots">' + Array.from({ length: Math.min(n, 3) }, () => '<div class="cal-dot"></div>').join('') + '</div>'
      : '<div class="cal-dots"></div>';
    html += `<div class="${cls.join(' ')}" data-date="${date}" onclick="onCalCellTap('${date}')">${d.getDate()}${dots}</div>`;
  }
  grid.innerHTML = html;
}

function renderCalList() {
  const list = document.getElementById('calList');
  if (!list) return;
  const [y, m] = calCursor.split('-').map(Number);
  const prefix = y + '-' + String(m).padStart(2, '0');
  const rows = shifts.filter(s => s.date.startsWith(prefix)).sort((a, b) => b.date.localeCompare(a.date));
  if (!rows.length) {
    list.innerHTML = `<div class="cal-list-empty">${L[curLang].cal_noShift || 'No shifts'}</div>`;
    return;
  }
  const t = L[curLang];
  list.innerHTML = rows.map(s => {
    const j = getShiftJobMeta(s);
    const dt = new Date(s.date + 'T12:00:00');
    const timeTxt = s.start
      ? `${s.start}–${s.end} · ${s.hours}h`
      : (t['type_' + j.type] || '');
    return `<div class="cal-list-item" onclick="openEditShift(${s.id})">
      <div class="cal-list-day"><div class="dd">${dt.getDate()}</div><div class="dw">${t.days[dt.getDay()]}</div></div>
      <div class="cal-list-main">
        <div class="t">${j.icon} ${j.name}</div>
        <div class="s">${timeTxt}</div>
      </div>
      <div class="cal-list-pay">${fmt(getShiftPay(s))}</div>
    </div>`;
  }).join('');
}

function renderCalDayPanel() {
  const dateLbl = document.getElementById('calPanelDate');
  const panel   = document.getElementById('calPanelShifts');
  if (!dateLbl || !panel) return;
  const t = L[curLang];
  if (!calSelectedDate) { dateLbl.textContent = ''; panel.innerHTML = ''; return; }

  const dt = new Date(calSelectedDate + 'T12:00:00');
  const locale = LOCALE_MAP[curLang] || curLang;
  let dStr;
  try { dStr = dt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }); }
  catch (e) { dStr = calSelectedDate; }
  dateLbl.textContent = (t.cal_panelTit || 'Shifts on {d}').replace('{d}', dStr);

  const dayShifts = shifts.filter(s => s.date === calSelectedDate);
  const rows = dayShifts.map(s => {
    const j = getShiftJobMeta(s);
    const time = s.start
      ? `${s.start}<br>${s.end}`
      : '—';
    const sub = s.start ? `${s.hours}h · ${fmt(getShiftPay(s))}` : `${t['type_' + j.type]} · ${fmt(getShiftPay(s))}`;
    return `<div class="swipe-row" data-shift-id="${s.id}">
      <div class="swipe-row-del" onclick="event.stopPropagation();delShift(${s.id})">🗑️</div>
      <div class="swipe-row-inner" onclick="openEditShift(${s.id})">
        <div class="panel-shift-row">
          <div class="panel-shift-time">${time}</div>
          <div class="panel-shift-bar"></div>
          <div class="panel-shift-main">
            <div class="panel-shift-name">${j.icon} ${j.name}</div>
            <div class="panel-shift-sub">${sub}</div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const addBtn = `<button class="panel-add-btn" onclick="openDaySheet('${calSelectedDate}')">＋ ${t.cal_newShift || 'Add shift'}</button>`;
  panel.innerHTML = rows + addBtn;
  attachSwipeHandlers(panel);
}

function onCalCellTap(date) {
  calSelectedDate = date;
  // also move cursor if user tapped trailing/leading day
  const mo = date.slice(0, 7);
  if (mo !== calCursor) {
    calCursor = mo;
    renderCalendar();
  } else {
    document.querySelectorAll('.cal-cell').forEach(c => c.classList.toggle('selected', c.dataset.date === date));
    renderCalDayPanel();
  }
  openDaySheet(date);
}

function setCalView(mode) {
  calViewMode = mode;
  save();
  renderCalendar();
}

function goCalToday() {
  const today = localYmd();
  calCursor = today.slice(0, 7);
  calSelectedDate = today;
  renderCalendar();
}

function shiftCalMonth(delta) {
  calCursor = monthShift(calCursor, delta);
  const [y, m] = calCursor.split('-').map(Number);
  const todayStr = localYmd();
  if (todayStr.startsWith(calCursor)) calSelectedDate = todayStr;
  else calSelectedDate = calCursor + '-01';
  renderCalendar();
}

/* -------- Swipe gesture helpers -------- */

function closeOpenSwipeRows(except) {
  document.querySelectorAll('.swipe-row.open').forEach(r => {
    if (r !== except) r.classList.remove('open');
  });
}

document.addEventListener('touchstart', (e) => {
  const row = e.target.closest && e.target.closest('.swipe-row');
  if (!row) closeOpenSwipeRows(null);
  else closeOpenSwipeRows(row);
}, { passive: true });

function attachSwipeHandlers(container) {
  container.querySelectorAll('.swipe-row').forEach(row => {
    const inner = row.querySelector('.swipe-row-inner');
    if (!inner || inner._swipeBound) return;
    inner._swipeBound = true;
    let x0 = 0, y0 = 0, dx = 0, dragging = false;

    inner.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      x0 = t.clientX; y0 = t.clientY; dx = 0; dragging = false;
    }, { passive: true });

    inner.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      dx = t.clientX - x0;
      const dy = t.clientY - y0;
      if (!dragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) dragging = true;
      if (dragging) {
        let tx = Math.min(0, Math.max(-90, dx));
        inner.style.transform = 'translateX(' + tx + 'px)';
      }
    }, { passive: true });

    inner.addEventListener('touchend', () => {
      if (!dragging) { inner.style.transform = ''; return; }
      if (dx < -40) row.classList.add('open');
      else         row.classList.remove('open');
      inner.style.transform = '';
    });
  });
}

function attachCalendarSwipe() {
  const wrap = document.querySelector('.cal-grid-wrap');
  if (!wrap || wrap._swipeBound) return;
  wrap._swipeBound = true;
  let x0 = 0, y0 = 0, dx = 0, dy = 0, active = false, swiped = false;
  wrap.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    x0 = t.clientX; y0 = t.clientY; dx = dy = 0; active = true; swiped = false;
  }, { passive: true });
  wrap.addEventListener('touchmove', (e) => {
    if (!active) return;
    const t = e.touches[0];
    dx = t.clientX - x0;
    dy = t.clientY - y0;
  }, { passive: true });
  wrap.addEventListener('touchend', () => {
    if (!active) return;
    active = false;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    if (absY > 50 && absY > absX * 1.3) {
      swiped = true;
      shiftCalMonth(dy < 0 ? +1 : -1);
    }
  });
  wrap.addEventListener('click', (e) => {
    if (swiped) { e.stopPropagation(); e.preventDefault(); swiped = false; }
  }, true);
}

/* -------- Add Shift form handlers -------- */

function fillJobSel() {
  const sel = document.getElementById('inp_job');
  if (!sel) return;
  sel.innerHTML = jobs.map(j =>
    `<option value="${j.id}">${j.icon} ${j.name} — ${L[curLang]['type_' + j.type]}</option>`
  ).join('');
  if (jobs.length) onJobChange();
}

function onJobChange() {
  if (!jobs.length) return;
  const fallbackJob = getFirstJob();
  const jobId = parseInt(document.getElementById('inp_job').value) || (fallbackJob ? fallbackJob.id : 0);
  const job   = getJob(jobId) || fallbackJob;
  if (!job) return;
  const isHourly = job.type === 'hourly';

  document.getElementById('hourly_fields').style.display = isHourly ? 'block' : 'none';
  const dateOnly = document.getElementById('daily_date_fields');
  if (dateOnly) dateOnly.style.display = isHourly ? 'none' : 'block';
  document.getElementById('dm_ot_box').style.display    = isHourly ? 'none' : 'block';
  document.getElementById('monthly_ot_manual').style.display =
    (job.type === 'monthly' && job.otType === 'manual' && otIsOn) ? 'block' : 'none';

  otIsOn = false;
  document.getElementById('togOT').className = 'toggle-switch';
  calcPrev();
}

function onShiftDateChange() {
  const start = document.getElementById('inp_date');
  const end   = document.getElementById('inp_date_end');
  syncDateDisplay('inp_date', 'disp_date');
  if (start && end && start.value && (!end.value || end.value < start.value)) {
    end.value = start.value;
  }
  syncDateDisplay('inp_date_end', 'disp_date_end');
  calcPrev();
}

function toggleOT() {
  otIsOn = !otIsOn;
  document.getElementById('togOT').className = 'toggle-switch' + (otIsOn ? ' on' : '');
  const jobId = parseInt(document.getElementById('inp_job').value) || jobs[0].id;
  const job   = getJob(jobId);
  document.getElementById('monthly_ot_manual').style.display =
    (job.type === 'monthly' && job.otType === 'manual' && otIsOn) ? 'block' : 'none';
  calcPrev();
}

function calcPrev() {
  if (!jobs.length) return;
  const fallbackJob = getFirstJob();
  const jobId = parseInt(document.getElementById('inp_job').value) || (fallbackJob ? fallbackJob.id : 0);
  const job   = getJob(jobId) || fallbackJob;
  if (!job) return;
  const t     = L[curLang];
  const dayAlw = job.allowances.filter(a => a.per === 'day').reduce((s, a) => s + a.amount, 0);
  const monAlw = job.allowances.filter(a => a.per === 'month').reduce((s, a) => s + a.amount, 0);

  let hours = 0, reg = 0, ot = 0, base = 0, total = 0, bkd = '';

  if (job.type === 'hourly') {
    const st  = document.getElementById('inp_start').value;
    const en  = document.getElementById('inp_end').value;
    const brk = parseInt(document.getElementById('inp_brk').value) || 0;
    const ds  = document.getElementById('inp_date').value;
    const de  = document.getElementById('inp_date_end').value || ds;
    if (st && en && ds) {
      const sDate = new Date(ds + 'T' + st + ':00');
      const eDate = new Date(de + 'T' + en + ':00');
      let m = (eDate - sDate) / 60000 - brk;
      if (m < 0) m = 0;
      hours = parseFloat((m / 60).toFixed(2));
    }
    const r = calcHourly(hours, job.rate, job.otThreshold, job.otMultiplier);
    reg = r.reg; ot = r.ot; base = r.base;
    total = Math.round(base + dayAlw);
    bkd = `${t.normalH}: ${reg}h × ¥${job.rate.toLocaleString()} = ${fmt(Math.round(reg * job.rate))}`;
    if (ot > 0) {
      bkd += `<br><span class="ot-line">🔥 ${t.otH}${job.otMultiplier}: ${ot.toFixed(1)}h × ¥${job.rate.toLocaleString()} × ${job.otMultiplier} = ${fmt(Math.round(ot * job.rate * job.otMultiplier))}</span>`;
    }
    if (dayAlw > 0) bkd += `<br>${t.allowance}: ${fmt(dayAlw)}`;
  } else if (job.type === 'daily') {
    base  = otIsOn ? Math.round(job.rate * job.otMultiplier) : job.rate;
    total = Math.round(base + dayAlw);
    bkd   = `${t.type_daily}: ${fmt(job.rate)}${otIsOn ? ` × ${job.otMultiplier} = ${fmt(base)}` : ''}`;
    if (dayAlw > 0) bkd += `<br>${t.allowance}: ${fmt(dayAlw)}`;
  } else {
    // monthly
    const dayVal  = Math.round(job.rate / job.workDays);
    const otExtra = (otIsOn && job.otType === 'manual')
      ? (parseInt(document.getElementById('inp_otamt').value) || 0) : 0;
    base = (otIsOn && job.otType === 'multiplier') ? Math.round(dayVal * job.otMultiplier) : dayVal;
    const monAlwD = Math.round(monAlw / job.workDays);
    total = Math.round(base + dayAlw + monAlwD + otExtra);
    bkd = `${t.type_monthly}: ¥${job.rate.toLocaleString()}÷${job.workDays}d = ${fmt(dayVal)}`;
    if (otIsOn)             bkd += `<br>🔥 OT: ${fmt(base)}${otExtra > 0 ? ' + ' + fmt(otExtra) : ''}`;
    if (dayAlw > 0 || monAlw > 0) bkd += `<br>${t.allowance}: ${fmt(dayAlw + monAlwD)}`;
  }

  document.getElementById('calcVal').textContent = fmt(total);
  document.getElementById('calcBkd').innerHTML   = bkd;
}

function addShift() {
  const fallbackJob = getFirstJob();
  const jobId = parseInt(document.getElementById('inp_job').value) || (fallbackJob ? fallbackJob.id : 0);
  const job   = getJob(jobId) || fallbackJob;
  if (!job) return;
  const isHourly = job.type === 'hourly';
  const date = (isHourly
    ? document.getElementById('inp_date').value
    : document.getElementById('inp_date_daily').value)
    || localYmd();
  const note  = document.getElementById('inp_note').value;

  let existing = null;
  if (editShiftId) existing = shifts.find(s => s.id === editShiftId) || null;

  const sh = existing || {
    id: nextShiftId++,
    start: '', end: '', breakMin: 0,
    hours: 0, regularH: 0, otH: 0,
    manualOT: 0, pay: 0
  };
  sh.date  = date;
  sh.jobId = jobId;
  sh.note  = note;
  sh.isOT  = otIsOn;
  captureShiftJobMeta(sh, job);
  sh.start = ''; sh.end = ''; sh.breakMin = 0;
  sh.hours = 0; sh.regularH = 0; sh.otH = 0; sh.manualOT = 0;

  if (isHourly) {
    sh.start    = document.getElementById('inp_start').value;
    sh.end      = document.getElementById('inp_end').value;
    sh.breakMin = parseInt(document.getElementById('inp_brk').value) || 0;
    const ds = document.getElementById('inp_date').value || date;
    const de = document.getElementById('inp_date_end').value || ds;
    const sDate = new Date(ds + 'T' + sh.start + ':00');
    const eDate = new Date(de + 'T' + sh.end + ':00');
    let m = (eDate - sDate) / 60000 - sh.breakMin;
    if (m < 0) m = 0;
    sh.hours = parseFloat((m / 60).toFixed(2));
    const r = calcHourly(sh.hours, job.rate, job.otThreshold, job.otMultiplier);
    sh.regularH = r.reg;
    sh.otH      = r.ot;
  }
  if (job.type === 'monthly' && otIsOn && job.otType === 'manual') {
    sh.manualOT = parseInt(document.getElementById('inp_otamt').value) || 0;
  }
  sh.pay = calcShiftPay(sh, job).total;

  if (!existing) shifts.push(sh);

  if (isHourly && sh.start && sh.end) saveTemplateFromShift(sh);

  save();
  closeShiftForm();
  calSelectedDate = sh.date;
  calCursor = sh.date.slice(0, 7);
  renderCalendar();
  renderShifts();
  renderHomeStats();
}

function saveTemplateFromShift(sh) {
  const key = sh.jobId + '|' + sh.start + '|' + sh.end + '|' + (sh.breakMin || 0);
  const existing = shiftTemplates.find(t =>
    t.jobId === sh.jobId && t.start === sh.start && t.end === sh.end && (t.breakMin || 0) === (sh.breakMin || 0)
  );
  if (existing) {
    existing.lastUsedAt = Date.now();
    return;
  }
  shiftTemplates.push({
    id: nextTemplateId++,
    jobId: sh.jobId,
    start: sh.start,
    end: sh.end,
    breakMin: sh.breakMin || 0,
    createdAt: Date.now(),
    lastUsedAt: Date.now()
  });
}

function delShift(id) {
  const t = L[curLang];
  const msg = t.cal_delShift || 'Delete this shift?';
  if (!confirm(msg)) return;
  shifts = shifts.filter(s => s.id !== id);
  save();
  renderCalendar();
  renderShifts();
  renderHomeStats();
}

/* -------- Report -------- */

function setPeriod(p, el) {
  curPeriod = p;
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderReport(p);
}

function renderJobFilter() {
  const t   = L[curLang];
  const row = document.getElementById('jfilter');
  if (!row) return;

  const chipStyle = (active, color) => active
    ? `background:${color};color:#fff;border-color:${color};`
    : '';

  let html = `<div class="job-chip${filterJobId === null ? ' active' : ''}"
    onclick="setJobFilter(null,this)"
    style="${chipStyle(filterJobId === null, 'var(--primary)')}">${t.all}</div>`;

  html += jobs.map(j =>
    `<div class="job-chip${filterJobId === j.id ? ' active' : ''}"
      onclick="setJobFilter(${j.id},this)"
      style="${chipStyle(filterJobId === j.id, j.color)}">${j.icon} ${j.name}</div>`
  ).join('');

  row.innerHTML = html;
}

function setJobFilter(id) {
  filterJobId = id;
  renderJobFilter();
  renderReport(curPeriod);
}

function renderReport(period) {
  renderJobFilter();
  const t   = L[curLang];
  const now = new Date();
  const src = filterJobId ? shifts.filter(s => s.jobId === filterJobId) : shifts;

  let filtered = [...src];
  let labels = [], values = [];

  if (period === 'week') {
    const today = localYmd(now);
    const wa = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const waStr = localYmd(wa);
    filtered = src.filter(s => s.date >= waStr && s.date <= today);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const ds = localYmd(d);
      labels.push(t.days[d.getDay()]);
      values.push(src.filter(s => s.date === ds).reduce((a, c) => a + getShiftPay(c), 0));
    }
  } else if (period === 'month') {
    filtered = src.filter(s => s.date.startsWith(localYm(now)));
    labels = [t.wkShort + '1', t.wkShort + '2', t.wkShort + '3', t.wkShort + '4'];
    values = [0, 0, 0, 0];
    filtered.forEach(s => {
      const d = parseInt(s.date.slice(8, 10));
      values[Math.min(Math.floor((d - 1) / 7), 3)] += getShiftPay(s);
    });
  } else if (period === 'quarter') {
    const qS = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    filtered = src.filter(s => s.date >= localYmd(qS));
    for (let i = 2; i >= 0; i--) {
      const mo = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ms = localYm(mo);
      labels.push((mo.getMonth() + 1) + t.moShort);
      values.push(src.filter(s => s.date.startsWith(ms)).reduce((a, c) => a + getShiftPay(c), 0));
    }
  } else {
    filtered = src.filter(s => s.date.startsWith(now.getFullYear() + ''));
    for (let i = 1; i <= 12; i++) {
      const ms = now.getFullYear() + '-' + i.toString().padStart(2, '0');
      labels.push(i + t.moShort);
      values.push(src.filter(s => s.date.startsWith(ms)).reduce((a, c) => a + getShiftPay(c), 0));
    }
  }

  const total  = filtered.reduce((a, c) => a + getShiftPay(c), 0);
  const totalH = filtered.reduce((a, c) => a + (c.hours || 0), 0);
  const pLbls  = { week: t.wkLbl, month: t.moLbl, quarter: t.tabQ, year: t.yrLbl };

  set('rPeriodLbl', pLbls[period] || period);
  set('rMainVal', fmt(total));
  set('rSub', filtered.length + ' ' + t.shiftsUnit + ' · ' + totalH.toFixed(0) + 'h');

  const mx = Math.max(...values, 1);
  const maxIdx = values.indexOf(Math.max(...values));
  document.getElementById('barChart').innerHTML = values.map((v, i) => `
    <div class="bar-wrap">
      <div class="bar-value">${v > 0 ? '¥' + (v / 1000).toFixed(0) + 'k' : ''}</div>
      <div class="bar${i === maxIdx ? ' acc' : ''}" style="height:${Math.max(4, Math.round(v / mx * 80))}px;"></div>
      <div class="bar-label">${labels[i]}</div>
    </div>`).join('');

  document.getElementById('rDetails').innerHTML =
    [...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map(s => {
      const j = getShiftJobMeta(s);
      const otMark = (s.otH > 0 || s.isOT)
        ? '<span style="color:var(--ot);font-weight:700;margin-left:4px;">OT</span>'
        : '';
      return `<div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;gap:10px;">
        <div style="width:36px;height:36px;background:${j.color};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${j.icon}</div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;">${fmtDate(s.date)}</div>
          <div style="font-size:11px;color:var(--text-muted);">${s.start ? s.start + '–' + s.end + ' · ' + s.hours + 'h' : L[curLang]['type_' + j.type]}${otMark}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:14px;font-weight:700;color:var(--primary);">${fmt(getShiftPay(s))}</div>
        </div>
      </div>`;
    }).join('');
}

/* -------- Settings / Job Cards -------- */

function renderJobCards() {
  const t  = L[curLang];
  const el = document.getElementById('jobCardList');
  if (!el) return;

  const sym = getCurSym();
  el.innerHTML = jobs.map(j => {
    const suffix = j.type === 'hourly'  ? t.rateHourSuffix
                 : j.type === 'daily'   ? t.rateDaySuffix
                 :                        t.rateMonthSuffix;
    const rateLabel = `${sym}${j.rate.toLocaleString()}${suffix}`;
    const otLabel  = j.type === 'hourly'
      ? t.otAfterTpl.replace('{h}', j.otThreshold).replace('{m}', j.otMultiplier)
      : t.otTimesTpl.replace('{m}', j.otMultiplier);
    const alwTags = j.allowances
      .map(a => `<span class="allowance-tag">${a.name} ${sym}${a.amount}/${a.per === 'day' ? t.alwDayShort : t.alwMonShort}</span>`)
      .join('');

    return `<div class="job-card">
      <div class="job-card-top">
        <div class="job-avatar" style="background:${j.color};">${j.icon}</div>
        <div class="job-info">
          <div class="job-name">${j.name}</div>
          <div class="job-rate">${rateLabel} · ${t['type_' + j.type]}</div>
        </div>
        <div class="job-actions">
          <button class="icon-btn" onclick="openEditJob(${j.id})">✏️</button>
          <button class="icon-btn" onclick="delJob(${j.id})" style="color:var(--red);">🗑️</button>
        </div>
      </div>
      <div class="job-card-detail">${otLabel}${j.allowances.length > 0 ? `<div class="job-card-allowances">${alwTags}</div>` : ''}</div>
    </div>`;
  }).join('');
}

/* -------- Navigation -------- */

function goPage(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.getElementById('nav-' + page).classList.add('active');
  curPage = page;
  if (page === 'home')     { renderHomeStats(); renderShifts(); }
  if (page === 'report')   renderReport(curPeriod);
  if (page === 'settings') renderJobCards();
  if (page === 'add')      { renderCalendar(); attachCalendarSwipe(); }
}
