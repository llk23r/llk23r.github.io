<script>
  const modes = {
    direct: {
      label: 'Direct',
      attempts: 1,
      hiddenTokens: 0,
      visibleTokens: 450,
      verifierPasses: 0,
      toolCalls: 0,
      description: 'one decode stream becomes the answer',
      color: 'var(--theme-cyan, #06b6d4)',
    },
    reasoning: {
      label: 'Reasoning',
      attempts: 1,
      hiddenTokens: 1800,
      visibleTokens: 450,
      verifierPasses: 0,
      toolCalls: 0,
      description: 'extra inference-time tokens are spent before the answer',
      color: 'var(--theme-green, #10b981)',
    },
    bestof: {
      label: 'Best-of-N',
      attempts: 6,
      hiddenTokens: 700,
      visibleTokens: 450,
      verifierPasses: 6,
      toolCalls: 0,
      description: 'sample several answers, score them, return one',
      color: 'var(--theme-yellow, #f59e0b)',
    },
    agent: {
      label: 'Tool loop',
      attempts: 3,
      hiddenTokens: 900,
      visibleTokens: 450,
      verifierPasses: 2,
      toolCalls: 4,
      description: 'reason, call tools, read results, continue',
      color: 'var(--theme-magenta, #8b5cf6)',
    },
  }

  let mode = $state('reasoning')
  let selected = $derived(modes[mode])
  let attempts = $state(1)
  let hiddenTokens = $state(1800)
  let visibleTokens = $state(450)
  let verifierPasses = $state(0)
  let toolCalls = $state(0)

  $effect(() => {
    attempts = selected.attempts
    hiddenTokens = selected.hiddenTokens
    visibleTokens = selected.visibleTokens
    verifierPasses = selected.verifierPasses
    toolCalls = selected.toolCalls
  })

  let generatedTokens = $derived(attempts * (hiddenTokens + visibleTokens))
  let verifierTokens = $derived(verifierPasses * 250)
  let toolLatencyMs = $derived(toolCalls * 350)
  let totalTokenWork = $derived(generatedTokens + verifierTokens)
  let latencyHint = $derived(Math.max(1, totalTokenWork / 450 + toolLatencyMs / 1000))
  let hiddenShare = $derived(totalTokenWork === 0 ? 0 : Math.round(hiddenTokens * attempts / totalTokenWork * 100))

  const stages = [
    ['1', 'Allocate budget', 'how much compute can this question spend?'],
    ['2', 'Generate work', 'reasoning tokens, candidate answers, or tool plans'],
    ['3', 'Check work', 'verifier, reward model, tests, citations, or policy'],
    ['4', 'Choose output', 'return one answer, not all internal work'],
  ]
</script>

<figure class="trace-viz" aria-labelledby="ttc-title">
  <div class="header">
    <div>
      <h3 id="ttc-title">Reasoning Is Inference-Time Compute, Not Magic</h3>
      <p>Modern reasoning systems may spend extra tokens, verifier passes, or tool calls before the final answer. The user sees one reply; the scheduler sees all the work.</p>
    </div>
    <div class="mode" role="group" aria-label="Inference-time compute mode">
      {#each Object.entries(modes) as [key, item]}
        <button type="button" class:active={mode === key} onclick={() => (mode = key)}>{item.label}</button>
      {/each}
    </div>
  </div>

  <div class="stages" style="--accent: {selected.color}">
    {#each stages as stage}
      <div class="stage">
        <span>{stage[0]}</span>
        <strong>{stage[1]}</strong>
        <small>{stage[2]}</small>
      </div>
    {/each}
  </div>

  <div class="controls">
    <label>
      Candidate attempts
      <input type="range" min="1" max="12" step="1" bind:value={attempts} />
      <span>{attempts}</span>
    </label>
    <label>
      Hidden / scratch tokens
      <input type="range" min="0" max="4000" step="100" bind:value={hiddenTokens} />
      <span>{hiddenTokens.toLocaleString()}</span>
    </label>
    <label>
      Visible answer tokens
      <input type="range" min="100" max="1200" step="50" bind:value={visibleTokens} />
      <span>{visibleTokens.toLocaleString()}</span>
    </label>
    <label>
      Verifier passes
      <input type="range" min="0" max="12" step="1" bind:value={verifierPasses} />
      <span>{verifierPasses}</span>
    </label>
    <label>
      Tool calls
      <input type="range" min="0" max="8" step="1" bind:value={toolCalls} />
      <span>{toolCalls}</span>
    </label>
  </div>

  <div class="cards">
    <div>
      <span>Mode shape</span>
      <strong>{selected.description}</strong>
    </div>
    <div>
      <span>Total token work</span>
      <strong>{totalTokenWork.toLocaleString()}</strong>
      <small>generated plus verifier estimate</small>
    </div>
    <div>
      <span>Hidden share</span>
      <strong>{hiddenShare}%</strong>
      <small>work the user may not see directly</small>
    </div>
    <div>
      <span>Latency pressure</span>
      <strong>{latencyHint.toFixed(1)}x</strong>
      <small>rough multiplier versus a 450-token direct answer</small>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: direct decoding spends one answer stream; reasoning models spend extra inference-time tokens; best-of-N samples multiple candidates and verifies them; tool loops add external-call latency and extra model passes.
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
    max-width: 18rem;
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
    background: var(--theme-green, #10b981);
    color: var(--theme-background, #111);
  }

  .stages {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .stage {
    min-height: 96px;
    display: grid;
    align-content: start;
    gap: 0.25rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.65rem;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
  }

  .stage span {
    width: 1.35rem;
    height: 1.35rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--accent);
    color: var(--theme-background, #111);
    font-weight: 800;
    font-size: 0.72rem;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
  }

  label {
    display: grid;
    grid-template-columns: 150px 1fr 92px;
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
    min-height: 98px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .cards strong {
    display: block;
    margin: 0.35rem 0;
    color: var(--theme-green, #10b981);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    line-height: 1.35;
  }

  @media (max-width: 640px) {
    .header,
    label {
      grid-template-columns: 1fr;
    }

    .mode {
      justify-content: start;
      max-width: none;
    }
  }
</style>
