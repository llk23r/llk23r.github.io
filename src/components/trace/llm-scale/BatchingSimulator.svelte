<script>
  const requests = [
    { id: 'A', arrival: 0, prefill: 4, decode: 10, color: 'var(--theme-cyan, #06b6d4)' },
    { id: 'B', arrival: 2, prefill: 2, decode: 7, color: 'var(--theme-green, #10b981)' },
    { id: 'C', arrival: 4, prefill: 6, decode: 5, color: 'var(--theme-yellow, #f59e0b)' },
    { id: 'D', arrival: 7, prefill: 3, decode: 8, color: 'var(--theme-red, #ec4899)' },
    { id: 'E', arrival: 10, prefill: 2, decode: 4, color: 'var(--theme-magenta, #8b5cf6)' },
  ]

  let mode = $state('continuous')
  let time = $state(0)
  let maxTime = $derived(mode === 'continuous' ? 26 : 52)

  let schedule = $derived.by(() => {
    if (mode === 'continuous') {
      return requests.map(req => ({ ...req, start: req.arrival, finish: req.arrival + req.prefill + req.decode }))
    }

    let cursor = 0
    return requests.map(req => {
      const start = Math.max(req.arrival, cursor)
      const finish = start + req.prefill + req.decode
      cursor = finish
      return { ...req, start, finish }
    })
  })

  function requestState(req) {
    if (time < req.arrival) return 'not arrived'
    if (time < req.start) return 'queued'
    const local = time - req.start
    if (local < req.prefill) return 'prefill'
    if (local < req.prefill + req.decode) return 'decode'
    return 'done'
  }

  let active = $derived(schedule.filter(req => ['prefill', 'decode'].includes(requestState(req))))
  let queued = $derived(schedule.filter(req => requestState(req) === 'queued').length)
  let done = $derived(schedule.filter(req => requestState(req) === 'done').length)
  let totalTokenIterations = $derived(schedule.reduce((sum, req) => sum + Math.max(0, Math.min(time - req.start - req.prefill, req.decode)), 0))

  $effect(() => {
    if (time > maxTime) time = maxTime
  })
</script>

<figure class="trace-viz" aria-labelledby="batch-title">
  <div class="header">
    <div>
      <h3 id="batch-title">Serving Is a Scheduling Problem</h3>
      <p>
        Move time forward. Continuous batching admits new requests between token-generation iterations instead of waiting for a whole batch to finish.
      </p>
    </div>
    <div class="mode" role="group" aria-label="Scheduling mode">
      <button type="button" class:active={mode === 'continuous'} on:click={() => (mode = 'continuous')}>Continuous</button>
      <button type="button" class:active={mode === 'naive'} on:click={() => (mode = 'naive')}>Naive</button>
    </div>
  </div>

  <label class="time">
    Time slice {time}
    <input type="range" min="0" max={maxTime} bind:value={time} />
  </label>

  <div class="gpu">
    <div>
      <span class="label">Active GPU batch</span>
      <strong>{active.length} requests</strong>
    </div>
    <div>
      <span class="label">Completed</span>
      <strong>{done}/{requests.length}</strong>
    </div>
    <div>
      <span class="label">Queued</span>
      <strong>{queued}</strong>
    </div>
    <div>
      <span class="label">Utilization hint</span>
      <strong>{active.length === 0 ? 'idle' : active.length < 2 ? 'low' : 'high'}</strong>
    </div>
  </div>

  <div class="lanes">
    {#each schedule as req}
      {@const state = requestState(req)}
      <div class="lane" style="--req-color: {req.color}">
        <div class="req-id">{req.id}</div>
        <div class="track">
          <span class="arrival" style="left: {req.arrival / maxTime * 100}%"></span>
          <span
            class="work prefill"
            style="left: {req.start / maxTime * 100}%; width: {req.prefill / maxTime * 100}%"
          ></span>
          <span
            class="work decode"
            style="left: {(req.start + req.prefill) / maxTime * 100}%; width: {req.decode / maxTime * 100}%"
          ></span>
          <span class="cursor" style="left: {time / maxTime * 100}%"></span>
        </div>
        <div class="state">{state}</div>
      </div>
    {/each}
  </div>

  <div class="legend">
    <span><i class="prefill-key"></i> prefill: read prompt</span>
    <span><i class="decode-key"></i> decode: one token per iteration</span>
    <span><i class="arrival-key"></i> arrival</span>
    <span>{totalTokenIterations} decode token-iterations emitted so far</span>
  </div>

  <noscript>
    <p>
      Static fallback: continuous batching works at the iteration level. Finished sequences leave a running batch, and newly arrived sequences can enter the next decoding step instead of waiting for every original batch-mate to finish.
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

  .header,
  .gpu,
  .lane,
  .legend {
    display: flex;
    gap: 1rem;
  }

  .header {
    justify-content: space-between;
    align-items: flex-start;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }

  p {
    color: var(--theme-foreground-light, #aaa);
    line-height: 1.5;
  }

  .mode {
    display: flex;
    padding: 0.2rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
  }

  button {
    border: 0;
    border-radius: 6px;
    padding: 0.45rem 0.65rem;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    cursor: pointer;
  }

  button.active {
    background: var(--theme-green, #10b981);
    color: var(--theme-background, #111);
  }

  .time {
    display: grid;
    gap: 0.45rem;
    margin: 1rem 0;
    font-weight: 650;
  }

  input[type='range'] {
    width: 100%;
  }

  .gpu {
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .gpu > div {
    flex: 1;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .label,
  .state,
  .legend {
    color: var(--theme-foreground-light, #aaa);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.72rem;
  }

  .gpu strong {
    display: block;
    margin-top: 0.3rem;
    font-size: 1.1rem;
  }

  .lanes {
    display: grid;
    gap: 0.55rem;
  }

  .lane {
    align-items: center;
  }

  .req-id {
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--req-color);
    color: var(--theme-background, #111);
    font-weight: 800;
  }

  .track {
    position: relative;
    flex: 1;
    height: 1.4rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--theme-foreground, #ddd) 8%, transparent);
    overflow: hidden;
  }

  .arrival {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--theme-foreground, #ddd);
    z-index: 3;
  }

  .work {
    position: absolute;
    top: 0.2rem;
    bottom: 0.2rem;
    border-radius: 999px;
  }

  .prefill {
    background: color-mix(in srgb, var(--req-color) 80%, white);
  }

  .decode {
    background: color-mix(in srgb, var(--req-color) 50%, transparent);
    outline: 1px dashed var(--req-color);
    outline-offset: -1px;
  }

  .cursor {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--theme-yellow, #f59e0b);
    z-index: 4;
  }

  .state {
    width: 4.6rem;
    text-align: right;
  }

  .legend {
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .legend i {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.35rem;
    vertical-align: -0.1rem;
    border-radius: 3px;
  }

  .prefill-key {
    background: var(--theme-cyan, #06b6d4);
  }

  .decode-key {
    border: 1px dashed var(--theme-cyan, #06b6d4);
  }

  .arrival-key {
    background: var(--theme-foreground, #ddd);
    width: 2px !important;
  }

  @media (max-width: 700px) {
    .header,
    .gpu {
      flex-direction: column;
    }

    .lane {
      gap: 0.5rem;
    }

    .state {
      width: 3.8rem;
      font-size: 0.65rem;
    }
  }
</style>
