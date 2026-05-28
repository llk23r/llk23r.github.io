<script>
  let includeHistory = $state(true)
  let includeRag = $state(true)
  let includeTools = $state(true)
  let includeImage = $state(false)
  let retrieved = $state(12)
  let reranked = $state(4)

  let promptParts = $derived.by(() => {
    const parts = [
      { label: 'system policy', tokens: 650, color: 'var(--theme-cyan, #06b6d4)' },
      { label: 'user message', tokens: 90, color: 'var(--theme-green, #10b981)' },
    ]
    if (includeHistory) parts.splice(1, 0, { label: 'recent history', tokens: 1200, color: 'var(--theme-yellow, #f59e0b)' })
    if (includeRag) parts.push({ label: 'retrieved chunks', tokens: reranked * 420, color: 'var(--theme-magenta, #8b5cf6)' })
    if (includeTools) parts.push({ label: 'tool schemas', tokens: 750, color: 'var(--theme-red, #ec4899)' })
    if (includeImage) parts.push({ label: 'image tokens', tokens: 576, color: 'var(--theme-blue, #60a5fa)' })
    return parts
  })

  let totalTokens = $derived(promptParts.reduce((sum, part) => sum + part.tokens, 0))
  let dropped = $derived(includeRag ? Math.max(0, retrieved - reranked) : 0)

  $effect(() => {
    if (reranked > retrieved) reranked = retrieved
  })

  const pipeline = [
    ['1', 'Read request', 'visible text plus metadata'],
    ['2', 'Fetch memory', 'recent turns or summaries'],
    ['3', 'Retrieve', 'sparse, dense, or hybrid search'],
    ['4', 'Rerank', 'keep only context worth spending tokens on'],
    ['5', 'Assemble', 'ordered prompt the model will actually see'],
  ]
</script>

<figure class="trace-viz" aria-labelledby="prompt-assembly-title">
  <div class="header">
    <div>
      <h3 id="prompt-assembly-title">The Prompt Is Built, Not Merely Sent</h3>
      <p>Toggle what the product adds before the model sees anything. Every added source competes for the same context window.</p>
    </div>
  </div>

  <div class="pipeline">
    {#each pipeline as step}
      <div class="step">
        <span>{step[0]}</span>
        <strong>{step[1]}</strong>
        <small>{step[2]}</small>
      </div>
    {/each}
  </div>

  <div class="toggles" aria-label="Prompt inputs">
    <label><input type="checkbox" bind:checked={includeHistory} /> conversation memory</label>
    <label><input type="checkbox" bind:checked={includeRag} /> RAG documents</label>
    <label><input type="checkbox" bind:checked={includeTools} /> tool schemas</label>
    <label><input type="checkbox" bind:checked={includeImage} /> image input</label>
  </div>

  {#if includeRag}
    <div class="controls">
      <label>
        Retrieved chunks
        <input type="range" min="4" max="30" step="1" bind:value={retrieved} />
        <span>{retrieved}</span>
      </label>
      <label>
        Chunks after rerank
        <input type="range" min="1" max={retrieved} step="1" bind:value={reranked} />
        <span>{reranked}</span>
      </label>
    </div>
  {/if}

  <div class="bar" aria-label="Prompt token composition">
    {#each promptParts as part}
      <span style="--part-color: {part.color}; width: {Math.max(7, part.tokens / totalTokens * 100)}%">
        {part.label}
      </span>
    {/each}
  </div>

  <div class="cards">
    <div>
      <span>Total prompt tokens</span>
      <strong>{totalTokens.toLocaleString()}</strong>
    </div>
    <div>
      <span>RAG chunks dropped</span>
      <strong>{dropped}</strong>
      <small>{includeRag ? 'retrieved but not worth context budget' : 'RAG disabled'}</small>
    </div>
    <div>
      <span>What the model can use</span>
      <strong>weights + assembled prompt + executed tool results</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: a chat product builds the real prompt from policy, memory, retrieved chunks, tool schemas, images converted to vectors or tokens, and the user's visible message. Retrieval must still be reranked and fit into the context window.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-yellow, #f59e0b));
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }

  p,
  small,
  .cards span {
    color: var(--theme-foreground-light, #aaa);
  }

  .pipeline {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .step {
    min-height: 96px;
    display: grid;
    align-content: start;
    gap: 0.25rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.65rem;
    background: color-mix(in srgb, var(--theme-yellow, #f59e0b) 10%, transparent);
  }

  .step span {
    width: 1.35rem;
    height: 1.35rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--theme-yellow, #f59e0b);
    color: var(--theme-background, #111);
    font-weight: 800;
    font-size: 0.72rem;
  }

  .toggles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .toggles label,
  .controls label {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.65rem;
    font-size: 0.82rem;
  }

  .controls {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .controls label {
    display: grid;
    grid-template-columns: 140px 1fr 52px;
    gap: 0.65rem;
    align-items: center;
  }

  input[type='range'] {
    width: 100%;
  }

  .bar {
    display: flex;
    min-height: 54px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
  }

  .bar span {
    display: grid;
    place-items: center;
    min-width: 0;
    padding: 0.4rem;
    background: color-mix(in srgb, var(--part-color) 54%, transparent);
    color: var(--theme-background, #111);
    font-size: 0.72rem;
    font-weight: 800;
    text-align: center;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
    gap: 0.55rem;
    margin-top: 0.75rem;
  }

  .cards div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .cards strong {
    display: block;
    margin-top: 0.35rem;
    color: var(--theme-yellow, #f59e0b);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    line-height: 1.35;
  }

  @media (max-width: 640px) {
    .controls label {
      grid-template-columns: 1fr;
    }

    .bar {
      flex-direction: column;
    }

    .bar span {
      width: 100% !important;
    }
  }
</style>
