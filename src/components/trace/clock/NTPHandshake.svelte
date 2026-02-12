<script>
  let outboundDelay = $state(25) // ms
  let returnDelay = $state(25) // ms
  let serverProcessing = $state(5) // ms
  let animStep = $state(-1) // -1 = not started, 0-3 = animation steps, 4 = done
  let animProgress = $state(0) // 0-1 for interpolating within a step

  // The "true" server time offset from client
  const trueOffset = 50 // ms; server is 50ms ahead of client

  // T1: client sends (client clock)
  let t1 = $derived(100)
  // T2: server receives (server clock) = T1 + trueOffset + outboundDelay
  let t2 = $derived(t1 + trueOffset + outboundDelay)
  // T3: server sends reply (server clock)
  let t3 = $derived(t2 + serverProcessing)
  // T4: client receives (client clock) = T1 + outboundDelay + serverProcessing + returnDelay
  let t4 = $derived(t1 + outboundDelay + serverProcessing + returnDelay)

  // NTP calculations
  let roundTrip = $derived((t4 - t1) - (t3 - t2))
  let estimatedOneWay = $derived(roundTrip / 2)
  let calculatedOffset = $derived(((t2 - t1) + (t3 - t4)) / 2)
  let offsetError = $derived(Math.abs(calculatedOffset - trueOffset))

  // Is path symmetric?
  let isSymmetric = $derived(outboundDelay === returnDelay)

  let animFrame = $state(null)
  let animStartTime = $state(null)

  function startAnimation() {
    animStep = 0
    animProgress = 0
    animStartTime = null
    if (animFrame) cancelAnimationFrame(animFrame)
    animFrame = requestAnimationFrame(tickAnim)
  }

  function tickAnim(timestamp) {
    if (animStartTime === null) animStartTime = timestamp
    const elapsed = timestamp - animStartTime
    const stepDuration = 800

    if (animStep === 0) {
      animProgress = Math.min(elapsed / stepDuration, 1)
      if (animProgress >= 1) { animStep = 1; animStartTime = timestamp }
    } else if (animStep === 1) {
      animProgress = Math.min(elapsed / (stepDuration * 0.5), 1)
      if (animProgress >= 1) { animStep = 2; animStartTime = timestamp }
    } else if (animStep === 2) {
      animProgress = Math.min(elapsed / stepDuration, 1)
      if (animProgress >= 1) { animStep = 3; animStartTime = timestamp }
    } else if (animStep === 3) {
      animProgress = Math.min(elapsed / (stepDuration * 0.5), 1)
      if (animProgress >= 1) { animStep = 4; return }
    }

    if (animStep < 4) animFrame = requestAnimationFrame(tickAnim)
  }

  function reset() {
    animStep = -1
    animProgress = 0
    if (animFrame) cancelAnimationFrame(animFrame)
  }

  import { onDestroy } from 'svelte'
  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })

  // SVG layout constants
  // Left boxes: x=20..160, center=90   Right boxes: x=300..440, center=370
  // T1: y=30..76  T2: y=92..138  T3: y=154..200  T4: y=216..262
  const CL = 20, CR = 160, CC = 90    // client box left, right, center-x
  const SL = 300, SR = 440, SC = 370  // server box left, right, center-x
  const BW = 140, BH = 46             // box width, height
  const T1Y = 30, T2Y = 92, T3Y = 154, T4Y = 216
</script>

<figure class="trace-viz" role="img" aria-label="NTP four-timestamp handshake visualization">
  <div class="diagram-container">
    <svg viewBox="0 0 460 270" preserveAspectRatio="xMidYMid meet" class="handshake-svg">
      <defs>
        <marker id="arrow-out" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-cyan, #06b6d4)" />
        </marker>
        <marker id="arrow-ret" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-yellow, #f59e0b)" />
        </marker>
      </defs>

      <!-- Column headers -->
      <text x={CC} y="18" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="10"
        font-family="JetBrains Mono, monospace" letter-spacing="0.08em"
        opacity="0.6">YOUR LAPTOP</text>
      <text x={SC} y="18" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="10"
        font-family="JetBrains Mono, monospace" letter-spacing="0.08em"
        opacity="0.6">TIME SERVER</text>

      <!-- T1 box (client, top) -->
      <g opacity={animStep >= 0 ? 1 : 0.2} class="ts-group">
        <rect x={CL} y={T1Y} width={BW} height={BH} rx="4"
          fill="rgba(255,255,255,0.03)"
          stroke={animStep >= 0 ? 'var(--theme-separator, #444)' : 'transparent'} stroke-width="1" />
        <text x={CC} y={T1Y + 15} text-anchor="middle"
          fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="700"
          font-family="JetBrains Mono, monospace">T1</text>
        <text x={CC} y={T1Y + 29} text-anchor="middle"
          fill="var(--theme-foreground, #ddd)" font-size="13" font-weight="600"
          font-family="JetBrains Mono, monospace">{t1} ms</text>
        <text x={CC} y={T1Y + 41} text-anchor="middle"
          fill="var(--theme-foreground, #888)" font-size="8"
          font-family="JetBrains Mono, monospace" opacity="0.5">send request</text>
      </g>

      <!-- T2 box (server, upper-mid) -->
      <g opacity={animStep >= 1 ? 1 : 0.2} class="ts-group">
        <rect x={SL} y={T2Y} width={BW} height={BH} rx="4"
          fill="rgba(255,255,255,0.03)"
          stroke={animStep >= 1 ? 'var(--theme-separator, #444)' : 'transparent'} stroke-width="1" />
        <text x={SC} y={T2Y + 15} text-anchor="middle"
          fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="700"
          font-family="JetBrains Mono, monospace">T2</text>
        <text x={SC} y={T2Y + 29} text-anchor="middle"
          fill="var(--theme-foreground, #ddd)" font-size="13" font-weight="600"
          font-family="JetBrains Mono, monospace">{t2} ms</text>
        <text x={SC} y={T2Y + 41} text-anchor="middle"
          fill="var(--theme-foreground, #888)" font-size="8"
          font-family="JetBrains Mono, monospace" opacity="0.5">receive request</text>
      </g>

      <!-- T3 box (server, lower-mid) -->
      <g opacity={animStep >= 2 ? 1 : 0.2} class="ts-group">
        <rect x={SL} y={T3Y} width={BW} height={BH} rx="4"
          fill="rgba(255,255,255,0.03)"
          stroke={animStep >= 2 ? 'var(--theme-separator, #444)' : 'transparent'} stroke-width="1" />
        <text x={SC} y={T3Y + 15} text-anchor="middle"
          fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="700"
          font-family="JetBrains Mono, monospace">T3</text>
        <text x={SC} y={T3Y + 29} text-anchor="middle"
          fill="var(--theme-foreground, #ddd)" font-size="13" font-weight="600"
          font-family="JetBrains Mono, monospace">{t3} ms</text>
        <text x={SC} y={T3Y + 41} text-anchor="middle"
          fill="var(--theme-foreground, #888)" font-size="8"
          font-family="JetBrains Mono, monospace" opacity="0.5">send reply</text>
      </g>

      <!-- T4 box (client, bottom) -->
      <g opacity={animStep >= 3 ? 1 : 0.2} class="ts-group">
        <rect x={CL} y={T4Y} width={BW} height={BH} rx="4"
          fill="rgba(255,255,255,0.03)"
          stroke={animStep >= 3 ? 'var(--theme-separator, #444)' : 'transparent'} stroke-width="1" />
        <text x={CC} y={T4Y + 15} text-anchor="middle"
          fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="700"
          font-family="JetBrains Mono, monospace">T4</text>
        <text x={CC} y={T4Y + 29} text-anchor="middle"
          fill="var(--theme-foreground, #ddd)" font-size="13" font-weight="600"
          font-family="JetBrains Mono, monospace">{t4} ms</text>
        <text x={CC} y={T4Y + 41} text-anchor="middle"
          fill="var(--theme-foreground, #888)" font-size="8"
          font-family="JetBrains Mono, monospace" opacity="0.5">receive reply</text>
      </g>

      <!-- Outbound arrow: right edge of T1 → left edge of T2 -->
      {#if animStep >= 0}
        {@const p = animStep > 0 ? 1 : animProgress}
        <line
          x1={CR} y1={T1Y + BH / 2}
          x2={CR + (SL - CR) * p} y2={T1Y + BH / 2 + (T2Y + BH / 2 - T1Y - BH / 2) * p}
          stroke="var(--theme-cyan, #06b6d4)" stroke-width="2"
          marker-end={p >= 1 ? 'url(#arrow-out)' : 'none'}
        />
      {/if}

      <!-- Server processing: vertical connector between T2 and T3 -->
      {#if animStep >= 1}
        <line
          x1={SC} y1={T2Y + BH} x2={SC} y2={T3Y}
          stroke="var(--theme-green, #10b981)" stroke-width="1.5" stroke-dasharray="3,3"
          opacity="0.5"
        />
        <text x={SC + 12} y={(T2Y + BH + T3Y) / 2 + 3}
          fill="var(--theme-green, #10b981)" font-size="7"
          font-family="JetBrains Mono, monospace" opacity="0.6">{serverProcessing}ms</text>
      {/if}
      {#if animStep >= 1 && animStep <= 2}
        <circle cx={SC} cy={(T2Y + BH + T3Y) / 2} r="3" fill="var(--theme-green, #10b981)">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" />
        </circle>
      {/if}

      <!-- Return arrow: left edge of T3 → right edge of T4 -->
      {#if animStep >= 2}
        {@const p = animStep > 2 ? 1 : animProgress}
        <line
          x1={SL} y1={T3Y + BH / 2}
          x2={SL + (CR - SL) * p} y2={T3Y + BH / 2 + (T4Y + BH / 2 - T3Y - BH / 2) * p}
          stroke="var(--theme-yellow, #f59e0b)" stroke-width="2"
          marker-end={p >= 1 ? 'url(#arrow-ret)' : 'none'}
        />
      {/if}
    </svg>
  </div>

  {#if animStep >= 3}
    <div class="results">
      <div class="result-row">
        <span class="formula">Round trip = (T4 - T1) - (T3 - T2)</span>
        <span class="result">= ({t4} - {t1}) - ({t3} - {t2}) = <strong>{roundTrip} ms</strong></span>
      </div>
      <div class="result-row">
        <span class="formula">Estimated one-way = {roundTrip} / 2</span>
        <span class="result">= <strong>{estimatedOneWay} ms</strong></span>
      </div>
      <div class="result-row">
        <span class="formula">Clock offset = ((T2-T1) + (T3-T4)) / 2</span>
        <span class="result">= <strong>{calculatedOffset} ms</strong></span>
      </div>
      <div class="result-row truth">
        <span class="formula">True offset</span>
        <span class="result">= <strong>{trueOffset} ms</strong></span>
      </div>
      {#if !isSymmetric}
        <div class="result-row error">
          <span class="formula">Error from asymmetry</span>
          <span class="result">= <strong>{offsetError.toFixed(1)} ms</strong></span>
        </div>
      {/if}
      {#if isSymmetric}
        <div class="result-note success">Symmetric path; offset calculated perfectly.</div>
      {:else}
        <div class="result-note warning">Asymmetric path; NTP has no way to detect this error.</div>
      {/if}
    </div>
  {/if}

  <div class="controls">
    <button onclick={animStep === -1 ? startAnimation : reset}>
      {animStep === -1 ? '▶ Run Exchange' : '↺ Reset'}
    </button>
    <div class="control-group">
      <label>
        Outbound
        <input type="range" bind:value={outboundDelay} min={5} max={100} step={5} name="outbound-delay-ms" />
        <span class="range-value">{outboundDelay}ms</span>
      </label>
    </div>
    <div class="control-group">
      <label>
        Return
        <input type="range" bind:value={returnDelay} min={5} max={100} step={5} name="return-delay-ms" />
        <span class="range-value">{returnDelay}ms</span>
      </label>
    </div>
    {#if !isSymmetric}
      <span class="asym-badge">asymmetric</span>
    {/if}
  </div>
</figure>

<style>
  .trace-viz {
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .diagram-container {
    padding: 0.75rem 0.5rem;
    display: flex;
    justify-content: center;
  }

  .handshake-svg {
    width: 100%;
    max-width: 460px;
    height: auto;
  }

  .ts-group {
    transition: opacity 0.4s ease;
  }

  .results {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .result-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .formula {
    color: var(--theme-foreground, #888);
    opacity: 0.6;
    font-size: 0.7rem;
  }

  .result {
    color: var(--theme-foreground, #ccc);
  }

  .result strong {
    color: var(--theme-green, #10b981);
  }

  .result-row.truth .result strong {
    color: var(--theme-cyan, #06b6d4);
  }

  .result-row.error .result strong {
    color: var(--theme-red, #ef4444);
  }

  .result-note {
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    margin-top: 0.25rem;
  }

  .result-note.success {
    color: var(--theme-green, #10b981);
    background: rgba(16, 185, 129, 0.08);
  }

  .result-note.warning {
    color: var(--theme-yellow, #f59e0b);
    background: rgba(245, 158, 11, 0.08);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.75rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    border: 1px solid var(--theme-separator, #444);
    background: transparent;
    color: var(--theme-foreground, #ccc);
    font-family: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: var(--theme-separator, #333);
  }

  .control-group label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
  }

  input[type='range'] {
    width: 70px;
    accent-color: var(--theme-accent, #8b5cf6);
  }

  .range-value {
    min-width: 2.5rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
  }

  .asym-badge {
    font-size: 0.6rem;
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
    background: rgba(245, 158, 11, 0.15);
    color: var(--theme-yellow, #f59e0b);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
