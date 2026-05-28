<script>
  const incidents = {
    capacity: {
      label: 'KV capacity spike',
      metric: 'KV occupancy',
      guardrail: 'stay below 82%',
      steps: [
        ['leading signal', 'long-context traffic pushes KV blocks toward the guardrail'],
        ['local symptom', 'time to first token rises while inter-token latency is still normal'],
        ['control action', 'admit short prompts, cap output, shed low-priority long requests'],
        ['recovery check', 'KV occupancy falls and active streams finish instead of timing out'],
      ],
    },
    quality: {
      label: 'RAG quality regression',
      metric: 'citation faithfulness',
      guardrail: 'stay above eval threshold',
      steps: [
        ['leading signal', 'regeneration rises for table-heavy multilingual answers'],
        ['local symptom', 'serving metrics look healthy but cited claims are unsupported'],
        ['control action', 'rollback snapshot or retrieval change, then add the slice to evals'],
        ['recovery check', 'judge and human audits agree that cited claims match sources'],
      ],
    },
    hardware: {
      label: 'slow tensor rank',
      metric: 'collective wait time',
      guardrail: 'stay below shard baseline',
      steps: [
        ['leading signal', 'one rank reports longer kernel or link wait than peers'],
        ['local symptom', 'every token waits at the same collective barrier'],
        ['control action', 'drain the replica group and route to warm healthy capacity'],
        ['recovery check', 'p95 inter-token latency returns before traffic weight increases'],
      ],
    },
    safety: {
      label: 'jailbreak wave',
      metric: 'policy violation rate',
      guardrail: 'stay below policy threshold',
      steps: [
        ['leading signal', 'input classifier and red-team probes cluster on one tactic'],
        ['local symptom', 'unsafe continuations appear after otherwise benign prefixes'],
        ['control action', 'tighten input/output gates, patch prompts, collect examples'],
        ['recovery check', 'false negatives fall without collapsing helpful allowed answers'],
      ],
    },
  }

  let mode = $state('capacity')
  let step = $state(1)

  let current = $derived(incidents[mode])
  let visibleStep = $derived(Math.min(step, current.steps.length - 1))
</script>

<figure class="trace-viz" aria-labelledby="incident-timeline-title">
  <div class="header">
    <div>
      <h3 id="incident-timeline-title">One Incident Is a Timeline, Not a Vibe</h3>
      <p>
        Pick an incident and move through it. The provider has to name the first metric, the owning loop, the action, and the recovery check.
      </p>
    </div>
    <div class="status">
      <span>Guardrail</span>
      <strong>{current.metric}</strong>
      <small>{current.guardrail}</small>
    </div>
  </div>

  <div class="modes" role="group" aria-label="Incident type">
    {#each Object.entries(incidents) as [key, incident]}
      <button type="button" class:active={mode === key} on:click={() => (mode = key)}>
        {incident.label}
      </button>
    {/each}
  </div>

  <label>
    Incident step
    <input aria-label="Incident step" type="range" min="0" max={current.steps.length - 1} step="1" bind:value={step} />
    <span>{visibleStep + 1}/{current.steps.length}</span>
  </label>

  <div class="timeline" aria-label="Incident timeline">
    {#each current.steps as item, index}
      <div class:active={index === visibleStep} class:done={index < visibleStep}>
        <span>{item[0]}</span>
        <strong>{item[1]}</strong>
      </div>
    {/each}
  </div>

  <div class="lesson">
    <strong>Operational invariant:</strong> a fix is only real when the owning metric moves and the recovery check passes. Otherwise the system may just have moved harm to another layer.
  </div>

  <noscript>
    <p>
      Static fallback: production stability traces incidents as timelines: leading signal, local symptom, control action, and recovery check.
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
    grid-template-columns: 1fr minmax(190px, 0.34fr);
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
  .timeline span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .timeline div,
  .lesson {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .status span,
  .status strong,
  .status small,
  .timeline span,
  .timeline strong {
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
    background: var(--theme-green, #10b981);
    color: var(--theme-background, #111);
  }

  label {
    display: grid;
    grid-template-columns: 130px 1fr 70px;
    gap: 0.6rem;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .timeline {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .timeline div {
    min-height: 118px;
  }

  .timeline .done {
    background: color-mix(in srgb, var(--theme-green, #10b981) 12%, transparent);
  }

  .timeline .active {
    border-color: var(--theme-green, #10b981);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--theme-green, #10b981) 55%, transparent);
  }

  .lesson {
    margin-top: 1rem;
  }

  @media (max-width: 760px) {
    .header,
    .timeline,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
