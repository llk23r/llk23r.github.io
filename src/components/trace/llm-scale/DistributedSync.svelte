<script>
  const modes = {
    tensor: {
      label: 'Tensor',
      crosses: 'partial activations',
      collective: 'all-reduce / all-gather',
      waits: 'inside many layers',
      why: 'one matrix is split across GPUs',
      color: 'var(--theme-cyan, #06b6d4)',
    },
    pipeline: {
      label: 'Pipeline',
      crosses: 'activation stream',
      collective: 'send / receive',
      waits: 'between layer stages',
      why: 'different layers live on different GPUs',
      color: 'var(--theme-green, #10b981)',
    },
    data: {
      label: 'Data',
      crosses: 'gradients during training',
      collective: 'all-reduce',
      waits: 'once per training step',
      why: 'replicas must agree on one update',
      color: 'var(--theme-yellow, #f59e0b)',
    },
    expert: {
      label: 'Expert',
      crosses: 'tokens routed to experts',
      collective: 'all-to-all',
      waits: 'before and after expert MLPs',
      why: 'selected experts live on different GPUs',
      color: 'var(--theme-magenta, #8b5cf6)',
    },
  }

  let mode = $state('tensor')
  let gpus = $state(8)
  let payloadMiB = $state(64)
  let linkGBs = $state(300)

  let selected = $derived(modes[mode])
  let communicationMiB = $derived.by(() => {
    if (mode === 'pipeline') return payloadMiB
    if (mode === 'expert') return payloadMiB * Math.max(1, gpus - 1)
    return payloadMiB * 2 * (gpus - 1) / gpus
  })
  let lowerBoundMs = $derived((communicationMiB / 1024) / linkGBs * 1000)

  const chips = Array.from({ length: 8 }, (_, index) => index)
</script>

<figure class="trace-viz" aria-labelledby="sync-title">
  <div class="header">
    <div>
      <h3 id="sync-title">More GPUs Means More Waiting Places</h3>
      <p>Choose a parallelism mode. The math can be local, but the token stream often cannot continue until data crosses the interconnect.</p>
    </div>
    <div class="mode" role="group" aria-label="Parallelism mode">
      {#each Object.entries(modes) as [key, item]}
        <button type="button" class:active={mode === key} onclick={() => (mode = key)}>{item.label}</button>
      {/each}
    </div>
  </div>

  <div class="node" style="--accent: {selected.color}">
    {#each chips as chip}
      <div class:dim={chip >= gpus}>
        <span>GPU {chip}</span>
        <small>{chip < gpus ? (mode === 'pipeline' ? `layers ${chip * 10}-${chip * 10 + 9}` : mode === 'expert' ? `experts ${chip * 4}-${chip * 4 + 3}` : `shard ${chip}`) : 'unused'}</small>
      </div>
    {/each}
  </div>

  <div class="controls">
    <label>
      GPUs participating
      <input type="range" min="2" max="8" step="1" bind:value={gpus} />
      <span>{gpus}</span>
    </label>
    <label>
      Payload per sync
      <input type="range" min="8" max="256" step="8" bind:value={payloadMiB} />
      <span>{payloadMiB} MiB</span>
    </label>
    <label>
      Link bandwidth
      <input type="range" min="32" max="900" step="4" bind:value={linkGBs} />
      <span>{linkGBs} GB/s</span>
    </label>
  </div>

  <div class="cards">
    <div>
      <span>What crosses</span>
      <strong>{selected.crosses}</strong>
    </div>
    <div>
      <span>Synchronization shape</span>
      <strong>{selected.collective}</strong>
    </div>
    <div>
      <span>Where the wait appears</span>
      <strong>{selected.waits}</strong>
    </div>
    <div>
      <span>Bandwidth lower bound</span>
      <strong>{lowerBoundMs.toFixed(3)} ms</strong>
      <small>before software, topology, and queueing overhead</small>
    </div>
  </div>

  <p class="explain">
    {selected.why}. The lower bound is deliberately optimistic: real systems also pay kernel launch, routing, topology, congestion, and straggler costs.
  </p>

  <noscript>
    <p>
      Static fallback: tensor parallelism synchronizes partial layer results, pipeline parallelism sends activations between stages, data parallel training all-reduces gradients, and expert parallelism all-to-all routes tokens to selected experts.
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
  small,
  .cards span {
    color: var(--theme-foreground-light, #aaa);
  }

  .mode {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: flex-end;
  }

  button {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 6px;
    padding: 0.45rem 0.55rem;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    cursor: pointer;
    font-size: 0.78rem;
  }

  button.active {
    background: var(--theme-magenta, #8b5cf6);
    color: var(--theme-background, #111);
  }

  .node {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .node div {
    min-height: 72px;
    display: grid;
    gap: 0.25rem;
    align-content: center;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.65rem;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
  }

  .node div:not(.dim) {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent);
  }

  .node .dim {
    opacity: 0.35;
  }

  .node span,
  .cards strong,
  label span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
  }

  label {
    display: grid;
    grid-template-columns: 150px 1fr 100px;
    gap: 0.7rem;
    align-items: center;
    font-size: 0.82rem;
  }

  input {
    width: 100%;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .cards div {
    min-height: 96px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .cards strong {
    display: block;
    margin: 0.35rem 0;
    color: var(--theme-magenta, #8b5cf6);
    line-height: 1.35;
  }

  .explain {
    margin-top: 0.85rem;
  }

  @media (max-width: 640px) {
    .header {
      grid-template-columns: 1fr;
    }

    .mode {
      justify-content: start;
    }

    label {
      grid-template-columns: 1fr;
    }
  }
</style>
