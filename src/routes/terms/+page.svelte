<!-- src/routes/terms/+page.svelte -->
<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Terms and Conditions | Crypto Staking Calculator</title>
  <meta name="description" content="Terms of use for the Crypto Staking Calculator, a free client-side tool for modeling staking rewards." />
  <meta property="og:title" content="Terms and Conditions | Crypto Staking Calculator" />
  <meta property="og:description" content="Terms of use for the Crypto Staking Calculator, a free client-side tool for modeling staking rewards." />
  <meta property="og:url" content="{base}/terms" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout" style="padding-top: 100px;">
  <article class="prose">
    <h1>Terms and Conditions</h1>

    <p class="post-meta">Effective Date: December 17, 2025</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using the <strong>Crypto Staking Calculator</strong> ("the Tool"), you agree to these Terms and Conditions. If you do not agree, please refrain from using the Tool. We reserve the right to modify these terms at any time, with changes effective upon posting.</p>

    <h2>2. Description of Service</h2>
    <p>The Crypto Staking Calculator is a free, open-source, client-side web application that enables users to model staking rewards, compounding scenarios, validator fees, slashing risks, inflation adjustments, lock-up penalties, taxes, and restaking strategies. All calculations occur locally in your browser.</p>

    <h2>3. No Financial Advice</h2>
    <p><strong>The Tool does not provide financial, investment, or tax advice.</strong> Results are mathematical simulations based on user-provided inputs and assumptions. Actual staking returns may vary significantly due to network changes, market conditions, validator performance, and other factors. Users are solely responsible for their staking decisions.</p>

    <h2>4. Use of the Tool</h2>
    <p>You may use the Tool for personal, non-commercial purposes. Permitted uses include:</p>
    <ul>
      <li>Modeling hypothetical staking scenarios</li>
      <li>Exporting calculation results for personal reference</li>
      <li>Saving sessions via browser localStorage</li>
    </ul>
    <p>Prohibited uses include automated scraping, redistribution as a service, or any activity that imposes unreasonable load on hosting infrastructure.</p>

    <h2>5. Accuracy and Reliability</h2>
    <p>While we strive for mathematical accuracy, <strong>the Tool is provided "as is" without warranties</strong> of any kind, express or implied. We do not guarantee error-free operation or that results will match real-world outcomes. Users should verify calculations independently.</p>

    <h2>6. Intellectual Property</h2>
    <p>The Tool's source code is open-source and available publicly. Documentation, design, and branding remain property of the developers. Users may fork or modify the code under applicable open-source licenses but may not represent modified versions as official without permission.</p>

    <h2>7. Limitation of Liability</h2>
    <p>To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of the Tool, including but not limited to financial losses from inaccurate projections or staking decisions.</p>

    <h2>8. External Links</h2>
    <p>The Tool may contain links to external blockchain explorers or resources. We are not responsible for the content or availability of third-party sites.</p>

    <h2>9. Termination</h2>
    <p>We reserve the right to restrict access to the Tool at our discretion, though as a static hosted application this is unlikely.</p>

    <h2>10. Governing Law</h2>
    <p>These terms shall be governed by general internet usage principles and applicable open-source licensing.</p>

    <p class="italic-note">The Crypto Staking Calculator is a community educational resource—<strong>use responsibly and verify results independently</strong>.</p>
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