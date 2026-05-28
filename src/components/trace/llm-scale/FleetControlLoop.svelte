<script>
  const scenarios = {
    quality: {
      label: 'Quality',
      signal: 'citation faithfulness',
      base: 96,
      bad: 82,
      threshold: 92,
      direction: 'min',
      action: 'rollback model snapshot; keep runtime unchanged',
    },
    latency: {
      label: 'Latency',
      signal: 'p95 TTFT ms',
      base: 820,
      bad: 1420,
      threshold: 1100,
      direction: 'max',
      action: 'lower canary weight or rollback runtime',
    },
    safety: {
      label: 'Safety',
      signal: 'policy pass rate',
      base: 99,
      bad: 94,
      threshold: 98,
      direction: 'min',
      action: 'pause snapshot; tighten policy/eval loop',
    },
    hardware: {
      label: 'Bad GPU',
      signal: 'NCCL wait ms',
      base: 12,
      bad: 86,
      threshold: 35,
      direction: 'max',
      action: 'evict replica group and route to warm capacity',
    },
  }

  let mode = $state('quality')
  let canary = $state(5)
  let minutes = $state(18)
  let current = $derived(scenarios[mode])
  let trafficSamples = $derived(Math.round(canary * minutes * 42))
  let confidence = $derived(Math.min(100, Math.round((trafficSamples / 2600) * 100)))
  let observed = $derived.by(() => {
    const mix = Math.min(1, canary / 25 + minutes / 60)
    return current.base + (current.bad - current.base) * mix
  })
  let healthy = $derived(current.direction === 'min' ? observed >= current.threshold : observed <= current.threshold)
  let phase = $derived.by(() => {
    if (minutes < 5) return 2
    if (canary < 1) return 3
    if (confidence < 35) return 4
    return healthy ? 5 : 6
  })
  let decision = $derived.by(() => {
    if (confidence < 35) return 'keep canary small; not enough signal yet'
    if (healthy) return 'promote gradually and keep monitoring by snapshot'
    return current.action
  })

  const loop = [
    ['1', 'candidate snapshot', 'weights, tokenizer, runtime config'],
    ['2', 'offline evals', 'known regressions and adversarial cases'],
    ['3', 'shadow traffic', 'real prompts, hidden answers'],
    ['4', 'canary', 'small visible traffic slice'],
    ['5', 'promote', 'increase routing weight'],
    ['6', 'rollback', 'drain streams and restore previous target'],
  ]
</script>

<figure class="trace-viz" aria-labelledby="fleet-title">
  <div class="header">
    <div>
      <h3 id="fleet-title">A Canary Is a Control Loop</h3>
      <p>
        Change traffic share and elapsed time. The fleet needs enough signal before it promotes or rolls back.
      </p>
    </div>
    <div class="modes" role="group" aria-label="Fleet scenario">
      {#each Object.entries(scenarios) as [key, scenario]}
        <button type="button" class:active={mode === key} on:click={() => (mode = key)}>
          {scenario.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="controls">
    <label>
      Canary traffic
      <input aria-label="Canary traffic" type="range" min="0" max="25" step="1" bind:value={canary} />
      <span>{canary}%</span>
    </label>
    <label>
      Minutes observed
      <input aria-label="Minutes observed" type="range" min="1" max="60" step="1" bind:value={minutes} />
      <span>{minutes}</span>
    </label>
  </div>

  <div class="loop">
    {#each loop as step, i}
      <div class:active={phase === i + 1} class:done={phase > i + 1}>
        <span>{step[0]}</span>
        <strong>{step[1]}</strong>
        <small>{step[2]}</small>
      </div>
    {/each}
  </div>

  <div class="incident">
    <div>
      <span>Signal</span>
      <strong>{current.signal}</strong>
    </div>
    <div>
      <span>Observed</span>
      <strong>{observed.toFixed(mode === 'latency' || mode === 'hardware' ? 0 : 1)}</strong>
    </div>
    <div>
      <span>Guardrail</span>
      <strong>{current.direction === 'min' ? 'must stay above' : 'must stay below'} {current.threshold}</strong>
    </div>
    <div>
      <span>Samples</span>
      <strong>{trafficSamples.toLocaleString()} ({confidence}% confidence hint)</strong>
    </div>
    <div class="wide">
      <span>Control action</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: production LLM fleets use offline evals, shadow traffic, canaries, online metrics, and rollback controls to separate model-quality regressions from serving or hardware regressions.
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
  .incident span {
    color: var(--theme-foreground-light, #aaa);
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: flex-end;
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
    background: var(--theme-yellow, #f59e0b);
    color: var(--theme-background, #111);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 140px 1fr 64px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .loop {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.55rem;
    margin: 1rem 0;
  }

  .loop div,
  .incident div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .loop div {
    opacity: 0.55;
  }

  .loop div.done,
  .loop div.active {
    opacity: 1;
  }

  .loop div.active {
    background: color-mix(in srgb, var(--theme-yellow, #f59e0b) 16%, transparent);
  }

  .loop span {
    width: 1.35rem;
    height: 1.35rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--theme-yellow, #f59e0b);
    color: var(--theme-background, #111);
    font-weight: 800;
    font-size: 0.72rem;
  }

  .loop strong,
  .incident strong {
    display: block;
    margin-top: 0.35rem;
    line-height: 1.35;
  }

  .incident {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
    gap: 0.55rem;
  }

  .incident strong {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .incident .wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 640px) {
    .header,
    label {
      grid-template-columns: 1fr;
    }

    .modes {
      justify-content: flex-start;
    }
  }
</style>
