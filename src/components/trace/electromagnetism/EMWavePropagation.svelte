<script>
  import { onMount } from 'svelte'

  // ── Wave math constants ──
  const TWO_PI = 2 * Math.PI
  const WAVELENGTH = 300
  const K = TWO_PI / WAVELENGTH
  const BASE_OMEGA = TWO_PI * 0.4
  const NUM_POINTS = 200
  const E_AMPLITUDE = 80
  const B_AMPLITUDE = 36
  const B_Y_OFFSET = 8

  // ── SVG layout ──
  const VB_WIDTH = 700
  const VB_HEIGHT = 300
  const AXIS_Y = VB_HEIGHT / 2
  const AXIS_X_START = 60
  const AXIS_X_END = VB_WIDTH - 30
  const AXIS_LENGTH = AXIS_X_END - AXIS_X_START

  // Propagation arrow
  const ARROW_TIP_X = AXIS_X_END - 4
  const ARROW_BODY_START = AXIS_X_END - 50

  // Axis tick positions
  const tickPositions = []
  for (let i = 0; i <= Math.floor(AXIS_LENGTH / WAVELENGTH); i++) {
    const x = AXIS_X_START + i * WAVELENGTH
    if (x <= AXIS_X_END) tickPositions.push(x)
  }

  // ── State ──
  let playing = $state(true)
  let speed = $state(1)
  let mode = $state('Both')

  // ── Refs for direct DOM manipulation ──
  let svgEl
  let rafId = 0
  let phaseVal = 0
  let lastTime = 0

  // ── Build sine polyline points string ──
  function buildSinePoints(phase, amplitude, yOffset) {
    const pts = []
    for (let i = 0; i <= NUM_POINTS; i++) {
      const t = i / NUM_POINTS
      const x = AXIS_X_START + t * AXIS_LENGTH
      const y = AXIS_Y + yOffset - amplitude * Math.sin(K * (x - AXIS_X_START) - phase)
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return pts.join(' ')
  }

  // ── Annotation positions ──
  function getAnnotations(phase) {
    const annotations = []

    for (let n = -1; n <= 3; n++) {
      // E peak
      const xE = ((Math.PI / 2 + TWO_PI * n + phase) / K) + AXIS_X_START
      if (xE > AXIS_X_START + 30 && xE < AXIS_X_END - 60) {
        const yE = AXIS_Y - E_AMPLITUDE * Math.sin(K * (xE - AXIS_X_START) - phase)
        annotations.push({ x: xE, yE, yB: AXIS_Y, label: 'E creates B', side: 'above' })
        break
      }

      // B peak
      const xB = ((3 * Math.PI / 2 + TWO_PI * n + phase) / K) + AXIS_X_START
      if (xB > AXIS_X_START + 30 && xB < AXIS_X_END - 60) {
        const yB = AXIS_Y + B_Y_OFFSET - B_AMPLITUDE * Math.sin(K * (xB - AXIS_X_START) - phase)
        annotations.push({ x: xB, yE: AXIS_Y, yB, label: 'B creates E', side: 'below' })
        break
      }
    }

    return annotations
  }

  // ── Animation loop (direct DOM for performance) ──
  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp
    const dt = (timestamp - lastTime) / 1000
    lastTime = timestamp

    if (playing) {
      phaseVal += BASE_OMEGA * speed * dt
      if (phaseVal > TWO_PI * 100) phaseVal -= TWO_PI * 100
    }

    if (!svgEl) {
      rafId = requestAnimationFrame(animate)
      return
    }

    const currentMode = mode

    // Update E field polyline
    const eLine = svgEl.querySelector('#em-e-field')
    if (eLine) {
      if (currentMode === 'E' || currentMode === 'Both') {
        eLine.setAttribute('points', buildSinePoints(phaseVal, E_AMPLITUDE, 0))
        eLine.style.opacity = '1'
      } else {
        eLine.style.opacity = '0'
      }
    }

    // Update B field polyline
    const bLine = svgEl.querySelector('#em-b-field')
    if (bLine) {
      if (currentMode === 'B' || currentMode === 'Both') {
        bLine.setAttribute('points', buildSinePoints(phaseVal, B_AMPLITUDE, B_Y_OFFSET))
        bLine.style.opacity = '1'
      } else {
        bLine.style.opacity = '0'
      }
    }

    // Update annotations
    const annotGroup = svgEl.querySelector('#em-annotations')
    if (annotGroup && currentMode === 'Both') {
      const annots = getAnnotations(phaseVal)
      const slots = annotGroup.querySelectorAll('.annot-slot')
      slots.forEach((slot, idx) => {
        const a = annots[idx]
        if (a) {
          slot.style.opacity = '1'
          slot.setAttribute('transform', `translate(${a.x.toFixed(1)}, 0)`)

          const line = slot.querySelector('line')
          const text = slot.querySelector('text')
          const arrow = slot.querySelector('polygon')

          if (a.side === 'above') {
            const tipY = a.yE + 6
            const startY = tipY - 28
            if (line) { line.setAttribute('y1', String(startY)); line.setAttribute('y2', String(tipY)) }
            if (arrow) arrow.setAttribute('transform', `translate(0, ${tipY}) rotate(90)`)
            if (text) text.setAttribute('y', String(startY - 6))
          } else {
            const tipY = a.yB - 6
            const startY = tipY + 28
            if (line) { line.setAttribute('y1', String(startY)); line.setAttribute('y2', String(tipY)) }
            if (arrow) arrow.setAttribute('transform', `translate(0, ${tipY}) rotate(-90)`)
            if (text) text.setAttribute('y', String(startY + 14))
          }
          if (text) text.textContent = a.label
        } else {
          slot.style.opacity = '0'
        }
      })
    } else if (annotGroup) {
      annotGroup.querySelectorAll('.annot-slot').forEach((slot) => {
        slot.style.opacity = '0'
      })
    }

    rafId = requestAnimationFrame(animate)
  }

  onMount(() => {
    lastTime = 0
    rafId = requestAnimationFrame(animate)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  })
</script>

<figure class="trace-viz" role="img" aria-label="Electromagnetic wave: coupled E and B fields propagating along an axis">
  <svg bind:this={svgEl} viewBox="0 0 {VB_WIDTH} {VB_HEIGHT}" width="100%" class="em-svg">

    <!-- Axis line (dashed) -->
    <line x1={AXIS_X_START} y1={AXIS_Y} x2={AXIS_X_END} y2={AXIS_Y}
      stroke="var(--viz-axis, #555)" stroke-width="1" stroke-dasharray="4 3" />

    <!-- Axis tick marks -->
    {#each tickPositions as x}
      <line x1={x} y1={AXIS_Y - 5} x2={x} y2={AXIS_Y + 5}
        stroke="var(--viz-axis, #555)" stroke-width="1" />
    {/each}

    <!-- Propagation arrow (green) -->
    <line x1={ARROW_BODY_START} y1={AXIS_Y} x2={ARROW_TIP_X} y2={AXIS_Y}
      stroke="var(--viz-propagation, #10b981)" stroke-width="2.5" stroke-linecap="round" />
    <polygon
      points="{ARROW_TIP_X - 8},{AXIS_Y - 5} {ARROW_TIP_X},{AXIS_Y} {ARROW_TIP_X - 8},{AXIS_Y + 5}"
      fill="var(--viz-propagation, #10b981)" />
    <text x={ARROW_TIP_X - 28} y={AXIS_Y + 18} text-anchor="middle"
      font-size="10" font-weight="600" fill="var(--viz-propagation, #10b981)"
      font-family="'JetBrains Mono', monospace">c</text>

    <!-- Axis labels -->
    <text x={AXIS_X_START - 6} y={AXIS_Y + 4} text-anchor="end"
      font-size="11" fill="var(--viz-text, #ccc)"
      font-family="'JetBrains Mono', monospace">0</text>
    <text x={VB_WIDTH / 2} y={VB_HEIGHT - 8} text-anchor="middle"
      font-size="11" fill="var(--viz-text, #ccc)"
      font-family="'JetBrains Mono', monospace">Direction of propagation (x)</text>

    <!-- E field label -->
    <text x={AXIS_X_START + 4} y={AXIS_Y - E_AMPLITUDE - 8}
      font-size="11" font-weight="600" fill="var(--viz-e-field, #ef4444)"
      font-family="'JetBrains Mono', monospace">E field</text>

    <!-- B field label -->
    <text x={AXIS_X_START + 4} y={AXIS_Y + B_AMPLITUDE + B_Y_OFFSET + 16}
      font-size="11" font-weight="600" fill="var(--viz-b-field, #3b82f6)"
      font-family="'JetBrains Mono', monospace">B field (perpendicular)</text>

    <!-- E field sinusoid (red) -->
    <polyline id="em-e-field" points="" fill="none"
      stroke="var(--viz-e-field, #ef4444)" stroke-width="2.5"
      stroke-linejoin="round" stroke-linecap="round"
      class="field-line" />

    <!-- B field sinusoid (blue dashed) -->
    <polyline id="em-b-field" points="" fill="none"
      stroke="var(--viz-b-field, #3b82f6)" stroke-width="2"
      stroke-linejoin="round" stroke-linecap="round"
      stroke-dasharray="6 3"
      class="field-line" />

    <!-- Annotation slots (pre-allocated, updated by RAF) -->
    <g id="em-annotations">
      {#each [0, 1] as idx}
        <g class="annot-slot" style="opacity: 0; transition: opacity 0.3s;">
          <line x1="0" y1="0" x2="0" y2="0"
            stroke="var(--viz-text, #ccc)" stroke-width="1" stroke-dasharray="2 2" />
          <polygon points="-3.5,-5 0,5 3.5,-5" fill="var(--viz-text, #ccc)" />
          <text x="0" y="0" text-anchor="middle" font-size="9" font-weight="600"
            fill="var(--viz-text, #ccc)"
            font-family="'JetBrains Mono', monospace"></text>
        </g>
      {/each}
    </g>

    <!-- Vertical axis labels -->
    <text x={AXIS_X_START - 6} y={AXIS_Y - E_AMPLITUDE / 2} text-anchor="end"
      font-size="9" fill="var(--viz-e-field, #ef4444)" opacity="0.7"
      font-family="'JetBrains Mono', monospace">+E</text>
    <text x={AXIS_X_START - 6} y={AXIS_Y + E_AMPLITUDE / 2 + 4} text-anchor="end"
      font-size="9" fill="var(--viz-e-field, #ef4444)" opacity="0.7"
      font-family="'JetBrains Mono', monospace">-E</text>
  </svg>

  <!-- Controls -->
  <div class="controls">
    <button class:active={playing} onclick={() => playing = !playing}
      aria-label={playing ? 'Pause animation' : 'Play animation'}>
      {playing ? '⏸ Pause' : '▶ Play'}
    </button>

    <span class="control-label">Speed</span>
    <input type="range" bind:value={speed} min="0.25" max="4" step="0.25"
      aria-label="Animation speed" name="em-wave-speed" />
    <span class="speed-value">{speed}x</span>

    <button class:active={mode === 'E'} onclick={() => mode = 'E'}>E field</button>
    <button class:active={mode === 'B'} onclick={() => mode = 'B'}>B field</button>
    <button class:active={mode === 'Both'} onclick={() => mode = 'Both'}>Both</button>
  </div>
</figure>

<style>
  .trace-viz {
    --viz-axis: var(--theme-separator, #555);
    --viz-propagation: var(--theme-green, #10b981);
    --viz-e-field: var(--theme-red, #ef4444);
    --viz-b-field: var(--theme-cyan, #3b82f6);
    --viz-text: var(--theme-foreground, #ccc);

    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .em-svg {
    display: block;
    height: auto;
    max-height: 300px;
  }

  .field-line {
    transition: opacity 0.2s;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.75rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.25rem 0.7rem;
    border-radius: 4px;
    border: 1px solid var(--theme-separator, #444);
    background: transparent;
    color: var(--theme-foreground, #ccc);
    font-family: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  button:hover {
    background: var(--theme-separator, #333);
  }

  button.active {
    border-color: var(--theme-accent, #8b5cf6);
    color: var(--theme-accent, #8b5cf6);
    background: rgba(139, 92, 246, 0.08);
  }

  .control-label {
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
    margin-left: 0.5rem;
  }

  input[type='range'] {
    width: 80px;
    accent-color: var(--theme-accent, #8b5cf6);
  }

  .speed-value {
    min-width: 2rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
    text-align: right;
  }
</style>
