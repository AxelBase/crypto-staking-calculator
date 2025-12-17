<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';

  const paypalUsername = "AxelLab427";
  const donationAmounts = [1, 3, 5, 10];
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

      <!-- THEME TOGGLE (ICON FIXED) -->
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
          <!-- Crescent Moon -->
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M21 12.8A9 9 0 0111.2 3a7 7 0 109.8 9.8z"
            />
          </svg>
        {/if}
      </button>

      <div class="position-relative" use:clickOutside on:click_outside={closeDropdown}>
        <button class="btn btn-coffee d-flex align-items-center gap-2" on:click={toggleDropdown}>
          ☕
          <span class="d-none d-sm-inline">Buy me a coffee</span>
        </button>

        {#if isDropdownOpen}
          <div class="dropdown-menu-custom glass p-2 shadow-lg" transition:slide>
            {#each donationAmounts as amount}
              <a
                href="https://paypal.me/{paypalUsername}/{amount}"
                target="_blank"
                class="donation-link"
              >
                ${amount}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- NAV LINKS (BLOG ADDED) -->
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
    <span>&copy; {new Date().getFullYear()} AxelBase</span>
    <div class="d-flex gap-3">
      <a href="{base}/privacy" class="text-decoration-none text-muted">Privacy</a>
      <a href="{base}/terms" class="text-decoration-none text-muted">Terms</a>
    </div>
  </div>
</footer>

<style>
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
    pointer-events: auto;
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

  .btn-coffee {
    background: #ffdd00;
    color: #3d3d3d;
    font-weight: 700;
    border-radius: 50px;
    border: none;
    padding: 0.45rem 1.2rem;
  }

  .dropdown-menu-custom {
    position: absolute;
    top: 125%;
    left: 0;
    min-width: 120px;
    z-index: 1100;
    border: 1px solid var(--color-accent) !important;
    border-radius: 12px;
  }

  .donation-link {
    display: block;
    padding: 10px;
    text-align: center;
    border-radius: 8px;
    color: var(--color-text-main);
    font-weight: bold;
    text-decoration: none;
  }

  .donation-link:hover {
    background: var(--color-accent);
    color: white;
  }
</style>
