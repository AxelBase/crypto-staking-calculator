<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { defaultParams, validateParams, intervalOptions } from '$lib/input.js';
  import { calculate } from '$lib/calculator.js';
  import { getTableData, getExportData } from '$lib/display.js';
  import { fade, slide, fly } from 'svelte/transition';

  let params = { ...defaultParams };
  let results = null;
  let errors = [];

  const STORAGE_KEY = 'cryptoStakingCalculatorSession';

  // --- Session Management ---
  function saveSession() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      alert('Session saved successfully!');
    } catch (e) {
      alert('Failed to save session.');
    }
  }

  function loadSession(showAlert = false) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const loaded = JSON.parse(saved);
        params = { ...defaultParams, ...loaded };
        if (showAlert) alert('Session loaded successfully!');
      } else if (showAlert && !saved) {
        if (showAlert) alert('No saved session found.');
      }
    } catch (e) {
      if (showAlert) alert('Failed to load session.');
    }
  }

  onMount(() => {
    loadSession(false);
  });

  // --- Core Logic ---
  function handleCalculate() {
    const validation = validateParams(params);
    errors = validation.errors;
    if (validation.valid) {
      try {
        results = calculate(params);
        resetChartView();
      } catch (calcError) {
        errors = ['Calculation failed - check console for details'];
      }
    } else {
      results = null;
    }
  }

  function exportCSV() {
    if (!results) return;
    const csv = getExportData(results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staking_rewards.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    if (!results) return;
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staking_rewards.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Chart Logic ---
  const chartWidth = 1200;
  const chartHeight = 600;
  const margin = { top: 40, right: 80, bottom: 80, left: 150 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  let viewBoxX = writable(0);
  let viewBoxY = writable(0);
  let viewBoxWidth = writable(innerWidth);
  let viewBoxHeight = writable(innerHeight);
  let zoomLevel = 1;
  const minZoom = 1;
  const maxZoom = 50;
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0, dragStartViewX = 0, dragStartViewY = 0;

  let tooltipVisible = false;
  let tooltipX = 0, tooltipY = 0, tooltipContent = '';

  let maxPeriod = 0, globalMinY = 0, globalMaxY = 1, yRange = 1;
  let xTicks = [], yTicks = [], cumulativePoints = [], afterDeductionPoints = [], afterInflationPoints = [];
  
  let yAxisLabel = "Value (Full Amount)";
  let dynamicLabelOffset = -100;

  function xScale(period) { return (period / maxPeriod) * innerWidth; }
  function yScale(value) { return innerHeight - ((value - globalMinY) / yRange) * innerHeight; }

  $: if (results && results.breakdown) {
    const breakdown = results.breakdown;
    maxPeriod = Math.max(...breakdown.map(b => b.period)) || 1;
    const mins = breakdown.map(b => Math.min(b.cumulative, b.afterDeduction, b.afterInflation));
    const maxs = breakdown.map(b => Math.max(b.cumulative, b.afterDeduction, b.afterInflation));
    globalMinY = Math.min(...mins);
    globalMaxY = Math.max(...maxs);
    yRange = globalMaxY - globalMinY || 1;

    xTicks = Array.from({ length: 11 }, (_, i) => i / 10 * maxPeriod);
    yTicks = Array.from({ length: 11 }, (_, i) => globalMinY + (i / 10) * yRange);

    cumulativePoints = breakdown.map(b => ({ x: xScale(b.period), y: yScale(b.cumulative), data: b }));
    afterDeductionPoints = breakdown.map(b => ({ x: xScale(b.period), y: yScale(b.afterDeduction), data: b }));
    afterInflationPoints = breakdown.map(b => ({ x: xScale(b.period), y: yScale(b.afterInflation), data: b }));

    if (globalMaxY >= 1_000_000_000) yAxisLabel = "Value (Billions)";
    else if (globalMaxY >= 1_000_000) yAxisLabel = "Value (Millions)";
    else if (globalMaxY >= 1_000) yAxisLabel = "Value (Thousands)";
    else yAxisLabel = "Value (Amount)";

    const longestTickStr = globalMaxY.toFixed(2);
    dynamicLabelOffset = -30 - (longestTickStr.length * 8);
  }

  function resetChartView() {
    $viewBoxX = 0; $viewBoxY = 0; $viewBoxWidth = innerWidth; $viewBoxHeight = innerHeight;
    zoomLevel = 1;
  }

  function zoom(factor) {
    const newZoom = zoomLevel * factor;
    if (newZoom < minZoom || newZoom > maxZoom) return;
    const centerX = $viewBoxX + $viewBoxWidth / 2;
    const centerY = $viewBoxY + $viewBoxHeight / 2;
    $viewBoxWidth /= factor; $viewBoxHeight /= factor;
    $viewBoxX = centerX - $viewBoxWidth / 2; $viewBoxY = centerY - $viewBoxHeight / 2;
    zoomLevel = newZoom;
  }

  function handleWheel(event) {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const zoomCenterX = $viewBoxX + (mouseX / chartWidth) * $viewBoxWidth;
    const zoomCenterY = $viewBoxY + (mouseY / chartHeight) * $viewBoxHeight;
    const newZoom = zoomLevel * (factor > 1 ? factor : 1 / factor);
    if (newZoom < minZoom || newZoom > maxZoom) return;
    const newWidth = $viewBoxWidth / factor;
    const newHeight = $viewBoxHeight / factor;
    $viewBoxX = zoomCenterX - (mouseX / chartWidth) * newWidth;
    $viewBoxY = zoomCenterY - (mouseY / chartHeight) * newHeight;
    $viewBoxWidth = newWidth; $viewBoxHeight = newHeight;
    zoomLevel = newZoom;
  }

  function startDrag(event) {
    isDragging = true;
    dragStartX = event.clientX; dragStartY = event.clientY;
    dragStartViewX = $viewBoxX; dragStartViewY = $viewBoxY;
  }

  function drag(event) {
    if (!isDragging) return;
    const dx = (dragStartX - event.clientX) * ($viewBoxWidth / chartWidth);
    const dy = (dragStartY - event.clientY) * ($viewBoxHeight / chartHeight);
    $viewBoxX = dragStartViewX + dx; $viewBoxY = dragStartViewY + dy;
  }

  function endDrag() { isDragging = false; }

  function showTooltip(event, point) {
    const rect = event.currentTarget.getBoundingClientRect();
    tooltipX = event.clientX - rect.left + 10;
    tooltipY = event.clientY - rect.top - 20;
    tooltipContent = `Period: ${point.data.period}\nReward: ${point.data.reward.toFixed(8)}\nCumulative: ${point.data.cumulative.toFixed(8)}\nAfter Deduction: ${point.data.afterDeduction.toFixed(8)}\nAfter Inflation: ${point.data.afterInflation.toFixed(8)}`;
    tooltipVisible = true;
  }

  function canvasInteraction(node) {
    node.addEventListener('wheel', handleWheel, { passive: false });
    node.addEventListener('mousedown', startDrag);
    node.addEventListener('mousemove', drag);
    node.addEventListener('mouseup', endDrag);
    node.addEventListener('mouseleave', endDrag);
    node.addEventListener('mousemove', (e) => {
      const rect = node.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - margin.left;
      const mouseY = e.clientY - rect.top - margin.top;
      const allPoints = [...cumulativePoints, ...afterDeductionPoints, ...afterInflationPoints];
      let closest = null; let minDist = Infinity;
      allPoints.forEach(p => {
        const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (dist < 20 && dist < minDist) { minDist = dist; closest = p; }
      });
      if (closest) showTooltip(e, closest); else tooltipVisible = false;
    });
    return {
      destroy() {
        node.removeEventListener('wheel', handleWheel);
        node.removeEventListener('mousedown', startDrag);
        node.removeEventListener('mousemove', drag);
        node.removeEventListener('mouseup', endDrag);
      }
    };
  }

  function exportChart() {
    const svg = document.querySelector('#growth-chart');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = chartWidth * 2; canvas.height = chartHeight * 2;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'staking_growth_chart.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }
</script>

<svelte:head>
  <title>Crypto Staking Calculator | Advanced Reward Modeling Tool</title>
  <meta name="description" content="Professional client-side calculator for precise crypto staking reward projections. Model compounding, fees, slashing, inflation, taxes, restaking, and lock-up penalties with interactive charts and detailed breakdowns." />
  <meta name="keywords" content="crypto staking calculator, staking rewards, compounding calculator, proof of stake yield, validator fees, slashing risk, network inflation, restaking, auto compounding, staking tax" />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Crypto Staking Calculator | Advanced Reward Modeling Tool" />
  <meta property="og:description" content="Accurate staking reward projections with full modeling of compounding intervals, validator fees, slashing risks, inflation, delays, taxes, and restaking strategies." />
  <meta property="og:url" content="{base}/" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Crypto Staking Calculator | Advanced Reward Modeling Tool" />
  <meta name="twitter:description" content="Professional client-side tool for detailed crypto staking analysis with interactive charts and comprehensive parameter modeling." />
</svelte:head>

<div class="container" style="padding-top: 6rem;">
  
  <section id="home" class="mb-5">
    <div class="text-center mb-5" in:fade={{ y: 20, duration: 800 }}>
      <h1 class="display-4 fw-bold mb-3 text-gradient">Crypto Staking Calculator</h1>
      <p class="lead text-muted">Optimize your rewards with professional analytics</p>
    </div>

    <div class="mb-4 text-center" in:fly={{ y: 20, duration: 800, delay: 100 }}>
      <button on:click={saveSession} class="btn btn-outline-success me-3 shadow-sm">💾 Save Session</button>
      <button on:click={() => loadSession(true)} class="btn btn-outline-info shadow-sm">📂 Load Session</button>
    </div>

    <form on:submit|preventDefault in:fly={{ y: 30, duration: 800, delay: 200 }}>
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card glass-card h-100">
            <div class="card-header border-0 bg-transparent text-primary">Basic Parameters</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="principal" class="form-label">Principal Amount</label>
                <input id="principal" type="number" bind:value={params.principal} class="form-control" step="any" />
              </div>
              <div class="mb-3">
                <label for="cryptoType" class="form-label">Crypto Type</label>
                <input id="cryptoType" type="text" bind:value={params.cryptoType} class="form-control" />
              </div>
              <div class="mb-3">
                <label for="apr" class="form-label">APR (%)</label>
                <input id="apr" type="number" bind:value={params.apr} class="form-control" step="0.01" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card glass-card h-100">
            <div class="card-header border-0 bg-transparent text-primary">Compounding & Duration</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="compoundingInterval" class="form-label">Compounding Interval</label>
                <select id="compoundingInterval" bind:value={params.compoundingInterval} class="form-select">
                  {#each intervalOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              {#if params.compoundingInterval === 'custom'}
                <div class="mb-3" transition:slide>
                  <label for="customIntervalSeconds" class="form-label">Custom Interval (seconds)</label>
                  <input id="customIntervalSeconds" type="number" bind:value={params.customIntervalSeconds} class="form-control" />
                </div>
              {/if}
              <div class="mb-3">
                <label for="durationDays" class="form-label">Duration (days)</label>
                <input id="durationDays" type="number" bind:value={params.durationDays} class="form-control" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card glass-card h-100">
            <div class="card-header border-0 bg-transparent text-primary">Risk & Fees</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="lockUpDays" class="form-label">Lock-up Days</label>
                <input id="lockUpDays" type="number" bind:value={params.lockUpDays} class="form-control" />
              </div>
              <div class="mb-3">
                <label for="lockUpPenalty" class="form-label">Lock-up Penalty (%)</label>
                <input id="lockUpPenalty" type="number" bind:value={params.lockUpPenalty} class="form-control" />
              </div>
              <div class="mb-3">
                <label for="slashingProbability" class="form-label">Slashing Probability (%)</label>
                <input id="slashingProbability" type="number" bind:value={params.slashingProbability} class="form-control" />
              </div>
              <div class="mb-3">
                <label for="validatorFee" class="form-label">Validator Fee (%)</label>
                <input id="validatorFee" type="number" bind:value={params.validatorFee} class="form-control" />
              </div>
              <div class="mb-3">
                <label for="inflationRate" class="form-label">Inflation Rate (%)</label>
                <input id="inflationRate" type="number" bind:value={params.inflationRate} class="form-control" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card glass-card h-100">
            <div class="card-header border-0 bg-transparent text-primary">Additional Adjustments</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="rewardDelayDays" class="form-label">Reward Delay (days)</label>
                <input id="rewardDelayDays" type="number" bind:value={params.rewardDelayDays} class="form-control" />
              </div>
              <div class="mb-3">
                <label for="taxRate" class="form-label">Tax Rate (%)</label>
                <input id="taxRate" type="number" bind:value={params.taxRate} class="form-control" />
              </div>
              <div class="mb-3">
                <label for="fiatRate" class="form-label">Fiat Conversion Rate</label>
                <input id="fiatRate" type="number" bind:value={params.fiatRate} class="form-control" />
              </div>
              <div class="form-check mb-2">
                <input id="restaking" type="checkbox" bind:checked={params.restaking} class="form-check-input" />
                <label for="restaking" class="form-check-label">Enable Restaking</label>
              </div>
              <div class="form-check">
                <input id="autoCompounding" type="checkbox" bind:checked={params.autoCompounding} class="form-check-input" />
                <label for="autoCompounding" class="form-check-label">Auto-Compounding</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-5">
        <button type="button" on:click={handleCalculate} class="btn btn-primary btn-lg px-5 shadow-lg">Calculate Rewards</button>
      </div>
    </form>

    {#if errors.length > 0}
      <div class="alert alert-danger mt-4 border-0 shadow-sm glass">
        <strong>Validation Errors:</strong>
        <ul class="mb-0 mt-2">
          {#each errors as error}
            <li>{error}</li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if results}
      <div class="mt-5" transition:slide>
        <h2 class="mb-4 text-center text-gradient">Professional Reward Analysis</h2>
        
        <div class="row g-4 mb-5">
          <div class="col-md-3">
            <div class="card glass-card text-center h-100">
              <div class="card-header bg-transparent">Net Amount</div>
              <div class="card-body"><h4>{results.net.toFixed(8)}</h4></div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card glass-card text-center h-100">
              <div class="card-header bg-transparent">Total Rewards</div>
              <div class="card-body"><h4>{results.totalRewards.toFixed(8)}</h4></div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card glass-card text-center h-100">
              <div class="card-header bg-transparent">Net in Fiat</div>
              <div class="card-body"><h4>${results.netFiat.toFixed(2)}</h4></div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card glass-card text-center h-100">
              <div class="card-header bg-transparent">Effective APY</div>
              <div class="card-body"><h4>{results.effectiveApy.toFixed(2)}%</h4></div>
            </div>
          </div>
        </div>

        <div class="card glass-card mb-5 shadow-sm overflow-hidden">
          <div class="card-header bg-transparent py-3"><h3 class="h5 mb-0">Detailed Breakdown Table</h3></div>
          <div class="table-container">
            <div class="table-responsive">
              <table class="table table-hover table-bordered mb-0" style="background: transparent;">
                <thead class="table-light sticky-top">
                  <tr><th>Period</th><th>Reward</th><th>Cumulative</th><th>After Deductions</th><th>After Inflation</th></tr>
                </thead>
                <tbody>
                  {#each getTableData(results.breakdown) as row}
                    <tr style="color: var(--color-text-main);"><td>{row.period}</td><td>{row.reward}</td><td>{row.cumulative}</td><td>{row.afterDeduction}</td><td>{row.afterInflation}</td></tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h3 class="mt-5 mb-3 text-center text-gradient">Interactive Growth Analytics Chart</h3>
        <div class="card glass-card mb-5 shadow-sm">
          <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
            <span>Zoom Level: {zoomLevel.toFixed(2)}x</span>
            <div>
              <button on:click={() => zoom(1.2)} class="btn btn-sm btn-outline-secondary me-2">Zoom In</button>
              <button on:click={() => zoom(0.8)} class="btn btn-sm btn-outline-secondary me-2">Zoom Out</button>
              <button on:click={resetChartView} class="btn btn-sm btn-outline-secondary me-2">Reset</button>
              <button on:click={exportChart} class="btn btn-sm btn-warning">Export PNG</button>
            </div>
          </div>
          <div class="card-body p-0 position-relative" style="overflow: hidden;">
            <canvas width={chartWidth} height={chartHeight} use:canvasInteraction class="position-absolute" style="z-index: 10; cursor: move;"></canvas>
            
            <svg id="growth-chart" width={chartWidth} height={chartHeight} viewBox={`${$viewBoxX} ${$viewBoxY} ${$viewBoxWidth} ${$viewBoxHeight}`}>
              <g transform={`translate(${margin.left},${margin.top})`}>
                {#each xTicks as tick}
                  <line x1={xScale(tick)} y1={0} x2={xScale(tick)} y2={innerHeight} stroke-width="0.5" />
                  <text x={xScale(tick)} y={innerHeight + 25} text-anchor="middle" font-size="12">{Math.round(tick)}</text>
                {/each}
                {#each yTicks as tick}
                  <line x1={0} y1={yScale(tick)} x2={innerWidth} y2={yScale(tick)} stroke-width="0.5" />
                  <text x={-15} y={yScale(tick) + 5} text-anchor="end" font-size="12">{tick.toFixed(2)}</text>
                {/each}

                <text x={innerWidth / 2} y={innerHeight + 60} text-anchor="middle" font-weight="bold" font-size="14">Period (Time)</text>
                <text x={dynamicLabelOffset} y={innerHeight / 2} text-anchor="middle" font-weight="bold" font-size="14" transform={`rotate(-90, ${dynamicLabelOffset}, ${innerHeight / 2})`}>{yAxisLabel}</text>

                <polyline points={cumulativePoints.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--color-chart-line)" stroke-width="3" />
                <polyline points={afterDeductionPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#9c27b0" stroke-width="2" stroke-dasharray="5,5" />
                <polyline points={afterInflationPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#e91e63" stroke-width="2" stroke-dasharray="3,3" />
              </g>
            </svg>
            {#if tooltipVisible}
              <div class="position-absolute glass shadow p-2" style="left: {tooltipX}px; top: {tooltipY}px; z-index: 1000; white-space: pre-line; border: 1px solid var(--color-accent); font-size: 0.85rem; color: var(--color-text-main);">{tooltipContent}</div>
            {/if}
          </div>
        </div>

        <div class="text-center mb-5">
          <button on:click={exportCSV} class="btn btn-secondary me-3 shadow-sm">Export Breakdown CSV</button>
          <button on:click={exportJSON} class="btn btn-secondary shadow-sm">Export Full JSON</button>
        </div>
      </div>
    {/if}
  </section>

<!-- Update to main +page.svelte sections -->

<section id="about" class="py-5" in:fade>
  <div class="card glass-card p-5">
    <h2 class="text-gradient">About</h2>
    <p>The Crypto Staking Calculator is a comprehensive, fully client-side web utility designed to provide precise and detailed staking reward projections for proof-of-stake blockchain networks. Built with a focus on technical accuracy and user privacy, it enables stakers, investors, and researchers to model complex scenarios that go far beyond simple APR multiplication.</p>

    <p>This tool addresses the limitations of basic calculators by incorporating every significant factor that influences real-world staking returns. Users can input principal amounts, annual percentage rates (APR), custom compounding intervals (from daily to hourly or even second-by-second), staking duration, lock-up periods with early withdrawal penalties, validator commission fees, slashing risk probabilities, network inflation rates, reward distribution delays, tax withholding on rewards, fiat conversion rates, restaking scenarios, and auto-compounding behavior.</p>

    <p>All calculations are performed locally in the browser using advanced mathematical modeling, ensuring complete data isolation and privacy. The reward engine simulates periodic compounding with adjustments for inflation dilution, fee deductions, probabilistic slashing, delayed reward crediting, and conditional lock-up penalties. Results include gross rewards, net principal growth, post-tax balances, effective annual percentage yield (APY), and fiat-equivalent values.</p>

    <p>Visual analytics feature an interactive growth chart with multiple series (cumulative balance, post-deduction balance, post-inflation balance), pan/zoom capabilities up to 50x magnification, hover tooltips with period-specific details, and export options for PNG images. A detailed breakdown table provides sampled periodic snapshots for in-depth analysis, while CSV and JSON exports allow further external processing.</p>

    <p>Session persistence via browser localStorage enables users to save and reload complex parameter sets. The tool operates entirely offline after initial load, making it suitable for secure environments. By covering every minute detail—from custom compounding intervals to probabilistic risk modeling—this calculator delivers professional-grade projections that reflect actual network economics rather than simplified assumptions.</p>

    <p>Whether evaluating short-term delegation strategies or multi-year holding plans, the Crypto Staking Calculator provides the depth and precision needed for informed decision-making in proof-of-stake ecosystems.</p>

    <p class="italic-note">Empowering accurate staking analysis through comprehensive, privacy-focused modeling.</p>
  </div>
</section>

<section id="how-to" class="py-5" in:fade>
  <div class="card glass-card p-5">
    <h2 class="text-gradient">How to Use</h2>
    <p>The Crypto Staking Calculator offers an intuitive yet powerful interface for modeling sophisticated staking scenarios. Begin by entering your principal staking amount and selecting the cryptocurrency type for reference. Input the network's annual percentage rate (APR) or expected reward rate as the base yield parameter.</p>

    <p>Choose your compounding interval from preset options (daily, weekly, monthly, quarterly, annually) or select "Custom" to specify exact seconds between reward credits—this enables precise modeling of networks with continuous or near-continuous distribution. Set the intended staking duration in days for accurate time-bound projections.</p>

    <p>Incorporate risk and cost factors by entering validator commission rates, estimated slashing probability (based on historical validator performance), and network inflation rate. Specify any reward distribution delay (time between earning and crediting rewards) and lock-up period with associated early withdrawal penalty percentage.</p>

    <p>For fiscal planning, input your applicable tax rate on rewards and current fiat conversion rate to view post-tax net balances and real-world value equivalents. Toggle restaking to simulate layered yield strategies and auto-compounding to ensure rewards are immediately reinvested.</p>

    <p>Click "Calculate Rewards" to generate results. The summary displays net final amount, total gross rewards, tax deducted, fiat equivalent, and effective APY after all adjustments. Below, a scrollable breakdown table shows periodic snapshots of growth, deductions, and inflation impact.</p>

    <p>The interactive growth chart visualizes multiple series with pan/zoom functionality—use mouse wheel to zoom (up to 50x for minute detail inspection) and drag to navigate. Hover data points for precise period values. Export charts as PNG, breakdowns as CSV, or full results as JSON for external analysis.</p>

    <p>Use "Save Session" to persist current parameters via browser localStorage for future reference, and "Load Session" to restore previous configurations. All data remains exclusively on your device.</p>

    <p>For optimal accuracy, research your target network's exact parameters (reward timing, inflation schedule, typical validator fees) and input them accordingly. The calculator's strength lies in its ability to reflect real network economics rather than simplified assumptions.</p>

    <p class="italic-note">Precise inputs yield professional-grade projections—adjust parameters iteratively to explore different strategies.</p>
  </div>
</section>

<section id="faq" class="py-5" in:fade>
  <div class="card glass-card p-5">
    <h2 class="text-gradient">FAQ</h2>

    <h3>Is this calculator connected to any blockchain or wallet?</h3>
    <p>No. The Crypto Staking Calculator is entirely client-side and offline-capable after loading. It does not connect to any blockchain, wallet, or external service beyond optional CDN resources for styling. Your inputs never leave your browser.</p>

    <h3>How accurate are the reward projections?</h3>
    <p>Projections are mathematically precise based on provided inputs and assumptions. Accuracy depends on using correct network parameters (APR, inflation schedule, reward timing, etc.). Real returns may vary due to network changes, validator performance, or market conditions.</p>

    <h3>Why does compounding frequency matter so much?</h3>
    <p>Frequent compounding significantly increases effective yield through exponential growth on reinvested rewards. Hourly vs daily compounding can add meaningful percentage points over years, while custom intervals allow modeling of continuous distribution networks.</p>

    <h3>Should I include taxes in calculations?</h3>
    <p>Yes, for realistic net return planning. Most jurisdictions treat staking rewards as taxable income. Including expected tax rates provides true post-fiscal yield rather than gross figures that overstate actual outcomes.</p>

    <h3>What does restaking simulation represent?</h3>
    <p>The restaking toggle models layered security protocols where staked assets earn additional rewards from secondary networks. It applies a simulated yield multiplier to approximate combined reward streams while maintaining principal exposure.</p>

    <h3>How is inflation adjustment calculated?</h3>
    <p>Inflation reduces effective base rate before compounding (Effective APR = APR - Inflation). This reflects token dilution impact on purchasing power, providing more realistic long-term growth estimates than nominal balance increases.</p>

    <h3>Can I trust the slashing risk modeling?</h3>
    <p>Slashing is modeled as an average probabilistic deduction based on input percentage. Use historical validator data for realistic estimates. Rare but severe events are averaged across periods rather than simulated as discrete occurrences.</p>

    <h3>Why include lock-up penalties?</h3>
    <p>Many networks enforce commitment periods with withdrawal penalties. Including these ensures projections reflect actual accessible returns for planned durations, preventing overestimation for short-term strategies.</p>

    <h3>Is my data saved anywhere?</h3>
    <p>Only if you explicitly click "Save Session," which uses your browser's localStorage. Data remains solely on your device and can be cleared anytime. No information is transmitted or stored externally.</p>

    <h3>Can I use this for professional analysis?</h3>
    <p>Yes. The tool's depth—covering every significant variable with high-precision calculations and export capabilities—makes it suitable for serious staking research and portfolio planning.</p>

    <p class="italic-note">These answers address common questions about functionality and best practices for accurate modeling.</p>
  </div>
</section>  
</div>

<style>
  .table thead th { font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; }
  .table-container { max-height: 400px; overflow-y: auto; border-bottom: 1px solid var(--glass-border); }
  .sticky-top { position: sticky; top: 0; z-index: 2; background-color: var(--glass-bg); backdrop-filter: blur(10px); }
  
  /* Chart elements color syncing */
  svg text { fill: var(--color-text-muted); transition: fill 0.3s; }
  svg line { stroke: var(--glass-border); transition: stroke 0.3s; }
  polyline { transition: stroke 0.3s; }
</style>