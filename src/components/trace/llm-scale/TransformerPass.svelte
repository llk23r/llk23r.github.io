<script>
  let tokenCount = $state(2048)
  let hidden = $state(8192)
  let layers = $state(80)
  let heads = $state(64)
  let kvHeads = $state(8)

  let attentionCells = $derived(tokenCount * tokenCount)
  let activationGiB = $derived((tokenCount * hidden * 2) / 1024 ** 3)
  let kvGiB = $derived((tokenCount * layers * 2 * kvHeads * (hidden / heads) * 2) / 1024 ** 3)

  const blocks = [
    ['Embeddings', 'token id -> vector'],
    ['Attention', 'compare queries with keys'],
    ['MLP', 'transform each position'],
    ['Logits', 'vector -> vocabulary scores'],
    ['Sampler', 'scores -> one next token'],
  ]
</script>

<figure class="trace-viz" aria-labelledby="pass-title">
  <div class="header">
    <div>
      <h3 id="pass-title">One Forward Pass Has Two Different Costs</h3>
      <p>Prefill pays to read many prompt positions at once. Decode pays less compute per step, but it must repeat once for every generated token.</p>
    </div>
  </div>

  <div class="pipeline" aria-label="Transformer forward pass">
    {#each blocks as block, i}
      <div class="block">
        <span class="num">{i + 1}</span>
        <strong>{block[0]}</strong>
        <small>{block[1]}</small>
      </div>
    {/each}
  </div>

  <div class="controls">
    <label>
      Prompt tokens
      <input type="range" min="512" max="32768" step="512" bind:value={tokenCount} />
      <span>{tokenCount.toLocaleString()}</span>
    </label>
    <label>
      Hidden width
      <input type="range" min="2048" max="16384" step="1024" bind:value={hidden} />
      <span>{hidden.toLocaleString()}</span>
    </label>
    <label>
      Layers
      <input type="range" min="24" max="128" step="4" bind:value={layers} />
      <span>{layers}</span>
    </label>
  </div>

  <div class="cards">
    <div>
      <span>Attention score cells in prefill</span>
      <strong>{attentionCells.toLocaleString()}</strong>
      <small>tokens × tokens before kernels optimize memory traffic</small>
    </div>
    <div>
      <span>One activation matrix</span>
      <strong>{activationGiB.toFixed(2)} GiB</strong>
      <small>tokens × hidden × 2 bytes</small>
    </div>
    <div>
      <span>KV cache after prefill</span>
      <strong>{kvGiB.toFixed(2)} GiB</strong>
      <small>tokens × layers × K/V × KV heads × head dim</small>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: prefill processes all prompt tokens and creates KV cache; decode repeats the same transformer stack one generated token at a time.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-cyan, #06b6d4));
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
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .block {
    min-height: 92px;
    display: grid;
    align-content: start;
    gap: 0.25rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.65rem;
    background: color-mix(in srgb, var(--theme-cyan, #06b6d4) 10%, transparent);
  }

  .num {
    width: 1.3rem;
    height: 1.3rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--theme-cyan, #06b6d4);
    color: var(--theme-background, #111);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
  }

  label {
    display: grid;
    grid-template-columns: 130px 1fr 84px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.82rem;
  }

  input {
    width: 100%;
  }

  label span,
  .cards strong {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .cards div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .cards strong {
    display: block;
    margin: 0.35rem 0;
    color: var(--theme-cyan, #06b6d4);
    font-size: 1.05rem;
  }

  @media (max-width: 760px) {
    .pipeline,
    .cards {
      grid-template-columns: 1fr;
    }

    label {
      grid-template-columns: 1fr;
    }
  }
</style>
