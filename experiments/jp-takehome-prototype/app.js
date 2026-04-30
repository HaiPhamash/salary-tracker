import { calculateTakeHome, JP_PAYROLL_2026, yen, signedYen } from './engine.js';

const LS_KEY = 'jp_takehome_prototype_inputs_v1';

const defaults = {
  monthlyGross: 260000,
  previousAnnualGross: 3000000,
  age: 30,
  workStyle: 'baito',
  insuranceMode: 'shakai',
  prefecture: 'tokyo',
  standardMode: 'auto',
  manualStandardMonthly: 260000,
  employmentCategory: 'general',
  withholdingType: 'ko',
  domesticDependents: 0,
  overseasDependents: 0,
  overseasQualified: false,
  residentTaxMode: 'hybrid',
  residentTaxManualMonthly: 0,
  includeNationalPension: true,
  nationalHealthInsuranceMonthly: 0,
  manualSocialInsuranceMonthly: 0
};

function $(id) {
  return document.getElementById(id);
}

function loadSaved() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') };
  } catch (e) {
    return { ...defaults };
  }
}

function saveCurrent(input) {
  localStorage.setItem(LS_KEY, JSON.stringify(input));
}

function readInput() {
  const input = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const el = $(key);
    if (!el) continue;
    if (el.type === 'checkbox') input[key] = el.checked;
    else input[key] = el.value;
  }
  return input;
}

function setInputValues(values) {
  for (const [key, value] of Object.entries(values)) {
    const el = $(key);
    if (!el) continue;
    if (el.type === 'checkbox') el.checked = !!value;
    else el.value = value;
  }
}

function populateOptions() {
  $('prefecture').innerHTML = JP_PAYROLL_2026.prefectures.map(pref =>
    `<option value="${pref.id}">${pref.name} / ${pref.vi} - ${(pref.healthRate * 100).toFixed(2)}%</option>`
  ).join('');
}

function row(label, value, cls = '') {
  return `<div class="result-row ${cls}">
    <span>${label}</span>
    <strong>${value}</strong>
  </div>`;
}

function sourceLink(label, url) {
  return `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
}

function render(result, input) {
  $('netAmount').textContent = signedYen(result.net);
  $('grossAmount').textContent = yen(result.gross);
  $('deductionAmount').textContent = yen(result.totalDeductions);
  $('effectiveRate').textContent = result.gross > 0
    ? Math.round(result.totalDeductions / result.gross * 1000) / 10 + '%'
    : '0%';

  const d = result.deductions;
  $('deductionRows').innerHTML = [
    row('Health insurance / 健康保険', '-' + yen(d.healthInsurance)),
    row('Child support levy / 子ども・子育て支援金', '-' + yen(d.childSupport)),
    row('Employee pension / 厚生年金', '-' + yen(d.employeePension)),
    row('National pension / 国民年金', '-' + yen(d.nationalPension)),
    row('National Health Insurance / 国保', '-' + yen(d.nationalHealthInsurance)),
    row('Manual social insurance', '-' + yen(d.manualSocialInsurance)),
    row('Employment insurance / 雇用保険', '-' + yen(d.employmentInsurance)),
    row('Income tax estimate / 所得税', '-' + yen(d.incomeTax)),
    row('Resident tax / 住民税', '-' + yen(d.residentTax)),
    row('Take-home / 手取り', signedYen(result.net), 'total')
  ].join('');

  const standard = result.shakai.healthStandard
    ? `<div class="pill">Health grade ${result.shakai.healthStandard.grade}: ${yen(result.shakai.healthStandard.amount)}</div>`
    : '';
  const pensionStandard = result.shakai.pensionStandard
    ? `<div class="pill">Pension grade ${result.shakai.pensionStandard.grade}: ${yen(result.shakai.pensionStandard.amount)}</div>`
    : '';
  const residentMode = result.residentTax.mode || input.residentTaxMode;
  $('explainBox').innerHTML = `
    <div class="mini-grid">
      <div>${standard}${pensionStandard}</div>
      <div>
        <div class="pill">Tax dependents counted: ${result.dependents.taxCount}</div>
        <div class="pill">Resident tax mode: ${residentMode}</div>
      </div>
    </div>
    <ul>${result.trace.map(item => `<li>${item}</li>`).join('')}</ul>
    <p class="muted">${result.incomeTax.explanation || ''}</p>
  `;

  $('warningBox').innerHTML = result.warnings.length
    ? `<div class="warning-title">Cần chú ý</div><ul>${result.warnings.map(item => `<li>${item}</li>`).join('')}</ul>`
    : '<div class="ok">Không có cảnh báo lớn cho input hiện tại.</div>';

  $('sourceBox').innerHTML = [
    sourceLink('Kyokai Kenpo FY2026', result.sources.kyokaiKenpo),
    sourceLink('FY2026 rates workbook', result.sources.kyokaiKenpoWorkbook),
    sourceLink('MHLW employment insurance FY2026', result.sources.employmentInsurance),
    sourceLink('Japan Pension Service national pension', result.sources.nationalPension),
    sourceLink('NTA withholding table 2026', result.sources.ntaWithholding),
    sourceLink('NTA overseas dependents', result.sources.overseasDependents),
    sourceLink('Resident tax special collection', result.sources.residentTaxSpecialCollection)
  ].join('');
}

function syncVisibility(input) {
  document.body.dataset.insurance = input.insuranceMode;
  document.body.dataset.workstyle = input.workStyle;
  $('standardFields').hidden = input.insuranceMode !== 'shakai';
  $('kokuminFields').hidden = input.insuranceMode !== 'kokumin';
  $('manualFields').hidden = input.insuranceMode !== 'manual';
  $('prefectureWrap').hidden = input.insuranceMode !== 'shakai';
  $('residentManualWrap').hidden = input.residentTaxMode === 'off' || input.residentTaxMode === 'auto';
}

function calculateAndRender() {
  const input = readInput();
  syncVisibility(input);
  const result = calculateTakeHome(input);
  render(result, input);
  saveCurrent(input);
}

function applyScenario(name) {
  const scenario = {
    baito: {
      workStyle: 'baito',
      monthlyGross: 180000,
      previousAnnualGross: 2100000,
      age: 24,
      insuranceMode: 'kokumin',
      employmentCategory: 'general',
      withholdingType: 'ko',
      residentTaxMode: 'auto',
      nationalHealthInsuranceMonthly: 9000,
      includeNationalPension: true,
      domesticDependents: 0,
      overseasDependents: 0,
      overseasQualified: false
    },
    haken: {
      workStyle: 'haken',
      monthlyGross: 260000,
      previousAnnualGross: 3000000,
      age: 30,
      insuranceMode: 'shakai',
      standardMode: 'auto',
      prefecture: 'tokyo',
      employmentCategory: 'general',
      withholdingType: 'ko',
      residentTaxMode: 'hybrid',
      residentTaxManualMonthly: 0
    },
    careAge: {
      workStyle: 'haken',
      monthlyGross: 300000,
      previousAnnualGross: 3600000,
      age: 45,
      insuranceMode: 'shakai',
      standardMode: 'auto',
      prefecture: 'osaka',
      employmentCategory: 'general',
      withholdingType: 'ko',
      residentTaxMode: 'manual',
      residentTaxManualMonthly: 12000
    },
    freelancer: {
      workStyle: 'freelancer',
      monthlyGross: 320000,
      previousAnnualGross: 3600000,
      age: 35,
      insuranceMode: 'kokumin',
      employmentCategory: 'none',
      withholdingType: 'none',
      residentTaxMode: 'auto',
      nationalHealthInsuranceMonthly: 22000,
      includeNationalPension: true
    }
  }[name];
  if (!scenario) return;
  setInputValues({ ...readInput(), ...scenario });
  calculateAndRender();
}

function bindEvents() {
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', calculateAndRender);
    el.addEventListener('change', calculateAndRender);
  });
  document.querySelectorAll('[data-scenario]').forEach(button => {
    button.addEventListener('click', () => applyScenario(button.dataset.scenario));
  });
  $('resetBtn').addEventListener('click', () => {
    setInputValues(defaults);
    calculateAndRender();
  });
}

populateOptions();
setInputValues(loadSaved());
bindEvents();
calculateAndRender();
