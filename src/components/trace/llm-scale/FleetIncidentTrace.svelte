<script>
  const incidents = {
    citation: {
      label: 'citation regression',
      user: 'answers sound fluent but cited tables do not support the claim',
      metric: 'citation faithfulness 96 -> 82',
      owner: 'eval and model rollout loop',
      action: 'rollback snapshot, add table-heavy multilingual eval slice',
      seen: 'some users see wrong sourced answers before canary stops',
    },
    gpu: {
      label: 'slow GPU shard',
      user: 'first token arrives late only on a subset of conversations',
      metric: 'tensor-parallel all-reduce wait 12 ms -> 86 ms',
      owner: 'hardware health and router loop',
      action: 'evict replica group, drain streams, replace GPU',
      seen: 'latency spike without a quality change',
    },
    safety: {
      label: 'safety bypass',
      user: 'a jailbreak pattern gets unsafe text through one path',
      metric: 'policy pass rate 99.2 -> 94.0',
      owner: 'safety eval, policy, output gate loop',
      action: 'pause route, tighten classifier, add red-team case',
      seen: 'some outputs are held or replaced while checks run',
    },
    kv: {
      label: 'KV storm',
      user: 'long-context users get queued or downgraded',
      metric: 'KV occupancy 71% -> 96%',
      owner: 'admission, scheduler, KV allocator loop',
      action: 'lower max output, chunk prefill, shed low-priority traffic',
      seen: 'capacity errors protect already-admitted streams',
    },
  }

  const stages = ['symptom', 'metric', 'owner', 'action', 'user-visible result']

  let mode = $state('citation')
  let stage = $state(1)
  let incident = $derived(incidents[mode])
  let facts = $derived([incident.user, incident.metric, incident.owner, incident.action, incident.seen])
</script>

<figure class="trace-viz" aria-labelledby="incident-title">
  <div class="header">
    <div>
      <h3 id="incident-title">Production Debugging Finds the Owning Loop</h3>
      <p>
        Pick a teaching incident and move through the trace. The fix depends on whether the failure belongs to weights, serving, safety, or memory pressure.
      </p>
    </div>
    <div class="modes" role="group" aria-label="Incident type">
      {#each Object.entries(incidents) as [key, item]}
        <button type="button" class:active={mode === key} onclick={() => (mode = key)}>
          {item.label}
        </button>
      {/each}
    </div>
  </div>

  <label>
    Incident trace
    <input aria-label="Incident trace stage" type="range" min="0" max={stages.length - 1} step="1" bind:value={stage} />
    <span>{stage + 1}/{stages.length}</span>
  </label>

  <div class="timeline" aria-label="Incident trace timeline">
    {#each stages as name, index}
      <div class:active={stage === index} class:done={stage > index}>
        <span>{index + 1}</span>
        <strong>{name}</strong>
        <small>{facts[index]}</small>
      </div>
    {/each}
  </div>

  <div class="frame">
    <span>Current question</span>
    <strong>{stages[stage]}</strong>
    <p>{facts[stage]}</p>
  </div>

  <noscript>
    <p>
      Static fallback: production LLM incidents must be traced from user symptom to metric, owning loop, control action, and user-visible result. Quality regressions, bad GPUs, safety bypasses, and KV-cache storms have different fixes.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-pink, #ec4899));
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
  .frame span {
    color: var(--theme-foreground-light, #aaa);
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.35rem;
    max-width: 400px;
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
    background: var(--theme-pink, #ec4899);
    color: var(--theme-background, #111);
  }

  label {
    display: grid;
    grid-template-columns: 120px 1fr 64px;
    gap: 0.6rem;
    align-items: center;
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .timeline {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .timeline div,
  .frame {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .timeline div {
    min-height: 128px;
  }

  .timeline span {
    display: inline-grid;
    width: 1.4rem;
    height: 1.4rem;
    place-items: center;
    margin-bottom: 0.45rem;
    border-radius: 999px;
    background: var(--theme-separator, #333);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.7rem;
  }

  .timeline div.done span,
  .timeline div.active span {
    background: var(--theme-pink, #ec4899);
    color: var(--theme-background, #111);
  }

  .timeline strong,
  .timeline small,
  .frame span,
  .frame strong {
    display: block;
  }

  .timeline small {
    margin-top: 0.4rem;
    line-height: 1.35;
  }

  .frame {
    margin-top: 1rem;
  }

  .frame strong {
    margin: 0.2rem 0 0.35rem;
  }

  @media (max-width: 840px) {
    .header,
    .timeline {
      grid-template-columns: 1fr;
    }

    .modes {
      justify-content: flex-start;
    }

    label {
      grid-template-columns: 1fr;
    }

    .timeline div {
      min-height: auto;
    }
  }
</style>
