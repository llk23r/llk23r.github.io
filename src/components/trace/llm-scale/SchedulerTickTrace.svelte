<script>
  const ticks = [
    {
      label: 'arrivals',
      sequences: [
        { id: 'A17', phase: 'prefill', tokens: 4096, kv: 0, priority: 'paid', state: 'reserve first KV pages' },
        { id: 'B04', phase: 'waiting', tokens: 0, kv: 0, priority: 'free', state: 'wait for prefill slot' },
        { id: 'C92', phase: 'decode', tokens: 1, kv: 39, priority: 'enterprise', state: 'protect deadline' },
        { id: 'D31', phase: 'decode', tokens: 1, kv: 9, priority: 'paid', state: 'stream is active' },
        { id: 'E08', phase: 'waiting', tokens: 0, kv: 0, priority: 'batch', state: 'admit if budget remains' },
      ],
    },
    {
      label: 'mixed batch',
      sequences: [
        { id: 'A17', phase: 'decode', tokens: 1, kv: 18, priority: 'paid', state: 'keep stream smooth' },
        { id: 'B04', phase: 'prefill', tokens: 4096, kv: 12, priority: 'free', state: 'chunk prompt' },
        { id: 'C92', phase: 'decode', tokens: 1, kv: 41, priority: 'enterprise', state: 'protect deadline' },
        { id: 'D31', phase: 'cancelled', tokens: 0, kv: 9, priority: 'paid', state: 'release KV pages' },
        { id: 'E08', phase: 'waiting', tokens: 0, kv: 0, priority: 'batch', state: 'admit if budget remains' },
      ],
    },
    {
      label: 'memory pressure',
      sequences: [
        { id: 'A17', phase: 'decode', tokens: 1, kv: 22, priority: 'paid', state: 'still active' },
        { id: 'B04', phase: 'prefill', tokens: 2048, kv: 28, priority: 'free', state: 'smaller chunk' },
        { id: 'C92', phase: 'decode', tokens: 1, kv: 44, priority: 'enterprise', state: 'must keep deadline' },
        { id: 'D31', phase: 'finished', tokens: 0, kv: 0, priority: 'paid', state: 'pages released' },
        { id: 'E08', phase: 'waiting', tokens: 0, kv: 0, priority: 'batch', state: 'blocked by KV budget' },
      ],
    },
  ]

  let tick = $state(1)
  let kvBudget = $state(82)
  let prefillSlots = $state(4096)
  let decodeSlots = $state(3)

  let current = $derived(ticks[tick])
  let sequences = $derived(current.sequences)
  let active = $derived(sequences.filter(seq => !['cancelled', 'finished', 'waiting'].includes(seq.phase)))
  let usedKv = $derived(active.reduce((sum, seq) => sum + seq.kv, 0))
  let admittedDecode = $derived(Math.min(decodeSlots, sequences.filter(seq => seq.phase === 'decode').length))
  let prefillAdmitted = $derived(prefillSlots >= 4096 && usedKv < kvBudget)
  let verdict = $derived.by(() => {
    if (usedKv >= kvBudget) return 'no new admissions: KV budget is full'
    if (!prefillAdmitted) return 'chunk prefill smaller to protect decodes'
    return 'run one mixed iteration'
  })
</script>

<figure class="trace-viz" aria-labelledby="tick-title">
  <div class="header">
    <div>
      <h3 id="tick-title">One Scheduler Tick Chooses the Next Batch</h3>
      <p>
        The scheduler does not run one request to completion. It repeatedly chooses which sequence records fit into the next model iteration.
      </p>
    </div>
    <div class="status">
      <span>Tick {tick + 1}: {current.label}</span>
      <strong>{verdict}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Tick
      <input aria-label="Scheduler tick" type="range" min="0" max={ticks.length - 1} step="1" bind:value={tick} />
      <span>{tick + 1}/{ticks.length}</span>
    </label>
    <label>
      KV budget
      <input aria-label="KV budget" type="range" min="30" max="110" step="1" bind:value={kvBudget} />
      <span>{kvBudget}</span>
    </label>
    <label>
      Prefill chunk
      <input aria-label="Prefill chunk tokens" type="range" min="512" max="8192" step="512" bind:value={prefillSlots} />
      <span>{prefillSlots.toLocaleString()}</span>
    </label>
    <label>
      Decode slots
      <input aria-label="Decode slots" type="range" min="1" max="5" step="1" bind:value={decodeSlots} />
      <span>{decodeSlots}</span>
    </label>
  </div>

  <div class="records" aria-label="Sequence records">
    {#each sequences as seq}
      <div class:cancelled={seq.phase === 'cancelled' || seq.phase === 'finished'} class:waiting={seq.phase === 'waiting'}>
        <span>{seq.id} · {seq.priority}</span>
        <strong>{seq.phase}</strong>
        <small>{seq.state}</small>
        <em>{seq.kv} KV pages</em>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Decode records admitted</span>
      <strong>{admittedDecode}</strong>
    </div>
    <div>
      <span>Prefill chunk admitted</span>
      <strong>{prefillAdmitted ? 'yes' : 'no'}</strong>
    </div>
    <div>
      <span>Active KV pages</span>
      <strong>{usedKv}/{kvBudget}</strong>
    </div>
  </div>

  <p class="estimate">Teaching simulation: real schedulers use more state, but the invariant is the same: each tick admits, chunks, protects, cancels, and frees sequence records under KV and compute budgets.</p>

  <noscript>
    <p>
      Static fallback: each scheduler tick selects active sequence records under compute and KV-cache budgets, drops cancelled records, chunks prefills, and protects decode streams.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-purple, #8b5cf6));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(210px, 0.36fr);
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
  .records span,
  .records small,
  .records em,
  .estimate,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .records div,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 130px 1fr 92px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .records {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .records div {
    min-height: 112px;
    background: color-mix(in srgb, var(--theme-purple, #8b5cf6) 10%, transparent);
  }

  .records .cancelled {
    opacity: 0.65;
    border-style: dashed;
  }

  .records .waiting {
    opacity: 0.75;
  }

  .records span,
  .records strong,
  .records small,
  .records em,
  .readout span,
  .readout strong {
    display: block;
  }

  .records em {
    margin-top: 0.4rem;
    font-style: normal;
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

  .estimate {
    margin-top: 0.85rem;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  @media (max-width: 860px) {
    .header,
    .records,
    .readout,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
