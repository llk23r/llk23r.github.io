<script>
  const scenarios = {
    normal: {
      label: 'Normal',
      pieces: ['The', ' answer', ' is', ' streamed'],
      minPieces: 1,
      policyAt: 1,
      toolAt: 1,
      cancelAt: 99,
      reason: 'bytes form ordinary text',
    },
    tool: {
      label: 'Tool JSON',
      pieces: ['{"query"', ': "GPU', ' KV cache"', '}'],
      minPieces: 4,
      policyAt: 1,
      toolAt: 4,
      cancelAt: 99,
      reason: 'tool arguments are not valid JSON until the closing brace arrives',
    },
    risky: {
      label: 'Risky Text',
      pieces: ['make', ' a', ' harmful', ' plan'],
      minPieces: 4,
      policyAt: 4,
      toolAt: 1,
      cancelAt: 99,
      reason: 'the policy decision needs the phrase, not just the first fragment',
    },
    cancel: {
      label: 'Cancelled',
      pieces: ['The', ' next', ' token', ' never shows'],
      minPieces: 1,
      policyAt: 1,
      toolAt: 1,
      cancelAt: 2,
      reason: 'the client closed the stream before the next flush',
    },
  }

  let mode = $state('normal')
  let pieceCount = $state(1)
  let current = $derived(scenarios[mode])

  $effect(() => {
    if (pieceCount > current.pieces.length) pieceCount = current.pieces.length
  })

  let buffered = $derived(current.pieces.slice(0, pieceCount).join(''))
  let utf8Ok = $derived(pieceCount >= current.minPieces)
  let toolOk = $derived(pieceCount >= current.toolAt)
  let policyOk = $derived(pieceCount >= current.policyAt)
  let connected = $derived(pieceCount < current.cancelAt)
  let release = $derived(utf8Ok && toolOk && policyOk && connected)
  let decision = $derived.by(() => {
    if (!connected) return 'drop fragment, mark sequence cancelled, release future KV pages'
    if (!utf8Ok) return 'buffer until bytes form a valid text fragment'
    if (!toolOk) return 'buffer until structured tool arguments parse'
    if (!policyOk) return 'hold until the policy gate has enough surrounding text'
    return 'flush stream event and schedule the next decode iteration'
  })

  const gates = [
    ['UTF-8/text', () => utf8Ok],
    ['tool syntax', () => toolOk],
    ['policy', () => policyOk],
    ['client open', () => connected],
  ]
</script>

<figure class="trace-viz" aria-labelledby="stream-title">
  <div class="header">
    <div>
      <h3 id="stream-title">A Streamed Token Has Gates</h3>
      <p>
        Generate more fragments. The stream flushes only when text, structure, policy, and connection state all permit release.
      </p>
    </div>
    <div class="modes" role="group" aria-label="Stream scenario">
      {#each Object.entries(scenarios) as [key, item]}
        <button type="button" class:active={mode === key} onclick={() => ((mode = key), (pieceCount = 1))}>
          {item.label}
        </button>
      {/each}
    </div>
  </div>

  <label class="scrub">
    Generated fragments
    <input
      aria-label="Generated fragments"
      type="range"
      min="1"
      max={current.pieces.length}
      step="1"
      bind:value={pieceCount}
    />
    <span>{pieceCount}/{current.pieces.length}</span>
  </label>

  <div class="buffer">
    <span>Detokenizer buffer</span>
    <strong>{buffered}</strong>
    <small>{current.reason}</small>
  </div>

  <div class="gates">
    {#each gates as gate}
      {@const ok = gate[1]()}
      <div class:ok>
        <span>{ok ? 'pass' : 'hold'}</span>
        <strong>{gate[0]}</strong>
      </div>
    {/each}
  </div>

  <div class="decision">
    <div>
      <span>Release decision</span>
      <strong>{release ? 'release now' : 'do not release yet'}</strong>
    </div>
    <div>
      <span>Backend action</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <div class="pipeline">
    <div class:active={pieceCount >= 1}>token id selected</div>
    <div class:active={pieceCount >= 1}>detokenizer buffer</div>
    <div class:active={release}>stream frame</div>
    <div class:active={release}>browser paint</div>
    <div class:active={!connected}>reverse cancellation</div>
  </div>

  <noscript>
    <p>
      Static fallback: streamed output is not printed blindly. It passes through detokenization, valid text buffering, tool/citation/policy gates, stream framing, browser rendering, and cancellation cleanup.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-magenta, #8b5cf6));
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
  .decision span,
  .buffer span {
    color: var(--theme-foreground-light, #aaa);
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: flex-end;
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
    background: var(--theme-magenta, #8b5cf6);
    color: white;
  }

  .scrub {
    display: grid;
    grid-template-columns: 150px 1fr 70px;
    gap: 0.6rem;
    align-items: center;
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .buffer,
  .decision div,
  .gates div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .buffer strong {
    display: block;
    margin: 0.35rem 0;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    overflow-wrap: anywhere;
  }

  .gates,
  .decision,
  .pipeline {
    display: grid;
    gap: 0.55rem;
    margin-top: 0.75rem;
  }

  .gates {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  }

  .gates span {
    display: inline-block;
    min-width: 3.2rem;
    border-radius: 999px;
    padding: 0.15rem 0.4rem;
    background: var(--theme-red, #ec4899);
    color: white;
    font-size: 0.68rem;
    text-align: center;
    text-transform: uppercase;
  }

  .gates .ok span {
    background: var(--theme-green, #10b981);
    color: var(--theme-background, #111);
  }

  .gates strong,
  .decision strong {
    display: block;
    margin-top: 0.35rem;
    line-height: 1.35;
  }

  .decision {
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  }

  .decision strong {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .pipeline {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .pipeline div {
    border-radius: 999px;
    padding: 0.45rem 0.6rem;
    background: color-mix(in srgb, var(--theme-foreground, #ddd) 8%, transparent);
    color: var(--theme-foreground-light, #aaa);
    font-size: 0.74rem;
    text-align: center;
  }

  .pipeline div.active {
    background: color-mix(in srgb, var(--theme-magenta, #8b5cf6) 38%, transparent);
    color: var(--theme-foreground, #ddd);
  }

  @media (max-width: 640px) {
    .header,
    .scrub {
      grid-template-columns: 1fr;
    }

    .modes {
      justify-content: flex-start;
    }
  }
</style>
