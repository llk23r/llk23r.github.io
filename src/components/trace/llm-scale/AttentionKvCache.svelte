<script>
  const tokens = ['When', 'many', 'people', 'chat', 'at', 'once', ',', 'the', 'server', 'batches', 'tokens']
  let target = $state(8)
  let layers = $state(80)
  let kvHeads = $state(8)
  let headDim = $state(128)
  let context = $state(4096)
  let precisionBytes = $state(2)

  function weight(row, col) {
    if (col > row) return 0
    const distance = row - col
    const recency = Math.exp(-distance / 2.4)
    const anchors = [0, 2, 3, 8, 9]
    const anchorBoost = anchors.includes(col) ? 0.45 : 0
    return Math.min(1, 0.12 + recency * 0.75 + anchorBoost)
  }

  let kvBytes = $derived(context * layers * 2 * kvHeads * headDim * precisionBytes)
  let kvGiB = $derived(kvBytes / 1024 ** 3)
  let activeWeights = $derived(tokens.map((_, i) => weight(target, i)))
</script>

<figure class="trace-viz" aria-labelledby="attention-title">
  <div class="header">
    <div>
      <h3 id="attention-title">Attention Reads the Past; KV Cache Keeps It</h3>
      <p>Pick the token being generated. It can look left, never right. The stored keys and values are why later tokens do not re-read the whole prompt from scratch.</p>
    </div>
  </div>

  <label class="control">
    Target token: <strong>{tokens[target]}</strong>
    <input type="range" min="0" max={tokens.length - 1} bind:value={target} />
  </label>

  <div class="attention-layout">
    <div class="matrix" aria-label="Causal attention heatmap">
      {#each tokens as rowToken, row}
        {#each tokens as colToken, col}
          <div
            class:future={col > row}
            class:selected={row === target}
            class:activecol={row === target && col <= row}
            style="--heat: {weight(row, col)}"
            title="{rowToken} attending to {colToken}"
          ></div>
        {/each}
      {/each}
    </div>

    <div class="readout">
      <h4>For "{tokens[target]}"</h4>
      {#each tokens as token, i}
        <div class="bar-row" class:muted={i > target}>
          <span>{token}</span>
          <div class="bar-shell">
            <div class="bar" style="width: {i <= target ? activeWeights[i] * 100 : 0}%"></div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="cache">
    <div class="sliders">
      <label>
        Context tokens
        <input type="range" min="1024" max="32768" step="1024" bind:value={context} />
        <span>{context.toLocaleString()}</span>
      </label>
      <label>
        Layers
        <input type="range" min="24" max="120" step="8" bind:value={layers} />
        <span>{layers}</span>
      </label>
      <label>
        KV heads
        <input type="range" min="4" max="32" step="4" bind:value={kvHeads} />
        <span>{kvHeads}</span>
      </label>
    </div>
    <div class="kv-number">
      <span>Approx KV cache for one sequence</span>
      <strong>{kvGiB.toFixed(2)} GiB</strong>
      <small>context × layers × 2 × KV heads × head dim × bytes</small>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: causal attention lets each generated token read earlier tokens only. The server stores prior keys and values per layer, so decode can append one new cache entry instead of recomputing the whole prompt.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 93%, var(--theme-magenta, #8b5cf6));
  }

  h3,
  h4,
  p {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }

  p {
    color: var(--theme-foreground-light, #aaa);
    line-height: 1.5;
  }

  .control {
    display: grid;
    gap: 0.45rem;
    margin: 1rem 0;
  }

  input[type='range'] {
    width: 100%;
  }

  .attention-layout {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) minmax(220px, 0.9fr);
    gap: 1rem;
    align-items: start;
  }

  .matrix {
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    gap: 3px;
    padding: 0.5rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
  }

  .matrix div {
    aspect-ratio: 1;
    border-radius: 3px;
    background: color-mix(in srgb, var(--theme-magenta, #8b5cf6) calc(var(--heat) * 90%), transparent);
    border: 1px solid color-mix(in srgb, var(--theme-magenta, #8b5cf6) 20%, transparent);
  }

  .matrix div.future {
    background: transparent;
    border-color: color-mix(in srgb, var(--theme-separator, #333) 55%, transparent);
  }

  .matrix div.selected {
    outline: 1px solid var(--theme-yellow, #f59e0b);
  }

  .matrix div.activecol {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--theme-yellow, #f59e0b) 45%, transparent);
  }

  .readout {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .readout h4 {
    margin-bottom: 0.65rem;
  }

  .bar-row {
    display: grid;
    grid-template-columns: 82px 1fr;
    gap: 0.5rem;
    align-items: center;
    margin: 0.35rem 0;
    font-size: 0.78rem;
  }

  .bar-row span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar-row.muted {
    opacity: 0.35;
  }

  .bar-shell {
    height: 0.55rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--theme-foreground, #ddd) 8%, transparent);
    overflow: hidden;
  }

  .bar {
    height: 100%;
    border-radius: inherit;
    background: var(--theme-magenta, #8b5cf6);
  }

  .cache {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .sliders,
  .kv-number {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .sliders label {
    display: grid;
    grid-template-columns: 120px 1fr 72px;
    gap: 0.5rem;
    align-items: center;
    margin: 0.4rem 0;
    font-size: 0.78rem;
  }

  .sliders span,
  .kv-number small,
  .kv-number span {
    color: var(--theme-foreground-light, #aaa);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .kv-number {
    display: grid;
    align-content: center;
    gap: 0.35rem;
  }

  .kv-number strong {
    font-size: 1.6rem;
    color: var(--theme-magenta, #8b5cf6);
  }

  @media (max-width: 760px) {
    .attention-layout,
    .cache {
      grid-template-columns: 1fr;
    }

    .sliders label {
      grid-template-columns: 1fr;
    }
  }
</style>
