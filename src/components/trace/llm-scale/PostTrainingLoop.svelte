<script>
  const modes = {
    sft: {
      label: 'Imitation',
      sampleLabel: 'labeled examples',
      signal: 'match the reference answer',
      update: 'ordinary next-token loss',
      color: 'var(--theme-cyan, #06b6d4)',
    },
    rlhf: {
      label: 'Human preference',
      sampleLabel: 'sampled answers',
      signal: 'human-trained score with a drift guardrail',
      update: 'careful preference update',
      color: 'var(--theme-green, #10b981)',
    },
    dpo: {
      label: 'Answer pairs',
      sampleLabel: 'chosen/rejected pairs',
      signal: 'make chosen answer more likely than rejected',
      update: 'direct preference loss',
      color: 'var(--theme-yellow, #f59e0b)',
    },
    grpo: {
      label: 'Group compare',
      sampleLabel: 'groups of sampled answers',
      signal: 'score each answer relative to its group',
      update: 'group-based preference update',
      color: 'var(--theme-magenta, #8b5cf6)',
    },
  }

  let mode = $state('grpo')
  let prompts = $state(512)
  let rollouts = $state(8)
  let avgTokens = $state(600)

  let selected = $derived(modes[mode])
  let sampledAnswers = $derived(mode === 'sft' || mode === 'dpo' ? prompts : prompts * rollouts)
  let generatedTokens = $derived((mode === 'sft' || mode === 'dpo' ? 0 : sampledAnswers * avgTokens))
  let comparisonUnits = $derived(mode === 'dpo' ? prompts : mode === 'grpo' ? prompts * rollouts : mode === 'rlhf' ? prompts * rollouts : 0)

  const stages = [
    ['1', 'Choose examples', 'questions, tasks, or conversations'],
    ['2', 'Produce answers', 'human labels or sampled model answers'],
    ['3', 'Score signal', 'reference, preference, reward, or verifier'],
    ['4', 'Compute loss', 'turn scores into pressure on weights'],
    ['5', 'Update policy', 'change the assistant for future serving'],
  ]
</script>

<figure class="trace-viz" aria-labelledby="post-train-title">
  <div class="header">
    <div>
      <h3 id="post-train-title">Post-Training Is a Factory for Better Future Answers</h3>
      <p>Serving runs fixed weights. Post-training changes those weights before the next deployment by turning examples, preferences, or sampled answers into update pressure.</p>
    </div>
    <div class="mode" role="group" aria-label="Post-training mode">
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
      Examples
      <input aria-label="Examples" type="range" min="128" max="2048" step="128" bind:value={prompts} />
      <span>{prompts.toLocaleString()}</span>
    </label>
    <label>
      Sampled answers per example
      <input aria-label="Sampled answers per example" type="range" min="2" max="16" step="1" bind:value={rollouts} disabled={mode === 'sft' || mode === 'dpo'} />
      <span>{mode === 'sft' || mode === 'dpo' ? 'not generated' : rollouts}</span>
    </label>
    <label>
      Avg answer pieces
      <input type="range" min="100" max="1600" step="100" bind:value={avgTokens} disabled={mode === 'sft' || mode === 'dpo'} />
      <span>{mode === 'sft' || mode === 'dpo' ? 'offline pairs' : avgTokens}</span>
    </label>
  </div>

  <div class="cards">
    <div>
      <span>Training signal</span>
      <strong>{selected.signal}</strong>
    </div>
    <div>
      <span>Items scored</span>
      <strong>{comparisonUnits.toLocaleString()}</strong>
      <small>{selected.sampleLabel}</small>
    </div>
    <div>
      <span>Generated answer pieces</span>
      <strong>{generatedTokens.toLocaleString()}</strong>
      <small>zero here means labels or pairs already exist</small>
    </div>
    <div>
      <span>Weight update</span>
      <strong>{selected.update}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: one post-training path learns from labeled answers, one learns from human preferences, one learns from chosen/rejected pairs, and one compares groups of sampled answers.
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
  small,
  .cards span {
    color: var(--theme-foreground-light, #aaa);
  }

  .mode {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: flex-end;
    max-width: 21rem;
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
    grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .stage {
    min-height: 98px;
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
    grid-template-columns: 140px 1fr 110px;
    gap: 0.7rem;
    align-items: center;
    font-size: 0.82rem;
  }

  input {
    width: 100%;
  }

  input:disabled {
    opacity: 0.45;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .cards div {
    min-height: 100px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .cards strong {
    display: block;
    margin: 0.3rem 0;
    color: var(--theme-cyan, #06b6d4);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.92rem;
    line-height: 1.35;
  }

  @media (max-width: 640px) {
    .header {
      grid-template-columns: 1fr;
    }

    .mode {
      justify-content: start;
      max-width: none;
    }

    label {
      grid-template-columns: 1fr;
    }
  }
</style>
