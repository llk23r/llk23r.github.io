<script>
  const steps = [
    ['trained weights', 'months before', 'optimization writes tensors'],
    ['request admitted', '0 ms', 'gateway reserves tokens and capacity'],
    ['prompt matrix', 'before GPU', 'token ids become vectors'],
    ['prefill cache', 'first model pass', 'context writes KV pages'],
    ['decode tick', 'many times', 'batch runs one next-token step'],
    ['sampled token', 'each tick', 'logits become one id'],
    ['streamed text', 'return path', 'detokenizer and gates release bytes'],
    ['fleet feedback', 'afterward', 'metrics, evals, incidents, future training'],
  ]

  let current = $state(4)
  let visible = $derived(Math.min(current, steps.length - 1))
</script>

<figure class="trace-viz" aria-labelledby="complete-loop-title">
  <div class="header">
    <div>
      <h3 id="complete-loop-title">The Whole Journey Is One Repeated Loop</h3>
      <p>
        Move through the complete path. The visible answer is the surface of repeated reservations, vector transforms, cache writes, sampling, and stream releases.
      </p>
    </div>
    <div class="status">
      <span>Current object</span>
      <strong>{steps[visible][0]}</strong>
    </div>
  </div>

  <label>
    Journey step
    <input aria-label="Complete loop step" type="range" min="0" max={steps.length - 1} step="1" bind:value={current} />
    <span>{visible + 1}/{steps.length}</span>
  </label>

  <div class="loop" aria-label="Complete LLM request loop">
    {#each steps as step, index}
      <div class:active={index === visible} class:done={index < visible}>
        <span>{step[1]}</span>
        <strong>{step[0]}</strong>
        <small>{step[2]}</small>
      </div>
    {/each}
  </div>

  <div class="lesson">
    <strong>Final invariant:</strong> the model never emits a whole answer in one act. It repeatedly turns the current context into one next-token distribution, while the serving system keeps the loop admitted, batched, cached, synchronized, sampled, checked, and streamed.
  </div>

  <noscript>
    <p>
      Static fallback: training creates weights; the gateway admits the request; tokens become vectors; prefill writes KV cache; decode repeatedly samples and streams tokens; fleet metrics feed future operations and training.
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
    grid-template-columns: 1fr minmax(180px, 0.3fr);
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
  .loop span,
  .loop small {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .loop div,
  .lesson {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  label {
    display: grid;
    grid-template-columns: 120px 1fr 70px;
    gap: 0.6rem;
    align-items: center;
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .loop {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .loop div {
    min-height: 116px;
  }

  .loop .done {
    background: color-mix(in srgb, var(--theme-green, #10b981) 10%, transparent);
  }

  .loop .active {
    border-color: var(--theme-green, #10b981);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--theme-green, #10b981) 55%, transparent);
  }

  .loop span,
  .loop strong,
  .loop small {
    display: block;
  }

  .status strong,
  label span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .lesson {
    margin-top: 1rem;
  }

  @media (max-width: 760px) {
    .header,
    .loop,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
