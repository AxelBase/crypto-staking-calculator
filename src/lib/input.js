// src/lib/input.js
// Targets FR-1: User Input Collection
// Provides default parameters, validation logic, and utility for input setup

export const defaultParams = {
  principal: 1000, // Initial staking amount
  cryptoType: 'ETH', // Reference only, string
  apr: 5, // Annual Percentage Rate (%), assuming input as APR; will compute APY if needed
  compoundingInterval: 'daily', // Options: 'daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'
  customIntervalSeconds: 86400, // For custom, in seconds
  durationDays: 365, // Staking duration in days
  lockUpDays: 0, // Lock-up period in days
  lockUpPenalty: 0, // Penalty % if withdrawn early
  slashingProbability: 0, // Slashing risk probability %
  validatorFee: 0, // Validator fee %
  inflationRate: 0, // Network inflation rate % (adjusts effective yield)
  rewardDelayDays: 0, // Delay in reward distribution in days
  taxRate: 0, // Tax withholding rate %
  fiatRate: 1, // Conversion rate to fiat (e.g., 2000 for ETH to USD)
  restaking: false, // Toggle for restaking scenario (simulates higher compounding if true)
  autoCompounding: true // Toggle for auto-compounding rewards
};

export const intervalOptions = [
  { value: 'daily', label: 'Daily', seconds: 86400 },
  { value: 'weekly', label: 'Weekly', seconds: 604800 },
  { value: 'monthly', label: 'Monthly', seconds: 2592000 }, // Approx 30 days
  { value: 'quarterly', label: 'Quarterly', seconds: 7776000 }, // Approx 90 days
  { value: 'annually', label: 'Annually', seconds: 31536000 },
  { value: 'custom', label: 'Custom' }
];

export function validateParams(params) {
  const errors = [];
  if (params.principal <= 0) errors.push('Principal must be positive.');
  if (params.apr < 0) errors.push('APR must be non-negative.');
  if (params.durationDays <= 0) errors.push('Duration must be positive.');
  if (params.lockUpDays < 0 || params.lockUpDays > params.durationDays) errors.push('Lock-up days invalid.');
  if (params.lockUpPenalty < 0 || params.lockUpPenalty > 100) errors.push('Lock-up penalty must be 0-100%.');
  if (params.slashingProbability < 0 || params.slashingProbability > 100) errors.push('Slashing probability must be 0-100%.');
  if (params.validatorFee < 0 || params.validatorFee > 100) errors.push('Validator fee must be 0-100%.');
  if (params.inflationRate < 0) errors.push('Inflation rate must be non-negative.');
  if (params.rewardDelayDays < 0) errors.push('Reward delay must be non-negative.');
  if (params.taxRate < 0 || params.taxRate > 100) errors.push('Tax rate must be 0-100%.');
  if (params.fiatRate <= 0) errors.push('Fiat rate must be positive.');
  if (params.compoundingInterval === 'custom' && params.customIntervalSeconds <= 0) errors.push('Custom interval must be positive seconds.');
  return { valid: errors.length === 0, errors };
}