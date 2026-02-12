<script>
  import { onMount } from 'svelte'

  // SVG layout
  const VB_W = 700
  const VB_H = 380
  const COIL_X = 350
  const COIL_Y = 140
  const COIL_W = 80
  const COIL_H = 100

  // Magnet
  const MAGNET_W = 120
  const MAGNET_H = 40
  const MAGNET_Y = COIL_Y + COIL_H / 2 - MAGNET_H / 2

  let magnetX = $state(120)
  let dragging = $state(false)
  let prevMagnetX = $state(120)
  let voltage = $state(0)

  // Voltage history for oscilloscope trace
  const HISTORY_LEN = 200
  let voltageHistory = $state(new Array(HISTORY_LEN).fill(0))
  let historyIdx = $state(0)

  // Graph area
  const GRAPH_Y = 260
  const GRAPH_H = 100
  const GRAPH_X = 60
  const GRAPH_W = VB_W - 120

  let svgEl
  let rafId = 0

  // Computed magnet velocity → induced voltage (Faraday's law: V ∝ -dΦ/dt)
  // Flux depends on how much of the magnet overlaps with the coil
  function computeVoltage(x, prevX) {
    const magnetCenter = x + MAGNET_W / 2
    const coilCenter = COIL_X + COIL_W / 2
    const dist = magnetCenter - coilCenter
    const velocity = x - prevX

    // Flux change is strongest when magnet is near coil center
    // Gaussian-like coupling factor
    const sigma = 80
    const coupling = Math.exp(-(dist * dist) / (2 * sigma * sigma))

    return -velocity * coupling * 0.8
  }

  function animate() {
    // Decay voltage toward 0 when not dragging
    if (!dragging) {
      voltage = voltage * 0.92
    }

    // Record voltage history
    voltageHistory[historyIdx] = voltage
    historyIdx = (historyIdx + 1) % HISTORY_LEN
    // Trigger reactivity
    voltageHistory = voltageHistory

    prevMagnetX = magnetX
    rafId = requestAnimationFrame(animate)
  }

  function getVoltagePath() {
    const pts = []
    for (let i = 0; i < HISTORY_LEN; i++) {
      const idx = (historyIdx + i) % HISTORY_LEN
      const x = GRAPH_X + (i / HISTORY_LEN) * GRAPH_W
      const v = voltageHistory[idx] || 0
      const y = GRAPH_Y + GRAPH_H / 2 - v * (GRAPH_H / 2) / 1.2
      const clampedY = Math.max(GRAPH_Y, Math.min(GRAPH_Y + GRAPH_H, y))
      pts.push(`${x.toFixed(1)},${clampedY.toFixed(1)}`)
    }
    return pts.join(' ')
  }

  // Pointer events for dragging
  function onPointerDown(e) {
    const svg = svgEl
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse())

    // Check if pointer is on magnet
    if (svgPt.x >= magnetX && svgPt.x <= magnetX + MAGNET_W &&
        svgPt.y >= MAGNET_Y - 10 && svgPt.y <= MAGNET_Y + MAGNET_H + 10) {
      dragging = true
      e.preventDefault()
    }
  }

  function onPointerMove(e) {
    if (!dragging) return
    const svg = svgEl
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse())

    const newX = Math.max(20, Math.min(VB_W - MAGNET_W - 20, svgPt.x - MAGNET_W / 2))
    voltage = computeVoltage(newX, magnetX)
    magnetX = newX
    e.preventDefault()
  }

  function onPointerUp() {
    dragging = false
  }

  onMount(() => {
    rafId = requestAnimationFrame(animate)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
    }
  })

  // Coil winding paths (decorative loops)
  const coilLoops = Array.from({ length: 6 }, (_, i) => {
    const y = COIL_Y + 8 + i * (COIL_H - 16) / 5
    return `M${COIL_X},${y} C${COIL_X - 12},${y - 6} ${COIL_X - 12},${y + 6} ${COIL_X},${y} C${COIL_X + COIL_W + 12},${y - 6} ${COIL_X + COIL_W + 12},${y + 6} ${COIL_X + COIL_W},${y}`
  })

  // Field lines from magnet
  function getFieldLines(mx) {
    const lines = []
    const rightPole = mx + MAGNET_W
    const midY = MAGNET_Y + MAGNET_H / 2
    for (let i = -2; i <= 2; i++) {
      const spread = i * 18
      const startY = midY + spread * 0.3
      const endY = midY + spread
      lines.push(`M${rightPole},${startY} C${rightPole + 40},${startY + spread * 0.5} ${rightPole + 60},${endY} ${rightPole + 80},${endY}`)
    }
    return lines
  }

  let magnetCenterRelCoil = $derived(magnetX + MAGNET_W / 2 - (COIL_X + COIL_W / 2))
  let coilGlow = $derived(Math.abs(voltage) > 0.05 ? Math.min(1, Math.abs(voltage) * 2) : 0)
</script>

<figure class="trace-viz" role="img" aria-label="Faraday induction: drag magnet through coil to generate voltage">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {VB_W} {VB_H}"
    width="100%"
    onpointerdown={onPointerDown}
    style="touch-action: none;"
  >
    <!-- Field lines from magnet N pole -->
    {#each getFieldLines(magnetX) as d}
      <path {d} fill="none" stroke="var(--viz-field)" stroke-width="1" opacity="0.3" />
    {/each}

    <!-- Coil body -->
    <rect
      x={COIL_X} y={COIL_Y}
      width={COIL_W} height={COIL_H}
      rx="4"
      fill="none"
      stroke="var(--viz-coil)"
      stroke-width="2.5"
      opacity={0.4 + coilGlow * 0.6}
    />

    <!-- Coil windings -->
    {#each coilLoops as d}
      <path {d} fill="none" stroke="var(--viz-coil)" stroke-width="1.5" opacity={0.3 + coilGlow * 0.4} />
    {/each}

    <!-- Coil glow when voltage induced -->
    {#if coilGlow > 0}
      <rect
        x={COIL_X - 4} y={COIL_Y - 4}
        width={COIL_W + 8} height={COIL_H + 8}
        rx="6"
        fill="var(--viz-coil)"
        opacity={coilGlow * 0.15}
      />
    {/if}

    <!-- Coil label -->
    <text
      x={COIL_X + COIL_W / 2} y={COIL_Y - 10}
      text-anchor="middle" font-size="11"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text-muted)"
    >Coil</text>

    <!-- Magnet -->
    <g style="cursor: grab;" class:dragging>
      <!-- Magnet body -->
      <rect
        x={magnetX} y={MAGNET_Y}
        width={MAGNET_W} height={MAGNET_H}
        rx="6"
        fill="var(--viz-bg)"
        stroke="var(--viz-text-muted)"
        stroke-width="1.5"
      />
      <!-- N pole (red) -->
      <rect
        x={magnetX + MAGNET_W / 2} y={MAGNET_Y}
        width={MAGNET_W / 2} height={MAGNET_H}
        rx="0"
        fill="var(--viz-n-pole)"
        opacity="0.8"
      />
      <!-- Round right end -->
      <rect
        x={magnetX + MAGNET_W - 6} y={MAGNET_Y}
        width={6} height={MAGNET_H}
        rx="6"
        fill="var(--viz-n-pole)"
        opacity="0.8"
      />
      <!-- S pole (blue) -->
      <rect
        x={magnetX} y={MAGNET_Y}
        width={MAGNET_W / 2} height={MAGNET_H}
        rx="0"
        fill="var(--viz-s-pole)"
        opacity="0.8"
      />
      <!-- Round left end -->
      <rect
        x={magnetX} y={MAGNET_Y}
        width={6} height={MAGNET_H}
        rx="6"
        fill="var(--viz-s-pole)"
        opacity="0.8"
      />
      <!-- Labels -->
      <text
        x={magnetX + MAGNET_W * 0.25} y={MAGNET_Y + MAGNET_H / 2 + 5}
        text-anchor="middle" font-size="16" font-weight="700"
        font-family="'JetBrains Mono', monospace"
        fill="#fff"
      >S</text>
      <text
        x={magnetX + MAGNET_W * 0.75} y={MAGNET_Y + MAGNET_H / 2 + 5}
        text-anchor="middle" font-size="16" font-weight="700"
        font-family="'JetBrains Mono', monospace"
        fill="#fff"
      >N</text>
    </g>

    <!-- Drag hint -->
    <text
      x={magnetX + MAGNET_W / 2} y={MAGNET_Y + MAGNET_H + 20}
      text-anchor="middle" font-size="10"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text-muted)" opacity="0.6"
    >← drag magnet →</text>

    <!-- Voltage graph area -->
    <rect
      x={GRAPH_X} y={GRAPH_Y}
      width={GRAPH_W} height={GRAPH_H}
      fill="none"
      stroke="var(--viz-axis)"
      stroke-width="1"
    />

    <!-- Zero line -->
    <line
      x1={GRAPH_X} y1={GRAPH_Y + GRAPH_H / 2}
      x2={GRAPH_X + GRAPH_W} y2={GRAPH_Y + GRAPH_H / 2}
      stroke="var(--viz-text-muted)" stroke-width="0.5" stroke-dasharray="4 3"
    />

    <!-- Graph labels -->
    <text
      x={GRAPH_X - 8} y={GRAPH_Y + 8}
      text-anchor="end" font-size="9"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text-muted)"
    >+V</text>
    <text
      x={GRAPH_X - 8} y={GRAPH_Y + GRAPH_H - 2}
      text-anchor="end" font-size="9"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text-muted)"
    >−V</text>
    <text
      x={GRAPH_X + GRAPH_W / 2} y={GRAPH_Y - 8}
      text-anchor="middle" font-size="11" font-weight="600"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text)"
    >Induced Voltage (EMF)</text>

    <!-- Voltage trace -->
    <polyline
      points={getVoltagePath()}
      fill="none"
      stroke="var(--viz-voltage)"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <!-- Current voltage indicator -->
    <text
      x={GRAPH_X + GRAPH_W} y={GRAPH_Y + GRAPH_H + 18}
      text-anchor="end" font-size="11"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-voltage)"
    >V = {voltage.toFixed(2)}</text>

    <!-- Faraday's law label -->
    <text
      x={GRAPH_X} y={GRAPH_Y + GRAPH_H + 18}
      font-size="10"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text-muted)"
    >EMF = −dΦ/dt</text>
  </svg>
</figure>

<style>
  .trace-viz {
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);
    --viz-bg: var(--theme-background, #1a1a2e);
    --viz-axis: var(--theme-separator, #555);
    --viz-coil: var(--theme-yellow, #f59e0b);
    --viz-n-pole: var(--theme-red, #ef4444);
    --viz-s-pole: var(--theme-blue, #3b82f6);
    --viz-field: var(--theme-foreground, #888);
    --viz-voltage: var(--theme-green, #10b981);
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  svg {
    display: block;
    user-select: none;
  }

  .dragging {
    cursor: grabbing !important;
  }
</style>
