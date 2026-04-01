<script>
  import { onDestroy } from 'svelte'

  let step = $state(0) // 0 = initial, 1 = ClientHello, 2 = ServerHello, 3 = Verifying, 4 = Finished, 5 = encrypted
  let arrowProgress = $state(0) // 0-1 for animating current arrow
  let animating = $state(false)
  let verifyProgress = $state(0) // 0-1 for cert verification animation

  let animFrame = $state(null)
  let animStartTime = $state(null)

  const ARROW_DURATION = 600 // ms per arrow animation
  const VERIFY_DURATION = 800 // ms for cert verification pause

  // Layout constants
  const VB_W = 500, VB_H = 320
  const CX = 100 // browser column center
  const SX = 400 // server column center
  const TIMELINE_TOP = 70
  const ROW_HEIGHT = 55

  // Arrow Y positions for steps with arrows (1, 2, 4)
  const ARROW_Y = {
    1: TIMELINE_TOP + 15,                   // step 1: ClientHello
    2: TIMELINE_TOP + 15 + ROW_HEIGHT,      // step 2: ServerHello + Cert + Finished
    4: TIMELINE_TOP + 15 + ROW_HEIGHT * 3,  // step 4: Finished
  }

  // Verify badge Y position (step 3)
  const VERIFY_Y = TIMELINE_TOP + 15 + ROW_HEIGHT * 2

  // TLS states per step: [browserState, serverState]
  const TLS_STATES = [
    ['READY', 'LISTENING'],
    ['WAITING', 'LISTENING'],
    ['WAITING', 'KEYS DERIVED'],
    ['CERT VERIFIED', 'KEYS DERIVED'],
    ['CERT VERIFIED', 'KEYS DERIVED'],
    ['ENCRYPTED \u2713', 'ENCRYPTED \u2713'],
  ]

  // Packet labels for arrow steps
  const PACKET_LABELS = {
    1: 'ClientHello: cipher suites, key share',
    2: 'ServerHello + Cert + Finished',
    4: 'Finished',
  }

  // Arrow directions: true = left-to-right, false = right-to-left
  const ARROW_LTR = { 1: true, 2: false, 4: true }

  // Colors per arrow step
  const ARROW_COLORS = {
    1: 'var(--theme-cyan, #06b6d4)',    // ClientHello
    2: 'var(--theme-yellow, #f59e0b)',  // ServerHello
    4: 'var(--theme-green, #10b981)',   // Finished
  }

  // Marker IDs per arrow step
  const MARKER_IDS = {
    1: 'url(#tls-arrow-clienthello)',
    2: 'url(#tls-arrow-serverhello)',
    4: 'url(#tls-arrow-finished)',
  }

  let browserState = $derived(TLS_STATES[step][0])
  let serverState = $derived(TLS_STATES[step][1])
  let isEncrypted = $derived(step === 5)
  let isWaiting = $derived(step === 1 || step === 2)
  let isVerifying = $derived(step === 3)

  // State badge color logic
  let browserBadgeColor = $derived(
    isEncrypted ? 'var(--theme-green, #10b981)'
    : (isWaiting || isVerifying) ? 'var(--theme-yellow, #f59e0b)'
    : 'var(--theme-accent, #8b5cf6)'
  )
  let browserBadgeBg = $derived(
    isEncrypted ? 'rgba(16, 185, 129, 0.12)'
    : (isWaiting || isVerifying) ? 'rgba(245, 158, 11, 0.1)'
    : 'rgba(139, 92, 246, 0.08)'
  )
  let browserBadgeStroke = $derived(browserBadgeColor)

  let serverBadgeColor = $derived(
    isEncrypted ? 'var(--theme-green, #10b981)'
    : step >= 2 ? 'var(--theme-yellow, #f59e0b)'
    : 'var(--theme-accent, #8b5cf6)'
  )
  let serverBadgeBg = $derived(
    isEncrypted ? 'rgba(16, 185, 129, 0.12)'
    : step >= 2 ? 'rgba(245, 158, 11, 0.1)'
    : 'rgba(139, 92, 246, 0.08)'
  )
  let serverBadgeStroke = $derived(serverBadgeColor)

  const ARROW_STEPS = [1, 2, 4]

  function advanceStep() {
    if (step >= 5 || animating) return
    step += 1

    if (step === 1 || step === 2 || step === 4) {
      // Animate arrow
      animating = true
      arrowProgress = 0
      animStartTime = null
      if (animFrame) cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(tickArrowAnim)
    } else if (step === 3) {
      // Animate verification
      animating = true
      verifyProgress = 0
      animStartTime = null
      if (animFrame) cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(tickVerifyAnim)
    }
  }

  function tickArrowAnim(timestamp) {
    if (animStartTime === null) animStartTime = timestamp
    const elapsed = timestamp - animStartTime
    arrowProgress = Math.min(elapsed / ARROW_DURATION, 1)

    if (arrowProgress >= 1) {
      animating = false
      // Auto-advance to encrypted after Finished arrow completes
      if (step === 4) {
        step = 5
      }
      return
    }

    animFrame = requestAnimationFrame(tickArrowAnim)
  }

  function tickVerifyAnim(timestamp) {
    if (animStartTime === null) animStartTime = timestamp
    const elapsed = timestamp - animStartTime
    verifyProgress = Math.min(elapsed / VERIFY_DURATION, 1)

    if (verifyProgress >= 1) {
      animating = false
      return
    }

    animFrame = requestAnimationFrame(tickVerifyAnim)
  }

  function reset() {
    if (animFrame) cancelAnimationFrame(animFrame)
    step = 0
    arrowProgress = 0
    verifyProgress = 0
    animating = false
    animStartTime = null
  }

  // Easing function for smooth arrow animation
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  // Compute arrow line endpoints
  function getArrowLine(arrowStep, progress) {
    const y = ARROW_Y[arrowStep]
    const ltr = ARROW_LTR[arrowStep]
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
  function getLabelPos(arrowStep) {
    const y = ARROW_Y[arrowStep]
    return { x: (CX + SX) / 2, y: y - 8 }
  }

  // Determine if an arrow step is completed
  function isArrowCompleted(arrowStep) {
    if (arrowStep === 1) return step > 1 || (step === 1 && !animating)
    if (arrowStep === 2) return step > 2 || (step === 2 && !animating)
    if (arrowStep === 4) return step > 4 || (step === 4 && !animating)
    return false
  }

  // Determine if an arrow step is currently animating
  function isArrowAnimating(arrowStep) {
    return step === arrowStep && animating
  }

  // Placeholder labels for dimmed upcoming arrows
  const PLACEHOLDER_LABELS = {
    1: 'ClientHello',
    2: 'ServerHello + Cert',
    4: 'Finished',
  }

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })
</script>

<figure class="trace-viz" role="img" aria-label="TLS 1.3 handshake showing ClientHello, ServerHello with certificate, and encryption establishment">
  <div class="diagram-container">
    <svg viewBox="0 0 {VB_W} {VB_H}" preserveAspectRatio="xMidYMid meet" class="handshake-svg">
      <defs>
        <marker id="tls-arrow-clienthello" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-cyan, #06b6d4)" />
        </marker>
        <marker id="tls-arrow-serverhello" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-yellow, #f59e0b)" />
        </marker>
        <marker id="tls-arrow-finished" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-green, #10b981)" />
        </marker>
        <!-- Glow filter for ENCRYPTED badge -->
        <filter id="tls-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Column headers -->
      <text x={CX} y="22" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="11"
        font-family="JetBrains Mono, monospace" letter-spacing="0.08em"
        opacity="0.6">BROWSER</text>
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

      <!-- Browser state badge -->
      <g class="state-group">
        <rect x={CX - 50} y="35" width="100" height="22" rx="4"
          fill={browserBadgeBg}
          stroke={browserBadgeStroke}
          stroke-width="1" stroke-opacity="0.5" />
        <text x={CX} y="50" text-anchor="middle"
          fill={browserBadgeColor}
          font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">{browserState}</text>
      </g>

      <!-- Server state badge -->
      <g class="state-group">
        <rect x={SX - 50} y="35" width="100" height="22" rx="4"
          fill={serverBadgeBg}
          stroke={serverBadgeStroke}
          stroke-width="1" stroke-opacity="0.5" />
        <text x={SX} y="50" text-anchor="middle"
          fill={serverBadgeColor}
          font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">{serverState}</text>
      </g>

      <!-- Arrows for steps 1, 2, 4 -->
      {#each ARROW_STEPS as arrowStep}
        {@const isCurrent = isArrowAnimating(arrowStep)}
        {@const isComplete = isArrowCompleted(arrowStep)}
        {@const isVisible = isCurrent || isComplete}

        {#if isVisible}
          {@const progress = isComplete ? 1 : arrowProgress}
          {@const line = getArrowLine(arrowStep, progress)}
          {@const label = getLabelPos(arrowStep)}

          <!-- Packet label -->
          {#if progress > 0.3}
            <text x={label.x} y={label.y} text-anchor="middle"
              fill={ARROW_COLORS[arrowStep]} font-size="8" font-weight="600"
              font-family="JetBrains Mono, monospace"
              opacity={Math.min(1, (progress - 0.3) / 0.3)}>
              {PACKET_LABELS[arrowStep]}
            </text>
          {/if}

          <!-- Arrow line -->
          <line
            x1={line.x1} y1={line.y1}
            x2={line.x2} y2={line.y2}
            stroke={ARROW_COLORS[arrowStep]} stroke-width="2"
            marker-end={progress >= 1 ? MARKER_IDS[arrowStep] : 'none'}
          />

          <!-- Moving dot at arrow tip during animation -->
          {#if isCurrent && progress < 1}
            <circle cx={line.x2} cy={line.y2} r="3"
              fill={ARROW_COLORS[arrowStep]} opacity="0.9">
            </circle>
          {/if}
        {:else}
          <!-- Placeholder: dimmed arrow region -->
          {@const label = getLabelPos(arrowStep)}
          <text x={label.x} y={label.y + 8} text-anchor="middle"
            fill="var(--theme-foreground, #888)" font-size="8"
            font-family="JetBrains Mono, monospace" opacity="0.15">
            {PLACEHOLDER_LABELS[arrowStep]}
          </text>
          <line
            x1={ARROW_LTR[arrowStep] ? CX + 35 : SX - 35} y1={ARROW_Y[arrowStep]}
            x2={ARROW_LTR[arrowStep] ? SX - 35 : CX + 35} y2={ARROW_Y[arrowStep]}
            stroke="var(--theme-separator, #333)" stroke-width="1"
            stroke-dasharray="4,4" opacity="0.2"
          />
        {/if}
      {/each}

      <!-- Step 3: Cert verification on browser side -->
      {#if step >= 3}
        {@const verifyOpacity = step === 3 ? verifyProgress : 1}
        <g opacity={verifyOpacity}>
          <rect x={CX - 55} y={VERIFY_Y - 12} width="110" height="22" rx="4"
            fill="rgba(245, 158, 11, 0.1)"
            stroke="var(--theme-yellow, #f59e0b)"
            stroke-width="1" stroke-opacity="0.5" />
          <text x={CX} y={VERIFY_Y + 3} text-anchor="middle"
            fill="var(--theme-yellow, #f59e0b)" font-size="8.5" font-weight="600"
            font-family="JetBrains Mono, monospace">
            {step === 3 && animating ? 'Verifying cert...' : 'Cert verified \u2713'}
          </text>
        </g>
        <!-- Dotted connector from timeline to verify badge -->
        <line x1={CX} y1={VERIFY_Y - 12} x2={CX} y2={VERIFY_Y + 10}
          stroke="var(--theme-yellow, #f59e0b)" stroke-width="1"
          stroke-dasharray="2,2" opacity="0.3" />
      {:else}
        <!-- Placeholder for verification step -->
        <text x={CX} y={VERIFY_Y + 3} text-anchor="middle"
          fill="var(--theme-foreground, #888)" font-size="8"
          font-family="JetBrains Mono, monospace" opacity="0.15">
          Verify cert
        </text>
      {/if}

      <!-- 1 RTT timing annotation -->
      {#if step >= 2}
        {@const rttX = 38}
        {@const rttY1 = ARROW_Y[1]}
        {@const rttY2 = ARROW_Y[4]}
        <line x1={rttX} y1={rttY1} x2={rttX} y2={rttY2}
          stroke="var(--theme-cyan, #06b6d4)" stroke-width="1"
          stroke-opacity="0.4" />
        <!-- Top tick -->
        <line x1={rttX - 4} y1={rttY1} x2={rttX + 4} y2={rttY1}
          stroke="var(--theme-cyan, #06b6d4)" stroke-width="1"
          stroke-opacity="0.4" />
        <!-- Bottom tick -->
        <line x1={rttX - 4} y1={rttY2} x2={rttX + 4} y2={rttY2}
          stroke="var(--theme-cyan, #06b6d4)" stroke-width="1"
          stroke-opacity="0.4" />
        <!-- Label -->
        <text x={rttX} y={(rttY1 + rttY2) / 2 + 3} text-anchor="middle"
          fill="var(--theme-cyan, #06b6d4)" font-size="8" font-weight="700"
          font-family="JetBrains Mono, monospace" opacity="0.7">
          1 RTT
        </text>
      {/if}

      <!-- Step indicator dots -->
      {#each [0, 1, 2, 3, 4] as i}
        <circle cx={VB_W / 2 - 30 + i * 15} cy={VB_H - 10} r="3"
          fill={step > i ? 'var(--theme-green, #10b981)' : 'var(--theme-separator, #444)'}
          opacity={step > i ? 0.8 : 0.3} />
      {/each}

      <!-- Encrypted banner -->
      {#if isEncrypted}
        <g class="encrypted-fade" filter="url(#tls-glow)">
          <rect x={VB_W / 2 - 80} y={ARROW_Y[4] + 22} width="160" height="24" rx="6"
            fill="rgba(16, 185, 129, 0.1)"
            stroke="var(--theme-green, #10b981)" stroke-width="1" stroke-opacity="0.4" />
          <text x={VB_W / 2} y={ARROW_Y[4] + 38} text-anchor="middle"
            fill="var(--theme-green, #10b981)" font-size="10" font-weight="700"
            font-family="JetBrains Mono, monospace">ENCRYPTED \u2713</text>
        </g>
      {/if}
    </svg>
  </div>

  <div class="controls">
    <button onclick={advanceStep} disabled={step >= 5 || animating}>
      {step === 0 ? '\u25B6 Start' : step >= 5 ? '\u2713 Done' : '\u2192 Step'}
    </button>
    <button onclick={reset}>\u21BA Reset</button>

    <span class="timing-label">
      TLS 1.3: <strong>1-RTT handshake</strong>
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

  .encrypted-fade {
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

  .timing-label {
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
    margin-left: auto;
  }

  .timing-label strong {
    color: var(--theme-cyan, #06b6d4);
  }
</style>
