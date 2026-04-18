/* =========================================================================
   Pages — Home, Add Shift, Report, Settings rendering + form handlers
   ========================================================================= */

let reportMotionAnimating = false;
let reportSwipeSuppressUntil = 0;

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

  const goalCard = document.getElementById('goalCard');
  if (goalCard && !goalCard.dataset.bound) {
    goalCard.dataset.bound = '1';
    goalCard.addEventListener('click', editMonthlyGoal);
    goalCard.setAttribute('role', 'button');
    goalCard.setAttribute('tabindex', '0');
    goalCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); editMonthlyGoal(); }
    });
  }
  if (monthlyGoal > 0) {
    const pct = Math.min(999, Math.round((moAmt / monthlyGoal) * 100));
    set('goalV', pct + '%');
  } else {
    set('goalV', '—');
  }
}

async function editMonthlyGoal() {
  const t = L[curLang];
  const msg = (t.goalPromptMsg || 'Enter your monthly income goal (0 to clear):');
  const title = t.goalPromptTitle || t.goalL || 'Monthly goal';
  const v = await promptDialog(msg, title, monthlyGoal ? String(monthlyGoal) : '');
  if (v == null) return;
  const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
  monthlyGoal = Number.isFinite(n) && n > 0 ? n : 0;
  save({ toast: true });
  hapticLight();
  renderHomeStats();
}

function renderShifts() {
  const el = document.getElementById('shiftList');
  if (!el) return;
  const grouped = {};
  [...shifts]
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (a.start || '').localeCompare(b.start || '');
    })
    .forEach(s => {
      if (!grouped[s.date]) grouped[s.date] = [];
      grouped[s.date].push(s);
    });

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a)).slice(0, 5);
  if (!dates.length) {
    const t = L[curLang] || {};
    if (!jobs.length) {
      el.innerHTML = getNoJobsStateHtml('home');
      return;
    }
    el.innerHTML = `<div class="empty-setup-card empty-setup-card--home">
      <div class="empty-setup-icon">📅</div>
      <div class="empty-setup-title">${t.emptyShiftTitle || t.cal_noShift || 'No shifts yet'}</div>
      <div class="empty-setup-body">${t.emptyShiftBody || 'Tap ➕ to add your first shift.'}</div>
      <div class="empty-setup-actions">
        <button class="btn btn--accent btn--small" onclick="goPage('add',document.getElementById('nav-add'))">${t.addTit || 'Add shift'}</button>
      </div>
    </div>`;
    return;
  }

  el.innerHTML = dates.map(date => {
    const dayShifts = grouped[date];
    const expanded = !!homeExpandedDates[date];
    const total = dayShifts.reduce((sum, shift) => sum + getShiftPay(shift), 0);
    const otCount = dayShifts.filter(shift => shift.otH > 0 || shift.isOT).length;
    const summaryMeta = [
      dayShifts.length + ' ' + ((L[curLang] && L[curLang].shiftsUnit) || 'shifts'),
      otCount ? otCount + ' OT' : ''
    ].filter(Boolean).join(' · ');

    return `<div class="recent-day-card${expanded ? ' open' : ''}">
      <button class="recent-day-summary" onclick="toggleHomeDay('${date}')">
        <div class="recent-day-date">
          <div class="recent-day-title">${fmtDate(date)}</div>
          <div class="recent-day-meta">${summaryMeta || '—'}</div>
        </div>
        <div class="recent-day-main"></div>
        <div class="recent-day-pay">
          <div class="recent-day-pay-total">${fmt(total)}</div>
          <div class="recent-day-pay-sub">${expanded ? getReportText('hideDay', 'Hide') : getReportText('showDay', 'View shifts')}</div>
        </div>
        <div class="recent-day-chevron">›</div>
      </button>
      <div class="recent-day-shifts">
        ${dayShifts.map(s => {
          const job = getShiftJobMeta(s);
          const hasOT = s.otH > 0 || s.isOT;
          const otBadge = hasOT
            ? `<span class="ot-badge">OT${s.otH > 0 ? ' ' + s.otH + 'h' : ''}</span>`
            : '';

          return `<div class="recent-shift-item">
            <div class="shift-avatar" style="background:${job.color};">${esc(job.icon)}</div>
            <div class="shift-meta">
              <div class="shift-date">${esc(job.name)}</div>
              <div class="shift-time">${getShiftTimeText(s, job)}${otBadge}</div>
            </div>
            <div class="shift-pay">
              <div class="shift-pay-total">${fmt(getShiftPay(s))}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

function toggleHomeDay(date) {
  homeExpandedDates[date] = !homeExpandedDates[date];
  renderShifts();
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

function shiftYmd(ymdStr, deltaDays) {
  const d = new Date(ymdStr + 'T12:00:00');
  d.setDate(d.getDate() + deltaDays);
  return localYmd(d);
}

function getShiftTimeText(shift, job) {
  return shift.start
    ? shift.start + '–' + shift.end + ' · ' + shift.hours + 'h'
    : L[curLang]['type_' + job.type];
}

function getReportText(key, fallback) {
  return (L[curLang] && L[curLang][key]) || fallback;
}

function getReportMinDate() {
  const profileStart = localYmd(getProfileStartDate());
  const shiftDates = shifts.map(s => s.date).filter(Boolean).sort();
  const earliestShift = shiftDates.length ? shiftDates[0] : profileStart;
  return earliestShift < profileStart ? earliestShift : profileStart;
}

function getProfileStartDate() {
  const profile = profiles.find(p => p.id === activeProfileId) || null;
  if (profile && profile.createdAt) return new Date(profile.createdAt);
  return new Date();
}

function getReportMaxDate() {
  const shiftDates = shifts.map(s => s.date).filter(Boolean).sort();
  const latestShift = shiftDates.length ? shiftDates[shiftDates.length - 1] : localYmd();
  return latestShift > localYmd() ? latestShift : localYmd();
}

function getReportWeekBounds() {
  return {
    minEnd: getReportMinDate(),
    maxEnd: getReportMaxDate()
  };
}

function getReportYearBounds() {
  const startYear = Number(getReportMinDate().slice(0, 4));
  const maxYear = Number(getReportMaxDate().slice(0, 4));
  return { startYear, maxYear };
}

function getReportMonthBounds() {
  const minYm = getReportMinDate().slice(0, 7);
  const maxYm = getReportMaxDate().slice(0, 7);
  return { minYm, maxYm };
}

function initReportState() {
  const now = new Date();
  if (!reportWeekCursor) reportWeekCursor = localYmd(now);
  if (!reportMonthCursor) reportMonthCursor = localYm(now);
  if (!reportMonthWindowStart) reportMonthWindowStart = monthShift(reportMonthCursor, -3);
  if (reportQuarterYear == null) reportQuarterYear = now.getFullYear();
  if (reportQuarterIndex == null) reportQuarterIndex = Math.floor(now.getMonth() / 3);
  if (reportYearCursor == null) reportYearCursor = now.getFullYear();
  clampReportState();
}

function syncReportMonthWindow() {
  const { minYm, maxYm } = getReportMonthBounds();
  const maxWindowStart = monthShift(maxYm, -3);
  let start = reportMonthWindowStart || monthShift(reportMonthCursor || maxYm, -3);

  if (maxWindowStart >= minYm) {
    if (start < minYm) start = minYm;
    if (start > maxWindowStart) start = maxWindowStart;
  } else {
    start = minYm;
  }

  if (reportMonthCursor < start) start = reportMonthCursor;
  if (reportMonthCursor > monthShift(start, 3)) {
    start = monthShift(reportMonthCursor, -3);
  }

  if (maxWindowStart >= minYm && start > maxWindowStart) start = maxWindowStart;
  if (start < minYm) start = minYm;
  reportMonthWindowStart = start;
}

function clampReportState() {
  const { minEnd, maxEnd } = getReportWeekBounds();
  if (!reportWeekCursor || reportWeekCursor < minEnd) reportWeekCursor = minEnd;
  if (reportWeekCursor > maxEnd) reportWeekCursor = maxEnd;

  const { minYm, maxYm } = getReportMonthBounds();
  if (!reportMonthCursor || reportMonthCursor < minYm) reportMonthCursor = minYm;
  if (reportMonthCursor > maxYm) reportMonthCursor = maxYm;
  syncReportMonthWindow();

  const { startYear, maxYear } = getReportYearBounds();
  reportQuarterYear = Math.min(maxYear, Math.max(startYear, reportQuarterYear == null ? maxYear : reportQuarterYear));
  reportQuarterIndex = Math.min(3, Math.max(0, reportQuarterIndex == null ? 0 : reportQuarterIndex));
  reportYearCursor = Math.min(maxYear, Math.max(startYear, reportYearCursor == null ? maxYear : reportYearCursor));
}

function getMonthLabel(ym, short) {
  const [year, month] = ym.split('-').map(Number);
  const monthName = (L[curLang].months && L[curLang].months[month - 1]) || month;
  return short ? monthName : (monthName + ' ' + year);
}

function getQuarterLabel(year, index) {
  const prefix = getReportText('qPrefix', 'Q');
  return prefix === 'Q' ? `Q${index + 1} ${year}` : `${prefix} ${index + 1} / ${year}`;
}

function getQuarterMonths(year, index) {
  const startMonth = index * 3 + 1;
  return [0, 1, 2].map(offset => year + '-' + pad2(startMonth + offset));
}

function getYearList() {
  const { startYear, maxYear } = getReportYearBounds();
  const years = [];
  for (let year = startYear; year <= maxYear; year++) years.push(year);
  return years;
}

function getMonthShifts(src, ym) {
  return src.filter(s => s.date.startsWith(ym));
}

function summarizeShiftBucket(list) {
  return {
    total: list.reduce((sum, shift) => sum + getShiftPay(shift), 0),
    shifts: list.length,
    hours: list.reduce((sum, shift) => sum + (shift.hours || 0), 0),
    otHours: list.reduce((sum, shift) => sum + (shift.otH || 0), 0)
  };
}

function formatChartValue(value) {
  const sym = getCurSym();
  if (!value) return '';
  if (value >= 1000000) return sym + (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return sym + (value / 1000).toFixed(0) + 'k';
  return sym + Math.round(value);
}

function renderShiftDetails(list) {
  if (!list.length) return `<div class="recent-empty">${getReportText('noShifts', 'No shifts')}</div>`;
  return `<div class="report-detail-list">${list.map(s => {
    const j = getShiftJobMeta(s);
    const otMark = (s.otH > 0 || s.isOT)
      ? '<span style="color:var(--ot);font-weight:700;margin-left:4px;">OT</span>'
      : '';
    return `<div class="report-detail-row">
      <div style="width:36px;height:36px;background:${j.color};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;color:#fff;">${esc(j.icon)}</div>
      <div class="report-detail-main">
        <div class="report-detail-title">${fmtDate(s.date)}</div>
        <div class="report-detail-sub">${getShiftTimeText(s, j)}${otMark}</div>
      </div>
      <div class="report-detail-pay">
        <div class="main">${fmt(getShiftPay(s))}</div>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderBreakdownDetails(items) {
  if (!items.length) return `<div class="recent-empty">${getReportText('noData', 'No data yet')}</div>`;
  return `<div class="report-breakdown-list">${items.map(item => `
    <div class="report-breakdown-row">
      <div class="report-breakdown-main">
        <div class="report-breakdown-title">${item.label}</div>
        <div class="report-breakdown-sub">${item.shifts} ${L[curLang].shiftsUnit} · ${item.hours.toFixed(0)}h${item.otHours > 0 ? ' · ' + item.otHours.toFixed(0) + 'h OT' : ''}</div>
      </div>
      <div class="report-breakdown-pay">
        <div class="main">${fmt(item.total)}</div>
      </div>
    </div>`).join('')}</div>`;
}

function getCalendarActionDate() {
  if (calSelectedDate && calSelectedDate.startsWith(calCursor)) return calSelectedDate;
  return calCursor + '-01';
}

function getNoJobsStateHtml(context) {
  const t = L[curLang];
  const body = t.noJobsBody || 'Create your first workplace before adding shifts.';
  return `<div class="empty-setup-card${context ? ' empty-setup-card--' + context : ''}">
    <div class="empty-setup-icon">🧭</div>
    <div class="empty-setup-title">${t.noJobsTitle || 'Create your first workplace'}</div>
    <div class="empty-setup-body">${body}</div>
    <div class="empty-setup-actions">
      <button class="btn btn--accent btn--small" onclick="goPage('settings');openAddJob()">${t.noJobsAction || 'Add first job'}</button>
      <button class="btn btn--small empty-setup-secondary" onclick="openGuideModal()">${t.sGuide || 'How to use'}</button>
    </div>
  </div>`;
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
  const gridWrap = document.querySelector('.cal-grid-wrap');
  const dayPanel = document.getElementById('calDayPanel');
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

  if (!jobs.length) {
    wk.style.display = 'none';
    if (gridWrap) gridWrap.style.display = 'none';
    grid.style.display = 'none';
    list.style.display = 'block';
    list.innerHTML = getNoJobsStateHtml('calendar');
    if (dayPanel) dayPanel.style.display = 'none';
    return;
  }

  if (calViewMode === 'list') {
    wk.style.display = 'none';
    grid.style.display = 'none';
    if (gridWrap) gridWrap.style.display = 'none';
    list.style.display = 'block';
    if (dayPanel) dayPanel.style.display = 'none';
    renderCalList();
  } else {
    wk.style.display = 'grid';
    grid.style.display = '';
    if (gridWrap) gridWrap.style.display = '';
    list.style.display = 'none';
    if (dayPanel) dayPanel.style.display = '';
    renderCalGrid();
    renderCalDayPanel();
  }
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
  const t = L[curLang];
  const totalDays = new Date(y, m, 0).getDate();
  let html = '';

  for (let day = 1; day <= totalDays; day++) {
    const date = prefix + '-' + String(day).padStart(2, '0');
    const dt = new Date(date + 'T12:00:00');
    const dayRows = shifts
      .filter(s => s.date === date)
      .sort((a, b) => (a.start || '').localeCompare(b.start || '') || a.id - b.id);
    const isSelected = date === calSelectedDate;
    const dow = dt.getDay();
    const dayClass = [
      'cal-list-date',
      isSelected ? 'selected' : '',
      dow === 0 ? 'sun' : '',
      dow === 6 ? 'sat' : '',
      dayRows.length ? 'has-shifts' : ''
    ].filter(Boolean).join(' ');

    const shiftHtml = dayRows.length
      ? dayRows.map(s => {
          const j = getShiftJobMeta(s);
          const timeText = s.start ? `${s.start}<span>${s.end}</span>` : `<strong>${t['type_' + j.type] || ''}</strong>`;
          const metaText = s.start
            ? `${s.hours}h${s.note ? ' · ' + esc(s.note) : ''}`
            : `${t['type_' + j.type] || ''}${s.note ? ' · ' + esc(s.note) : ''}`;
          return `<button class="cal-timeline-shift" onclick="event.stopPropagation();openEditShift(${s.id})">
            <div class="cal-timeline-time">${timeText}</div>
            <div class="cal-timeline-bar" style="background:${j.color};"></div>
            <div class="cal-timeline-main">
              <div class="cal-timeline-job">${esc(j.icon)} ${esc(j.name)}</div>
              <div class="cal-timeline-meta">${metaText}</div>
            </div>
            <div class="cal-timeline-pay">${fmt(getShiftPay(s))}</div>
          </button>`;
        }).join('')
      : `<button class="cal-list-empty-day" onclick="event.stopPropagation();openDaySheet('${date}')">＋ ${t.cal_newShift || 'Add shift'}</button>`;

    html += `<div class="cal-list-group${isSelected ? ' selected' : ''}">
      <button class="${dayClass}" onclick="selectCalListDate('${date}', true)">
        <div class="dd">${dt.getDate()}</div>
        <div class="dw">${t.days[dow]}</div>
        <div class="dot"></div>
      </button>
      <div class="cal-list-track">
        ${shiftHtml}
      </div>
    </div>`;
  }

  html += `<button class="cal-list-add-btn" onclick="openDaySheet('${getCalendarActionDate()}')">＋ ${t.cal_newShift || 'Add shift'}</button>`;
  list.innerHTML = html;
}

function renderCalDayPanel() {
  const dateLbl = document.getElementById('calPanelDate');
  const panel   = document.getElementById('calPanelShifts');
  if (!dateLbl || !panel) return;
  const t = L[curLang];
  if (!jobs.length) {
    dateLbl.textContent = '';
    panel.innerHTML = '';
    return;
  }
  if (!calSelectedDate) { dateLbl.textContent = ''; panel.innerHTML = ''; return; }

  const dStr = formatYmdWithDow(calSelectedDate);
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
            <div class="panel-shift-name">${esc(j.icon)} ${esc(j.name)}</div>
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

function selectCalListDate(date, openSheet) {
  calSelectedDate = date;
  renderCalendar();
  if (openSheet) openDaySheet(date);
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
  const surface = document.getElementById('page-add');
  if (!surface || surface._swipeBound) return;
  surface._swipeBound = true;
  let x0 = 0, y0 = 0, dx = 0, dy = 0, active = false, swiped = false;
  let ignore = false;
  surface.addEventListener('touchstart', (e) => {
    ignore = !!(e.target.closest && e.target.closest('input,select,textarea,a,label,.swipe-row,.cal-view-btn'));
    if (ignore) return;
    const t = e.touches[0];
    x0 = t.clientX; y0 = t.clientY; dx = dy = 0; active = true; swiped = false;
  }, { passive: true });
  surface.addEventListener('touchmove', (e) => {
    if (!active || ignore) return;
    const t = e.touches[0];
    dx = t.clientX - x0;
    dy = t.clientY - y0;
  }, { passive: true });
  surface.addEventListener('touchend', () => {
    if (!active || ignore) { active = false; return; }
    active = false;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    if (absX > 60 && absX > absY * 1.25) {
      swiped = true;
      shiftCalMonth(dx < 0 ? +1 : -1);
    }
  });
  surface.addEventListener('click', (e) => {
    if (swiped) { e.stopPropagation(); e.preventDefault(); swiped = false; }
  }, true);
}

function attachReportSwipe() {
  const surface = document.querySelector('#reportMotion .chart-stage');
  if (!surface || surface._swipeBound) return;
  surface._swipeBound = true;
  let x0 = 0, y0 = 0, dx = 0, dy = 0, active = false, dragging = false;
  let lastX = 0, lastTs = 0, velocityX = 0;
  let ignore = false;

  const resetGesture = () => {
    x0 = 0;
    y0 = 0;
    dx = 0;
    dy = 0;
    lastX = 0;
    lastTs = 0;
    velocityX = 0;
    active = false;
    dragging = false;
    ignore = false;
  };

  const getDragOffset = (distance, width, blocked) => {
    const sign = distance < 0 ? -1 : 1;
    const abs = Math.abs(distance);
    const follow = Math.min(abs, width * 0.22);
    const extra = Math.max(0, abs - follow);
    const eased = follow + extra * (blocked ? 0.16 : 0.52);
    const limit = width * (blocked ? 0.24 : 0.84);
    return sign * Math.min(limit, eased);
  };

  const getMotion = () => document.getElementById('barChart');

  surface.addEventListener('touchstart', (e) => {
    if (reportMotionAnimating || curPeriod === 'quarter') return;
    ignore = !!(e.target.closest && e.target.closest('.chart-nav-btn,input,select,textarea,a,label'));
    if (ignore) return;
    const t = e.touches[0];
    x0 = t.clientX;
    y0 = t.clientY;
    lastX = t.clientX;
    lastTs = Date.now();
    dx = 0;
    dy = 0;
    active = true;
    dragging = false;
    velocityX = 0;
  }, { passive: true, capture: true });

  surface.addEventListener('touchmove', (e) => {
    if (!active || ignore) return;
    const t = e.touches[0];
    dx = t.clientX - x0;
    dy = t.clientY - y0;
    const now = Date.now();
    const dt = Math.max(16, now - lastTs);
    velocityX = (t.clientX - lastX) / dt;
    lastX = t.clientX;
    lastTs = now;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (!dragging) {
      if (absX < 10 && absY < 10) return;
      if (absY > absX * 1.05) {
        active = false;
        return;
      }
      if (absX > absY * 1.12) dragging = true;
    }

    if (!dragging) return;
    if (e.cancelable) e.preventDefault();

    if (absX > 14) reportSwipeSuppressUntil = Date.now() + 240;
    const blocked = !canNavigateReport(dx < 0 ? 1 : -1);
    const width = Math.max(240, surface.offsetWidth || 320);
    const offset = getDragOffset(dx, width, blocked);
    const motion = getMotion();
    if (!motion) return;
    motion.style.transition = 'none';
    motion.style.transform = 'translate3d(' + Math.round(offset) + 'px,0,0)';
    motion.style.opacity = String(Math.max(blocked ? 0.94 : 0.82, 1 - Math.abs(offset) / (width * 1.6)));
  }, { passive: false, capture: true });

  surface.addEventListener('touchend', () => {
    if (!active && !dragging) {
      resetGesture();
      return;
    }
    if (ignore) {
      resetGesture();
      return;
    }
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const projected = absX + Math.min(76, Math.abs(velocityX) * 170);
    if (dragging && projected > 92 && absX > absY * 1.05) {
      reportSwipeSuppressUntil = Date.now() + 380;
      const moved = navigateReport(dx < 0 ? 1 : -1);
      if (!moved) {
        reportMotionAnimating = false;
        resetReportMotionPosition();
      }
    } else {
      resetReportMotionPosition();
    }
    resetGesture();
  }, { passive: true, capture: true });

  surface.addEventListener('touchcancel', () => {
    reportMotionAnimating = false;
    resetReportMotionPosition();
    resetGesture();
  }, { passive: true, capture: true });

  surface.addEventListener('click', (e) => {
    if (Date.now() < reportSwipeSuppressUntil) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
}

function resetReportMotionPosition() {
  const motion = document.getElementById('barChart');
  if (!motion) return;
  motion.style.transition = 'transform .24s cubic-bezier(.16, .9, .28, 1.04), opacity .18s ease';
  motion.style.transform = 'translate3d(0px,0,0)';
  motion.style.opacity = '1';
}

/* -------- Add Shift form handlers -------- */

function fillJobSel() {
  const sel = document.getElementById('inp_job');
  if (!sel) return;
  if (!jobs.length) {
    sel.innerHTML = `<option value="">${(L[curLang] && L[curLang].noJobsTitle) || 'Create your first workplace'}</option>`;
    return;
  }
  sel.innerHTML = jobs.map(j =>
    `<option value="${j.id}">${esc(j.icon)} ${esc(j.name)} — ${L[curLang]['type_' + j.type]}</option>`
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
  const fallbackJob = getFirstJob();
  const jobId = parseInt(document.getElementById('inp_job').value) || (fallbackJob ? fallbackJob.id : 0);
  const job   = getJob(jobId) || fallbackJob;
  if (!job) return;
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
      let m = (eDate - sDate) / 60000;
      if (m < 0 && ds === de) m += 1440;
      m -= brk;
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
  if (!job) {
    toast((L[curLang] && L[curLang].needJobFirst) || 'Create your first workplace before adding shifts.');
    closeShiftForm();
    goPage('settings');
    openAddJob();
    return;
  }
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
    let m = (eDate - sDate) / 60000;
    if (m < 0 && ds === de) m += 1440;
    m -= sh.breakMin;
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

  save({ toast: true });
  hapticMedium();
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

async function delShift(id) {
  const t = L[curLang] || {};
  const msg = t.cal_delShift || 'Delete this shift?';
  if (!(await confirmDialog(msg))) return;
  const idx = shifts.findIndex(s => s.id === id);
  if (idx < 0) return;
  const removed = shifts[idx];
  shifts.splice(idx, 1);
  save();
  hapticMedium();
  renderCalendar();
  renderShifts();
  renderHomeStats();
  const undoLbl = t.undoLbl || 'Undo';
  toast('🗑️ ' + (t.deletedLbl || 'Deleted') + ' · ' + undoLbl, {
    duration: 5000,
    onClick: () => {
      shifts.splice(idx, 0, removed);
      save();
      renderCalendar();
      renderShifts();
      renderHomeStats();
    }
  });
}

/* -------- Report -------- */

function setPeriod(p, el) {
  initReportState();
  curPeriod = p;
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
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
      style="${chipStyle(filterJobId === j.id, j.color)}">${esc(j.icon)} ${esc(j.name)}</div>`
  ).join('');

  row.innerHTML = html;
}

function setJobFilter(id) {
  filterJobId = id;
  renderJobFilter();
  renderReport(curPeriod);
}

function canNavigateReport(delta) {
  initReportState();
  clampReportState();
  if (curPeriod === 'week') {
    const { minEnd, maxEnd } = getReportWeekBounds();
    const next = shiftYmd(reportWeekCursor, delta * 7);
    return next >= minEnd && next <= maxEnd;
  }
  if (curPeriod === 'month') {
    const { minYm, maxYm } = getReportMonthBounds();
    const next = monthShift(reportMonthCursor, delta);
    return next >= minYm && next <= maxYm;
  }
  if (curPeriod === 'quarter') {
    const { startYear, maxYear } = getReportYearBounds();
    const next = reportQuarterYear + delta;
    return next >= startYear && next <= maxYear;
  }
  const { startYear, maxYear } = getReportYearBounds();
  const next = reportYearCursor + delta;
  return next >= startYear && next <= maxYear;
}

function animateReportNavigation(delta) {
  if (reportMotionAnimating) return false;
  if (!canNavigateReport(delta)) {
    reportMotionAnimating = false;
    resetReportMotionPosition();
    return false;
  }

  const motion = document.getElementById('barChart');
  if (!motion) return stepReport(delta);

  const width = Math.max(240, motion.offsetWidth || 320);
  const outOffset = delta < 0 ? width * 0.96 : -width * 0.96;
  const inOffset  = delta < 0 ? -Math.min(56, width * 0.16) : Math.min(56, width * 0.16);
  reportMotionAnimating = true;

  motion.style.transition = 'transform .18s cubic-bezier(.32, .94, .6, 1), opacity .14s ease';
  motion.style.transform = 'translate3d(' + Math.round(outOffset) + 'px,0,0)';
  motion.style.opacity = '0.32';

  window.setTimeout(() => {
    const moved = stepReport(delta, false);
    if (!moved) {
      reportMotionAnimating = false;
      resetReportMotionPosition();
      return;
    }
    renderReport(curPeriod);
    motion.style.transition = 'none';
    motion.style.transform = 'translate3d(' + Math.round(inOffset) + 'px,0,0)';
    motion.style.opacity = '0.56';
    window.requestAnimationFrame(() => {
      motion.style.transition = 'transform .28s cubic-bezier(.16, 1, .3, 1), opacity .2s ease';
      motion.style.transform = 'translate3d(0px,0,0)';
      motion.style.opacity = '1';
      window.setTimeout(() => { reportMotionAnimating = false; }, 300);
    });
  }, 150);
  return true;
}

function navigateReport(delta) {
  if (curPeriod === 'quarter') return false;
  return animateReportNavigation(delta);
}

function stepReport(delta, shouldRender) {
  let moved = false;
  if (curPeriod === 'week') moved = shiftReportWeek(delta, shouldRender);
  else if (curPeriod === 'month') moved = shiftReportMonth(delta, shouldRender);
  else if (curPeriod === 'quarter') moved = shiftReportQuarterYear(delta, shouldRender);
  else if (curPeriod === 'year') moved = shiftReportYear(delta, shouldRender);
  return moved;
}

function shiftReportWeek(delta, shouldRender) {
  clampReportState();
  const { minEnd, maxEnd } = getReportWeekBounds();
  const next = shiftYmd(reportWeekCursor, delta * 7);
  if (next < minEnd || next > maxEnd) return false;
  reportWeekCursor = next;
  if (shouldRender !== false) renderReport('week');
  return true;
}

function shiftReportMonth(delta, shouldRender) {
  clampReportState();
  const { minYm, maxYm } = getReportMonthBounds();
  const next = monthShift(reportMonthCursor, delta);
  if (next < minYm || next > maxYm) return false;
  reportMonthCursor = next;
  syncReportMonthWindow();
  clampReportState();
  if (shouldRender !== false) renderReport('month');
  return true;
}

function selectReportMonth(ym) {
  const { minYm, maxYm } = getReportMonthBounds();
  if (ym < minYm || ym > maxYm) return;
  reportMonthCursor = ym;
  syncReportMonthWindow();
  clampReportState();
  renderReport('month');
}

function shiftReportQuarterYear(delta, shouldRender) {
  clampReportState();
  const { startYear, maxYear } = getReportYearBounds();
  const next = reportQuarterYear + delta;
  if (next < startYear || next > maxYear) return false;
  reportQuarterYear = next;
  if (shouldRender !== false) renderReport('quarter');
  return true;
}

function selectReportQuarter(index) {
  reportQuarterIndex = index;
  renderReport('quarter');
}

function shiftReportYear(delta, shouldRender) {
  clampReportState();
  const { startYear, maxYear } = getReportYearBounds();
  const next = reportYearCursor + delta;
  if (next < startYear || next > maxYear) return false;
  reportYearCursor = next;
  if (shouldRender !== false) renderReport('year');
  return true;
}

function selectReportYear(year) {
  reportYearCursor = year;
  renderReport('year');
}

function renderReport(period) {
  initReportState();
  clampReportState();
  renderJobFilter();
  const t = L[curLang];
  const src = filterJobId ? shifts.filter(s => s.jobId === filterJobId) : shifts;
  const barChart = document.getElementById('barChart');
  const prevBtn = document.getElementById('chartPrevBtn');
  const nextBtn = document.getElementById('chartNextBtn');
  const chartStage = barChart ? barChart.closest('.chart-stage') : null;

  let filtered = [];
  let chartItems = [];
  let chartTitle = t.chartTit;
  let detailsTitle = t.detTit;
  let summaryLabel = t.rPeriodLbl || t.wkLbl;
  let rangeLabel = '';
  let detailsHtml = '';
  let canPrev = false;
  let canNext = false;

  if (period === 'week') {
    const { minEnd, maxEnd } = getReportWeekBounds();
    const endStr = reportWeekCursor;
    const startStr = shiftYmd(endStr, -6);
    filtered = src.filter(s => s.date >= startStr && s.date <= endStr);
    for (let i = 6; i >= 0; i--) {
      const ds = shiftYmd(endStr, -i);
      const d = new Date(ds + 'T12:00:00');
      chartItems.push({
        label: t.days[d.getDay()],
        value: src.filter(s => s.date === ds).reduce((sum, shift) => sum + getShiftPay(shift), 0),
        selected: false,
        action: ''
      });
    }
    summaryLabel = t.wkLbl;
    rangeLabel = fmtDate(startStr) + ' - ' + fmtDate(endStr);
    detailsHtml = renderShiftDetails([...filtered].sort((a, b) => b.date.localeCompare(a.date)));
    canPrev = reportWeekCursor > minEnd;
    canNext = reportWeekCursor < maxEnd;
  } else if (period === 'month') {
    const { minYm, maxYm } = getReportMonthBounds();
    const visibleMonths = [0, 1, 2, 3].map(offset => monthShift(reportMonthWindowStart, offset));
    chartItems = visibleMonths.map(ym => ({
      label: getMonthLabel(ym, true),
      value: getMonthShifts(src, ym).reduce((sum, shift) => sum + getShiftPay(shift), 0),
      selected: ym === reportMonthCursor,
      action: ym >= minYm && ym <= maxYm ? `selectReportMonth('${ym}')` : ''
    }));
    filtered = getMonthShifts(src, reportMonthCursor);
    chartTitle = getReportText('monthIncome', 'Monthly income');
    detailsTitle = getReportText('monthShiftDetails', 'Monthly shift details');
    summaryLabel = getMonthLabel(reportMonthCursor, false);
    rangeLabel = getMonthLabel(visibleMonths[0], false) + ' - ' + getMonthLabel(visibleMonths[visibleMonths.length - 1], false);
    detailsHtml = renderShiftDetails([...filtered].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (a.start || '').localeCompare(b.start || '');
    }));
    canPrev = reportMonthCursor > minYm;
    canNext = reportMonthCursor < maxYm;
  } else if (period === 'quarter') {
    const { startYear, maxYear } = getReportYearBounds();
    const months = getQuarterMonths(reportQuarterYear, reportQuarterIndex);
    chartItems = [0, 1, 2, 3].map(index => {
      const quarterMonths = getQuarterMonths(reportQuarterYear, index);
      const list = src.filter(s => quarterMonths.some(ym => s.date.startsWith(ym)));
      return {
        label: getQuarterLabel(reportQuarterYear, index).replace(' / ' + reportQuarterYear, '').replace(' ' + reportQuarterYear, ''),
        value: summarizeShiftBucket(list).total,
        selected: index === reportQuarterIndex,
        action: `selectReportQuarter(${index})`
      };
    });
    filtered = src.filter(s => months.some(ym => s.date.startsWith(ym)));
    const breakdown = months.map(ym => {
      const summary = summarizeShiftBucket(getMonthShifts(src, ym));
      return { label: getMonthLabel(ym, false), ...summary };
    });
    chartTitle = getReportText('quarterIncome', 'Quarter income');
    detailsTitle = getReportText('quarterBreakdown', '3-month breakdown');
    summaryLabel = getQuarterLabel(reportQuarterYear, reportQuarterIndex);
    rangeLabel = String(reportQuarterYear);
    detailsHtml = renderBreakdownDetails(breakdown);
    canPrev = reportQuarterYear > startYear;
    canNext = reportQuarterYear < maxYear;
  } else {
    const years = getYearList();
    filtered = src.filter(s => s.date.startsWith(String(reportYearCursor)));
    chartItems = years.map(year => ({
      label: String(year),
      value: src.filter(s => s.date.startsWith(String(year))).reduce((sum, shift) => sum + getShiftPay(shift), 0),
      selected: year === reportYearCursor,
      action: `selectReportYear(${year})`
    }));
    const breakdown = Array.from({ length: 12 }, (_, index) => {
      const ym = reportYearCursor + '-' + pad2(index + 1);
      const summary = summarizeShiftBucket(getMonthShifts(src, ym));
      return { label: getMonthLabel(ym, false), ...summary };
    });
    chartTitle = getReportText('yearIncome', 'Year income');
    detailsTitle = getReportText('yearBreakdown', '12-month breakdown');
    summaryLabel = String(reportYearCursor);
    rangeLabel = years[0] + ' - ' + years[years.length - 1];
    detailsHtml = renderBreakdownDetails(breakdown);
    canPrev = reportYearCursor > years[0];
    canNext = reportYearCursor < years[years.length - 1];
  }

  const total  = filtered.reduce((a, c) => a + getShiftPay(c), 0);
  const totalH = filtered.reduce((a, c) => a + (c.hours || 0), 0);
  const totalOt = filtered.reduce((sum, shift) => sum + (shift.otH || 0), 0);

  set('rPeriodLbl', summaryLabel);
  set('rMainVal', fmt(total));
  set('rSub', filtered.length + ' ' + t.shiftsUnit + ' · ' + totalH.toFixed(0) + 'h' + (totalOt > 0 ? ' · ' + totalOt.toFixed(0) + 'h OT' : ''));
  set('chartTit', chartTitle);
  set('chartRangeLbl', rangeLabel);
  set('detTit', detailsTitle);

  const showNav = period !== 'quarter';
  if (chartStage) chartStage.classList.toggle('chart-stage--navless', !showNav);
  if (prevBtn) {
    prevBtn.hidden = !showNav;
    prevBtn.disabled = !showNav || !canPrev;
  }
  if (nextBtn) {
    nextBtn.hidden = !showNav;
    nextBtn.disabled = !showNav || !canNext;
  }
  const values = chartItems.map(item => item.value);
  const mx = Math.max(...values, 1);
  const hasSelection = chartItems.some(item => item.selected);
  const maxIdx = values.indexOf(Math.max(...values));
  if (barChart) {
    barChart.innerHTML = chartItems.map((item, index) => `
      <button type="button" class="bar-wrap${item.selected ? ' is-selected' : ''}" ${item.action ? `onclick="${item.action}"` : 'disabled'}>
        <div class="bar-value">${item.value > 0 ? formatChartValue(item.value) : ''}</div>
        <div class="bar${(item.selected || (!hasSelection && index === maxIdx)) ? ' acc' : ''}" style="height:${Math.max(4, Math.round(item.value / mx * 140))}px;"></div>
        <div class="bar-label">${item.label}</div>
      </button>`).join('');
  }

  document.getElementById('rDetails').innerHTML = detailsHtml;
}

/* -------- Settings / Job Cards -------- */

function renderJobCards() {
  const t  = L[curLang];
  const el = document.getElementById('jobCardList');
  if (!el) return;
  if (!jobs.length) {
    el.innerHTML = getNoJobsStateHtml('settings');
    return;
  }

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
      .map(a => `<span class="allowance-tag">${esc(a.name)} ${sym}${a.amount}/${a.per === 'day' ? t.alwDayShort : t.alwMonShort}</span>`)
      .join('');

    return `<div class="job-card">
      <div class="job-card-top">
        <div class="job-avatar" style="background:${j.color};">${esc(j.icon)}</div>
        <div class="job-info">
          <div class="job-name">${esc(j.name)}</div>
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
  if (page === 'report')   { attachReportSwipe(); renderReport(curPeriod); }
  if (page === 'settings') renderJobCards();
  if (page === 'add')      { renderCalendar(); attachCalendarSwipe(); }
}
