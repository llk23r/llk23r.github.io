<script>
  const ranks = Array.from({ length: 8 }, (_, index) => index)
  const steps = ['input vector', 'local matmul', 'partial result', 'collective', 'complete vector']

  let activeRanks = $state(4)
  let hidden = $state(8192)
  let tokens = $state(16)
  let slowRank = $state(2)
  let step = $state(3)

  let shard = $derived(Math.ceil(hidden / activeRanks))
  let payloadMiB = $derived((tokens * hidden * 2) / 1024 ** 2)
  let collectiveMiB = $derived(payloadMiB * 2 * (activeRanks - 1) / activeRanks)
  let visibleStep = $derived(Math.min(step, steps.length - 1))
</script>

<figure class="trace-viz" aria-labelledby="tp-title">
  <div class="header">
    <div>
      <h3 id="tp-title">One Tensor-Parallel Layer Has a Waiting Point</h3>
      <p>
        Each rank owns a slice of the matrix. The layer is not done until the missing partial results cross the interconnect.
      </p>
    </div>
    <div class="status">
      <span>Current step</span>
      <strong>{steps[visibleStep]}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Tensor-parallel ranks
      <input aria-label="Tensor parallel ranks" type="range" min="2" max="8" step="1" bind:value={activeRanks} />
      <span>{activeRanks}</span>
    </label>
    <label>
      Hidden width
      <input aria-label="Hidden width" type="range" min="2048" max="16384" step="1024" bind:value={hidden} />
      <span>{hidden.toLocaleString()}</span>
    </label>
    <label>
      Tokens in microbatch
      <input aria-label="Tokens in microbatch" type="range" min="1" max="128" step="1" bind:value={tokens} />
      <span>{tokens}</span>
    </label>
    <label>
      Trace step
      <input aria-label="Tensor parallel trace step" type="range" min="0" max={steps.length - 1} step="1" bind:value={step} />
      <span>{visibleStep + 1}/{steps.length}</span>
    </label>
  </div>

  <div class="ranks" aria-label="Tensor parallel ranks">
    {#each ranks as rank}
      <div class:inactive={rank >= activeRanks} class:slow={rank === slowRank && rank < activeRanks}>
        <span>rank {rank}</span>
        <strong>{rank < activeRanks ? `${shard.toLocaleString()} cols` : 'unused'}</strong>
        <small>{rank === slowRank && rank < activeRanks ? 'straggler risk' : rank < activeRanks ? 'local shard' : 'not in group'}</small>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Per-rank weight slice</span>
      <strong>hidden x {shard.toLocaleString()}</strong>
    </div>
    <div>
      <span>Activation payload</span>
      <strong>{payloadMiB.toFixed(2)} MiB</strong>
    </div>
    <div>
      <span>Approx collective traffic</span>
      <strong>{collectiveMiB.toFixed(2)} MiB</strong>
    </div>
    <div>
      <span>Invariant</span>
      <strong>next op waits for all ranks</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: tensor parallelism splits a matrix across ranks. Local matrix multiplies produce partial tensors, then collectives assemble or reduce them before the next operation can continue.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-magenta, #8b5cf6));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(180px, 0.32fr);
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
  .ranks small,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .ranks div,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status strong,
  .ranks strong,
  .readout strong,
  label span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 160px 1fr 95px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .ranks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.55rem;
  }

  .ranks div {
    min-height: 82px;
    background: color-mix(in srgb, var(--theme-magenta, #8b5cf6) 12%, transparent);
  }

  .ranks .slow {
    border-color: var(--theme-yellow, #f59e0b);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--theme-yellow, #f59e0b) 55%, transparent);
  }

  .ranks .inactive {
    opacity: 0.35;
  }

  .ranks span,
  .ranks strong,
  .ranks small,
  .readout span,
  .readout strong {
    display: block;
  }

  .readout {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  @media (max-width: 760px) {
    .header,
    .readout,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
