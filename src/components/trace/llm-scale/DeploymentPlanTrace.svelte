<script>
  const precisionOptions = [
    { label: 'INT4', bits: 4 },
    { label: 'INT8', bits: 8 },
    { label: 'BF16', bits: 16 },
  ]

  let paramsB = $state(70)
  let precisionBits = $state(16)
  let tensorParallel = $state(4)
  let gpuGiB = $state(80)
  let concurrent = $state(48)
  let context = $state(8192)

  let weightGiB = $derived((paramsB * 1e9 * (precisionBits / 8)) / 1024 ** 3)
  let shardGiB = $derived(weightGiB / tensorParallel)
  let kvGiB = $derived((concurrent * context * 80 * 2 * 8 * 128 * 2) / 1024 ** 3)
  let kvPerRankGiB = $derived(kvGiB / tensorParallel)
  let overheadGiB = $derived(Math.max(5, shardGiB * 0.12))
  let totalPerRankGiB = $derived(shardGiB + kvPerRankGiB + overheadGiB)
  let headroomGiB = $derived(gpuGiB - totalPerRankGiB)
  let verdict = $derived.by(() => {
    if (headroomGiB < 0) return 'does not fit: reduce precision, ranks, context, or concurrency'
    if (headroomGiB < gpuGiB * 0.12) return 'fragile: little room for fragmentation and bursts'
    return 'fits with usable headroom'
  })
</script>

<figure class="trace-viz" aria-labelledby="deployment-title">
  <div class="header">
    <div>
      <h3 id="deployment-title">A 70B Deployment Plan Is a Per-Rank Budget</h3>
      <p>
        The question is not only whether the weights fit somewhere. Every rank needs weights, KV cache, workspace, buffers, and headroom at decode time.
      </p>
    </div>
    <div class:bad={headroomGiB < 0} class="status">
      <span>Verdict</span>
      <strong>{verdict}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Parameters
      <input aria-label="Parameters" type="range" min="7" max="405" step="1" bind:value={paramsB} />
      <span>{paramsB}B</span>
    </label>
    <div class="precision" role="group" aria-label="Weight precision">
      <span>Weight precision</span>
      <div>
        {#each precisionOptions as option}
          <button type="button" class:active={precisionBits === option.bits} on:click={() => (precisionBits = option.bits)}>
            {option.label}
          </button>
        {/each}
      </div>
      <small>{precisionBits / 8} bytes/weight estimate</small>
    </div>
    <label>
      Tensor-parallel ranks
      <input aria-label="Tensor parallel ranks" type="range" min="1" max="8" step="1" bind:value={tensorParallel} />
      <span>{tensorParallel}</span>
    </label>
    <label>
      GPU memory
      <input aria-label="GPU memory GiB" type="range" min="40" max="192" step="8" bind:value={gpuGiB} />
      <span>{gpuGiB} GiB</span>
    </label>
    <label>
      Active sequences
      <input aria-label="Active sequences" type="range" min="1" max="160" step="1" bind:value={concurrent} />
      <span>{concurrent}</span>
    </label>
    <label>
      Context tokens
      <input aria-label="Context tokens" type="range" min="1024" max="32768" step="1024" bind:value={context} />
      <span>{context.toLocaleString()}</span>
    </label>
  </div>

  <div class="stack" aria-label="Per rank memory stack">
    <div class="weights" style="height: {Math.min(100, (shardGiB / gpuGiB) * 100)}%">
      <span>weights</span>
    </div>
    <div class="kv" style="height: {Math.min(100, (kvPerRankGiB / gpuGiB) * 100)}%">
      <span>KV</span>
    </div>
    <div class="overhead" style="height: {Math.min(100, (overheadGiB / gpuGiB) * 100)}%">
      <span>runtime</span>
    </div>
  </div>

  <div class="readout">
    <div>
      <span>Weight shard/rank</span>
      <strong>{shardGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>KV/rank estimate</span>
      <strong>{kvPerRankGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Runtime reserve</span>
      <strong>{overheadGiB.toFixed(1)} GiB</strong>
    </div>
    <div>
      <span>Headroom/rank</span>
      <strong>{headroomGiB.toFixed(1)} GiB</strong>
    </div>
  </div>

  <p class="estimate">Teaching estimate: real deployments also depend on FP8 formats, group scales, quantization metadata, activation precision, KV-cache layout, allocator behavior, and kernel support.</p>

  <noscript>
    <p>
      Static fallback: production placement budgets memory per tensor-parallel rank: weight shard, KV cache, workspace, communication buffers, fragmentation, and headroom.
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
    grid-template-columns: 1fr minmax(220px, 0.38fr);
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
  .precision span,
  .precision small,
  .readout span,
  .estimate {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .precision,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .status.bad {
    border-color: var(--theme-yellow, #f59e0b);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 160px 1fr 100px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .precision {
    display: grid;
    grid-template-columns: 160px 1fr 130px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  .precision div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  button {
    min-height: 34px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 7px;
    padding: 0.4rem 0.65rem;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    cursor: pointer;
  }

  button.active {
    background: var(--theme-yellow, #f59e0b);
    color: var(--theme-background, #111);
  }

  .stack {
    display: flex;
    align-items: end;
    gap: 0.4rem;
    height: 96px;
    padding: 0.6rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
  }

  .stack div {
    flex: 1;
    min-height: 8px;
    display: grid;
    place-items: center;
    border-radius: 6px 6px 0 0;
    color: var(--theme-background, #111);
    font-size: 0.75rem;
    font-weight: 800;
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

  .readout {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .status strong,
  .readout strong,
  label span,
  .precision small {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .readout span,
  .readout strong {
    display: block;
  }

  .estimate {
    margin-top: 0.85rem;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  @media (max-width: 760px) {
    .header,
    .readout,
    .precision,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
