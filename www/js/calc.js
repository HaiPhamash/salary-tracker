/* =========================================================================
   Calc — wage computation per shift, supports hourly/daily/monthly + OT
   ========================================================================= */

function calcShiftPay(shift, job) {
  // Monthly allowances (a.per === 'month') are NOT included in per-shift pay.
  // They are aggregated independently by period in getMonthlyAllowanceForRange().
  const dayAlw = job.allowances.filter(a => a.per === 'day').reduce((s, a) => s + a.amount, 0);

  if (job.type === 'hourly') {
    const { reg, ot, base } = calcHourly(shift.hours, job.rate, job.otThreshold, job.otMultiplier);
    return {
      base,
      dayAlwAmt: dayAlw,
      total: Math.round(base + dayAlw),
      reg, ot,
      otRate: job.otMultiplier
    };
  }

  if (job.type === 'daily') {
    let base = job.rate;
    if (shift.isOT) base = Math.round(job.rate * job.otMultiplier);
    return {
      base,
      dayAlwAmt: dayAlw,
      total: Math.round(base + dayAlw),
      isOT: shift.isOT,
      otRate: job.otMultiplier
    };
  }

  // monthly
  const dayVal = Math.round(job.rate / job.workDays);
  let base = dayVal;
  let otExtra = 0;
  if (shift.isOT) {
    if (job.otType === 'multiplier') base = Math.round(dayVal * job.otMultiplier);
    else { base = dayVal; otExtra = shift.manualOT || 0; }
  }
  const total = Math.round(base + dayAlw + otExtra);
  return {
    base,
    dayAlwAmt: dayAlw,
    otExtra,
    total,
    isOT: shift.isOT,
    dayVal,
    otRate: job.otMultiplier
  };
}

function calcHourly(hours, rate, threshold, multiplier) {
  if (hours <= threshold) {
    return { reg: hours, ot: 0, base: Math.round(hours * rate) };
  }
  const reg = threshold;
  const ot = hours - threshold;
  return { reg, ot, base: Math.round(reg * rate + ot * rate * multiplier) };
}
