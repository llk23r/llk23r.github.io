<script>
  // Chart dimensions
  const W = 600
  const H = 380
  const margin = { top: 30, right: 30, bottom: 50, left: 65 }
  const plotW = W - margin.left - margin.right
  const plotH = H - margin.top - margin.bottom

  // Data ranges: time 0-6ms, voltage -90 to +50 mV
  const tMin = 0, tMax = 6
  const vMin = -90, vMax = 50

  function tToX(t) { return margin.left + (t - tMin) / (tMax - tMin) * plotW }
  function vToY(v) { return margin.top + (vMax - v) / (vMax - vMin) * plotH }

  // Grid lines
  const vTicks = [-90, -70, -55, -40, -20, 0, 20, 40]
  const tTicks = [0, 1, 2, 3, 4, 5, 6]

  // Resting potential & threshold
  const restingV = -70
  const thresholdV = -55

  // Waveform path (action potential shape via bezier curves)
  // Phases: resting -> stimulus -> rapid depolarization -> peak -> repolarization -> hyperpolarization -> recovery
  const waveformPath = [
    `M${tToX(0)},${vToY(-70)}`,
    // Resting phase
    `L${tToX(0.8)},${vToY(-70)}`,
    // Stimulus begins
    `C${tToX(1.0)},${vToY(-70)} ${tToX(1.1)},${vToY(-65)} ${tToX(1.2)},${vToY(-55)}`,
    // Rapid depolarization (Na+ rushes in)
    `C${tToX(1.3)},${vToY(-40)} ${tToX(1.4)},${vToY(10)} ${tToX(1.6)},${vToY(40)}`,
    // Peak and repolarization begins (K+ flows out)
    `C${tToX(1.8)},${vToY(45)} ${tToX(2.0)},${vToY(30)} ${tToX(2.2)},${vToY(0)}`,
    // Repolarization continues
    `C${tToX(2.4)},${vToY(-30)} ${tToX(2.6)},${vToY(-65)} ${tToX(2.8)},${vToY(-80)}`,
    // Hyperpolarization (undershoot)
    `C${tToX(3.0)},${vToY(-85)} ${tToX(3.3)},${vToY(-82)} ${tToX(3.6)},${vToY(-78)}`,
    // Recovery to resting
    `C${tToX(4.0)},${vToY(-74)} ${tToX(4.5)},${vToY(-71)} ${tToX(5.0)},${vToY(-70)}`,
    // Steady resting
    `L${tToX(6)},${vToY(-70)}`,
  ].join(' ')

  // Phase labels
  const phases = [
    { label: 'Resting', t: 0.4, v: -80, anchor: 'middle' },
    { label: 'Depolarization', t: 1.5, v: -15, anchor: 'start' },
    { label: 'Repolarization', t: 2.5, v: -15, anchor: 'start' },
    { label: 'Hyperpolarization', t: 3.5, v: -88, anchor: 'middle' },
  ]

  // Refractory period bracket positions
  const refStartX = tToX(1.2)
  const refEndX = tToX(3.6)
  const bracketY = margin.top + 8

  // Absolute vs relative refractory boundary
  const absEndX = tToX(2.2)
</script>

<figure class="trace-viz" role="img" aria-label="Action potential voltage-vs-time waveform showing depolarization and repolarization phases">
  <svg viewBox="0 0 {W} {H}" width="100%">
    <defs>
      <!-- Arrow markers for Na+ and K+ annotations -->
      <marker id="apArrowUp" viewBox="0 0 10 10" refX="5" refY="10"
        markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 1 10 L 5 1 L 9 10 z" fill="var(--viz-na)" />
      </marker>
      <marker id="apArrowDown" viewBox="0 0 10 10" refX="5" refY="0"
        markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 1 0 L 5 9 L 9 0 z" fill="var(--viz-k)" />
      </marker>
    </defs>

    <!-- Grid lines -->
    {#each vTicks as v}
      <line
        x1={margin.left} y1={vToY(v)}
        x2={W - margin.right} y2={vToY(v)}
        stroke="var(--viz-grid)" stroke-width="0.5" opacity="0.2"
      />
      <text
        x={margin.left - 8} y={vToY(v) + 3}
        text-anchor="end" font-size="9"
        font-family="'JetBrains Mono', monospace"
        fill="var(--viz-text-muted)" opacity="0.6"
      >
        {v}
      </text>
    {/each}
    {#each tTicks as t}
      <line
        x1={tToX(t)} y1={margin.top}
        x2={tToX(t)} y2={H - margin.bottom}
        stroke="var(--viz-grid)" stroke-width="0.5" opacity="0.2"
      />
      <text
        x={tToX(t)} y={H - margin.bottom + 18}
        text-anchor="middle" font-size="9"
        font-family="'JetBrains Mono', monospace"
        fill="var(--viz-text-muted)" opacity="0.6"
      >
        {t}
      </text>
    {/each}

    <!-- Axes -->
    <line x1={margin.left} y1={margin.top} x2={margin.left} y2={H - margin.bottom}
      stroke="var(--viz-text-muted)" stroke-width="1" opacity="0.5" />
    <line x1={margin.left} y1={H - margin.bottom} x2={W - margin.right} y2={H - margin.bottom}
      stroke="var(--viz-text-muted)" stroke-width="1" opacity="0.5" />

    <!-- Axis labels -->
    <text
      x={margin.left - 45} y={margin.top + plotH / 2}
      text-anchor="middle" font-size="11"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text)" opacity="0.8"
      transform="rotate(-90, {margin.left - 45}, {margin.top + plotH / 2})"
    >
      Voltage (mV)
    </text>
    <text
      x={margin.left + plotW / 2} y={H - 8}
      text-anchor="middle" font-size="11"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text)" opacity="0.8"
    >
      Time (ms)
    </text>

    <!-- Resting potential dashed line -->
    <line
      x1={margin.left} y1={vToY(restingV)}
      x2={W - margin.right} y2={vToY(restingV)}
      stroke="var(--viz-resting)" stroke-width="1" stroke-dasharray="6,4" opacity="0.5"
    />
    <text
      x={W - margin.right + 4} y={vToY(restingV) + 3}
      text-anchor="start" font-size="8"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-resting)" opacity="0.7"
    >
      rest
    </text>

    <!-- Threshold dotted line -->
    <line
      x1={margin.left} y1={vToY(thresholdV)}
      x2={W - margin.right} y2={vToY(thresholdV)}
      stroke="var(--viz-threshold)" stroke-width="1" stroke-dasharray="2,3" opacity="0.5"
    />
    <text
      x={W - margin.right + 4} y={vToY(thresholdV) + 3}
      text-anchor="start" font-size="8"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-threshold)" opacity="0.7"
    >
      threshold
    </text>

    <!-- Action potential waveform -->
    <path d={waveformPath} fill="none" stroke="var(--viz-waveform)" stroke-width="2.5" stroke-linejoin="round" />

    <!-- Na+ rushes in annotation -->
    <line
      x1={tToX(1.45)} y1={vToY(15)}
      x2={tToX(1.45)} y2={vToY(-10)}
      stroke="var(--viz-na)" stroke-width="1.5" marker-start="url(#apArrowUp)"
    />
    <text
      x={tToX(1.45) + 6} y={vToY(5)}
      text-anchor="start" font-size="9" font-weight="600"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-na)"
    >
      Na&#8314; rushes in
    </text>

    <!-- K+ flows out annotation -->
    <line
      x1={tToX(2.45)} y1={vToY(-25)}
      x2={tToX(2.45)} y2={vToY(-55)}
      stroke="var(--viz-k)" stroke-width="1.5" marker-end="url(#apArrowDown)"
    />
    <text
      x={tToX(2.45) + 6} y={vToY(-35)}
      text-anchor="start" font-size="9" font-weight="600"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-k)"
    >
      K&#8314; flows out
    </text>

    <!-- Phase labels -->
    {#each phases as phase}
      <text
        x={tToX(phase.t)} y={vToY(phase.v)}
        text-anchor={phase.anchor} font-size="8"
        font-family="'JetBrains Mono', monospace"
        fill="var(--viz-text)" opacity="0.5"
      >
        {phase.label}
      </text>
    {/each}

    <!-- Refractory period bracket -->
    <line x1={refStartX} y1={bracketY} x2={refEndX} y2={bracketY}
      stroke="var(--viz-refractory)" stroke-width="1" opacity="0.5" />
    <line x1={refStartX} y1={bracketY - 4} x2={refStartX} y2={bracketY + 4}
      stroke="var(--viz-refractory)" stroke-width="1" opacity="0.5" />
    <line x1={refEndX} y1={bracketY - 4} x2={refEndX} y2={bracketY + 4}
      stroke="var(--viz-refractory)" stroke-width="1" opacity="0.5" />
    <text
      x={(refStartX + refEndX) / 2} y={bracketY - 4}
      text-anchor="middle" font-size="8"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-refractory)" opacity="0.7"
    >
      refractory period
    </text>

    <!-- Absolute vs relative refractory sub-labels -->
    <line x1={refStartX} y1={bracketY + 12} x2={absEndX} y2={bracketY + 12}
      stroke="var(--viz-refractory)" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.3" />
    <text
      x={(refStartX + absEndX) / 2} y={bracketY + 22}
      text-anchor="middle" font-size="7"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-refractory)" opacity="0.4"
    >
      absolute
    </text>
    <line x1={absEndX} y1={bracketY + 12} x2={refEndX} y2={bracketY + 12}
      stroke="var(--viz-refractory)" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.3" />
    <text
      x={(absEndX + refEndX) / 2} y={bracketY + 22}
      text-anchor="middle" font-size="7"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-refractory)" opacity="0.4"
    >
      relative
    </text>

    <!-- Peak voltage annotation -->
    <text
      x={tToX(1.7)} y={vToY(42)}
      text-anchor="start" font-size="8"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text)" opacity="0.5"
    >
      +40 mV peak
    </text>
  </svg>
</figure>

<style>
  .trace-viz {
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-separator, #888);
    --viz-grid: var(--theme-separator, #555);
    --viz-waveform: var(--theme-green, #10b981);
    --viz-na: var(--theme-red, #ef4444);
    --viz-k: var(--theme-blue, #3b82f6);
    --viz-resting: var(--theme-yellow, #f59e0b);
    --viz-threshold: var(--theme-cyan, #06b6d4);
    --viz-refractory: var(--theme-accent, #8b5cf6);
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }
  svg {
    display: block;
    max-width: 620px;
    margin: 0 auto;
  }
</style>
