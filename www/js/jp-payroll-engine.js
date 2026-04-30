/* =========================================================================
   Japan Payroll Engine — estimate-only calculation core
   ========================================================================= */

const JP_TAX_BRACKETS = [
  { over: 0, rate: 0.05, deduction: 0 },
  { over: 1950000, rate: 0.10, deduction: 97500 },
  { over: 3300000, rate: 0.20, deduction: 427500 },
  { over: 6950000, rate: 0.23, deduction: 636000 },
  { over: 9000000, rate: 0.33, deduction: 1536000 },
  { over: 18000000, rate: 0.40, deduction: 2796000 },
  { over: 40000000, rate: 0.45, deduction: 4796000 }
];

function jpToNumber(value, fallback) {
  const n = Number(String(value == null ? '' : value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : (fallback || 0);
}

function jpNormalRound(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

function jpPayrollRound(value) {
  const n = Number(value) || 0;
  const floor = Math.floor(n);
  return (n - floor) <= 0.5000001 ? floor : Math.ceil(n);
}

function jpFmtYen(value) {
  const n = Math.round(Number(value) || 0);
  const sign = n < 0 ? '−' : '';
  return sign + '¥' + Math.abs(n).toLocaleString('ja-JP');
}

function jpFindBracket(amount, table) {
  const n = Math.max(0, jpToNumber(amount));
  return table.find(row => n >= row.lower && (row.upper == null || n < row.upper)) || table[table.length - 1];
}

function jpGetPrefecture(id) {
  const rules = JP_PAYROLL_RULES_2026;
  return rules.prefectures.find(pref => pref.id === id) || rules.prefectures.find(pref => pref.id === 'tokyo');
}

function jpSalaryIncomeDeduction(annualGross) {
  const gross = Math.max(0, annualGross);
  const min = JP_PAYROLL_RULES_2026.incomeTaxEstimate.salaryDeductionMinimum;
  if (gross <= 1800000) return Math.min(gross, Math.max(min, gross * 0.4 - 100000));
  if (gross <= 3600000) return gross * 0.3 + 80000;
  if (gross <= 6600000) return gross * 0.2 + 440000;
  if (gross <= 8500000) return gross * 0.1 + 1100000;
  return 1950000;
}

function jpProgressiveNationalTax(taxableIncome) {
  const taxable = Math.max(0, Math.floor(taxableIncome / 1000) * 1000);
  let bracket = JP_TAX_BRACKETS[0];
  JP_TAX_BRACKETS.forEach(row => { if (taxable >= row.over) bracket = row; });
  return Math.max(0, taxable * bracket.rate - bracket.deduction);
}

function jpCountDependents(input) {
  const domestic = Math.max(0, Math.floor(jpToNumber(input.domesticDependents)));
  const overseasTotal = Math.max(0, Math.floor(jpToNumber(input.overseasDependents)));
  const overseasQualified = input.overseasQualified ? overseasTotal : 0;
  return { domestic, overseasTotal, overseasQualified, taxCount: domestic + overseasQualified };
}

function jpAnnualizedIncomeTax(input, annualSocial, dependents) {
  const grossMonthly = jpToNumber(input.monthlyGross);
  const annualGross = grossMonthly * 12;
  const settings = JP_PAYROLL_RULES_2026.incomeTaxEstimate;
  const isFreelancer = input.workStyle === 'freelancer';
  const employmentDeduction = isFreelancer ? 0 : jpSalaryIncomeDeduction(annualGross);
  const incomeBeforeDeductions = Math.max(0, annualGross - employmentDeduction);
  const dependentDeduction = dependents.taxCount * settings.dependentDeduction;
  const taxable = Math.max(0, incomeBeforeDeductions - annualSocial - settings.basicDeduction - dependentDeduction);
  const baseTax = jpProgressiveNationalTax(taxable);
  const annualTax = baseTax * (1 + settings.reconstructionSurtaxRate);
  return {
    annualGross, employmentDeduction, incomeBeforeDeductions, dependentDeduction, taxable,
    annualTax: jpNormalRound(annualTax),
    monthlyTax: jpNormalRound(annualTax / 12)
  };
}

function jpCalculateIncomeTax(input, socialMonthly, employmentMonthly, dependents) {
  if (input.withholdingType === 'none') return { monthly: 0, mode: 'none', explanation: 'Income tax withholding is disabled.' };
  const taxableMonthly = Math.max(0, jpToNumber(input.monthlyGross) - socialMonthly - employmentMonthly);
  if (input.withholdingType === 'otsu') {
    return {
      monthly: jpNormalRound(taxableMonthly * 0.03063),
      mode: 'otsu',
      taxableMonthly,
      explanation: 'Rough otsu-rate estimate using 3.063% after social insurance.'
    };
  }
  const annualized = jpAnnualizedIncomeTax(input, (socialMonthly + employmentMonthly) * 12, dependents);
  return {
    monthly: annualized.monthlyTax,
    mode: 'ko',
    taxableMonthly,
    annualized,
    explanation: 'Annualized ko-table estimate. Production will replace this with official NTA monthly table data.'
  };
}

function jpEstimateResidentTax(input, annualSocial, dependents) {
  const mode = input.residentTaxMode || 'off';
  const manualMonthly = jpNormalRound(jpToNumber(input.residentTaxManualMonthly));
  if (mode === 'off') return { monthly: 0, mode: 'off' };
  if (mode === 'manual') return { monthly: manualMonthly, mode: 'manual', annualEstimate: manualMonthly * 12 };
  if (mode === 'hybrid' && manualMonthly > 0) return { monthly: manualMonthly, mode: 'hybrid-manual', annualEstimate: manualMonthly * 12 };

  const settings = JP_PAYROLL_RULES_2026.residentTaxEstimate;
  const grossSource = jpToNumber(input.previousAnnualGross) || jpToNumber(input.monthlyGross) * 12;
  const employmentDeduction = input.workStyle === 'freelancer' ? 0 : jpSalaryIncomeDeduction(grossSource);
  const income = Math.max(0, grossSource - employmentDeduction);
  const dependentDeduction = dependents.taxCount * settings.dependentDeduction;
  const taxable = Math.max(0, income - annualSocial - settings.basicDeduction - dependentDeduction);
  const annual = taxable > 0 ? jpNormalRound(taxable * settings.incomeRate + settings.perCapitaAnnual) : 0;
  return { monthly: jpNormalRound(annual / 12), mode: mode === 'hybrid' ? 'hybrid-auto' : 'auto', annualEstimate: annual, taxable };
}

function jpCalculateShakai(input, warnings, trace) {
  const rules = JP_PAYROLL_RULES_2026;
  const pref = jpGetPrefecture(input.prefecture);
  const age = jpToNumber(input.age, 30);
  const gross = jpToNumber(input.monthlyGross);
  const standardSource = input.standardMode === 'manual' ? jpToNumber(input.manualStandardMonthly, gross) : gross;
  const healthStandard = jpFindBracket(standardSource, rules.healthStandardMonthly);
  const pensionStandard = jpFindBracket(standardSource, rules.pensionStandardMonthly);
  const isCareAge = age >= rules.socialInsurance.careAgeFrom && age <= rules.socialInsurance.careAgeTo;
  const hasHealth = age <= rules.socialInsurance.healthAgeTo;
  const hasPension = age <= rules.socialInsurance.pensionAgeTo;
  const healthRate = input.customHealthRateEnabled
    ? Math.max(0, jpToNumber(input.customHealthRate) / 100)
    : (isCareAge ? pref.healthCareRate : pref.healthRate);
  const health = hasHealth ? jpPayrollRound(healthStandard.amount * healthRate / 2) : 0;
  const childSupport = hasHealth ? jpPayrollRound(healthStandard.amount * rules.socialInsurance.childSupportRate / 2) : 0;
  const pension = hasPension ? jpPayrollRound(pensionStandard.amount * rules.socialInsurance.pensionRate / 2) : 0;

  trace.push(`${pref.name} Kyokai Kenpo rate: ${(healthRate * 100).toFixed(2)}%${isCareAge ? ' including care insurance' : ''}.`);
  trace.push(`Health grade ${healthStandard.grade}: ${jpFmtYen(healthStandard.amount)}.`);
  if (hasPension) trace.push(`Pension grade ${pensionStandard.grade}: ${jpFmtYen(pensionStandard.amount)}.`);
  if (!hasHealth) warnings.push('Age 75+ normally uses a different medical insurance system.');
  if (!hasPension) warnings.push('Age 70+ normally does not pay employee pension premiums.');

  return { health, childSupport, pension, total: health + childSupport + pension, healthStandard, pensionStandard, prefecture: pref, isCareAge };
}

function jpCalculateKokumin(input, trace) {
  const pension = input.includeNationalPension ? JP_PAYROLL_RULES_2026.nationalPensionMonthly : 0;
  const nhi = jpNormalRound(jpToNumber(input.nationalHealthInsuranceMonthly));
  if (pension) trace.push(`National pension FY2026: ${jpFmtYen(pension)} per month.`);
  if (nhi) trace.push(`National Health Insurance manual amount: ${jpFmtYen(nhi)}.`);
  return { nationalPension: pension, nationalHealthInsurance: nhi, total: pension + nhi };
}

function calculateJpTakehome(input) {
  const warnings = [];
  const trace = [];
  const dependents = jpCountDependents(input);
  const gross = jpNormalRound(jpToNumber(input.monthlyGross));
  let shakai = { health: 0, childSupport: 0, pension: 0, total: 0 };
  let kokumin = { nationalPension: 0, nationalHealthInsurance: 0, total: 0 };
  let manualSocial = 0;

  if (input.insuranceMode === 'shakai') shakai = jpCalculateShakai(input, warnings, trace);
  else if (input.insuranceMode === 'kokumin') kokumin = jpCalculateKokumin(input, trace);
  else {
    manualSocial = jpNormalRound(jpToNumber(input.manualSocialInsuranceMonthly));
    trace.push(`Manual social insurance total: ${jpFmtYen(manualSocial)}.`);
  }

  const empInfo = JP_PAYROLL_RULES_2026.employmentInsurance[input.employmentCategory || 'general'] || JP_PAYROLL_RULES_2026.employmentInsurance.general;
  const employmentInsurance = jpNormalRound(gross * empInfo.workerRate);
  const socialMonthly = shakai.total + kokumin.total + manualSocial;
  const incomeTax = jpCalculateIncomeTax(input, socialMonthly, employmentInsurance, dependents);
  const residentTax = jpEstimateResidentTax(input, (socialMonthly + employmentInsurance) * 12, dependents);

  if (dependents.overseasTotal > 0 && !input.overseasQualified) warnings.push('Overseas dependents are not counted unless NTA document/remittance conditions are marked ready.');
  if (residentTax.mode === 'auto' || residentTax.mode === 'hybrid-auto') warnings.push('Resident tax auto mode is only an estimate; municipal notice/manual mode is more reliable.');
  if (incomeTax.mode === 'ko') warnings.push('Income tax currently uses annualized estimate, not the final NTA monthly table.');
  if (input.workStyle === 'freelancer') warnings.push('Freelancer mode is not a final tax return calculator.');

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
  return {
    version: JP_PAYROLL_RULES_2026.version,
    gross,
    net: gross - totalDeductions,
    totalDeductions,
    deductions,
    dependents,
    shakai,
    kokumin,
    incomeTax,
    residentTax,
    trace,
    warnings,
    sources: JP_PAYROLL_RULES_2026.sources
  };
}
