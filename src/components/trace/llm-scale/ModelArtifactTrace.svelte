<script>
  const stages = [
    {
      label: 'recipe',
      action: 'read model recipe, text-splitting rule, chat format, split plan',
      failure: 'wrong text-piece count or unsupported setting',
    },
    {
      label: 'pieces',
      action: 'check table names, shapes, number formats, fingerprints',
      failure: 'missing model piece or shape mismatch',
    },
    {
      label: 'arrange',
      action: 'repack learned numbers for GPU programs',
      failure: 'number format not supported',
    },
    {
      label: 'GPU memory',
      action: 'copy learned numbers into GPU memory and save workspace',
      failure: 'not enough room for remembered tokens',
    },
    {
      label: 'ready',
      action: 'run test work and mark replica healthy',
      failure: 'cold route delays first answer piece',
    },
  ]

  let step = $state(2)
  let paramsB = $state(70)
  let tensorParallel = $state(4)
  let bytesEach = $state(2)

  let visibleStep = $derived(Math.min(step, stages.length - 1))
  let totalGiB = $derived((paramsB * 1e9 * bytesEach) / 1024 ** 3)
  let perRankGiB = $derived(totalGiB / tensorParallel)
</script>

<figure class="trace-viz" aria-labelledby="artifact-title">
  <div class="header">
    <div>
      <h3 id="artifact-title">A Model Artifact Becomes a Live Replica</h3>
      <p>
        A snapshot is not serving-ready until its files, recipe, layout, memory, and health checks agree.
      </p>
    </div>
    <div class="status">
      <span>Now checking</span>
      <strong>{stages[visibleStep].label}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Warmup step
      <input aria-label="Artifact warmup step" type="range" min="0" max={stages.length - 1} step="1" bind:value={step} />
      <span>{visibleStep + 1}/{stages.length}</span>
    </label>
    <label>
      Parameters
      <input aria-label="Parameter count" type="range" min="7" max="405" step="1" bind:value={paramsB} />
      <span>{paramsB}B</span>
    </label>
    <label>
      GPU workers
      <input aria-label="GPU workers" type="range" min="1" max="8" step="1" bind:value={tensorParallel} />
      <span>{tensorParallel}</span>
    </label>
    <label>
      Bytes per weight
      <input aria-label="Bytes per weight" type="range" min="1" max="2" step="1" bind:value={bytesEach} />
      <span>{bytesEach}</span>
    </label>
  </div>

  <div class="steps" aria-label="Artifact warmup stages">
    {#each stages as item, index}
      <div class:active={index === visibleStep} class:done={index < visibleStep}>
        <span>{item.label}</span>
        <strong>{item.action}</strong>
        <small>{item.failure}</small>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Total raw weights</span>
      <strong>{totalGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Per-worker piece</span>
      <strong>{perRankGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Serving invariant</span>
      <strong>all workers ready or no route</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: a model snapshot becomes live only after recipe checks, model-piece verification, layout packing, GPU-memory loading, workspace allocation, and health registration.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-green, #10b981));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(180px, 0.3fr);
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
  .steps span,
  .steps small,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .steps div,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 160px 1fr 90px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .steps div {
    min-height: 138px;
  }

  .steps .done {
    background: color-mix(in srgb, var(--theme-green, #10b981) 10%, transparent);
  }

  .steps .active {
    border-color: var(--theme-green, #10b981);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--theme-green, #10b981) 55%, transparent);
  }

  .steps span,
  .steps strong,
  .steps small,
  .readout span,
  .readout strong {
    display: block;
  }

  .status strong,
  .readout strong,
  label span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .readout {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  @media (max-width: 860px) {
    .header,
    .steps,
    .readout,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
