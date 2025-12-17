// src/lib/display.js
// Targets FR-3: Results Display and Breakdown

export function getTableData(breakdown) {
  // Ensure we are working with an array to prevent .map crashes
  if (!breakdown || !Array.isArray(breakdown)) return [];
  
  return breakdown.map(item => ({
    period: item.period,
    reward: item.reward.toFixed(8),
    cumulative: item.cumulative.toFixed(8),
    afterDeduction: item.afterDeduction.toFixed(8),
    afterInflation: item.afterInflation.toFixed(8)
  }));
}

export function getSVGChart(breakdown, width = 600, height = 300) {
  if (!breakdown || breakdown.length < 2) return '<p>No data for chart.</p>';

  const maxCumulative = Math.max(...breakdown.map(b => b.cumulative));
  const minCumulative = Math.min(...breakdown.map(b => b.cumulative));
  const range = maxCumulative - minCumulative || 1;

  const points = breakdown.map((b, i) => {
    const x = (i / (breakdown.length - 1)) * width;
    const y = height - ((b.cumulative - minCumulative) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${points}" fill="none" stroke="blue" stroke-width="2" />
      <text x="10" y="20" font-size="12">Growth Over Periods</text>
    </svg>
  `;
}

export function getExportData(results) {
  if (!results || !results.breakdown) return "";
  const csv = [
    'Period,Reward,Cumulative,After Deduction,After Inflation',
    ...results.breakdown.map(b => `${b.period},${b.reward.toFixed(8)},${b.cumulative.toFixed(8)},${b.afterDeduction.toFixed(8)},${b.afterInflation.toFixed(8)}`)
  ].join('\n');
  return csv;
}