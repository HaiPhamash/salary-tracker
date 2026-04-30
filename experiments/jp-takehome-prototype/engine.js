import { JP_PAYROLL_2026 } from './data/jp-2026.js';

const TAX_BRACKETS = [
  { over: 0, rate: 0.05, deduction: 0 },
  { over: 1950000, rate: 0.10, deduction: 97500 },
  { over: 3300000, rate: 0.20, deduction: 427500 },
  { over: 6950000, rate: 0.23, deduction: 636000 },
  { over: 9000000, rate: 0.33, deduction: 1536000 },
  { over: 18000000, rate: 0.40, deduction: 2796000 },
  { over: 40000000, rate: 0.45, deduction: 4796000 }
];

export function yen(value) {
  const n = Math.round(Number(value) || 0);
  return '¥' + Math.abs(n).toLocaleString('ja-JP');
}

export function signedYen(value) {
  const n = Math.round(Number(value) || 0);
  if (n < 0) return '-' + yen(n);
  return yen(n);
}

function toNumber(value, fallback = 0) {
  const n = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

function payrollRound(value) {
  const n = Number(value) || 0;
  const floor = Math.floor(n);
  const fraction = n - floor;
  return fraction <= 0.5000001 ? floor : Math.ceil(n);
}

function normalRound(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

function findBracket(amount, table) {
  const n = Math.max(0, toNumber(amount));
  return table.find(row => n >= row.lower && (row.upper == null || n < row.upper)) || table[table.length - 1];
}

function findStandardFromMode(amount, manualAmount, mode, table) {
  const source = mode === 'manual' ? toNumber(manualAmount, amount) : amount;
  return findBracket(source, table);
}

function getPrefecture(id) {
  return JP_PAYROLL_2026.prefectures.find(pref => pref.id === id) || JP_PAYROLL_2026.prefectures.find(pref => pref.id === 'tokyo');
}

function getEmployeeInsuranceShare(standard, rate) {
  return payrollRound(standard * rate / 2);
}

function countDependents(input) {
  const domestic = Math.max(0, Math.floor(toNumber(input.domesticDependents)));
  const overseasTotal = Math.max(0, Math.floor(toNumber(input.overseasDependents)));
  const overseasQualified = input.overseasQualified ? overseasTotal : 0;
  return {
    domestic,
    overseasTotal,
    overseasQualified,
    taxCount: domestic + overseasQualified
  };
}

export function salaryIncomeDeduction(annualGross) {
  const gross = Math.max(0, annualGross);
  const min = JP_PAYROLL_2026.incomeTaxEstimate.salaryDeductionMinimum;
  if (gross <= 1800000) return Math.min(gross, Math.max(min, gross * 0.4 - 100000));
  if (gross <= 3600000) return gross * 0.3 + 80000;
  if (gross <= 6600000) return gross * 0.2 + 440000;
  if (gross <= 8500000) return gross * 0.1 + 1100000;
  return 1950000;
}

function progressiveNationalTax(taxableIncome) {
  const taxable = Math.max(0, Math.floor(taxableIncome / 1000) * 1000);
  let bracket = TAX_BRACKETS[0];
  for (const row of TAX_BRACKETS) {
    if (taxable >= row.over) bracket = row;
  }
  return Math.max(0, taxable * bracket.rate - bracket.deduction);
}

function annualizedIncomeTax(input, annualSocial, dependents) {
  const grossMonthly = toNumber(input.monthlyGross);
  const annualGross = grossMonthly * 12;
  const settings = JP_PAYROLL_2026.incomeTaxEstimate;
  const isFreelancer = input.workStyle === 'freelancer';
  const employmentDeduction = isFreelancer ? 0 : salaryIncomeDeduction(annualGross);
  const incomeBeforeDeductions = Math.max(0, annualGross - employmentDeduction);
  const dependentDeduction = dependents.taxCount * settings.dependentDeduction;
  const taxable = Math.max(0, incomeBeforeDeductions - annualSocial - settings.basicDeduction - dependentDeduction);
  const baseTax = progressiveNationalTax(taxable);
  const totalTax = baseTax * (1 + settings.reconstructionSurtaxRate);

  return {
    annualGross,
    employmentDeduction,
    incomeBeforeDeductions,
    dependentDeduction,
    taxable,
    annualTax: normalRound(totalTax),
    monthlyTax: normalRound(totalTax / 12)
  };
}

function calculateWithholdingIncomeTax(input, socialMonthly, employmentMonthly, dependents) {
  if (input.withholdingType === 'none') {
    return {
      monthly: 0,
      mode: 'none',
      explanation: 'Income tax withholding is disabled for this scenario.'
    };
  }

  const taxableMonthly = Math.max(0, toNumber(input.monthlyGross) - socialMonthly - employmentMonthly);
  if (input.withholdingType === 'otsu') {
    return {
      monthly: normalRound(taxableMonthly * 0.03063),
      mode: 'otsu',
      taxableMonthly,
      explanation: 'Rough otsu-rate estimate using 3.063% of salary after social insurance.'
    };
  }

  const annualized = annualizedIncomeTax(input, (socialMonthly + employmentMonthly) * 12, dependents);
  return {
    monthly: annualized.monthlyTax,
    mode: 'ko',
    taxableMonthly,
    annualized,
    explanation: 'Annualized ko-table estimate. Production should use the official NTA monthly table.'
  };
}

function estimateResidentTax(input, annualSocial, dependents) {
  const mode = input.residentTaxMode || 'off';
  const manualMonthly = normalRound(toNumber(input.residentTaxManualMonthly));
  if (mode === 'off') return { monthly: 0, mode: 'off' };
  if (mode === 'manual') return { monthly: manualMonthly, mode: 'manual', annualEstimate: manualMonthly * 12 };
  if (mode === 'hybrid' && manualMonthly > 0) {
    return { monthly: manualMonthly, mode: 'hybrid-manual', annualEstimate: manualMonthly * 12 };
  }

  const settings = JP_PAYROLL_2026.residentTaxEstimate;
  const grossSource = toNumber(input.previousAnnualGross) || toNumber(input.monthlyGross) * 12;
  const isFreelancer = input.workStyle === 'freelancer';
  const employmentDeduction = isFreelancer ? 0 : salaryIncomeDeduction(grossSource);
  const income = Math.max(0, grossSource - employmentDeduction);
  const dependentDeduction = dependents.taxCount * settings.dependentDeduction;
  const taxable = Math.max(0, income - annualSocial - settings.basicDeduction - dependentDeduction);
  const annual = taxable > 0 ? normalRound(taxable * settings.incomeRate + settings.perCapitaAnnual) : 0;
  return {
    monthly: normalRound(annual / 12),
    mode: mode === 'hybrid' ? 'hybrid-auto' : 'auto',
    annualEstimate: annual,
    taxable,
    grossSource,
    employmentDeduction,
    dependentDeduction
  };
}

function calculateShakai(input, warnings, trace) {
  const pref = getPrefecture(input.prefecture);
  const age = toNumber(input.age, 30);
  const gross = toNumber(input.monthlyGross);
  const mode = input.standardMode || 'auto';
  const healthStandard = findStandardFromMode(gross, input.manualStandardMonthly, mode, JP_PAYROLL_2026.healthStandardMonthly);
  const pensionStandard = findStandardFromMode(gross, input.manualStandardMonthly, mode, JP_PAYROLL_2026.pensionStandardMonthly);
  const isCareAge = age >= JP_PAYROLL_2026.socialInsurance.careInsuranceAgeFrom && age <= JP_PAYROLL_2026.socialInsurance.careInsuranceAgeTo;
  const hasHealth = age <= JP_PAYROLL_2026.socialInsurance.healthInsuranceAgeTo;
  const hasPension = age <= JP_PAYROLL_2026.socialInsurance.pensionAgeTo;
  const healthRate = isCareAge ? pref.healthCareRate : pref.healthRate;
  const health = hasHealth ? getEmployeeInsuranceShare(healthStandard.amount, healthRate) : 0;
  const childSupport = hasHealth ? getEmployeeInsuranceShare(healthStandard.amount, JP_PAYROLL_2026.socialInsurance.childSupportRate) : 0;
  const pension = hasPension ? getEmployeeInsuranceShare(pensionStandard.amount, JP_PAYROLL_2026.socialInsurance.pensionRate) : 0;

  if (mode === 'auto') {
    trace.push(`Standard remuneration is estimated from monthly gross ${yen(gross)}.`);
  } else {
    trace.push(`Standard remuneration is estimated from the manual value ${yen(input.manualStandardMonthly)}.`);
  }
  trace.push(`${pref.name} Kyokai Kenpo rate: ${(healthRate * 100).toFixed(2)}%${isCareAge ? ' including care insurance' : ''}.`);
  trace.push(`Health standard grade ${healthStandard.grade}: ${yen(healthStandard.amount)}.`);
  if (hasPension) trace.push(`Pension standard grade ${pensionStandard.grade}: ${yen(pensionStandard.amount)}.`);
  if (!hasHealth) warnings.push('Age 75+ normally moves to the late-stage elderly medical system; Kyokai health insurance is disabled here.');
  if (!hasPension) warnings.push('Age 70+ normally does not pay employee pension premiums in this prototype.');

  return {
    health,
    childSupport,
    pension,
    total: health + childSupport + pension,
    healthStandard,
    pensionStandard,
    prefecture: pref,
    isCareAge
  };
}

function calculateKokumin(input, trace) {
  const pension = input.includeNationalPension ? JP_PAYROLL_2026.nationalPension.monthlyPremium : 0;
  const nhi = normalRound(toNumber(input.nationalHealthInsuranceMonthly));
  if (pension) trace.push(`National pension FY2026 monthly premium: ${yen(pension)}.`);
  if (nhi) trace.push(`National Health Insurance uses the manual amount entered by the user: ${yen(nhi)}.`);
  return {
    nationalPension: pension,
    nationalHealthInsurance: nhi,
    total: pension + nhi
  };
}

export function calculateTakeHome(input) {
  const warnings = [];
  const trace = [];
  const dependents = countDependents(input);
  const gross = normalRound(toNumber(input.monthlyGross));
  const insuranceMode = input.insuranceMode || 'shakai';

  let shakai = { health: 0, childSupport: 0, pension: 0, total: 0 };
  let kokumin = { nationalPension: 0, nationalHealthInsurance: 0, total: 0 };
  let manualSocial = 0;

  if (insuranceMode === 'shakai') {
    shakai = calculateShakai(input, warnings, trace);
  } else if (insuranceMode === 'kokumin') {
    kokumin = calculateKokumin(input, trace);
  } else {
    manualSocial = normalRound(toNumber(input.manualSocialInsuranceMonthly));
    trace.push(`Social insurance uses the manual total entered by the user: ${yen(manualSocial)}.`);
  }

  const employmentInfo = JP_PAYROLL_2026.employmentInsurance[input.employmentCategory || 'general'] || JP_PAYROLL_2026.employmentInsurance.general;
  const employmentInsurance = normalRound(gross * employmentInfo.workerRate);
  if (employmentInfo.workerRate > 0) {
    trace.push(`Employment insurance worker rate: ${(employmentInfo.workerRate * 100).toFixed(1)}%.`);
  }

  const socialMonthly = shakai.total + kokumin.total + manualSocial;
  const incomeTax = calculateWithholdingIncomeTax(input, socialMonthly, employmentInsurance, dependents);
  const annualSocialForResident = (socialMonthly + employmentInsurance) * 12;
  const residentTax = estimateResidentTax(input, annualSocialForResident, dependents);

  if (dependents.overseasTotal > 0 && !input.overseasQualified) {
    warnings.push('Overseas dependents are not counted unless relationship/remittance or other NTA-required conditions are marked as ready.');
  }
  if (input.residentTaxMode === 'auto' || residentTax.mode === 'hybrid-auto') {
    warnings.push('Resident tax auto mode is only an estimate. Manual notice mode is more reliable after the municipal notice arrives.');
  }
  if (incomeTax.mode === 'ko') {
    warnings.push('Income tax uses an annualized estimate in this prototype; production should use the official NTA monthly table.');
  }
  if (input.workStyle === 'freelancer') {
    warnings.push('Freelancer mode treats monthly gross as income after expenses. This is not a final tax return calculator.');
  }

  const deductions = {
    healthInsurance: shakai.health,
    childSupport: shakai.childSupport,
    employeePension: shakai.pension,
    nationalPension: kokumin.nationalPension,
    nationalHealthInsurance: kokumin.nationalHealthInsurance,
    manualSocialInsurance: manualSocial,
    employmentInsurance,
    incomeTax: incomeTax.monthly,
    residentTax: residentTax.monthly
  };
  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0);
  const net = gross - totalDeductions;

  return {
    version: JP_PAYROLL_2026.version,
    gross,
    net,
    totalDeductions,
    deductions,
    dependents,
    shakai,
    kokumin,
    incomeTax,
    residentTax,
    trace,
    warnings,
    sources: JP_PAYROLL_2026.sources
  };
}

export { JP_PAYROLL_2026 };
