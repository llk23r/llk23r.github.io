<script>
  import { onMount } from 'svelte'

  // ── Stage definitions ──
  const STAGES = [
    { label: 'Photon', sublabel: '1', count: 1, dotsShown: 1, dotsShownMobile: 1, color: '#f59e0b', shape: 'circle' },
    { label: 'Rhodopsin', sublabel: '1', count: 1, dotsShown: 1, dotsShownMobile: 1, color: '#8b5cf6', shape: 'circle' },
    { label: 'Transducin', sublabel: '~100', count: 100, dotsShown: 25, dotsShownMobile: 15, color: '#06b6d4', shape: 'circle' },
    { label: 'PDE', sublabel: '~100', count: 100, dotsShown: 25, dotsShownMobile: 15, color: '#10b981', shape: 'circle' },
    { label: 'cGMP', sublabel: '~100,000', count: 100000, dotsShown: 60, dotsShownMobile: 30, color: '#f97316', shape: 'rect' },
    { label: 'Channels', sublabel: '~250', count: 250, dotsShown: 30, dotsShownMobile: 20, color: '#ec4899', shape: 'rect' },
    { label: 'Ion flow', sublabel: '~1,000,000', count: 1000000, dotsShown: 80, dotsShownMobile: 40, color: '#ef4444', shape: 'circle' },
  ]

  const TOTAL_STAGES = STAGES.length

  // ── SVG layout ──
  const SVG_W = 760
  const SVG_H = 340
  const COLUMN_Y = 60
  const COLUMN_H = 160
  const MARGIN_LEFT = 30
  const MARGIN_RIGHT = 30
  const COLUMN_W = (SVG_W - MARGIN_LEFT - MARGIN_RIGHT) / TOTAL_STAGES
  const DOT_AREA_Y = COLUMN_Y + 10
  const DOT_AREA_H = COLUMN_H - 20
  const LABEL_Y = COLUMN_Y + COLUMN_H + 24
  const SUBLABEL_Y = LABEL_Y + 16

  // Arrow multiplication labels
  const ARROW_LABELS = ['activates', '\u00d7100', '\u00d7100', '\u00d71000', '\u00d7250', '\u00d74000']

  // ── State ──
  let currentStep = $state(0)
  let autoPlay = $state(false)
  let isMobile = $state(false)
  let autoPlayTimer = null

  // ── Deterministic pseudo-random dot positions ──
  function getDotPositions(stageIndex, dotCount) {
    const colCenterX = MARGIN_LEFT + stageIndex * COLUMN_W + COLUMN_W / 2
    const spread = Math.min(COLUMN_W * 0.35, 38)
    const positions = []

    if (dotCount === 1) {
      return [{ cx: colCenterX, cy: DOT_AREA_Y + DOT_AREA_H / 2 }]
    }

    const cols = Math.ceil(Math.sqrt(dotCount))
    const rows = Math.ceil(dotCount / cols)

    for (let i = 0; i < dotCount; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const jitterX = ((((i * 7 + 13) % 17) / 17) - 0.5) * 6
      const jitterY = ((((i * 11 + 3) % 13) / 13) - 0.5) * 6
      const cx = colCenterX - spread + (cols > 1 ? (col / (cols - 1)) * spread * 2 : 0) + jitterX
      const cy = DOT_AREA_Y + 10 + (rows > 1 ? (row / (rows - 1)) * (DOT_AREA_H - 20) : DOT_AREA_H / 2) + jitterY
      positions.push({ cx, cy })
    }

    return positions
  }

  // Arrow X positions between adjacent columns
  function getArrowX(fromStage) {
    const x1 = MARGIN_LEFT + fromStage * COLUMN_W + COLUMN_W * 0.72
    const x2 = MARGIN_LEFT + (fromStage + 1) * COLUMN_W + COLUMN_W * 0.28
    return { x1, x2 }
  }

  // Arrow mid Y
  const arrowMidY = DOT_AREA_Y + DOT_AREA_H / 2

  // ── Auto-play logic ──
  function startAutoPlayTimer() {
    stopAutoPlayTimer()
    if (currentStep >= TOTAL_STAGES - 1) {
      autoPlay = false
      return
    }
    autoPlayTimer = setTimeout(() => {
      if (currentStep < TOTAL_STAGES - 1) {
        currentStep += 1
        startAutoPlayTimer()
      } else {
        autoPlay = false
      }
    }, 800)
  }

  function stopAutoPlayTimer() {
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer)
      autoPlayTimer = null
    }
  }

  // Watch autoPlay changes
  $effect(() => {
    if (autoPlay) {
      startAutoPlayTimer()
    } else {
      stopAutoPlayTimer()
    }
  })

  function handleNext() {
    if (currentStep < TOTAL_STAGES - 1) {
      currentStep += 1
    }
  }

  function handleReset() {
    autoPlay = false
    stopAutoPlayTimer()
    currentStep = 0
  }

  function toggleAutoPlay() {
    if (!autoPlay && currentStep >= TOTAL_STAGES - 1) {
      currentStep = 0
    }
    autoPlay = !autoPlay
  }

  // ── Detect mobile ──
  function checkMobile() {
    if (typeof window !== 'undefined') {
      isMobile = window.innerWidth < 640
    }
  }

  onMount(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      stopAutoPlayTimer()
      window.removeEventListener('resize', checkMobile)
    }
  })

  // Derive max stagger delay per stage for CSS animation
  function staggerDelay(dotIndex, totalDots) {
    return dotIndex * (300 / Math.max(totalDots, 1))
  }
</script>

<figure class="trace-viz" role="img" aria-label="Phototransduction cascade: 1 photon triggers million-fold amplification">
  <svg viewBox="0 0 {SVG_W} {SVG_H}" width="100%" class="cascade-svg">
    <!-- Title -->
    <text x={SVG_W / 2} y="28" text-anchor="middle"
      fill="var(--viz-text, #ccc)" font-size="14" font-weight="700"
      font-family="'JetBrains Mono', monospace">Phototransduction Cascade</text>
    <text x={SVG_W / 2} y="44" text-anchor="middle"
      fill="var(--viz-text-muted, #888)" font-size="11"
      font-family="'JetBrains Mono', monospace">1 photon triggers ~1,000,000 ions blocked</text>

    <!-- Connecting arrows between stages -->
    {#each STAGES.slice(0, -1) as _, i}
      {@const arrow = getArrowX(i)}
      {@const visible = i < currentStep}
      <g class="arrow-group" class:arrow-visible={visible}>
        <line x1={arrow.x1} y1={arrowMidY} x2={arrow.x2 - 6} y2={arrowMidY}
          stroke="var(--viz-text-muted, #888)" stroke-width="1.5" stroke-linecap="round" />
        <polygon points="{arrow.x2 - 7},{arrowMidY - 4} {arrow.x2},{arrowMidY} {arrow.x2 - 7},{arrowMidY + 4}"
          fill="var(--viz-text-muted, #888)" />
        <text x={(arrow.x1 + arrow.x2) / 2} y={arrowMidY - 10} text-anchor="middle"
          fill="var(--viz-text-muted, #888)" font-size="9" font-weight="600"
          font-family="'JetBrains Mono', monospace">{ARROW_LABELS[i]}</text>
      </g>
    {/each}

    <!-- Stage columns -->
    {#each STAGES as stage, stageIdx}
      {@const active = stageIdx <= currentStep}
      {@const dotCount = isMobile ? stage.dotsShownMobile : stage.dotsShown}
      {@const positions = getDotPositions(stageIdx, dotCount)}
      {@const colCenterX = MARGIN_LEFT + stageIdx * COLUMN_W + COLUMN_W / 2}
      {@const dotRadius = stage.count === 1 ? 8 : stage.count <= 100 ? 4 : 3}

      <!-- Column separator -->
      {#if stageIdx < TOTAL_STAGES - 1}
        <line x1={MARGIN_LEFT + (stageIdx + 1) * COLUMN_W} y1={COLUMN_Y}
          x2={MARGIN_LEFT + (stageIdx + 1) * COLUMN_W} y2={COLUMN_Y + COLUMN_H}
          stroke="var(--viz-text-muted, #888)" stroke-width="0.5" opacity="0.2" />
      {/if}

      <!-- Dots -->
      {#if active}
        {#each positions as pos, dotIdx}
          {#if stage.shape === 'rect'}
            <rect
              x={pos.cx - dotRadius} y={pos.cy - dotRadius * 0.6}
              width={dotRadius * 2} height={dotRadius * 1.2} rx="1.5"
              fill={stage.color}
              class="cascade-dot"
              style="--dot-delay: {staggerDelay(dotIdx, dotCount)}ms; transform-origin: {pos.cx}px {pos.cy}px;"
            />
          {:else}
            <circle
              cx={pos.cx} cy={pos.cy} r={dotRadius}
              fill={stage.color}
              class="cascade-dot"
              style="--dot-delay: {staggerDelay(dotIdx, dotCount)}ms; transform-origin: {pos.cx}px {pos.cy}px;"
            />
          {/if}
        {/each}
      {/if}

      <!-- Stage label -->
      <g class="stage-label" class:label-visible={active}>
        <text x={colCenterX} y={LABEL_Y} text-anchor="middle"
          fill={stage.color} font-size="11" font-weight="700"
          font-family="'JetBrains Mono', monospace">{stage.label}</text>
        <text x={colCenterX} y={SUBLABEL_Y} text-anchor="middle"
          fill="var(--viz-text-muted, #888)" font-size="9"
          font-family="'JetBrains Mono', monospace">{stage.sublabel}</text>
      </g>
    {/each}

    <!-- Final amplification callout -->
    {#if currentStep >= TOTAL_STAGES - 1}
      <text x={SVG_W / 2} y={SVG_H - 12} text-anchor="middle"
        fill="#ef4444" font-size="12" font-weight="700"
        font-family="'JetBrains Mono', monospace"
        class="final-callout">1,000,000 &#x00D7; amplification from a single photon</text>
    {/if}
  </svg>

  <!-- Controls -->
  <div class="controls">
    <div class="control-left">
      <button class:active={autoPlay} onclick={toggleAutoPlay} aria-pressed={autoPlay}>
        {autoPlay ? '⏸ Pause' : '▶ Auto-play'}
      </button>
      <button onclick={handleNext}
        disabled={currentStep >= TOTAL_STAGES - 1 || autoPlay}
        class:disabled={currentStep >= TOTAL_STAGES - 1 || autoPlay}>
        Next step
      </button>
      <button onclick={handleReset}>&#x21BA; Reset</button>
    </div>
    <span class="step-counter">Step {currentStep + 1} of {TOTAL_STAGES}</span>
  </div>
</figure>

<style>
  .trace-viz {
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);

    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .cascade-svg {
    display: block;
    height: auto;
  }

  /* ── Dot appearance animation ── */
  @keyframes fadeScale {
    from {
      opacity: 0;
      transform: scale(0);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .cascade-dot {
    animation: fadeScale 0.35s ease-out backwards;
    animation-delay: var(--dot-delay, 0ms);
  }

  /* ── Arrow visibility ── */
  .arrow-group {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .arrow-group.arrow-visible {
    opacity: 0.7;
  }

  /* ── Stage label visibility ── */
  .stage-label {
    opacity: 0;
    transition: opacity 0.35s ease 0.15s;
  }

  .stage-label.label-visible {
    opacity: 1;
  }

  /* ── Final callout ── */
  .final-callout {
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 0.9; }
  }

  /* ── Controls ── */
  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.75rem;
    flex-wrap: wrap;
  }

  .control-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

  button.disabled {
    opacity: 0.4;
    cursor: default;
  }

  button.disabled:hover {
    background: transparent;
  }

  .step-counter {
    color: var(--theme-foreground, #aaa);
    font-size: 0.75rem;
  }

  @media (max-width: 600px) {
    .controls {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
