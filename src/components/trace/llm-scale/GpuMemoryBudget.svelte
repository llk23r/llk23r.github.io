<script>
  let paramsB = $state(70)
  let weightBytes = $state(2)
  let batch = $state(16)
  let context = $state(8192)
  let layers = $state(80)
  let kvHeads = $state(8)
  let headDim = $state(128)
  let kvBytesEach = $state(2)
  let gpuMemory = $state(80)

  let weightGiB = $derived((paramsB * 1e9 * weightBytes) / 1024 ** 3)
  let kvGiB = $derived((batch * context * layers * 2 * kvHeads * headDim * kvBytesEach) / 1024 ** 3)
  let overheadGiB = $derived(Math.max(4, weightGiB * 0.08))
  let totalGiB = $derived(weightGiB + kvGiB + overheadGiB)
  let gpusNeeded = $derived(Math.ceil(totalGiB / gpuMemory))
  let fill = $derived(Math.min(100, (totalGiB / gpuMemory) * 100))
</script>

<figure class="trace-viz" aria-labelledby="memory-title">
  <div class="header">
    <div>
      <h3 id="memory-title">The First Wall Is Memory</h3>
      <p>Weights occupy memory before the first user arrives. KV cache grows with active requests and context length.</p>
    </div>
    <div class="needed">
      <span>Minimum GPUs at {gpuMemory} GiB each</span>
      <strong>{gpusNeeded}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Parameters
      <input type="range" min="7" max="405" step="1" bind:value={paramsB} />
      <span>{paramsB}B</span>
    </label>
    <label>
      Weight bytes
      <input type="range" min="1" max="2" step="1" bind:value={weightBytes} />
      <span>{weightBytes}</span>
    </label>
    <label>
      Layers
      <input type="range" min="24" max="128" step="4" bind:value={layers} />
      <span>{layers}</span>
    </label>
    <label>
      KV heads
      <input type="range" min="4" max="32" step="4" bind:value={kvHeads} />
      <span>{kvHeads}</span>
    </label>
    <label>
      Concurrent sequences
      <input type="range" min="1" max="128" step="1" bind:value={batch} />
      <span>{batch}</span>
    </label>
    <label>
      Context tokens
      <input type="range" min="1024" max="32768" step="1024" bind:value={context} />
      <span>{context.toLocaleString()}</span>
    </label>
    <label>
      GPU memory
      <input type="range" min="24" max="192" step="8" bind:value={gpuMemory} />
      <span>{gpuMemory} GiB</span>
    </label>
  </div>

  <div class="bar" aria-label="Approximate memory budget">
    <div class="segment weights" style="width: {Math.min(100, (weightGiB / totalGiB) * fill)}%">
      <span>weights</span>
    </div>
    <div class="segment kv" style="width: {Math.min(100, (kvGiB / totalGiB) * fill)}%">
      <span>KV</span>
    </div>
    <div class="segment overhead" style="width: {Math.min(100, (overheadGiB / totalGiB) * fill)}%">
      <span>runtime</span>
    </div>
  </div>

  <div class="cards">
    <div>
      <span>Weights</span>
      <strong>{weightGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>KV cache</span>
      <strong>{kvGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Runtime overhead</span>
      <strong>{overheadGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Total</span>
      <strong>{totalGiB.toFixed(1)} GiB</strong>
    </div>
  </div>

  <p class="footnote">This is a teaching estimate, not a capacity planner. Real systems add split model pieces, temporary workspace, warmed GPU-program overhead, leftover gaps, smaller-number details, add-on weights, and safety margins.</p>

  <noscript>
    <p>
      Static fallback: serving memory is dominated by model weights plus KV cache. Weights scale with parameter count and precision; KV cache scales with concurrent sequences, context length, layers, KV heads, head dimension, and bytes per value.
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

  .header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
  }

  h3,
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

  .needed {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
    min-width: 150px;
    text-align: right;
  }

  .needed span,
  .cards span,
  .footnote {
    color: var(--theme-foreground-light, #aaa);
  }

  .needed strong {
    display: block;
    color: var(--theme-yellow, #f59e0b);
    font-size: 2rem;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 150px 1fr 92px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  label span,
  .cards strong {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .bar {
    display: flex;
    height: 2.4rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    overflow: hidden;
    background: repeating-linear-gradient(
      90deg,
      color-mix(in srgb, var(--theme-foreground, #ddd) 8%, transparent) 0,
      color-mix(in srgb, var(--theme-foreground, #ddd) 8%, transparent) 1px,
      transparent 1px,
      transparent 10%
    );
  }

  .segment {
    display: grid;
    place-items: center;
    min-width: 0;
    color: var(--theme-background, #111);
    font-size: 0.72rem;
    font-weight: 800;
    overflow: hidden;
  }

  .weights {
    background: var(--theme-cyan, #06b6d4);
  }

  .kv {
    background: var(--theme-magenta, #8b5cf6);
  }

  .overhead {
    background: var(--theme-yellow, #f59e0b);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
    margin-top: 0.35rem;
  }

  .footnote {
    margin-top: 1rem;
    font-size: 0.82rem;
  }

  @media (max-width: 760px) {
    .header,
    label {
      grid-template-columns: 1fr;
      flex-direction: column;
    }

    .needed {
      text-align: left;
    }

    .cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
