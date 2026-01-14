<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  import { slide, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  const currentYear = new Date().getFullYear();

  let isDropdownOpen = false;
  let currentTheme = 'light';

  function toggleDropdown() { isDropdownOpen = !isDropdownOpen; }
  function closeDropdown() { isDropdownOpen = false; }

  function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node)) {
        node.dispatchEvent(new CustomEvent('click_outside'));
      }
    };
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }

  onMount(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentTheme = saved || (prefersDark ? 'dark' : 'light');
    document.body.dataset.bsTheme = currentTheme;
  });

  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.dataset.bsTheme = currentTheme;
    localStorage.setItem('theme', currentTheme);
  }
</script>

<header class="fixed-top p-3 w-100" style="pointer-events: none; z-index: 1040;">
  <nav
    class="container glass rounded-pill px-4 py-2 d-flex justify-content-between align-items-center shadow-sm"
    style="pointer-events: auto; max-width: 1200px;"
  >
    <div class="d-flex align-items-center gap-3">
      <a href="{base}/" class="d-flex align-items-center gap-2 logo-group text-decoration-none">
        <img src="{base}/AxelLab-Logo.ico" alt="Logo" class="navbar-brand-logo" />
        <span class="fw-bold fs-5 d-none d-md-inline" style="color: var(--color-text-main);">
          AxelBase
        </span>
      </a>

      <!-- THEME TOGGLE -->
      <button
        type="button"
        class="theme-toggle-btn shadow-sm"
        on:click={toggleTheme}
        aria-label="Toggle theme"
      >
        {#if currentTheme === 'light'}
          <!-- Sun -->
          <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <g stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="4"/>
              <line x1="12" y1="20" x2="12" y2="23"/>
              <line x1="1" y1="12" x2="4" y2="12"/>
              <line x1="20" y1="12" x2="23" y2="12"/>
              <line x1="4.2" y1="4.2" x2="6.4" y2="6.4"/>
              <line x1="17.6" y1="17.6" x2="19.8" y2="19.8"/>
              <line x1="4.2" y1="19.8" x2="6.4" y2="17.6"/>
              <line x1="17.6" y1="6.4" x2="19.8" y2="4.2"/>
            </g>
          </svg>
        {:else}
          <!-- Moon -->
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M21 12.8A9 9 0 0111.2 3a7 7 0 109.8 9.8z"
            />
          </svg>
        {/if}
      </button>

      <!-- BUY ME A COFFEE (File 1 style adapted) -->
      <div class="position-relative" use:clickOutside on:click_outside={closeDropdown}>
        <button
          class="bmac-button d-flex align-items-center gap-2 text-white border-0 px-4 py-2 rounded-pill shadow-sm"
          on:click={toggleDropdown}
          aria-label="Support options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2,21V19H20V21H2M20,8V5H4V8H20M20,10H4V13C4,14.38 4.5,15.63 5.31,16.58L11.64,19H12.36L18.69,16.58C19.5,15.63 20,14.38 20,13V10M16,2H8V4H16V2Z" />
          </svg>
          <span class="d-none d-sm-inline fw-semibold">Buy me a Coffee</span>
        </button>

        {#if isDropdownOpen}
          <div
            class="bmac-dropdown glass mt-2 shadow-lg"
            transition:fly={{ y: -10, duration: 250 }}
          >
            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
            >
              <span class="amount">$3</span> One Coffee
            </a>
            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
            >
              <span class="amount">$5</span> Two Coffees
            </a>
            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
            >
              <span class="amount">$10</span> Three Coffees
            </a>

            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
              class="custom-amount"
            >
              Custom Amount
            </a>

            <a
              href="bitcoin:bc1q3p0e6vt492m4w4fpz5m2cl4zcfuqqkgaj6myc9?label=AxelBase&message=Buy%20me%20a%20coffee"
              on:click={closeDropdown}
              class="custom-amount bitcoin-link"
            >
              Buy via Crypto (Bitcoin)
            </a>
          </div>
        {/if}
      </div>
    </div>

    <!-- NAV LINKS -->
    <ul class="nav d-none d-lg-flex align-items-center gap-1">
      <li><a class="nav-link-custom" href="{base}/#home">Home</a></li>
      <li><a class="nav-link-custom" href="{base}/#about">About</a></li>
      <li><a class="nav-link-custom" href="{base}/#how-to">How to Use</a></li>
      <li><a class="nav-link-custom" href="{base}/#faq">FAQ</a></li>
      <li><a class="nav-link-custom" href="{base}/blog">Blog</a></li>
    </ul>

    <button
      class="navbar-toggler d-lg-none border-0"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mobileNav"
      aria-label="Toggle navigation"
    >
      ☰
    </button>
  </nav>
</header>

<slot />

<footer class="glass border-top py-4 mt-auto">
  <div class="container d-flex justify-content-between align-items-center small text-muted">
    <span>© {currentYear} AxelBase</span>
    <div class="d-flex gap-3">
      <a href="{base}/privacy" class="text-decoration-none text-muted">Privacy</a>
      <a href="{base}/terms" class="text-decoration-none text-muted">Terms</a>
    </div>
  </div>
</footer>

<style>
  /* ── Keep most of your existing styles from File 2 ── */

  .navbar-brand-logo {
    height: 32px;
    transition: transform 0.3s ease;
  }

  .logo-group:hover .navbar-brand-logo {
    transform: rotate(10deg) scale(1.1);
  }

  .theme-toggle-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--glass-bg);
    border: 2px solid var(--color-accent);
    color: var(--color-text-main);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .theme-toggle-btn:hover {
    transform: rotate(15deg) scale(1.1);
    background: var(--color-accent);
    color: white;
  }

  .nav-link-custom {
    padding: 0.5rem 1rem;
    color: var(--color-text-muted);
    font-weight: 600;
    text-decoration: none;
    transition: 0.3s;
  }

  .nav-link-custom:hover {
    color: var(--color-accent);
  }

  /* ── Buy Me a Coffee styles (mostly from File 1) ── */
  .bmac-button {
    background: #00a651;           /* green similar to original */
    font-size: 0.95rem;
    transition: all 0.3s ease;
    color: white !important;
  }

  .bmac-button:hover {
    background: #008c45;
    transform: translateY(-1px);
  }

  .bmac-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 240px;
    border-radius: 16px;
    overflow: hidden;
    z-index: 1000;
    border: 1px solid var(--glass-border);
  }

  .bmac-dropdown a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    color: var(--color-text-main);
    text-decoration: none;
    font-size: 0.98rem;
    transition: all 0.2s ease;
  }

  .bmac-dropdown a:hover {
    background: rgba(0, 166, 81, 0.12);
    color: #00a651;
    padding-left: 28px;
  }

  .bmac-dropdown .amount {
    font-weight: 700;
    color: #00a651;
    font-size: 1.1rem;
  }

  .bmac-dropdown .custom-amount {
    font-weight: 600;
    color: #00a651;
    border-top: 1px solid rgba(128,128,128,0.15);
    justify-content: center !important;
  }

  .bitcoin-link {
    color: #f7931a !important;
    font-weight: 600;
  }

  .bitcoin-link:hover {
    background: rgba(247, 147, 26, 0.12) !important;
    color: #f7931a !important;
  }
</style>