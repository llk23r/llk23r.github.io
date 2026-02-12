<script>
  import { onMount } from 'svelte'

  // ── Physics ──
  const WIRE_LENGTH_M = 15
  const SIGNAL_SPEED = 2e8  // m/s (~2/3 c in copper)
  const DRIFT_SPEED = 2.5e-5  // m/s (0.025 mm/s)
  const SIGNAL_TRANSIT_S = WIRE_LENGTH_M / SIGNAL_SPEED  // ~75 ns
  const ELECTRON_DRIFT_IN_TRANSIT = DRIFT_SPEED * SIGNAL_TRANSIT_S  // ~1.875e-12 m

  // ── Animation timing ──
  const FIELD_ANIM_DURATION_MS = 1000
  const HOLD_DELAY_MS = 300
  const TOTAL_ANIM_MS = FIELD_ANIM_DURATION_MS + HOLD_DELAY_MS + 2000

  // ── SVG layout ──
  const VB_W = 800
  const VB_H = 430
  const WIRE_X_START = 80
  const WIRE_X_END = 720
  const WIRE_VIEW_W = WIRE_X_END - WIRE_X_START

  const ELECTRON_VIEW_Y = 20
  const ELECTRON_VIEW_H = 140
  const ELECTRON_VIEW_MID = ELECTRON_VIEW_Y + ELECTRON_VIEW_H / 2

  const FIELD_VIEW_Y = 200
  const FIELD_VIEW_H = 140
  const FIELD_VIEW_MID = FIELD_VIEW_Y + FIELD_VIEW_H / 2

  const CONTROLS_Y = 380
  const NUM_ELECTRONS = 7

  // ── State ──
  let phase = $state('idle')
  let fieldProgress = $state(0)
  let elapsedMs = $state(0)
  let showCallout = $state(false)
  let rafId = 0
  let startTime = 0

  // ── Electron init ──
  function initElectrons() {
    const arr = []
    const spacing = WIRE_VIEW_W / (NUM_ELECTRONS + 1)
    for (let i = 0; i < NUM_ELECTRONS; i++) {
      arr.push({
        baseX: WIRE_X_START + spacing * (i + 1),
        y: ELECTRON_VIEW_MID + (Math.random() - 0.5) * 40,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }

  let electrons = $state(initElectrons())

  // ── Derived values ──
  let maxVisualDrift = 0.3
  let electronDriftPx = $derived(fieldProgress * maxVisualDrift)
  let simTimeFraction = $derived(Math.min(fieldProgress, 1))
  let electronDistanceM = $derived(simTimeFraction * ELECTRON_DRIFT_IN_TRANSIT)
  let fieldDistanceM = $derived(simTimeFraction * WIRE_LENGTH_M)
  let fieldX = $derived(WIRE_X_START + fieldProgress * WIRE_VIEW_W)

  // Trailing wave lines
  let trailingWaves = $derived.by(() => {
    if (fieldProgress <= 0.05) return []
    const count = Math.min(12, Math.floor(fieldProgress * 14))
    const waves = []
    for (let i = 0; i < count; i++) {
      const waveX = fieldX - (i + 1) * 40
      if (waveX < WIRE_X_START) continue
      const fade = 1 - (i / 12)
      waves.push({ x: waveX, opacity: fade * 0.5 })
    }
    return waves
  })

  // Lattice dots (20 x 3 grid)
  const latticeDots = []
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 3; j++) {
      latticeDots.push({
        cx: WIRE_X_START + 16 + i * 33,
        cy: ELECTRON_VIEW_Y + 40 + j * 27,
      })
    }
  }

  // ── Format helpers ──
  function formatDistance(meters) {
    if (meters === 0) return '0 mm'
    if (meters < 1e-9) return `${(meters * 1e12).toFixed(6)} pm`
    if (meters < 1e-6) return `${(meters * 1e9).toFixed(6)} nm`
    if (meters < 1e-3) return `${(meters * 1e6).toFixed(6)} \u00B5m`
    return `${(meters * 1e3).toFixed(6)} mm`
  }

  function formatTime(ms) {
    if (ms === 0) return '0 ns'
    const simNs = (ms / FIELD_ANIM_DURATION_MS) * (SIGNAL_TRANSIT_S * 1e9)
    if (simNs < 1000) return `${simNs.toFixed(1)} ns`
    return `${(simNs / 1000).toFixed(2)} \u00B5s`
  }

  // ── Animation ──
  function animate(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime

    fieldProgress = Math.min(1, elapsed / FIELD_ANIM_DURATION_MS)
    elapsedMs = elapsed

    if (elapsed >= FIELD_ANIM_DURATION_MS + HOLD_DELAY_MS) {
      showCallout = true
    }

    if (elapsed >= TOTAL_ANIM_MS) {
      phase = 'done'
      return
    }

    rafId = requestAnimationFrame(animate)
  }

  function handleStart() {
    phase = 'running'
    fieldProgress = 0
    elapsedMs = 0
    showCallout = false
    startTime = 0
    electrons = initElectrons()
    rafId = requestAnimationFrame(animate)
  }

  function handleReset() {
    cancelAnimationFrame(rafId)
    phase = 'idle'
    fieldProgress = 0
    elapsedMs = 0
    showCallout = false
    startTime = 0
    electrons = initElectrons()
  }

  onMount(() => {
    return () => cancelAnimationFrame(rafId)
  })
</script>

<figure class="trace-viz" role="img" aria-label="Interactive comparison of electron drift speed vs electromagnetic signal speed in a copper wire">
  <svg viewBox="0 0 {VB_W} {VB_H}" width="100%" class="drift-svg">
    <defs>
      <!-- Copper wire gradient -->
      <linearGradient id="dvs-wire-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--viz-wire, #b87333)" stop-opacity="0.15" />
        <stop offset="50%" stop-color="var(--viz-wire, #b87333)" stop-opacity="0.25" />
        <stop offset="100%" stop-color="var(--viz-wire, #b87333)" stop-opacity="0.15" />
      </linearGradient>

      <!-- Field pulse glow -->
      <radialGradient id="dvs-pulse-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="var(--viz-field-pulse, #f59e0b)" stop-opacity="0.9" />
        <stop offset="40%" stop-color="var(--viz-field-pulse, #f59e0b)" stop-opacity="0.5" />
        <stop offset="100%" stop-color="var(--viz-field-pulse, #f59e0b)" stop-opacity="0" />
      </radialGradient>

      <!-- Clip paths -->
      <clipPath id="dvs-clip-electron">
        <rect x={WIRE_X_START} y={ELECTRON_VIEW_Y + 20} width={WIRE_VIEW_W} height={ELECTRON_VIEW_H - 40} rx="8" />
      </clipPath>
      <clipPath id="dvs-clip-field">
        <rect x={WIRE_X_START} y={FIELD_VIEW_Y + 20} width={WIRE_VIEW_W} height={FIELD_VIEW_H - 40} rx="8" />
      </clipPath>
    </defs>

    <!-- ═══ TOP VIEW: Electron Drift ═══ -->

    <!-- Section label -->
    <text x={WIRE_X_START} y={ELECTRON_VIEW_Y + 12}
      fill="var(--viz-electron, #06b6d4)" font-size="12" font-weight="600"
      font-family="'JetBrains Mono', monospace">Electron View (zoomed in)</text>

    <!-- Wire body -->
    <rect x={WIRE_X_START} y={ELECTRON_VIEW_Y + 20}
      width={WIRE_VIEW_W} height={ELECTRON_VIEW_H - 40} rx="8"
      fill="url(#dvs-wire-bg)"
      stroke="var(--viz-wire, #b87333)" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Lattice dots -->
    <g opacity="0.12">
      {#each latticeDots as dot}
        <circle cx={dot.cx} cy={dot.cy} r="2" fill="var(--viz-wire, #b87333)" />
      {/each}
    </g>

    <!-- Electron particles -->
    <g clip-path="url(#dvs-clip-electron)">
      {#each electrons as e, i}
        {@const jitterX = Math.sin(e.phase + (elapsedMs / 400)) * 1.5}
        {@const jitterY = Math.cos(e.phase * 1.7 + (elapsedMs / 500)) * 1}
        {@const x = e.baseX + electronDriftPx + jitterX}
        {@const y = e.y + jitterY}
        <!-- Glow -->
        <circle cx={x} cy={y} r="9" fill="var(--viz-electron, #06b6d4)" opacity="0.15" />
        <!-- Body -->
        <circle cx={x} cy={y} r="5" fill="var(--viz-electron, #06b6d4)" opacity="0.85" />
        <!-- Label -->
        <text x={x} y={y + 1} text-anchor="middle" dominant-baseline="central"
          fill="#fff" font-size="7" font-weight="700"
          font-family="'JetBrains Mono', monospace">e&#x207B;</text>
      {/each}
    </g>

    <!-- Speed label -->
    <text x={WIRE_X_END} y={ELECTRON_VIEW_Y + ELECTRON_VIEW_H + 2}
      text-anchor="end" fill="var(--viz-text-muted, #888)" font-size="11"
      font-family="'JetBrains Mono', monospace">Drift speed: ~0.025 mm/s</text>

    <!-- Distance counter -->
    <text x={WIRE_X_START} y={ELECTRON_VIEW_Y + ELECTRON_VIEW_H + 2}
      fill="var(--viz-electron, #06b6d4)" font-size="11" font-weight="600"
      font-family="'JetBrains Mono', monospace">
      {phase === 'idle' ? 'Moved: ---' : `Moved: ${formatDistance(electronDistanceM)}`}
    </text>

    <!-- ═══ BOTTOM VIEW: Field Propagation ═══ -->

    <!-- Section label -->
    <text x={WIRE_X_START} y={FIELD_VIEW_Y + 12}
      fill="var(--viz-field-pulse, #f59e0b)" font-size="12" font-weight="600"
      font-family="'JetBrains Mono', monospace">Field View (electromagnetic signal)</text>

    <!-- Wire body -->
    <rect x={WIRE_X_START} y={FIELD_VIEW_Y + 20}
      width={WIRE_VIEW_W} height={FIELD_VIEW_H - 40} rx="8"
      fill="url(#dvs-wire-bg)"
      stroke="var(--viz-wire, #b87333)" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Field pulse wavefront -->
    {#if phase !== 'idle'}
      <g clip-path="url(#dvs-clip-field)">
        <!-- Illuminated region behind wavefront -->
        <rect x={WIRE_X_START} y={FIELD_VIEW_Y + 20}
          width={Math.max(0, fieldX - WIRE_X_START)} height={FIELD_VIEW_H - 40}
          fill="var(--viz-field-pulse, #f59e0b)" opacity="0.08" />

        <!-- Wavefront line -->
        <line x1={fieldX} y1={FIELD_VIEW_Y + 20} x2={fieldX} y2={FIELD_VIEW_Y + FIELD_VIEW_H - 20}
          stroke="var(--viz-field-pulse, #f59e0b)" stroke-width="3" stroke-opacity="0.9" />

        <!-- Glow around wavefront -->
        <ellipse cx={fieldX} cy={FIELD_VIEW_MID} rx="18" ry={(FIELD_VIEW_H - 40) / 2}
          fill="url(#dvs-pulse-glow)" opacity={fieldProgress < 1 ? 0.7 : 0.3} />

        <!-- Trailing wave lines -->
        {#each trailingWaves as wave}
          <line x1={wave.x} y1={FIELD_VIEW_Y + 30} x2={wave.x} y2={FIELD_VIEW_Y + FIELD_VIEW_H - 30}
            stroke="var(--viz-field-pulse, #f59e0b)" stroke-width="1" stroke-opacity={wave.opacity} />
        {/each}
      </g>
    {/if}

    <!-- Speed label -->
    <text x={WIRE_X_END} y={FIELD_VIEW_Y + FIELD_VIEW_H + 2}
      text-anchor="end" fill="var(--viz-text-muted, #888)" font-size="11"
      font-family="'JetBrains Mono', monospace">Signal speed: ~200,000 km/s (&#x2154;c)</text>

    <!-- Distance counter -->
    <text x={WIRE_X_START} y={FIELD_VIEW_Y + FIELD_VIEW_H + 2}
      fill="var(--viz-field-pulse, #f59e0b)" font-size="11" font-weight="600"
      font-family="'JetBrains Mono', monospace">
      {phase === 'idle' ? 'Traveled: ---' : `Traveled: ${fieldDistanceM >= WIRE_LENGTH_M ? '15.00' : fieldDistanceM.toFixed(2)} m`}
    </text>

    <!-- ═══ CALLOUT ═══ -->
    {#if showCallout}
      <g class="callout-fade">
        <rect x={VB_W / 2 - 260} y={CONTROLS_Y - 34} width="520" height="44" rx="10"
          fill="var(--viz-bg, rgba(0,0,0,0.6))"
          stroke="var(--viz-field-pulse, #f59e0b)" stroke-width="1.5" stroke-opacity="0.6" />
        <text x={VB_W / 2} y={CONTROLS_Y - 16} text-anchor="middle"
          fill="var(--viz-text, #ccc)" font-size="12" font-weight="600"
          font-family="'JetBrains Mono', monospace">
          The field arrived in ~75 ns. The electron moved:
          <tspan fill="var(--viz-electron, #06b6d4)" font-weight="700">{formatDistance(ELECTRON_DRIFT_IN_TRANSIT)}</tspan>
        </text>
      </g>
    {/if}

    <!-- ═══ ELAPSED TIME ═══ -->
    {#if phase !== 'idle'}
      <text x={VB_W / 2} y={CONTROLS_Y + 20} text-anchor="middle"
        fill="var(--viz-text-muted, #888)" font-size="11"
        font-family="'JetBrains Mono', monospace">
        Simulated time: {formatTime(Math.min(elapsedMs, FIELD_ANIM_DURATION_MS))}
      </text>
    {/if}
  </svg>

  <!-- Controls -->
  <div class="controls">
    {#if phase === 'idle'}
      <button class="start-btn" onclick={handleStart}>&#x26A1; Flip the switch</button>
    {:else if phase === 'running'}
      <span class="status-label">Signal propagating...</span>
    {:else}
      <span class="status-label">Ratio: ~2 &#x00D7; 10&#x00B9;&#x00B3;</span>
      <button onclick={handleReset}>&#x21BA; Reset</button>
    {/if}
  </div>
</figure>

<style>
  .trace-viz {
    --viz-wire: var(--theme-yellow, #b87333);
    --viz-electron: var(--theme-cyan, #06b6d4);
    --viz-field-pulse: var(--theme-yellow, #f59e0b);
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);
    --viz-bg: rgba(0, 0, 0, 0.6);

    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .drift-svg {
    display: block;
    height: auto;
  }

  .callout-fade {
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.6rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.8rem;
  }

  button {
    padding: 0.3rem 0.85rem;
    border-radius: 4px;
    border: 1px solid var(--theme-separator, #444);
    background: transparent;
    color: var(--theme-foreground, #ccc);
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: var(--theme-separator, #333);
  }

  .start-btn {
    font-size: 0.95rem;
    padding: 0.5rem 1.5rem;
    border-color: var(--theme-yellow, #f59e0b);
    color: var(--theme-yellow, #f59e0b);
  }

  .start-btn:hover {
    background: rgba(245, 158, 11, 0.1);
  }

  .status-label {
    color: var(--theme-foreground, #aaa);
    font-size: 0.8rem;
  }
</style>
