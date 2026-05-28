<script>
  let paramsB = $state(70)
  let weightBytes = $state(2)
  let tensorParallel = $state(4)
  let sequences = $state(24)
  let context = $state(8192)
  let layers = $state(80)
  let kvHeads = $state(8)
  let headDim = $state(128)
  let kvBytes = $state(2)
  let gpuMemory = $state(80)

  let totalWeightGiB = $derived((paramsB * 1e9 * weightBytes) / 1024 ** 3)
  let weightPerGpuGiB = $derived(totalWeightGiB / tensorParallel)
  let totalKvGiB = $derived((sequences * context * layers * 2 * kvHeads * headDim * kvBytes) / 1024 ** 3)
  let kvPerGpuGiB = $derived(totalKvGiB / tensorParallel)
  let workspaceGiB = $derived(6 + tensorParallel * 0.75)
  let commGiB = $derived(1.5 + tensorParallel * 0.4)
  let marginGiB = $derived((weightPerGpuGiB + kvPerGpuGiB + workspaceGiB + commGiB) * 0.14)
  let perGpuGiB = $derived(weightPerGpuGiB + kvPerGpuGiB + workspaceGiB + commGiB + marginGiB)
  let freeGiB = $derived(gpuMemory - perGpuGiB)
  let fill = $derived(Math.min(100, (perGpuGiB / gpuMemory) * 100))
  let status = $derived(freeGiB >= 0 ? 'fits' : 'does not fit')

  let gpus = $derived(Array.from({ length: tensorParallel }, (_, i) => i + 1))
</script>

<figure class="trace-viz" aria-labelledby="replica-title">
  <div class="header">
    <div>
      <h3 id="replica-title">One Replica Has to Fit on Every Shard</h3>
      <p>
        Tensor parallelism splits weight work. KV placement depends on the runtime layout, and every GPU still carries buffers and safety margin.
      </p>
    </div>
    <div class:bad={freeGiB < 0} class="status">
      <span>Per-GPU placement</span>
      <strong>{status}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Parameters
      <input aria-label="Parameters" type="range" min="7" max="405" step="1" bind:value={paramsB} />
      <span>{paramsB}B</span>
    </label>
    <label>
      Weight bytes
      <input aria-label="Weight bytes" type="range" min="1" max="2" step="1" bind:value={weightBytes} />
      <span>{weightBytes}</span>
    </label>
    <label>
      TP GPUs
      <input aria-label="TP GPUs" type="range" min="1" max="8" step="1" bind:value={tensorParallel} />
      <span>{tensorParallel}</span>
    </label>
    <label>
      Active sequences
      <input aria-label="Active sequences" type="range" min="1" max="128" step="1" bind:value={sequences} />
      <span>{sequences}</span>
    </label>
    <label>
      Context tokens
      <input aria-label="Context tokens" type="range" min="1024" max="32768" step="1024" bind:value={context} />
      <span>{context.toLocaleString()}</span>
    </label>
    <label>
      GPU memory
      <input aria-label="GPU memory" type="range" min="24" max="192" step="8" bind:value={gpuMemory} />
      <span>{gpuMemory} GiB</span>
    </label>
  </div>

  <div class="node" aria-label="Tensor-parallel replica placement">
    {#each gpus as gpu}
      <div class="gpu">
        <div class="gpu-head">
          <strong>GPU {gpu}</strong>
          <span>{perGpuGiB.toFixed(1)} / {gpuMemory} GiB</span>
        </div>
        <div class="stack">
          <span class="part weights" style="width: {Math.min(100, (weightPerGpuGiB / gpuMemory) * 100)}%">
            weights
          </span>
          <span class="part kv" style="width: {Math.min(100, (kvPerGpuGiB / gpuMemory) * 100)}%">KV</span>
          <span class="part runtime" style="width: {Math.min(100, ((workspaceGiB + commGiB) / gpuMemory) * 100)}%">
            runtime
          </span>
          <span class="part margin" style="width: {Math.min(100, (marginGiB / gpuMemory) * 100)}%">margin</span>
          <span class="capacity" style="left: {Math.min(100, fill)}%"></span>
        </div>
      </div>
    {/each}
  </div>

  <div class="cards">
    <div>
      <span>Weight shard</span>
      <strong>{weightPerGpuGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>KV shard</span>
      <strong>{kvPerGpuGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Runtime + comm</span>
      <strong>{(workspaceGiB + commGiB).toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Free per GPU</span>
      <strong class:bad-text={freeGiB < 0}>{freeGiB.toFixed(1)} GiB</strong>
    </div>
  </div>

  <p class="footnote">
    Teaching model: KV cache is shown as evenly sharded by tensor-parallel degree. Real placement depends on the attention layout, runtime, quantization, allocator fragmentation, and the exact parallelism plan.
  </p>

  <noscript>
    <p>
      Static fallback: a model replica must fit weights, KV cache, workspace, communication buffers, and safety margin on every tensor-parallel GPU. Fitting raw weights alone is not enough.
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
    grid-template-columns: 1fr auto;
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
  .cards span,
  .status span,
  .gpu-head span,
  .footnote {
    color: var(--theme-foreground-light, #aaa);
  }

  .status {
    min-width: 140px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
    text-align: right;
  }

  .status strong {
    display: block;
    color: var(--theme-green, #10b981);
    text-transform: uppercase;
  }

  .status.bad strong,
  .bad-text {
    color: var(--theme-red, #ec4899);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 140px 1fr 96px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .node {
    display: grid;
    gap: 0.55rem;
  }

  .gpu {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.65rem;
  }

  .gpu-head {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.45rem;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.78rem;
  }

  .stack {
    position: relative;
    display: flex;
    height: 2rem;
    overflow: hidden;
    border-radius: 6px;
    background: color-mix(in srgb, var(--theme-foreground, #ddd) 8%, transparent);
  }

  .part {
    display: grid;
    place-items: center;
    min-width: 0;
    overflow: hidden;
    color: var(--theme-background, #111);
    font-size: 0.68rem;
    font-weight: 800;
  }

  .weights {
    background: var(--theme-cyan, #06b6d4);
  }

  .kv {
    background: var(--theme-magenta, #8b5cf6);
  }

  .runtime {
    background: var(--theme-yellow, #f59e0b);
  }

  .margin {
    background: var(--theme-red, #ec4899);
  }

  .capacity {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--theme-foreground, #ddd);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
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
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .footnote {
    margin-top: 0.75rem;
    font-size: 0.82rem;
  }

  @media (max-width: 640px) {
    .header,
    label {
      grid-template-columns: 1fr;
    }

    .status {
      text-align: left;
    }
  }
</style>
