<script>
  const requests = [
    { id: 'seq-1842', arrival: 0, prefill: 2, decode: 10, pages: 19, priority: 3, tenant: 'paid' },
    { id: 'seq-1843', arrival: 1, prefill: 1, decode: 6, pages: 6, priority: 4, tenant: 'interactive' },
    { id: 'seq-1844', arrival: 3, prefill: 4, decode: 8, pages: 42, priority: 5, tenant: 'enterprise' },
    { id: 'seq-1845', arrival: 5, prefill: 7, decode: 5, pages: 78, priority: 1, tenant: 'batch' },
    { id: 'seq-1846', arrival: 7, prefill: 2, decode: 9, pages: 31, priority: 3, tenant: 'paid' },
  ]

  let time = $state(6)
  let kvBudget = $state(88)
  let tokenBudget = $state(24)
  let cancelFirst = $state(false)

  function rawPhase(req) {
    if (time < req.arrival) return 'not arrived'
    const local = time - req.arrival
    if (local < req.prefill) return 'prefill'
    if (local < req.prefill + req.decode) return 'decode'
    return 'done'
  }

  function tokenCost(req, phase) {
    if (phase === 'prefill') return Math.min(16, req.pages)
    if (phase === 'decode') return 1
    return 0
  }

  let candidates = $derived.by(() =>
    requests
      .map(req => {
        const phase = cancelFirst && req.id === 'seq-1842' && time >= 5 ? 'cancelled' : rawPhase(req)
        return { ...req, phase, cost: tokenCost(req, phase) }
      })
      .filter(req => !['not arrived', 'done', 'cancelled'].includes(req.phase))
      .sort((a, b) => b.priority - a.priority || a.arrival - b.arrival)
  )

  let scheduled = $derived.by(() => {
    let usedPages = 0
    let usedTokens = 0

    return candidates.map(req => {
      const fitsKv = usedPages + req.pages <= kvBudget
      const fitsTokens = usedTokens + req.cost <= tokenBudget
      const selected = fitsKv && fitsTokens

      if (selected) {
        usedPages += req.pages
        usedTokens += req.cost
      }

      return {
        ...req,
        selected,
        reason: selected ? 'in next GPU launch' : fitsKv ? 'token budget full' : 'KV budget full',
        usedPages,
        usedTokens,
      }
    })
  })

  let selected = $derived(scheduled.filter(req => req.selected))
  let waiting = $derived(scheduled.filter(req => !req.selected))
  let usedKv = $derived(selected.reduce((sum, req) => sum + req.pages, 0))
  let usedTokens = $derived(selected.reduce((sum, req) => sum + req.cost, 0))
  let freedPages = $derived(cancelFirst && time >= 5 ? requests[0].pages : 0)
  let decision = $derived.by(() => {
    if (freedPages > 0) return `free ${freedPages} KV pages, then rebuild the next iteration`
    if (waiting.some(req => req.reason === 'KV budget full')) return 'protect running decodes; leave low-priority work queued'
    if (waiting.some(req => req.reason === 'token budget full')) return 'chunk prefill work so decode latency stays bounded'
    return 'launch every active sequence this iteration'
  })
</script>

<figure class="trace-viz" aria-labelledby="scheduler-title">
  <div class="header">
    <div>
      <h3 id="scheduler-title">The Batch Is Rebuilt Every Iteration</h3>
      <p>
        Move time and memory pressure. The scheduler decides which sequence records enter the next GPU launch.
      </p>
    </div>
    <div class="readout">
      <span>Selected records</span>
      <strong>{selected.length}/{candidates.length}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Time slice
      <input aria-label="Time slice" type="range" min="0" max="18" step="1" bind:value={time} />
      <span>{time}</span>
    </label>
    <label>
      KV-page budget
      <input aria-label="KV-page budget" type="range" min="24" max="140" step="4" bind:value={kvBudget} />
      <span>{kvBudget}</span>
    </label>
    <label>
      Token budget
      <input aria-label="Token budget" type="range" min="4" max="48" step="2" bind:value={tokenBudget} />
      <span>{tokenBudget}</span>
    </label>
    <label class="toggle">
      <input aria-label="cancel seq-1842 after slice 5" type="checkbox" bind:checked={cancelFirst} />
      cancel seq-1842 after slice 5
    </label>
  </div>

  <div class="summary">
    <div>
      <span>KV pages in launch</span>
      <strong>{usedKv}/{kvBudget}</strong>
    </div>
    <div>
      <span>Token work in launch</span>
      <strong>{usedTokens}/{tokenBudget}</strong>
    </div>
    <div>
      <span>Waiting records</span>
      <strong>{waiting.length}</strong>
    </div>
    <div>
      <span>Decision</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <div class="records" role="table" aria-label="Scheduler sequence records">
    <div class="row head" role="row">
      <span>sequence</span>
      <span>phase</span>
      <span>KV pages</span>
      <span>priority</span>
      <span>tenant</span>
      <span>scheduler result</span>
    </div>
    {#each scheduled as record}
      <div class:selected={record.selected} class="row" role="row">
        <span>{record.id}</span>
        <span>{record.phase}</span>
        <span>{record.pages}</span>
        <span>{record.priority}</span>
        <span>{record.tenant}</span>
        <span>{record.reason}</span>
      </div>
    {/each}
  </div>

  <div class="timeline" aria-label="Request phases over time">
    {#each requests as req}
      {@const phase = cancelFirst && req.id === 'seq-1842' && time >= 5 ? 'cancelled' : rawPhase(req)}
      <div class="lane" class:active={phase !== 'not arrived' && phase !== 'done'} class:cancelled={phase === 'cancelled'}>
        <span>{req.id}</span>
        <div class="track">
          <i class="prefill" style="left: {req.arrival / 18 * 100}%; width: {req.prefill / 18 * 100}%"></i>
          <i class="decode" style="left: {(req.arrival + req.prefill) / 18 * 100}%; width: {req.decode / 18 * 100}%"></i>
          <b style="left: {time / 18 * 100}%"></b>
        </div>
        <small>{phase}</small>
      </div>
    {/each}
  </div>

  <noscript>
    <p>
      Static fallback: an LLM scheduler rebuilds each GPU launch from mutable sequence records. It chooses among prefill and decode records using token budget, KV-cache pages, priority, deadline, and cancellation state.
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
  .summary span,
  .readout span,
  small {
    color: var(--theme-foreground-light, #aaa);
  }

  .readout,
  .summary div,
  .row {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .readout {
    min-width: 140px;
    text-align: right;
  }

  .readout strong {
    display: block;
    color: var(--theme-green, #10b981);
    font-size: 1.4rem;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 135px 1fr 64px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  .toggle {
    grid-template-columns: auto 1fr;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.65rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
    gap: 0.55rem;
    margin-bottom: 1rem;
  }

  .summary strong,
  .row {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .summary strong {
    display: block;
    margin-top: 0.3rem;
    line-height: 1.35;
  }

  .records {
    display: grid;
    gap: 0.4rem;
    overflow-x: auto;
  }

  .row {
    display: grid;
    grid-template-columns: 94px 82px 80px 70px 96px 190px;
    gap: 0.5rem;
    min-width: 700px;
    font-size: 0.74rem;
  }

  .row.head {
    color: var(--theme-green, #10b981);
    font-weight: 800;
  }

  .row.selected {
    background: color-mix(in srgb, var(--theme-green, #10b981) 14%, transparent);
  }

  .timeline {
    display: grid;
    gap: 0.45rem;
    margin-top: 1rem;
  }

  .lane {
    display: grid;
    grid-template-columns: 88px 1fr 82px;
    gap: 0.5rem;
    align-items: center;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.72rem;
  }

  .track {
    position: relative;
    height: 1.4rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 999px;
    overflow: hidden;
    background: color-mix(in srgb, var(--theme-foreground, #ddd) 8%, transparent);
  }

  .track i,
  .track b {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .prefill {
    background: var(--theme-yellow, #f59e0b);
  }

  .decode {
    background: var(--theme-green, #10b981);
  }

  .track b {
    width: 2px;
    background: var(--theme-foreground, #ddd);
  }

  .lane.cancelled {
    opacity: 0.58;
  }

  @media (max-width: 640px) {
    .header,
    label,
    .lane {
      grid-template-columns: 1fr;
    }

    .readout {
      text-align: left;
    }
  }
</style>
