<!-- src/routes/privacy/+page.svelte -->
<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Privacy Policy | Crypto Staking Calculator</title>
  <meta name="description" content="Our privacy policy explains how the Crypto Staking Calculator protects your data with a fully client-side, no-collection approach." />
  <meta property="og:title" content="Privacy Policy | Crypto Staking Calculator" />
  <meta property="og:description" content="Our privacy policy explains how the Crypto Staking Calculator protects your data with a fully client-side, no-collection approach." />
  <meta property="og:url" content="{base}/privacy" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout" style="padding-top: 100px;">
  <article class="prose">
    <h1>Privacy Policy</h1>

    <p class="post-meta">Effective Date: December 17, 2025</p>

    <h2>1. Introduction</h2>
    <p>Welcome to the <strong>Crypto Staking Calculator</strong>, a client-side web utility ("we," "us," or "our"). This Privacy Policy explains our approach to user privacy when you use our tool to model staking rewards, compounding scenarios, and related calculations. We prioritize <strong>complete user privacy</strong> by design. The entire application runs locally in your browser, and <strong>we do not collect, store, transmit, or process any personal data</strong>. All inputs and calculations remain exclusively on your device.</p>

    <h2>2. Information We Do Not Collect</h2>
    <p>The Crypto Staking Calculator operates without gathering any information from users. Specifically, we do not collect:</p>
    <ul>
      <li><strong>Personal identifiers</strong> such as names, email addresses, or wallet addresses.</li>
      <li><strong>Usage or behavioral data</strong> including IP addresses, browser details, device information, or location.</li>
      <li><strong>Calculation inputs</strong>: Principal amounts, APR values, validator fees, or any other parameters you enter are processed only in your browser memory.</li>
      <li><strong>Analytics or tracking data</strong>: No cookies, pixels, or third-party tracking scripts are used.</li>
    </ul>
    <p>Because every operation—from reward simulation to chart generation—occurs <strong>entirely client-side</strong>, your data never leaves your device or reaches our servers.</p>

    <h2>3. How the Tool Functions</h2>
    <p>When using the calculator:</p>
    <ul>
      <li><strong>All computations</strong> are performed using JavaScript running locally in your browser.</li>
      <li><strong>No network requests</strong> are made beyond the initial page load (and optional Bootstrap CDN for styling).</li>
      <li><strong>Session persistence</strong> is optional and uses only your browser's localStorage to save inputs for convenience across page reloads—data remains on your device only.</li>
      <li><strong>Exports</strong> (CSV, JSON, PNG charts) are generated locally and downloaded directly via your browser.</li>
    </ul>
    <p>This architecture ensures <strong>absolute data isolation</strong> and makes the tool suitable for sensitive financial modeling.</p>

    <h2>4. Third-Party Services</h2>
    <p>We do not integrate analytics, advertising, or tracking services. The only external resource is Bootstrap styling delivered via a reputable CDN, which does not track individual users. No other third-party scripts execute on the site.</p>

    <h2>5. Cookies and Tracking</h2>
    <p>The Crypto Staking Calculator uses <strong>no cookies</strong>, localStorage is used solely for optional session saving at your explicit action, and no persistent tracking mechanisms exist. Your activity is completely anonymous.</p>

    <h2>6. Data Security</h2>
    <p>Since no data is transmitted or stored server-side, traditional security risks are eliminated. We recommend using updated browsers and secure connections for general web safety.</p>

    <h2>7. Changes to This Policy</h2>
    <p>We may occasionally update this Privacy Policy. Changes will be reflected here with the revised effective date. Continued use constitutes acceptance of updates.</p>

    <h2>8. Contact</h2>
    <p>For questions about this policy, please open an issue on our public repository.</p>

    <p class="italic-note">Your privacy is fundamental to this tool’s design—<strong>no data collection means no privacy concerns</strong>.</p>
  </article>
</div>

<style>
  .post-layout {
    max-width: 800px;
    padding-top: 2rem;
    padding-bottom: 4rem;
  }

  .prose {
    line-height: 1.8;
  }

  .prose .post-meta {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
  }

  .prose h1, .prose h2 {
    color: var(--accent-secondary);
  }

  .prose h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .prose h2 {
    margin-top: 2.5rem;
    border-bottom: 1px solid var(--secondary-bg);
    padding-bottom: 0.5rem;
  }

  .prose p {
    color: var(--text-primary);
  }

  .prose ul {
    list-style-type: '→ ';
    padding-left: 1.5rem;
    color: var(--text-primary);
  }
  .prose ul li::marker {
    color: var(--accent-primary);
  }
  .prose ul li {
    padding-left: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .prose .italic-note {
    font-style: italic;
    color: var(--text-secondary);
    text-align: center;
    margin-top: 3rem;
  }
</style>