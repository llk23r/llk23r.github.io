<script>
  import { onDestroy } from 'svelte'

  let step = $state(0) // 0 = initial, 1 = SYN, 2 = SYN-ACK, 3 = ACK, 4 = established
  let arrowProgress = $state(0) // 0-1 for animating current arrow
  let animating = $state(false)
  let rtt = $state(50) // ms

  let animFrame = $state(null)
  let animStartTime = $state(null)

  const ARROW_DURATION = 600 // ms per arrow animation

  // Layout constants
  const VB_W = 500, VB_H = 300
  const CX = 100 // client column center
  const SX = 400 // server column center
  const TIMELINE_TOP = 70
  const ROW_HEIGHT = 60

  // Arrow Y positions for each step
  const ARROW_Y = [
    TIMELINE_TOP + 15,                    // step 1: SYN
    TIMELINE_TOP + 15 + ROW_HEIGHT,       // step 2: SYN-ACK
    TIMELINE_TOP + 15 + ROW_HEIGHT * 2,   // step 3: ACK
  ]

  // TCP states per step: [clientState, serverState]
  const TCP_STATES = [
    ['CLOSED', 'LISTEN'],
    ['SYN_SENT', 'LISTEN'],
    ['SYN_SENT', 'SYN_RECV'],
    ['ESTABLISHED', 'SYN_RECV'],
    ['ESTABLISHED', 'ESTABLISHED'],
  ]

  // Packet labels
  const PACKET_LABELS = [
    'SYN seq=1000',
    'SYN-ACK seq=5000 ack=1001',
    'ACK ack=5001',
  ]

  // Arrow directions: true = left-to-right, false = right-to-left
  const ARROW_LTR = [true, false, true]

  // Colors per arrow
  const ARROW_COLORS = [
    'var(--theme-cyan, #06b6d4)',    // SYN
    'var(--theme-yellow, #f59e0b)',  // SYN-ACK
    'var(--theme-green, #10b981)',   // ACK
  ]

  let clientState = $derived(TCP_STATES[step][0])
  let serverState = $derived(TCP_STATES[step][1])
  let handshakeDuration = $derived(1.5 * rtt)
  let isEstablished = $derived(step === 4)

  function advanceStep() {
    if (step >= 4 || animating) return
    step += 1
    if (step <= 3) {
      animating = true
      arrowProgress = 0
      animStartTime = null
      if (animFrame) cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(tickAnim)
    }
  }

  function tickAnim(timestamp) {
    if (animStartTime === null) animStartTime = timestamp
    const elapsed = timestamp - animStartTime
    arrowProgress = Math.min(elapsed / ARROW_DURATION, 1)

    if (arrowProgress >= 1) {
      animating = false
      // Auto-advance to step 4 after step 3 arrow completes
      if (step === 3) {
        step = 4
      }
      return
    }

    animFrame = requestAnimationFrame(tickAnim)
  }

  function reset() {
    if (animFrame) cancelAnimationFrame(animFrame)
    step = 0
    arrowProgress = 0
    animating = false
    animStartTime = null
  }

  // Easing function for smooth arrow animation
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  // Compute arrow line endpoints
  function getArrowLine(index, progress) {
    const y = ARROW_Y[index]
    const ltr = ARROW_LTR[index]
    const margin = 35 // gap from column center to arrow start/end
    const x1 = ltr ? CX + margin : SX - margin
    const x2 = ltr ? SX - margin : CX + margin
    const easedP = easeOutCubic(progress)
    return {
      x1,
      y1: y,
      x2: x1 + (x2 - x1) * easedP,
      y2: y,
    }
  }

  // Get label position for an arrow
  function getLabelPos(index) {
    const y = ARROW_Y[index]
    return { x: (CX + SX) / 2, y: y - 8 }
  }

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })
</script>

<figure class="trace-viz" role="img" aria-label="TCP three-way handshake step-through visualization">
  <div class="diagram-container">
    <svg viewBox="0 0 {VB_W} {VB_H}" preserveAspectRatio="xMidYMid meet" class="handshake-svg">
      <defs>
        <marker id="tcp-arrow-syn" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-cyan, #06b6d4)" />
        </marker>
        <marker id="tcp-arrow-synack" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-yellow, #f59e0b)" />
        </marker>
        <marker id="tcp-arrow-ack" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-green, #10b981)" />
        </marker>
      </defs>

      <!-- Column headers -->
      <text x={CX} y="22" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="11"
        font-family="JetBrains Mono, monospace" letter-spacing="0.08em"
        opacity="0.6">CLIENT</text>
      <text x={SX} y="22" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="11"
        font-family="JetBrains Mono, monospace" letter-spacing="0.08em"
        opacity="0.6">SERVER</text>

      <!-- Vertical timeline lines -->
      <line x1={CX} y1="30" x2={CX} y2={VB_H - 20}
        stroke="var(--theme-separator, #333)" stroke-width="1.5"
        stroke-dasharray="4,4" opacity="0.5" />
      <line x1={SX} y1="30" x2={SX} y2={VB_H - 20}
        stroke="var(--theme-separator, #333)" stroke-width="1.5"
        stroke-dasharray="4,4" opacity="0.5" />

      <!-- Client state label -->
      <g class="state-group">
        <rect x={CX - 45} y="35" width="90" height="22" rx="4"
          fill={isEstablished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(139, 92, 246, 0.08)'}
          stroke={isEstablished ? 'var(--theme-green, #10b981)' : 'var(--theme-accent, #8b5cf6)'}
          stroke-width="1" stroke-opacity="0.5" />
        <text x={CX} y="50" text-anchor="middle"
          fill={isEstablished ? 'var(--theme-green, #10b981)' : 'var(--theme-accent, #8b5cf6)'}
          font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">{clientState}</text>
      </g>

      <!-- Server state label -->
      <g class="state-group">
        <rect x={SX - 45} y="35" width="90" height="22" rx="4"
          fill={isEstablished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(139, 92, 246, 0.08)'}
          stroke={isEstablished ? 'var(--theme-green, #10b981)' : 'var(--theme-accent, #8b5cf6)'}
          stroke-width="1" stroke-opacity="0.5" />
        <text x={SX} y="50" text-anchor="middle"
          fill={isEstablished ? 'var(--theme-green, #10b981)' : 'var(--theme-accent, #8b5cf6)'}
          font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">{serverState}</text>
      </g>

      <!-- Arrows and labels for completed steps -->
      {#each [0, 1, 2] as i}
        {@const markerIds = ['url(#tcp-arrow-syn)', 'url(#tcp-arrow-synack)', 'url(#tcp-arrow-ack)']}
        {@const isCurrentStep = step === i + 1 && animating}
        {@const isCompleted = step > i + 1 || (step === i + 1 && !animating)}
        {@const isVisible = isCurrentStep || isCompleted}

        {#if isVisible}
          {@const progress = isCompleted ? 1 : arrowProgress}
          {@const line = getArrowLine(i, progress)}
          {@const label = getLabelPos(i)}

          <!-- Packet label -->
          {#if progress > 0.3}
            <text x={label.x} y={label.y} text-anchor="middle"
              fill={ARROW_COLORS[i]} font-size="8.5" font-weight="600"
              font-family="JetBrains Mono, monospace"
              opacity={Math.min(1, (progress - 0.3) / 0.3)}>
              {PACKET_LABELS[i]}
            </text>
          {/if}

          <!-- Arrow line -->
          <line
            x1={line.x1} y1={line.y1}
            x2={line.x2} y2={line.y2}
            stroke={ARROW_COLORS[i]} stroke-width="2"
            marker-end={progress >= 1 ? markerIds[i] : 'none'}
          />

          <!-- Moving dot at arrow tip during animation -->
          {#if isCurrentStep && progress < 1}
            <circle cx={line.x2} cy={line.y2} r="3"
              fill={ARROW_COLORS[i]} opacity="0.9">
            </circle>
          {/if}
        {:else if step === 0 || step <= i}
          <!-- Placeholder: dimmed arrow region -->
          {@const label = getLabelPos(i)}
          <text x={label.x} y={label.y + 8} text-anchor="middle"
            fill="var(--theme-foreground, #888)" font-size="8"
            font-family="JetBrains Mono, monospace" opacity="0.15">
            {PACKET_LABELS[i]}
          </text>
          <line
            x1={ARROW_LTR[i] ? CX + 35 : SX - 35} y1={ARROW_Y[i]}
            x2={ARROW_LTR[i] ? SX - 35 : CX + 35} y2={ARROW_Y[i]}
            stroke="var(--theme-separator, #333)" stroke-width="1"
            stroke-dasharray="4,4" opacity="0.2"
          />
        {/if}
      {/each}

      <!-- Step indicator dots -->
      {#each [0, 1, 2, 3] as i}
        <circle cx={VB_W / 2 - 22.5 + i * 15} cy={VB_H - 10} r="3"
          fill={step > i ? 'var(--theme-green, #10b981)' : 'var(--theme-separator, #444)'}
          opacity={step > i ? 0.8 : 0.3} />
      {/each}

      <!-- Established banner -->
      {#if isEstablished}
        <g class="established-fade">
          <rect x={VB_W / 2 - 80} y={ARROW_Y[2] + 22} width="160" height="24" rx="6"
            fill="rgba(16, 185, 129, 0.1)"
            stroke="var(--theme-green, #10b981)" stroke-width="1" stroke-opacity="0.4" />
          <text x={VB_W / 2} y={ARROW_Y[2] + 38} text-anchor="middle"
            fill="var(--theme-green, #10b981)" font-size="10" font-weight="700"
            font-family="JetBrains Mono, monospace">CONNECTION READY</text>
        </g>
      {/if}
    </svg>
  </div>

  <div class="controls">
    <button onclick={advanceStep} disabled={step >= 4 || animating}>
      {step === 0 ? '▶ Start' : step >= 4 ? '✓ Done' : '→ Step'}
    </button>
    <button onclick={reset}>↺ Reset</button>

    <div class="control-group">
      <label>
        RTT
        <input type="range" bind:value={rtt} min={10} max={200} step={5} name="rtt-ms" />
        <span class="range-value">{rtt}ms</span>
      </label>
    </div>

    <span class="timing-label">
      Handshake: <strong>{handshakeDuration.toFixed(0)}ms</strong>
    </span>
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
    max-width: 500px;
    height: auto;
  }

  .state-group {
    transition: all 0.3s ease;
  }

  .established-fade {
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
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

  button:hover:not(:disabled) {
    background: var(--theme-separator, #333);
  }

  button:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .control-group label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
  }

  input[type='range'] {
    width: 80px;
    accent-color: var(--theme-accent, #8b5cf6);
  }

  .range-value {
    min-width: 2.5rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
  }

  .timing-label {
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
    margin-left: auto;
  }

  .timing-label strong {
    color: var(--theme-cyan, #06b6d4);
  }
</style>
