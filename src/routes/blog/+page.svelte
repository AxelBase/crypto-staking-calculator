<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
  import { base } from '$app/paths';

  const posts = [
    {
      href: '/blog/posts/post1',
      title: 'Understanding Crypto Staking: Core Concepts and Rewards',
      description: 'A foundational overview of staking mechanics, how rewards are generated, and the key factors that influence yield in proof-of-stake networks.'
    },
    {
      href: '/blog/posts/post2',
      title: 'Compounding Intervals Explained: Daily vs Hourly vs Custom',
      description: 'Deep dive into how different compounding frequencies affect long-term staking returns, including real-world examples and mathematical impact.'
    },
    {
      href: '/blog/posts/post3',
      title: 'Accounting for Validator Fees and Slashing Risks',
      description: 'Learn how validator commissions and potential slashing events reduce effective yield and how to model them accurately in reward projections.'
    },
    {
      href: '/blog/posts/post4',
      title: 'The Hidden Impact of Network Inflation on Staking Returns',
      description: 'Explore how token inflation dilutes staking rewards over time and strategies to adjust expectations for real net growth.'
    },
    {
      href: '/blog/posts/post5',
      title: 'Modeling Reward Delays and Lock-up Penalties',
      description: 'Technical breakdown of delayed reward distribution and early withdrawal penalties, with precise calculation methods for accurate forecasting.'
    },
    {
      href: '/blog/posts/post6',
      title: 'Tax Implications in Staking Reward Calculations',
      description: 'How to incorporate tax withholding on rewards into projections to arrive at true net returns after fiscal obligations.'
    },
    {
      href: '/blog/posts/post7',
      title: 'Advanced Scenarios: Restaking and Auto-Compounding Strategies',
      description: 'Examination of restaking protocols and auto-compounding effects, including simulated yield boosts and long-term growth patterns.'
    }
  ];
</script>

<svelte:head>
  <title>Blog | Crypto Staking Insights</title>
  <meta name="description" content="In-depth technical articles on staking mechanics, reward modeling, compounding strategies, risk adjustments, and advanced yield optimization." />
</svelte:head>

<div class="container fade-in blog-index" style="padding-top: 100px;">
  <header class="blog-header">
    <h1><i class="bi bi-journal-richtext"></i> Blog: Crypto Staking Insights</h1>
    <p class="subtitle">
      Technical deep dives into staking mechanics, reward calculations, risk modeling, and yield optimization. 
      Explore precise methodologies for forecasting returns across various network conditions and strategies.
    </p>
  </header>

  <div class="posts-grid">
    {#each posts as post}
      <a href="{base}{post.href}" class="card post-card">
        <div class="card-body">
          <h2 class="post-title">{post.title}</h2>
          <p class="post-description">{post.description}</p>
          <span class="read-more">Read Article &rarr;</span>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .blog-index {
    padding-top: 2rem;
    padding-bottom: 4rem;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 3rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 2rem;
  }

  .blog-header h1 {
    font-size: 2.8rem;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .post-card {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .post-card .card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .post-title {
    font-size: 1.25rem;
    color: var(--accent-secondary);
    margin-bottom: 0.75rem;
  }

  .post-description {
    color: var(--text-secondary);
    flex-grow: 1;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .read-more {
    color: var(--accent-primary);
    font-weight: 600;
    align-self: flex-start;
    transition: var(--transition-fast);
  }

  .post-card:hover .read-more {
    transform: translateX(5px);
  }
</style>