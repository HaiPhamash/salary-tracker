import assert from 'node:assert/strict';
import { calculateTakeHome } from './engine.js';

function baseInput(overrides = {}) {
  return {
    monthlyGross: 260000,
    previousAnnualGross: 3000000,
    age: 30,
    workStyle: 'haken',
    insuranceMode: 'shakai',
    prefecture: 'tokyo',
    standardMode: 'auto',
    manualStandardMonthly: 260000,
    employmentCategory: 'general',
    withholdingType: 'ko',
    domesticDependents: 0,
    overseasDependents: 0,
    overseasQualified: false,
    residentTaxMode: 'off',
    residentTaxManualMonthly: 0,
    includeNationalPension: true,
    nationalHealthInsuranceMonthly: 0,
    manualSocialInsuranceMonthly: 0,
    ...overrides
  };
}

const tokyo = calculateTakeHome(baseInput());
assert.equal(tokyo.gross, 260000);
assert.equal(tokyo.shakai.healthStandard.amount, 260000);
assert.equal(tokyo.shakai.pensionStandard.amount, 260000);
assert.equal(tokyo.deductions.healthInsurance, 12805);
assert.equal(tokyo.deductions.childSupport, 299);
assert.equal(tokyo.deductions.employeePension, 23790);
assert.equal(tokyo.deductions.employmentInsurance, 1300);
assert.ok(tokyo.net < tokyo.gross);

const careAge = calculateTakeHome(baseInput({ age: 45, monthlyGross: 300000, prefecture: 'osaka', residentTaxMode: 'manual', residentTaxManualMonthly: 12000 }));
assert.equal(careAge.shakai.isCareAge, true);
assert.equal(careAge.shakai.healthStandard.amount, 300000);
assert.equal(careAge.residentTax.mode, 'manual');
assert.equal(careAge.deductions.residentTax, 12000);
assert.ok(careAge.deductions.healthInsurance > tokyo.deductions.healthInsurance);

const freelancer = calculateTakeHome(baseInput({
  workStyle: 'freelancer',
  insuranceMode: 'kokumin',
  employmentCategory: 'none',
  withholdingType: 'none',
  monthlyGross: 320000,
  nationalHealthInsuranceMonthly: 22000,
  residentTaxMode: 'auto'
}));
assert.equal(freelancer.deductions.nationalPension, 17920);
assert.equal(freelancer.deductions.nationalHealthInsurance, 22000);
assert.equal(freelancer.deductions.employmentInsurance, 0);
assert.equal(freelancer.deductions.incomeTax, 0);
assert.ok(freelancer.warnings.some(text => text.includes('Freelancer mode')));

const overseasNotQualified = calculateTakeHome(baseInput({ overseasDependents: 2, overseasQualified: false }));
assert.equal(overseasNotQualified.dependents.taxCount, 0);
assert.ok(overseasNotQualified.warnings.some(text => text.includes('Overseas dependents')));

const overseasQualified = calculateTakeHome(baseInput({ overseasDependents: 2, overseasQualified: true }));
assert.equal(overseasQualified.dependents.taxCount, 2);

console.log('jp-takehome prototype engine tests passed');
