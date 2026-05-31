<script>
  const base = [
    [' the', 3.2, false],
    [' answer', 2.7, false],
    [' is', 2.2, false],
    [' probably', 1.4, false],
    [' because', 1.1, false],
    [' unsafe', 0.9, true],
    [' banana', -0.6, false],
  ]

  let temperature = $state(0.8)
  let topP = $state(0.9)
  let maskUnsafe = $state(true)
  let seed = $state(42)

  function random01(n) {
    const x = Math.sin(n * 999.13) * 10000
    return x - Math.floor(x)
  }

  let rows = $derived.by(() => {
    const candidates = base.map(([token, logit, unsafe]) => ({
      token,
      unsafe,
      logit: unsafe && maskUnsafe ? -999 : logit,
      rawLogit: logit,
    }))
    const max = Math.max(...candidates.map(row => row.logit))
    const exp = candidates.map(row => (row.logit < -100 ? 0 : Math.exp((row.logit - max) / temperature)))
    const total = exp.reduce((sum, value) => sum + value, 0)
    return candidates
      .map((row, index) => ({ ...row, probability: total === 0 ? 0 : exp[index] / total }))
      .sort((a, b) => b.probability - a.probability)
  })

  let nucleus = $derived.by(() => {
    let cumulative = 0
    const selected = []
    for (const row of rows) {
      if (row.probability === 0) continue
      selected.push(row)
      cumulative += row.probability
      if (cumulative >= topP) break
    }
    const total = selected.reduce((sum, row) => sum + row.probability, 0)
    return selected.map(row => ({ ...row, sampleProbability: row.probability / total }))
  })

  let chosen = $derived.by(() => {
    const r = random01(seed)
    let cumulative = 0
    for (const row of nucleus) {
      cumulative += row.sampleProbability
      if (r <= cumulative) return row
    }
    return nucleus[nucleus.length - 1]
  })
</script>

<figure class="trace-viz" aria-labelledby="sampling-title">
  <div class="header">
    <div>
      <h3 id="sampling-title">Raw Scores Become One Sampled Token</h3>
      <p>
        Change temperature, top-p, and the safety mask. The same raw scores can produce a narrow path or a wider candidate set.
      </p>
    </div>
    <div class="status">
      <span>Chosen token</span>
      <strong>{chosen?.token ?? 'none'}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Temperature
      <input aria-label="Sampling temperature" type="range" min="0.1" max="1.8" step="0.1" bind:value={temperature} />
      <span>{temperature.toFixed(1)}</span>
    </label>
    <label>
      Top-p
      <input aria-label="Top p" type="range" min="0.2" max="1" step="0.05" bind:value={topP} />
      <span>{topP.toFixed(2)}</span>
    </label>
    <label>
      Seed
      <input aria-label="Sampling seed" type="range" min="1" max="99" step="1" bind:value={seed} />
      <span>{seed}</span>
    </label>
    <label class="toggle">
      <input aria-label="Mask unsafe token" type="checkbox" bind:checked={maskUnsafe} />
      mask unsafe token
    </label>
  </div>

  <div class="table" role="table" aria-label="Sampling candidates">
    <div class="row head" role="row">
      <span>token</span>
      <span>raw score</span>
      <span>ticket share</span>
      <span>in top-p</span>
    </div>
    {#each rows as row}
      {@const inNucleus = nucleus.some(item => item.token === row.token)}
      <div class:chosen={chosen?.token === row.token} class:masked={row.probability === 0} class="row" role="row">
        <span>{row.token}</span>
        <span>{row.unsafe && maskUnsafe ? 'masked' : row.rawLogit.toFixed(1)}</span>
        <span>{(row.probability * 100).toFixed(1)}%</span>
        <span>{inNucleus ? 'yes' : 'no'}</span>
      </div>
    {/each}
  </div>

  <div class="lesson">
    <strong>Loop invariant:</strong> after this one token is chosen, it is appended to the context, written into KV cache, streamed if allowed, and the whole model runs again for the next token.
  </div>

  <noscript>
    <p>
      Static fallback: raw scores are adjusted by temperature, turned into ticket shares, trimmed by top-p or masks, sampled, appended to the context, and used in the next decode step.
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
    grid-template-columns: 1fr minmax(150px, 0.3fr);
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
  .lesson {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .row,
  .lesson {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status span,
  .status strong {
    display: block;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 120px 1fr 64px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  .toggle {
    grid-template-columns: auto 1fr;
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
    grid-template-columns: 1fr 0.7fr 0.8fr 0.7fr;
    gap: 0.55rem;
    align-items: center;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.78rem;
  }

  .row.head {
    color: var(--theme-foreground-light, #aaa);
  }

  .row.chosen {
    border-color: color-mix(in srgb, var(--theme-cyan, #06b6d4) 75%, var(--theme-separator, #333));
    background: color-mix(in srgb, var(--theme-cyan, #06b6d4) 10%, transparent);
  }

  .row.masked {
    opacity: 0.6;
  }

  .lesson {
    margin-top: 1rem;
    line-height: 1.45;
  }

  @media (max-width: 700px) {
    .header,
    label {
      grid-template-columns: 1fr;
    }

    .row {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
