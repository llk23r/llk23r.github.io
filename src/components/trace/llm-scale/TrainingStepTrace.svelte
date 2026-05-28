<script>
  const tokens = [' Paris', ' London', ' blue', ' quickly', ' unsafe']

  let target = $state(' Paris')
  let confidence = $state(1.2)
  let learningRate = $state(0.2)
  let replicas = $state(8)

  let logits = $derived.by(() => {
    const base = {
      ' Paris': confidence,
      ' London': 0.7,
      ' blue': -0.4,
      ' quickly': -0.8,
      ' unsafe': -1.4,
    }
    if (target !== ' Paris') {
      base[target] = confidence
      base[' Paris'] = 0.3
    }
    return base
  })

  let probs = $derived.by(() => {
    const max = Math.max(...tokens.map(token => logits[token]))
    const exp = tokens.map(token => Math.exp(logits[token] - max))
    const total = exp.reduce((sum, value) => sum + value, 0)
    return Object.fromEntries(tokens.map((token, index) => [token, exp[index] / total]))
  })

  let loss = $derived(-Math.log(probs[target]))
  let gradients = $derived.by(() =>
    Object.fromEntries(tokens.map(token => [token, probs[token] - (token === target ? 1 : 0)]))
  )
  let updatedTargetLogit = $derived(logits[target] - learningRate * gradients[target])
  let allReduceBytes = $derived(replicas * 5 * 2)
  let verdict = $derived.by(() => {
    if (loss < 0.4) return 'small update: model already expected the target'
    if (loss < 1.2) return 'medium update: raise target, lower competitors'
    return 'large update: the target was surprising'
  })
</script>

<figure class="trace-viz" aria-labelledby="training-step-title">
  <div class="header">
    <div>
      <h3 id="training-step-title">One Training Position Becomes a Weight Nudge</h3>
      <p>
        Pick the correct next token and model confidence. Cross-entropy turns the miss into a logit-gradient seed; backpropagation carries that signal into the weights.
      </p>
    </div>
    <div class="status">
      <span>Loss</span>
      <strong>{loss.toFixed(3)}</strong>
      <small>{verdict}</small>
    </div>
  </div>

  <div class="controls">
    <div class="targets" role="group" aria-label="Correct next token">
      {#each tokens.slice(0, 4) as token}
        <button type="button" class:active={target === token} on:click={() => (target = token)}>
          {token.trim()}
        </button>
      {/each}
    </div>
    <label>
      Target logit
      <input aria-label="Target logit" type="range" min="-1.5" max="3" step="0.1" bind:value={confidence} />
      <span>{confidence.toFixed(1)}</span>
    </label>
    <label>
      Learning rate
      <input aria-label="Learning rate" type="range" min="0.02" max="0.8" step="0.02" bind:value={learningRate} />
      <span>{learningRate.toFixed(2)}</span>
    </label>
    <label>
      Data replicas
      <input aria-label="Data parallel replicas" type="range" min="1" max="64" step="1" bind:value={replicas} />
      <span>{replicas}</span>
    </label>
  </div>

  <div class="table" role="table" aria-label="Training token probabilities and logit gradients">
    <div class="row head" role="row">
      <span>token</span>
      <span>logit</span>
      <span>probability</span>
      <span>dL/dlogit</span>
    </div>
    {#each tokens as token}
      <div class:target={token === target} class="row" role="row">
        <span>{token}</span>
        <span>{logits[token].toFixed(2)}</span>
        <span>{(probs[token] * 100).toFixed(1)}%</span>
        <span>{gradients[token].toFixed(3)}</span>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Target logit after toy update</span>
      <strong>{updatedTargetLogit.toFixed(3)}</strong>
    </div>
    <div>
      <span>Replica gradient sync</span>
      <strong>{replicas} workers all-reduce</strong>
    </div>
    <div>
      <span>Toy gradient payload</span>
      <strong>{allReduceBytes} bytes</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: a training position produces logits, stable softmax probabilities, cross-entropy loss, logit gradients that seed backpropagation, a data-parallel gradient synchronization, and then an optimizer update to the weights.
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
    grid-template-columns: 1fr minmax(170px, 0.32fr);
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
  .status span,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .row,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status span,
  .status strong,
  .status small,
  .readout span,
  .readout strong {
    display: block;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  .targets {
    display: flex;
    flex-wrap: wrap;
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
    grid-template-columns: 130px 1fr 70px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .table {
    display: grid;
    gap: 0.4rem;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 0.7fr 0.9fr 0.8fr;
    gap: 0.55rem;
    align-items: center;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.78rem;
  }

  .row.head {
    color: var(--theme-foreground-light, #aaa);
  }

  .row.target {
    border-color: color-mix(in srgb, var(--theme-green, #10b981) 70%, var(--theme-separator, #333));
    background: color-mix(in srgb, var(--theme-green, #10b981) 9%, transparent);
  }

  .readout {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  @media (max-width: 760px) {
    .header,
    .readout,
    label {
      grid-template-columns: 1fr;
    }

    .row {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
