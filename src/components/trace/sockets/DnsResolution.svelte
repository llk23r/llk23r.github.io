<script>
  import { onDestroy } from 'svelte'

  let step = $state(-1) // -1 = idle, 0-6 = active steps
  let animating = $state(false)
  let animFrame = $state(null)
  let animStartTime = $state(null)
  let nodeGlow = $state(0) // 0-1 for pulsing the active node

  const STEP_DURATION = 500 // ms per step

  // Node definitions
  // Top row (y=65): Browser Cache → OS Cache → Resolver
  // Bottom row (y=190): Root NS ← .com TLD ← Authoritative
  // Bottom row goes right-to-left so the path flows: Resolver↓ Root→.com→Auth
  const NODES = [
    { id: 0, label: 'Browser Cache', sub: 'Local', row: 0, col: 0 },
    { id: 1, label: 'OS Cache', sub: '/etc/hosts', row: 0, col: 1 },
    { id: 2, label: 'Resolver', sub: 'Recursive', row: 0, col: 2 },
    { id: 3, label: 'Root NS', sub: '. (root)', row: 1, col: 2 },
    { id: 4, label: '.com TLD', sub: 'TLD server', row: 1, col: 1 },
    { id: 5, label: 'Authoritative', sub: 'ns1.example', row: 1, col: 0 },
  ]

  // Step results shown near each node after activation
  const STEP_RESULTS = [
    { text: 'MISS', color: 'var(--theme-red, #ef4444)', symbol: '\u2717' },
    { text: 'MISS', color: 'var(--theme-red, #ef4444)', symbol: '\u2717' },
    { text: 'Querying...', color: 'var(--theme-cyan, #06b6d4)', symbol: '\u2192' },
    { text: 'try .com TLD', color: 'var(--theme-cyan, #06b6d4)', symbol: '\u2192' },
    { text: 'try ns1.example', color: 'var(--theme-cyan, #06b6d4)', symbol: '\u2192' },
    { text: '203.0.113.50', color: 'var(--theme-green, #10b981)', symbol: '\u2713' },
  ]

  // Layout constants
  const COL_X = [100, 270, 440]
  const ROW_Y = [65, 190]
  const NODE_W = 110
  const NODE_H = 42

  function nodeX(n) { return COL_X[n.col] }
  function nodeY(n) { return ROW_Y[n.row] }

  // Which node is active at each step (0-5 map to nodes 0-5, step 6 = final)
  function nodeForStep(s) {
    if (s >= 0 && s <= 5) return s
    if (s === 6) return 2 // resolver gets the answer back
    return -1
  }

  let activeNode = $derived(nodeForStep(step))
  let isComplete = $derived(step === 6)

  // Arrow connections: [fromNode, toNode, appearsAtStep]
  // Step 0: activate Browser Cache node (no preceding arrow)
  // Step 1: arrow Browser→OS, activate OS Cache
  // Step 2: arrow OS→Resolver, activate Resolver
  // Step 3: arrow Resolver↓Root, activate Root
  // Step 4: arrow Root→.com, activate .com TLD
  // Step 5: arrow .com→Auth, activate Authoritative
  // Step 6: return arrow Auth↗Resolver (curved), resolver gets answer
  const EDGES = [
    { from: 0, to: 1, step: 1 },  // Browser → OS Cache (horizontal right)
    { from: 1, to: 2, step: 2 },  // OS Cache → Resolver (horizontal right)
    { from: 2, to: 3, step: 3 },  // Resolver → Root NS (vertical down)
    { from: 3, to: 4, step: 4 },  // Root NS → .com TLD (horizontal left)
    { from: 4, to: 5, step: 5 },  // .com TLD → Authoritative (horizontal left)
  ]

  function getNodeStroke(nodeIndex) {
    if (step === -1) return 'var(--theme-separator, #444)'
    if (isComplete) return 'var(--theme-green, #10b981)'
    if (nodeIndex === activeNode) return 'var(--theme-cyan, #06b6d4)'
    if (nodeIndex < step) return 'var(--theme-green, #10b981)'
    return 'var(--theme-separator, #444)'
  }

  function getNodeFill(nodeIndex) {
    if (step === -1) return 'rgba(255,255,255,0.02)'
    if (isComplete) return 'rgba(16, 185, 129, 0.06)'
    if (nodeIndex === activeNode) return 'rgba(6, 182, 212, 0.1)'
    if (nodeIndex < step) return 'rgba(16, 185, 129, 0.06)'
    return 'rgba(255,255,255,0.02)'
  }

  function getNodeStrokeWidth(nodeIndex) {
    if (nodeIndex === activeNode) return 1.5
    return 0.75
  }

  // Compute line endpoints for an edge
  function edgeLine(edge) {
    const from = NODES[edge.from]
    const to = NODES[edge.to]
    const fx = nodeX(from), fy = nodeY(from)
    const tx = nodeX(to), ty = nodeY(to)

    // Same row: horizontal
    if (from.row === to.row) {
      const dir = tx > fx ? 1 : -1
      return {
        x1: fx + dir * (NODE_W / 2 + 2),
        y1: fy,
        x2: tx - dir * (NODE_W / 2 + 2),
        y2: ty,
      }
    }

    // Same col, different row: vertical
    if (from.col === to.col) {
      const dir = ty > fy ? 1 : -1
      return {
        x1: fx,
        y1: fy + dir * (NODE_H / 2 + 2),
        x2: tx,
        y2: ty - dir * (NODE_H / 2 + 2),
      }
    }

    // Shouldn't happen in our layout, but fallback
    return { x1: fx, y1: fy, x2: tx, y2: ty }
  }

  function edgeStroke(edge) {
    if (step === -1) return 'var(--theme-separator, #444)'
    if (step >= edge.step + 1 || isComplete) return 'var(--theme-green, #10b981)'
    if (step === edge.step) return 'var(--theme-cyan, #06b6d4)'
    return 'var(--theme-separator, #444)'
  }

  function edgeMarker(edge) {
    if (step === -1) return 'url(#dns-arrow)'
    if (step >= edge.step + 1 || isComplete) return 'url(#dns-arrow-done)'
    if (step === edge.step) return 'url(#dns-arrow-active)'
    return 'url(#dns-arrow)'
  }

  function edgeOpacity(edge) {
    if (step === -1) return 0.2
    if (step >= edge.step) return 1
    return 0.2
  }

  function edgeWidth(edge) {
    if (step === edge.step && animating) return 1.5
    return 1
  }

  function edgeDash(edge) {
    if (step < edge.step) return '4,4'
    return 'none'
  }

  // Return arrow path (Authoritative -> Resolver, curved)
  function getReturnPath() {
    const from = NODES[5] // Authoritative (row 1, col 0)
    const to = NODES[2]   // Resolver (row 0, col 2)
    const fx = nodeX(from)
    const fy = nodeY(from) - NODE_H / 2 - 2
    const tx = nodeX(to)
    const ty = nodeY(to) + NODE_H / 2 + 2
    return `M ${fx} ${fy} C ${fx - 30} ${(fy + ty) / 2}, ${tx + 30} ${(fy + ty) / 2}, ${tx} ${ty}`
  }

  // Result annotation position: above node for row 1, below for row 0
  function resultY(node) {
    if (node.row === 0) return nodeY(node) + NODE_H / 2 + 13
    return nodeY(node) - NODE_H / 2 - 6
  }

  function startResolve() {
    if (animating || step >= 6) return
    step = 0
    nodeGlow = 1
    animating = true
    animStartTime = null
    if (animFrame) cancelAnimationFrame(animFrame)
    animFrame = requestAnimationFrame(tick)
  }

  function tick(timestamp) {
    if (animStartTime === null) animStartTime = timestamp
    const elapsed = timestamp - animStartTime
    const currentStepTime = elapsed % STEP_DURATION
    const currentStep = Math.floor(elapsed / STEP_DURATION)

    nodeGlow = 0.5 + 0.5 * Math.sin((currentStepTime / STEP_DURATION) * Math.PI)

    if (currentStep > 6) {
      step = 6
      animating = false
      nodeGlow = 1
      return
    }

    step = Math.min(currentStep, 6)

    if (step < 6) {
      animFrame = requestAnimationFrame(tick)
    } else {
      animating = false
      nodeGlow = 1
    }
  }

  function reset() {
    if (animFrame) cancelAnimationFrame(animFrame)
    step = -1
    animating = false
    nodeGlow = 0
    animStartTime = null
  }

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })
</script>

<figure class="trace-viz" role="img" aria-label="DNS resolution chain showing recursive lookup from browser cache through root nameservers to authoritative answer">
  <div class="diagram-container">
    <svg viewBox="0 0 540 280" preserveAspectRatio="xMidYMid meet" class="dns-svg">
      <defs>
        <marker id="dns-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-separator, #555)" />
        </marker>
        <marker id="dns-arrow-active" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-cyan, #06b6d4)" />
        </marker>
        <marker id="dns-arrow-done" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-green, #10b981)" />
        </marker>
        <marker id="dns-arrow-return" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-green, #10b981)" />
        </marker>
      </defs>

      <!-- Title -->
      <text x="270" y="20" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="10"
        font-family="JetBrains Mono, monospace" letter-spacing="0.06em"
        opacity="0.5">DNS RESOLUTION — example.com</text>

      <!-- Row labels -->
      <text x="20" y={ROW_Y[0] + 2} text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace"
        opacity="0.3" transform="rotate(-90, 20, {ROW_Y[0] + 2})">LOCAL</text>
      <text x="20" y={ROW_Y[1] + 2} text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace"
        opacity="0.3" transform="rotate(-90, 20, {ROW_Y[1] + 2})">REMOTE</text>

      <!-- Dashed separator between rows -->
      <line x1="35" y1="130" x2="505" y2="130"
        stroke="var(--theme-separator, #333)" stroke-width="0.75"
        stroke-dasharray="4,4" opacity="0.3" />

      <!-- Edges (arrows between nodes) -->
      {#each EDGES as edge}
        {@const line = edgeLine(edge)}
        <line
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke={edgeStroke(edge)}
          stroke-width={edgeWidth(edge)}
          stroke-dasharray={edgeDash(edge)}
          opacity={edgeOpacity(edge)}
          marker-end={edgeMarker(edge)}
        />
      {/each}

      <!-- Return arrow (Authoritative → Resolver): curved, appears at step 5+ -->
      <path
        d={getReturnPath()}
        fill="none"
        stroke={step >= 6 ? 'var(--theme-green, #10b981)' : step >= 5 ? 'var(--theme-cyan, #06b6d4)' : 'var(--theme-separator, #444)'}
        stroke-width={step >= 5 && step < 7 ? 1.5 : 1}
        stroke-dasharray={step < 5 ? '4,4' : step === 5 && animating ? '4,4' : 'none'}
        opacity={step < 5 ? 0.15 : step === 5 && animating ? nodeGlow : 1}
        marker-end={step >= 6 ? 'url(#dns-arrow-return)' : step >= 5 ? 'url(#dns-arrow-active)' : 'url(#dns-arrow)'}
      />

      <!-- Return label -->
      {#if step >= 5}
        <text x="270" y="128" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="8" font-weight="600"
          font-family="JetBrains Mono, monospace"
          opacity={step >= 6 ? 1 : 0.7}>
          &#x2190; 203.0.113.50 &#x2192;
        </text>
      {/if}

      <!-- Nodes -->
      {#each NODES as node, i}
        {@const cx = nodeX(node)}
        {@const cy = nodeY(node)}
        <g>
          <!-- Node rectangle -->
          <rect
            x={cx - NODE_W / 2} y={cy - NODE_H / 2}
            width={NODE_W} height={NODE_H}
            rx="6"
            fill={getNodeFill(i)}
            stroke={getNodeStroke(i)}
            stroke-width={getNodeStrokeWidth(i)}
          />

          <!-- Label -->
          <text x={cx} y={cy - 4} text-anchor="middle"
            fill="var(--theme-foreground, #ccc)" font-size="10"
            font-family="JetBrains Mono, monospace" font-weight="600">
            {node.label}
          </text>

          <!-- Sublabel -->
          <text x={cx} y={cy + 9} text-anchor="middle"
            fill="var(--theme-foreground, #888)" font-size="8"
            font-family="JetBrains Mono, monospace" opacity="0.6">
            {node.sub}
          </text>

          <!-- Step result annotation -->
          {#if step >= i && step >= 0 && i <= 5}
            {@const result = STEP_RESULTS[i]}
            <text x={cx} y={resultY(node)} text-anchor="middle"
              fill={result.color} font-size="8" font-weight="600"
              font-family="JetBrains Mono, monospace"
              opacity={step === i && animating ? nodeGlow : 1}>
              {result.symbol} {result.text}
            </text>
          {/if}

          <!-- Step 6 annotation above resolver -->
          {#if step === 6 && i === 2}
            <text x={cx} y={cy - NODE_H / 2 - 6} text-anchor="middle"
              fill="var(--theme-green, #10b981)" font-size="8.5" font-weight="700"
              font-family="JetBrains Mono, monospace">
              &#x2713; IP cached &amp; returned
            </text>
          {/if}
        </g>
      {/each}

      <!-- Step progress dots -->
      {#each { length: 7 } as _, i}
        <circle cx={270 - 45 + i * 15} cy="265" r="3"
          fill={step >= i ? 'var(--theme-green, #10b981)' : 'var(--theme-separator, #444)'}
          opacity={step >= i ? 0.8 : 0.3} />
      {/each}

      <!-- Final resolved banner -->
      {#if isComplete}
        <g class="resolved-fade">
          <rect x="140" y="244" width="260" height="18" rx="4"
            fill="rgba(16, 185, 129, 0.08)"
            stroke="var(--theme-green, #10b981)" stroke-width="0.75" stroke-opacity="0.4" />
          <text x="270" y="256" text-anchor="middle"
            fill="var(--theme-green, #10b981)" font-size="8.5" font-weight="700"
            font-family="JetBrains Mono, monospace">RESOLVED: example.com &#x2192; 203.0.113.50</text>
        </g>
      {/if}
    </svg>
  </div>

  <div class="controls">
    <button onclick={startResolve} disabled={animating || step >= 6}>
      {step === -1 ? '▶ Resolve' : step >= 6 ? '✓ Done' : '▶ Resolve'}
    </button>
    <button onclick={reset}>↺ Reset</button>

    {#if step >= 0}
      <span class="step-label">
        Step {Math.min(step, 6)}/6
        {#if step >= 0 && step <= 5}
          — {NODES[step]?.label ?? 'Resolver'}
        {:else if step === 6}
          — Resolved
        {/if}
      </span>
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

  .dns-svg {
    width: 100%;
    max-width: 540px;
    height: auto;
  }

  .resolved-fade {
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
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

  .step-label {
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
    margin-left: auto;
  }
</style>
