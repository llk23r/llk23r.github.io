<script>
  const forces = [
    { name: 'Strong Nuclear', strength: 1, strengthLabel: '1', range: '~10\u207b\u00b9\u2075 m', carrier: 'Gluon', color: '#ef4444' },
    { name: 'Electromagnetic', strength: 1 / 137, strengthLabel: '1/137', range: '\u221e', carrier: 'Photon', color: '#f59e0b', highlight: true },
    { name: 'Weak Nuclear', strength: 1e-6, strengthLabel: '10\u207b\u2076', range: '~10\u207b\u00b9\u2078 m', carrier: 'W\u00b1, Z\u2070', color: '#3b82f6' },
    { name: 'Gravity', strength: 6e-39, strengthLabel: '6\u00d710\u207b\u00b3\u2079', range: '\u221e', carrier: 'Graviton?', color: '#10b981' },
  ]

  // Log scale: map log10(strength) from -39 to 0 -> 0 to maxBarWidth
  const maxBarWidth = 380
  const minLog = -39
  const maxLog = 0

  function barWidth(strength) {
    const logVal = Math.log10(strength)
    const normalized = (logVal - minLog) / (maxLog - minLog)
    return Math.max(6, normalized * maxBarWidth)
  }

  const barY0 = 52
  const barH = 36
  const barGap = 12
  const labelX = 138
  const barX = 150
</script>

<figure class="trace-viz" role="img" aria-label="The four fundamental forces compared by relative strength on a logarithmic scale">
  <svg viewBox="0 0 700 280" width="100%">
    <!-- Title -->
    <text x="350" y="26" text-anchor="middle" font-size="14" font-weight="700"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text)" letter-spacing="0.04em">
      The Four Fundamental Forces
    </text>

    <!-- Bars -->
    {#each forces as force, i}
      {@const y = barY0 + i * (barH + barGap)}
      {@const w = barWidth(force.strength)}

      <!-- Force name (left-aligned) -->
      <text
        x={labelX}
        y={y + barH / 2 + 1}
        text-anchor="end"
        dominant-baseline="central"
        font-size="11"
        font-weight="600"
        font-family="'JetBrains Mono', monospace"
        fill={force.color}
        opacity={force.highlight ? 1 : 0.85}
      >
        {force.name}
      </text>

      <!-- Bar -->
      {#if force.highlight}
        <!-- Glow for electromagnetic -->
        <rect
          x={barX}
          y={y + 2}
          width={w}
          height={barH - 4}
          rx="4"
          fill={force.color}
          opacity="0.15"
          filter="url(#emGlow)"
        />
      {/if}
      <rect
        x={barX}
        y={y + 4}
        width={w}
        height={barH - 8}
        rx="4"
        fill={force.color}
        opacity={force.highlight ? 0.9 : 0.7}
      />

      <!-- Strength label (at end of bar) -->
      <text
        x={barX + w + 8}
        y={y + barH / 2 - 4}
        text-anchor="start"
        dominant-baseline="central"
        font-size="10"
        font-weight="600"
        font-family="'JetBrains Mono', monospace"
        fill="var(--viz-text)"
        opacity="0.85"
      >
        {force.strengthLabel}
      </text>

      <!-- Range + carrier below strength -->
      <text
        x={barX + w + 8}
        y={y + barH / 2 + 10}
        text-anchor="start"
        dominant-baseline="central"
        font-size="8"
        font-family="'JetBrains Mono', monospace"
        fill="var(--viz-text-muted)"
        opacity="0.55"
      >
        Range: {force.range} &middot; {force.carrier}
      </text>
    {/each}

    <!-- Log scale axis label at bottom -->
    <defs>
      <marker id="ffArrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--viz-text-muted)" />
      </marker>
      <filter id="emGlow">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <line
      x1={barX + maxBarWidth}
      y1={barY0 + 4 * (barH + barGap) + 6}
      x2={barX}
      y2={barY0 + 4 * (barH + barGap) + 6}
      stroke="var(--viz-text-muted)"
      stroke-width="1"
      opacity="0.35"
      marker-end="url(#ffArrow)"
    />
    <text
      x={barX + maxBarWidth / 2}
      y={barY0 + 4 * (barH + barGap) + 22}
      text-anchor="middle"
      font-size="9"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text-muted)"
      opacity="0.5"
      letter-spacing="0.06em"
    >
      &larr; Relative strength (log scale)
    </text>

    <!-- Subtle log scale tick marks -->
    {#each [-39, -30, -20, -10, 0] as logTick}
      {@const tx = barX + ((logTick - minLog) / (maxLog - minLog)) * maxBarWidth}
      <line
        x1={tx} y1={barY0 + 4 * (barH + barGap) + 2}
        x2={tx} y2={barY0 + 4 * (barH + barGap) + 10}
        stroke="var(--viz-text-muted)" stroke-width="0.5" opacity="0.3"
      />
      <text
        x={tx}
        y={barY0 + 4 * (barH + barGap) + 36}
        text-anchor="middle"
        font-size="7"
        font-family="'JetBrains Mono', monospace"
        fill="var(--viz-text-muted)"
        opacity="0.35"
      >
        10{#if logTick === 0}&sup0;{:else if logTick === -10}&sup{'\u207b\u00b9\u2070'}{:else if logTick === -20}&sup{'\u207b\u00b2\u2070'}{:else if logTick === -30}&sup{'\u207b\u00b3\u2070'}{:else if logTick === -39}&sup{'\u207b\u00b3\u2079'}{/if}
      </text>
    {/each}
  </svg>
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
  svg {
    display: block;
    max-width: 720px;
    margin: 0 auto;
  }
</style>
