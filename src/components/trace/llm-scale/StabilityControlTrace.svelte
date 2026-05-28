<script>
  const scenarios = {
    load: {
      label: 'load spike',
      metric: 'p95 TTFT',
      observed: 1800,
      limit: 1200,
      loop: 'admission and scheduler',
      action: 'shed low-priority long prompts, protect active decodes',
    },
    quality: {
      label: 'quality drift',
      metric: 'citation faithfulness',
      observed: 84,
      limit: 93,
      loop: 'eval and rollout',
      action: 'rollback snapshot and add failing slice to evals',
    },
    safety: {
      label: 'jailbreak wave',
      metric: 'policy pass rate',
      observed: 95,
      limit: 98,
      loop: 'safety gates',
      action: 'tighten classifier, hold risky outputs, sample for red-team review',
    },
    hardware: {
      label: 'slow shard',
      metric: 'collective wait',
      observed: 80,
      limit: 35,
      loop: 'hardware health and router',
      action: 'drain replica group and route to warm capacity',
    },
  }

  let mode = $state('load')
  let traffic = $state(80)
  let current = $derived(scenarios[mode])
  let severity = $derived(Math.min(100, Math.round((traffic / 100) * (mode === 'quality' ? 70 : 95))))
  let decision = $derived(severity > 65 ? current.action : 'watch, keep canary or route weight small')
</script>

<figure class="trace-viz" aria-labelledby="stability-title">
  <div class="header">
    <div>
      <h3 id="stability-title">Stability Means Choosing the Right Control Loop</h3>
      <p>
        Pick a failure. A provider cannot fix every incident by adding GPUs; it must identify which loop owns the metric.
      </p>
    </div>
    <div class="status">
      <span>Decision</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <div class="modes" role="group" aria-label="Stability scenario">
    {#each Object.entries(scenarios) as [key, item]}
      <button type="button" class:active={mode === key} on:click={() => (mode = key)}>
        {item.label}
      </button>
    {/each}
  </div>

  <label>
    Traffic pressure
    <input aria-label="Traffic pressure" type="range" min="10" max="100" step="5" bind:value={traffic} />
    <span>{traffic}%</span>
  </label>

  <div class="grid">
    <div>
      <span>Metric</span>
      <strong>{current.metric}</strong>
    </div>
    <div>
      <span>Observed</span>
      <strong>{current.observed}</strong>
    </div>
    <div>
      <span>Guardrail</span>
      <strong>{mode === 'quality' || mode === 'safety' ? 'must stay above' : 'must stay below'} {current.limit}</strong>
    </div>
    <div>
      <span>Owning loop</span>
      <strong>{current.loop}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: production stability means mapping symptoms to the right loop: admission for load, eval for quality, safety gates for jailbreaks, hardware routing for slow shards, and rollback when a snapshot regresses.
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
    grid-template-columns: 1fr minmax(200px, 0.42fr);
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
  .grid span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .grid div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status span,
  .status strong,
  .grid span,
  .grid strong {
    display: block;
  }

  .modes {
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

  label {
    display: grid;
    grid-template-columns: 130px 1fr 64px;
    gap: 0.6rem;
    align-items: center;
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .grid strong {
    margin-top: 0.25rem;
  }

  @media (max-width: 760px) {
    .header,
    .grid,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
