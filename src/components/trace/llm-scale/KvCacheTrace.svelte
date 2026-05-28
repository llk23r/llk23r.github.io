<script>
  let promptTokens = $state(4096)
  let generatedTokens = $state(512)
  let activeSequences = $state(24)
  let layers = $state(80)
  let kvHeads = $state(8)
  let headDim = $state(128)
  let bytes = $state(2)

  let tokensPerSeq = $derived(promptTokens + generatedTokens)
  let bytesPerSeq = $derived(tokensPerSeq * layers * 2 * kvHeads * headDim * bytes)
  let gibPerSeq = $derived(bytesPerSeq / 1024 ** 3)
  let totalGib = $derived((bytesPerSeq * activeSequences) / 1024 ** 3)
  let pageCount = $derived(Math.ceil(tokensPerSeq / 16) * activeSequences)
  let decodeWorkSaved = $derived(Math.max(0, generatedTokens - 1) * promptTokens)
</script>

<figure class="trace-viz" aria-labelledby="kv-trace-title">
  <div class="header">
    <div>
      <h3 id="kv-trace-title">KV Cache Turns Recompute into Memory</h3>
      <p>
        Change context, concurrency, and KV-head count. The cache makes decode feasible by storing past keys and values, but it spends GPU memory for every active sequence.
      </p>
    </div>
    <div class="status">
      <span>Total KV memory</span>
      <strong>{totalGib.toFixed(1)} GiB</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Prompt tokens
      <input aria-label="KV prompt tokens" type="range" min="512" max="32768" step="512" bind:value={promptTokens} />
      <span>{promptTokens.toLocaleString()}</span>
    </label>
    <label>
      Generated tokens
      <input aria-label="KV generated tokens" type="range" min="64" max="4096" step="64" bind:value={generatedTokens} />
      <span>{generatedTokens.toLocaleString()}</span>
    </label>
    <label>
      Active sequences
      <input aria-label="KV active sequences" type="range" min="1" max="96" step="1" bind:value={activeSequences} />
      <span>{activeSequences}</span>
    </label>
    <label>
      Layers
      <input aria-label="KV model layers" type="range" min="24" max="128" step="4" bind:value={layers} />
      <span>{layers}</span>
    </label>
    <label>
      KV heads
      <input aria-label="KV heads" type="range" min="1" max="32" step="1" bind:value={kvHeads} />
      <span>{kvHeads}</span>
    </label>
  </div>

  <div class="formula">
    <code>tokens x layers x 2 x kv_heads x head_dim x bytes</code>
    <span>The 2 is one key tensor plus one value tensor per layer.</span>
  </div>

  <div class="readout">
    <div>
      <span>Tokens per sequence</span>
      <strong>{tokensPerSeq.toLocaleString()}</strong>
    </div>
    <div>
      <span>KV per sequence</span>
      <strong>{gibPerSeq.toFixed(2)} GiB</strong>
    </div>
    <div>
      <span>Logical 16-token pages</span>
      <strong>{pageCount.toLocaleString()}</strong>
    </div>
    <div>
      <span>Approx prompt-token recompute avoided</span>
      <strong>{decodeWorkSaved.toLocaleString()}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: KV-cache memory scales with tokens, layers, key/value tensors, KV heads, head dimension, bytes per value, and active sequences. It saves repeated prefill work by storing past keys and values, but it makes concurrency memory-bound.
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
    display: grid;
    grid-template-columns: 1fr minmax(150px, 0.3fr);
    gap: 1rem;
    align-items: start;
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
  .status span,
  .formula span,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .formula,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status span,
  .status strong,
  .formula code,
  .formula span,
  .readout span,
  .readout strong {
    display: block;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 145px 1fr 86px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  code {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    overflow-wrap: anywhere;
  }

  .formula span {
    margin-top: 0.35rem;
  }

  .readout {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .readout strong {
    margin-top: 0.25rem;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  @media (max-width: 760px) {
    .header,
    .readout,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
