<script>
  const stages = [
    ['snapshot copied', 'weights and tokenizer land in model storage'],
    ['canary warm', 'small replica group loads and passes health checks'],
    ['shadow compare', 'real prompts run without exposing answers'],
    ['traffic shift', 'router sends a small percentage to the new snapshot'],
    ['guardrail check', 'quality, safety, latency, KV, and errors are compared'],
    ['commit or rollback', 'increase weight or drain the bad group'],
  ]

  let stage = $state(2)
  let traffic = $state(5)
  let qualityDelta = $state(-1)
  let latencyDelta = $state(6)
  let safetyDelta = $state(0)

  let visibleStage = $derived(Math.min(stage, stages.length - 1))
  let healthy = $derived(qualityDelta >= -2 && latencyDelta <= 15 && safetyDelta >= -1)
  let decision = $derived.by(() => {
    if (!healthy) return 'hold or rollback'
    if (visibleStage < 4) return 'keep observing'
    return traffic >= 50 ? 'commit rollout' : 'increase traffic slowly'
  })
</script>

<figure class="trace-viz" aria-labelledby="rollout-title">
  <div class="header">
    <div>
      <h3 id="rollout-title">A Fleet Change Is a Controlled Experiment</h3>
      <p>
        A new model snapshot must prove both behavior and serving health before it becomes the default route.
      </p>
    </div>
    <div class:bad={!healthy} class="status">
      <span>Decision</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Rollout stage
      <input aria-label="Rollout stage" type="range" min="0" max={stages.length - 1} step="1" bind:value={stage} />
      <span>{visibleStage + 1}/{stages.length}</span>
    </label>
    <label>
      Traffic weight
      <input aria-label="Traffic weight percent" type="range" min="0" max="100" step="1" bind:value={traffic} />
      <span>{traffic}%</span>
    </label>
    <label>
      Quality delta
      <input aria-label="Quality delta" type="range" min="-10" max="10" step="1" bind:value={qualityDelta} />
      <span>{qualityDelta}</span>
    </label>
    <label>
      Latency delta
      <input aria-label="Latency delta percent" type="range" min="-20" max="40" step="1" bind:value={latencyDelta} />
      <span>{latencyDelta}%</span>
    </label>
    <label>
      Safety delta
      <input aria-label="Safety delta" type="range" min="-5" max="5" step="1" bind:value={safetyDelta} />
      <span>{safetyDelta}</span>
    </label>
  </div>

  <div class="timeline" aria-label="Fleet rollout timeline">
    {#each stages as item, index}
      <div class:active={index === visibleStage} class:done={index < visibleStage}>
        <span>{item[0]}</span>
        <strong>{item[1]}</strong>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Behavior health</span>
      <strong>{qualityDelta >= -2 && safetyDelta >= -1 ? 'inside guardrail' : 'regression'}</strong>
    </div>
    <div>
      <span>Serving health</span>
      <strong>{latencyDelta <= 15 ? 'inside guardrail' : 'too slow'}</strong>
    </div>
    <div>
      <span>Route action</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: fleet rollouts copy a snapshot, warm canaries, shadow compare, shift traffic, check guardrails, then commit or roll back.
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
    grid-template-columns: 1fr minmax(200px, 0.34fr);
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
  .timeline span,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .timeline div,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
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
    grid-template-columns: 140px 1fr 78px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .timeline {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .timeline div {
    min-height: 112px;
  }

  .timeline .done {
    background: color-mix(in srgb, var(--theme-cyan, #06b6d4) 10%, transparent);
  }

  .timeline .active {
    border-color: var(--theme-cyan, #06b6d4);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--theme-cyan, #06b6d4) 55%, transparent);
  }

  .timeline span,
  .timeline strong,
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

  @media (max-width: 900px) {
    .header,
    .timeline,
    .readout,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
