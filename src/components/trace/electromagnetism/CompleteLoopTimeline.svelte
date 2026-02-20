<script>
  // Ellipse layout
  const CX = 350
  const CY = 250
  const RX = 260
  const RY = 180
  const W = 700
  const H = 520

  const nodes = [
    { id: 'brain', label: 'Brain\ndecides', color: 'var(--viz-purple)', angle: 90 },
    { id: 'finger', label: 'Finger\npresses', color: 'var(--viz-yellow)', angle: 122 },
    { id: 'contacts', label: 'Switch\ncontacts', color: 'var(--viz-orange)', angle: 154 },
    { id: 'efield', label: 'E-field\npropagates', color: 'var(--viz-cyan)', angle: 186 },
    { id: 'electrons', label: 'Electrons\ndrift', color: 'var(--viz-blue)', angle: 218 },
    { id: 'filament', label: 'Filament\nheats', color: 'var(--viz-red)', angle: 250 },
    { id: 'photon', label: 'Photon\nemitted', color: 'var(--viz-yellow)', angle: 282 },
    { id: 'eye', label: 'Retina\nabsorbs', color: 'var(--viz-green)', angle: 314 },
    { id: 'cascade', label: 'Rhodopsin\ncascade', color: 'var(--viz-pink)', angle: 346 },
    { id: 'nerve', label: 'Optic\nnerve', color: 'var(--viz-cyan)', angle: 18 },
    { id: 'cortex', label: 'Visual\ncortex', color: 'var(--viz-purple)', angle: 58 },
  ]

  const nodeR = 28

  // Compute positions
  function getPos(angleDeg) {
    const rad = (angleDeg * Math.PI) / 180
    return {
      x: CX + RX * Math.cos(rad),
      y: CY - RY * Math.sin(rad),
    }
  }

  const nodePositions = nodes.map(n => ({ ...n, ...getPos(n.angle) }))

  // Deep-dive box between filament and photon
  const filNode = nodePositions.find(n => n.id === 'filament')
  const phoNode = nodePositions.find(n => n.id === 'photon')
  const deepDiveX = (filNode.x + phoNode.x) / 2 - 50
  const deepDiveY = (filNode.y + phoNode.y) / 2 + 40

  // Arrow path between consecutive nodes (along ellipse)
  function getArrowPath(from, to) {
    // Offset start and end by node radius along the direction
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const ux = dx / dist
    const uy = dy / dist
    const sx = from.x + ux * (nodeR + 4)
    const sy = from.y + uy * (nodeR + 4)
    const ex = to.x - ux * (nodeR + 4)
    const ey = to.y - uy * (nodeR + 4)

    // Slight curve via ellipse midpoint
    const midAngle = ((from.angle + to.angle) / 2) * Math.PI / 180
    // If angles wrap around, adjust
    let fromA = from.angle
    let toA = to.angle
    if (toA < fromA) toA += 360
    const midA = ((fromA + toA) / 2) * Math.PI / 180
    const cmx = CX + (RX + 20) * Math.cos(midA)
    const cmy = CY - (RY + 20) * Math.sin(midA)

    return `M${sx},${sy} Q${cmx},${cmy} ${ex},${ey}`
  }

  // Build arrow pairs (consecutive nodes)
  let arrows = []
  for (let i = 0; i < nodePositions.length; i++) {
    const from = nodePositions[i]
    const to = nodePositions[(i + 1) % nodePositions.length]
    arrows.push({ from, to, path: getArrowPath(from, to) })
  }

  // Label line-split helper
  function splitLabel(label) {
    return label.split('\n')
  }
</script>

<figure class="trace-viz" role="img" aria-label="Complete electromagnetic loop: 11 steps from brain decision to visual perception, arranged on an ellipse">
  <svg viewBox="0 0 {W} {H}" width="100%">
    <defs>
      <marker id="loopArrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--viz-text-muted)" />
      </marker>
      <marker id="deepDiveArrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--viz-accent)" />
      </marker>
    </defs>

    <!-- Center text -->
    <text x={CX} y={CY - 16} text-anchor="middle" font-size="16" font-weight="700"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text)" opacity="0.8">
      The Complete Loop
    </text>
    <text x={CX} y={CY + 4} text-anchor="middle" font-size="11"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.5">
      Every step is electromagnetic
    </text>
    <text x={CX} y={CY + 22} text-anchor="middle" font-size="10"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.35">
      ~120 ms total
    </text>

    <!-- Connecting arrows -->
    {#each arrows as arrow}
      <path d={arrow.path} fill="none" stroke="var(--viz-text-muted)" stroke-width="1"
        opacity="0.3" marker-end="url(#loopArrow)" />
    {/each}

    <!-- Deep-dive branch box -->
    <rect x={deepDiveX} y={deepDiveY} width="100" height="34" rx="4"
      fill="rgba(139, 92, 246, 0.08)" stroke="var(--viz-accent)" stroke-width="1"
      stroke-dasharray="3,2" opacity="0.7" />
    <text x={deepDiveX + 50} y={deepDiveY + 15} text-anchor="middle" font-size="8" font-weight="600"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-accent)" opacity="0.8">
      Deep Dive
    </text>
    <text x={deepDiveX + 50} y={deepDiveY + 27} text-anchor="middle" font-size="7"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-accent)" opacity="0.5">
      blackbody radiation
    </text>

    <!-- Lines from deep-dive to filament and photon -->
    <line x1={deepDiveX + 30} y1={deepDiveY} x2={filNode.x} y2={filNode.y + nodeR + 2}
      stroke="var(--viz-accent)" stroke-width="0.75" stroke-dasharray="3,2" opacity="0.4"
      marker-end="url(#deepDiveArrow)" />
    <line x1={deepDiveX + 70} y1={deepDiveY} x2={phoNode.x} y2={phoNode.y + nodeR + 2}
      stroke="var(--viz-accent)" stroke-width="0.75" stroke-dasharray="3,2" opacity="0.4"
      marker-end="url(#deepDiveArrow)" />

    <!-- Nodes -->
    {#each nodePositions as node, i}
      <!-- Node circle -->
      <circle cx={node.x} cy={node.y} r={nodeR}
        fill="rgba(0,0,0,0.4)" stroke={node.color} stroke-width="2" />

      <!-- Step number -->
      <text x={node.x} y={node.y - nodeR - 8} text-anchor="middle" font-size="8"
        font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.4">
        {i + 1}
      </text>

      <!-- Icon SVG per node -->
      {#if node.id === 'brain'}
        <!-- Brain: simplified brain icon -->
        <g transform="translate({node.x},{node.y})">
          <ellipse cx="-4" cy="-3" rx="8" ry="9" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.8" />
          <ellipse cx="4" cy="-3" rx="8" ry="9" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.8" />
          <path d="M0,-12 C0,-6 0,0 0,8" stroke={node.color} stroke-width="0.8" fill="none" opacity="0.5" />
        </g>
      {:else if node.id === 'finger'}
        <!-- Finger: pointing finger -->
        <g transform="translate({node.x},{node.y})">
          <rect x="-3" y="-10" width="6" height="14" rx="3" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.8" />
          <rect x="-7" y="4" width="14" height="6" rx="2" fill="none" stroke={node.color} stroke-width="1" opacity="0.5" />
        </g>
      {:else if node.id === 'contacts'}
        <!-- Switch contacts: two parallel lines with gap -->
        <g transform="translate({node.x},{node.y})">
          <line x1="-10" y1="0" x2="-3" y2="0" stroke={node.color} stroke-width="1.5" opacity="0.8" />
          <line x1="3" y1="0" x2="10" y2="0" stroke={node.color} stroke-width="1.5" opacity="0.8" />
          <circle cx="-3" cy="0" r="2" fill={node.color} opacity="0.6" />
          <circle cx="3" cy="0" r="2" fill={node.color} opacity="0.6" />
          <path d="M-3,-2 L3,-6" stroke={node.color} stroke-width="1.2" opacity="0.6" />
        </g>
      {:else if node.id === 'efield'}
        <!-- E-field: wavy arrow -->
        <g transform="translate({node.x},{node.y})">
          <path d="M-10,0 Q-5,-6 0,0 Q5,6 10,0" fill="none" stroke={node.color} stroke-width="1.5" opacity="0.8" />
          <polygon points="10,-3 14,0 10,3" fill={node.color} opacity="0.7" />
        </g>
      {:else if node.id === 'electrons'}
        <!-- Electrons: small circles with minus -->
        <g transform="translate({node.x},{node.y})">
          <circle cx="-6" cy="-4" r="4" fill="none" stroke={node.color} stroke-width="1" opacity="0.7" />
          <line x1="-8" y1="-4" x2="-4" y2="-4" stroke={node.color} stroke-width="1" opacity="0.7" />
          <circle cx="6" cy="4" r="4" fill="none" stroke={node.color} stroke-width="1" opacity="0.7" />
          <line x1="4" y1="4" x2="8" y2="4" stroke={node.color} stroke-width="1" opacity="0.7" />
          <path d="M-2,0 L2,0" stroke={node.color} stroke-width="0.5" stroke-dasharray="1,1" opacity="0.4" />
        </g>
      {:else if node.id === 'filament'}
        <!-- Filament: zigzag coil -->
        <g transform="translate({node.x},{node.y})">
          <path d="M-10,0 L-6,-6 L-2,6 L2,-6 L6,6 L10,0" fill="none" stroke={node.color} stroke-width="1.5" opacity="0.8" />
        </g>
      {:else if node.id === 'photon'}
        <!-- Photon: wavy line with gamma symbol -->
        <g transform="translate({node.x},{node.y})">
          <path d="M-10,0 Q-7,-5 -4,0 Q-1,5 2,0 Q5,-5 8,0" fill="none" stroke={node.color} stroke-width="1.3" opacity="0.8" />
          <circle cx="10" cy="0" r="2" fill={node.color} opacity="0.6" />
        </g>
      {:else if node.id === 'eye'}
        <!-- Eye: almond shape with pupil -->
        <g transform="translate({node.x},{node.y})">
          <ellipse cx="0" cy="0" rx="11" ry="6" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.8" />
          <circle cx="0" cy="0" r="3.5" fill={node.color} opacity="0.5" />
          <circle cx="0" cy="0" r="1.5" fill="var(--viz-bg)" />
        </g>
      {:else if node.id === 'cascade'}
        <!-- Cascade: stacked chevrons -->
        <g transform="translate({node.x},{node.y})">
          <path d="M-6,-8 L0,-4 L6,-8" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.8" />
          <path d="M-6,-2 L0,2 L6,-2" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.6" />
          <path d="M-6,4 L0,8 L6,4" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.4" />
        </g>
      {:else if node.id === 'nerve'}
        <!-- Nerve: axon with nodes of Ranvier -->
        <g transform="translate({node.x},{node.y})">
          <line x1="-12" y1="0" x2="12" y2="0" stroke={node.color} stroke-width="1.2" opacity="0.6" />
          <circle cx="-8" cy="0" r="2" fill={node.color} opacity="0.7" />
          <circle cx="0" cy="0" r="2" fill={node.color} opacity="0.7" />
          <circle cx="8" cy="0" r="2" fill={node.color} opacity="0.7" />
          <path d="M-8,-4 L-8,4" stroke={node.color} stroke-width="0.8" opacity="0.4" />
          <path d="M0,-4 L0,4" stroke={node.color} stroke-width="0.8" opacity="0.4" />
          <path d="M8,-4 L8,4" stroke={node.color} stroke-width="0.8" opacity="0.4" />
        </g>
      {:else if node.id === 'cortex'}
        <!-- Cortex: layered curves -->
        <g transform="translate({node.x},{node.y})">
          <path d="M-8,-6 Q0,-12 8,-6" fill="none" stroke={node.color} stroke-width="1.2" opacity="0.8" />
          <path d="M-10,-1 Q0,-8 10,-1" fill="none" stroke={node.color} stroke-width="1" opacity="0.6" />
          <path d="M-10,4 Q0,-3 10,4" fill="none" stroke={node.color} stroke-width="0.8" opacity="0.4" />
          <line x1="-6" y1="6" x2="6" y2="6" stroke={node.color} stroke-width="0.8" opacity="0.3" />
        </g>
      {/if}

      <!-- Node label (below or above based on position) -->
      {@const labelY = node.y > CY ? node.y + nodeR + 14 : node.y - nodeR - 18}
      {@const labelLines = splitLabel(node.label)}
      {#each labelLines as line, li}
        <text
          x={node.x}
          y={labelY + li * 12}
          text-anchor="middle"
          font-size="9"
          font-family="'JetBrains Mono', monospace"
          fill={node.color}
          opacity={li === 0 ? 0.9 : 0.6}
          font-weight={li === 0 ? '600' : '400'}
        >
          {line}
        </text>
      {/each}
    {/each}
  </svg>
</figure>

<style>
  .trace-viz {
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);
    --viz-bg: var(--theme-background, #1a1a2e);
    --viz-accent: var(--theme-accent, #8b5cf6);
    --viz-purple: var(--theme-accent, #8b5cf6);
    --viz-yellow: var(--theme-yellow, #f59e0b);
    --viz-orange: var(--theme-orange, #f97316);
    --viz-cyan: var(--theme-cyan, #06b6d4);
    --viz-blue: var(--theme-blue, #3b82f6);
    --viz-red: var(--theme-red, #ef4444);
    --viz-green: var(--theme-green, #10b981);
    --viz-pink: var(--theme-pink, #ec4899);
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }
  svg {
    display: block;
    max-width: 720px;
    margin: 0 auto;
  }
</style>
