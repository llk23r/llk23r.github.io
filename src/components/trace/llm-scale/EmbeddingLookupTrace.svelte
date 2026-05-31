<script>
  const tokens = [
    { text: '<system>', id: 128006, kind: 'control' },
    { text: ' refund', id: 34952, kind: 'word piece' },
    { text: '_policy', id: 73188, kind: 'identifier piece' },
    { text: '🙂', id: 9468, kind: 'unicode / byte path' },
  ]

  let selected = $state(1)
  let hidden = $state(4096)
  let promptTokens = $state(8192)
  let bytesEach = $state(2)

  let current = $derived(tokens[selected])
  let rowBytes = $derived(hidden * bytesEach)
  let promptMiB = $derived((promptTokens * rowBytes) / 1024 ** 2)
  let tableGiB = $derived((128000 * rowBytes) / 1024 ** 3)
  let cells = $derived(Array.from({ length: 12 }, (_, index) => ((current.id * 17 + index * 101) % 2000) / 1000 - 1))
</script>

<figure class="trace-viz" aria-labelledby="embedding-title">
  <div class="header">
    <div>
      <h3 id="embedding-title">A Token Id Selects One Row of Weights</h3>
      <p>
        Text is gone now. The integer id indexes an embedding table, and that row becomes the first vector the transformer can process.
      </p>
    </div>
    <div class="status">
      <span>Selected row</span>
      <strong>{current.id}</strong>
      <small>{current.kind}</small>
    </div>
  </div>

  <div class="tokens" role="group" aria-label="Token id examples">
    {#each tokens as token, index}
      <button type="button" class:active={selected === index} onclick={() => (selected = index)}>
        {token.text}
      </button>
    {/each}
  </div>

  <div class="flow" aria-label="Embedding lookup path">
    <div>
      <span>token text</span>
      <strong>{current.text}</strong>
    </div>
    <div>
      <span>token id</span>
      <strong>{current.id}</strong>
    </div>
    <div>
      <span>embedding row</span>
      <strong>{hidden.toLocaleString()} numbers</strong>
    </div>
    <div>
      <span>prompt matrix</span>
      <strong>{promptTokens.toLocaleString()} x {hidden.toLocaleString()}</strong>
    </div>
  </div>

  <div class="vector" aria-label="Toy embedding vector values">
    {#each cells as value}
      <span style="height: {Math.abs(value) * 78 + 12}%; --sign: {value >= 0 ? 'var(--theme-cyan, #06b6d4)' : 'var(--theme-yellow, #f59e0b)'}"></span>
    {/each}
  </div>

  <div class="controls">
    <label>
      Hidden width
      <input aria-label="Hidden width" type="range" min="1024" max="16384" step="1024" bind:value={hidden} />
      <span>{hidden.toLocaleString()}</span>
    </label>
    <label>
      Prompt tokens
      <input aria-label="Prompt tokens" type="range" min="512" max="32768" step="512" bind:value={promptTokens} />
      <span>{promptTokens.toLocaleString()}</span>
    </label>
    <label>
      Bytes per number
      <input aria-label="Bytes per embedding value" type="range" min="1" max="2" step="1" bind:value={bytesEach} />
      <span>{bytesEach}</span>
    </label>
  </div>

  <div class="readout">
    <div>
      <span>One embedding row</span>
      <strong>{(rowBytes / 1024).toFixed(1)} KiB</strong>
    </div>
    <div>
      <span>Prompt matrix</span>
      <strong>{promptMiB.toFixed(1)} MiB</strong>
    </div>
    <div>
      <span>128k-row table</span>
      <strong>{tableGiB.toFixed(2)} GiB</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: token ids select rows from a learned embedding table. The selected rows form a prompt matrix with one vector per token position.
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

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(170px, 0.32fr);
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
  .status small,
  .flow span,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .flow div,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status strong,
  .flow strong,
  .readout strong,
  label span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .tokens {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 1rem 0;
  }

  button {
    min-height: 36px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 7px;
    padding: 0.45rem 0.65rem;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    cursor: pointer;
  }

  button.active {
    background: var(--theme-cyan, #06b6d4);
    color: var(--theme-background, #111);
  }

  .flow,
  .readout {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .flow span,
  .flow strong,
  .readout span,
  .readout strong {
    display: block;
  }

  .vector {
    display: flex;
    align-items: end;
    gap: 0.35rem;
    height: 96px;
    margin: 1rem 0;
    padding: 0.7rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
  }

  .vector span {
    flex: 1;
    min-width: 10px;
    border-radius: 5px 5px 0 0;
    background: var(--sign);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 140px 1fr 92px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  @media (max-width: 760px) {
    .header,
    .flow,
    .readout,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
