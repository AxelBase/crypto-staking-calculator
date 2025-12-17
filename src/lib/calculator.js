// src/lib/calculator.js
// Targets FR-2: Reward Calculation Engine
// Implements detailed computation algorithms, formulas, and edge case handling

export function calculate(params) {
  const SECONDS_IN_DAY = 86400;
  const SECONDS_IN_YEAR = 31536000;

  // Effective APR after adjustments (inflation reduces yield)
  let effectiveApr = params.apr - params.inflationRate;
  if (effectiveApr < 0) effectiveApr = 0;

  // Get compounding interval in seconds
  let intervalSeconds = params.customIntervalSeconds;
  if (params.compoundingInterval !== 'custom') {
    const option = intervalOptions.find(opt => opt.value === params.compoundingInterval);
    intervalSeconds = option ? option.seconds : SECONDS_IN_DAY;
  }

  // Periods and rates
  const periodsPerYear = SECONDS_IN_YEAR / intervalSeconds;
  const periodicRate = (effectiveApr / 100) / periodsPerYear;
  const totalSeconds = params.durationDays * SECONDS_IN_DAY;
  let totalPeriods = Math.floor(totalSeconds / intervalSeconds);

  // Handle reward delay: effective periods after delay
  const delaySeconds = params.rewardDelayDays * SECONDS_IN_DAY;
  const delayPeriods = Math.floor(delaySeconds / intervalSeconds);
  const effectivePeriods = Math.max(0, totalPeriods - delayPeriods);

  // Edge case: zero or negative periods
  if (effectivePeriods <= 0) {
    return {
      net: params.principal,
      totalRewards: 0,
      netFiat: params.principal * params.fiatRate,
      effectiveApy: 0,
      breakdown: []
    };
  }

  // Adjust for restaking: simulate 10% higher rate if enabled (simplification)
  let adjustedPeriodicRate = periodicRate;
  if (params.restaking) adjustedPeriodicRate *= 1.1;

  // Fees and slashing applied as average deduction per period
  const deductionRate = (params.validatorFee + params.slashingProbability) / 100;

  // Use formula for efficiency if auto-compounding and no per-period variance
  let finalAmount;
  let totalRewards;
  if (params.autoCompounding) {
    // Compound interest formula with adjustments
    const effectivePeriodicRate = adjustedPeriodicRate * (1 - deductionRate);
    finalAmount = params.principal * Math.pow(1 + effectivePeriodicRate, effectivePeriods);
    totalRewards = finalAmount - params.principal;
  } else {
    // Simple interest: rewards accumulated separately
    const effectivePeriodicRate = adjustedPeriodicRate * (1 - deductionRate);
    totalRewards = params.principal * effectivePeriodicRate * effectivePeriods;
    finalAmount = params.principal + totalRewards;
  }

  // Apply lock-up penalty if duration < lock-up
  if (params.durationDays < params.lockUpDays) {
    const penalty = (params.lockUpPenalty / 100) * finalAmount;
    finalAmount -= penalty;
    totalRewards -= penalty;
  }

  // Apply tax on rewards
  const tax = totalRewards * (params.taxRate / 100);
  const net = finalAmount - tax;
  const netFiat = net * params.fiatRate;

  // Effective APY calculation
  const effectiveApy = (Math.pow(finalAmount / params.principal, 1 / (params.durationDays / 365)) - 1) * 100;

  // Generate breakdown: sample every 10 periods if too many, for minute details
  const maxBreakdown = 1000; // Performance cap
  const step = Math.max(1, Math.ceil(effectivePeriods / maxBreakdown));
  const breakdown = [];
  let current = params.principal;
  for (let p = step; p <= effectivePeriods; p += step) {
    let periodAmount;
    if (params.autoCompounding) {
      periodAmount = params.principal * Math.pow(1 + adjustedPeriodicRate * (1 - deductionRate), p);
    } else {
      periodAmount = params.principal + params.principal * adjustedPeriodicRate * (1 - deductionRate) * p;
    }
    const periodReward = periodAmount - current;
    breakdown.push({
      period: p,
      reward: periodReward,
      cumulative: periodAmount,
      afterDeduction: periodAmount * (1 - deductionRate),
      afterInflation: periodAmount // Already adjusted
    });
    current = periodAmount;
  }
  // Add final
  breakdown.push({
    period: effectivePeriods,
    reward: finalAmount - current,
    cumulative: finalAmount,
    afterDeduction: finalAmount * (1 - deductionRate),
    afterInflation: finalAmount
  });

  return { net, totalRewards, netFiat, effectiveApy, breakdown, tax, finalAmountBeforeTax: finalAmount };
}