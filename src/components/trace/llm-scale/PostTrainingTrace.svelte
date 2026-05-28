<script>
  const modes = {
    sft: {
      label: 'SFT',
      signal: 'human-written target answer',
      loss: 'imitate the target tokens',
      risk: 'copies format but may not learn preference boundaries',
    },
    dpo: {
      label: 'DPO',
      signal: 'preferred answer beats rejected answer',
      loss: 'raise preferred probability relative to rejected',
      risk: 'depends on pair quality and reference behavior',
    },
    rlhf: {
      label: 'RLHF / PPO',
      signal: 'reward model score plus KL guardrail',
      loss: 'sample rollout, score it, update policy cautiously',
      risk: 'reward hacking or unstable policy updates',
    },
    grpo: {
      label: 'GRPO-style',
      signal: 'group of rollouts compared against each other',
      loss: 'improve answers that beat their group baseline',
      risk: 'group quality and verifier coverage dominate',
    },
  }

  const steps = [
    ['prompt', 'A training prompt asks for helpful behavior, tool use, refusal, math, or citation.'],
    ['rollouts', 'The current model or humans produce candidate answers.'],
    ['signal', 'A target, preference, reward, verifier, or principle turns behavior into supervision.'],
    ['loss', 'Training code converts that signal into a number to minimize.'],
    ['update', 'Gradients nudge a copy of the model weights.'],
    ['eval gate', 'Offline evals, red-team cases, and canaries decide whether this snapshot can serve users.'],
  ]

  let mode = $state('dpo')
  let step = $state(2)
  let current = $derived(modes[mode])
  let visibleStep = $derived(Math.min(step, steps.length - 1))
</script>

<figure class="trace-viz" aria-labelledby="post-training-trace-title">
  <div class="header">
    <div>
      <h3 id="post-training-trace-title">One Prompt Becomes a Post-Training Signal</h3>
      <p>
        Pick the training recipe and move through the path. The deployed assistant is shaped by these loops before your request arrives.
      </p>
    </div>
    <div class="modes" role="group" aria-label="Post-training recipe">
      {#each Object.entries(modes) as [key, item]}
        <button type="button" class:active={mode === key} on:click={() => (mode = key)}>
          {item.label}
        </button>
      {/each}
    </div>
  </div>

  <label>
    Training step
    <input aria-label="Training step" type="range" min="0" max={steps.length - 1} step="1" bind:value={step} />
    <span>{visibleStep + 1}/{steps.length}</span>
  </label>

  <div class="rail" aria-label="Post-training path">
    {#each steps as item, index}
      <div class:done={visibleStep > index} class:active={visibleStep === index}>
        <span>{index + 1}</span>
        <strong>{item[0]}</strong>
        <small>{item[1]}</small>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Supervision signal</span>
      <strong>{current.signal}</strong>
    </div>
    <div>
      <span>What the loss tries to do</span>
      <strong>{current.loss}</strong>
    </div>
    <div>
      <span>Failure to test</span>
      <strong>{current.risk}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: post-training turns prompts and candidate answers into targets, preferences, rewards, verifier results, or principles. Those signals become losses, losses become weight updates, and eval gates decide whether a snapshot is deployable.
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
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.35rem;
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
    grid-template-columns: 120px 1fr 64px;
    gap: 0.6rem;
    align-items: center;
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .rail,
  .readout {
    display: grid;
    gap: 0.55rem;
  }

  .rail {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .readout {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 1rem;
  }

  .rail div,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .rail div {
    min-height: 118px;
  }

  .rail div span {
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

  .rail div.done span,
  .rail div.active span {
    background: var(--theme-green, #10b981);
    color: var(--theme-background, #111);
  }

  .rail strong,
  .rail small,
  .readout span,
  .readout strong {
    display: block;
  }

  .rail small,
  .readout strong {
    margin-top: 0.35rem;
    line-height: 1.35;
  }

  @media (max-width: 860px) {
    .header,
    .rail,
    .readout {
      grid-template-columns: 1fr;
    }

    .modes {
      justify-content: flex-start;
    }

    label {
      grid-template-columns: 1fr;
    }

    .rail div {
      min-height: auto;
    }
  }
</style>
