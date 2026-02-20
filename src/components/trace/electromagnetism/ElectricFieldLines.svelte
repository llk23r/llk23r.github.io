<script>
  const posX = 200
  const negX = 600
  const cy = 200
  const chargeR = 28

  const lines = [
    { dy: 0, spread: 0 },
    { dy: 0, spread: 60 },
    { dy: 0, spread: -60 },
    { dy: 0, spread: 120 },
    { dy: 0, spread: -120 },
    { dy: 0, spread: 175 },
    { dy: 0, spread: -175 },
    { dy: 0, spread: 225 },
    { dy: 0, spread: -225 },
  ]

  function getPath(dy, spread) {
    const startY = cy + dy
    const endY = cy + dy
    const cp1x = posX + 100
    const cp1y = startY - spread
    const cp2x = negX - 100
    const cp2y = endY - spread
    return `M${posX + chargeR + 2},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${negX - chargeR - 2},${endY}`
  }

  function getMidpoint(dy, spread) {
    const startY = cy + dy
    const endY = cy + dy
    const cp1x = posX + 100
    const cp1y = startY - spread
    const cp2x = negX - 100
    const cp2y = endY - spread
    const t = 0.5
    const mt = 0.5
    const mx = mt ** 3 * (posX + chargeR + 2) + 3 * mt ** 2 * t * cp1x + 3 * mt * t ** 2 * cp2x + t ** 3 * (negX - chargeR - 2)
    const my = mt ** 3 * startY + 3 * mt ** 2 * t * cp1y + 3 * mt * t ** 2 * cp2y + t ** 3 * endY
    const dx = 3 * mt ** 2 * (cp1x - (posX + chargeR + 2)) + 6 * mt * t * (cp2x - cp1x) + 3 * t ** 2 * ((negX - chargeR - 2) - cp2x)
    const dyt = 3 * mt ** 2 * (cp1y - startY) + 6 * mt * t * (cp2y - cp1y) + 3 * t ** 2 * (endY - cp2y)
    const angle = (Math.atan2(dyt, dx) * 180) / Math.PI
    return { mx, my, angle }
  }
</script>

<figure class="trace-viz" role="img" aria-label="Electric field lines from positive charge to negative charge">
  <svg viewBox="0 0 800 400" width="100%">
    <!-- Field lines -->
    {#each lines as { dy, spread }}
      <path d={getPath(dy, spread)} fill="none" stroke="var(--viz-text-muted)" stroke-width="1.5" opacity="0.6" />
    {/each}

    <!-- Directional arrows at midpoints -->
    {#each lines as { dy, spread }}
      {@const mid = getMidpoint(dy, spread)}
      <polygon
        points="-5,-3.5 5,0 -5,3.5"
        transform="translate({mid.mx},{mid.my}) rotate({mid.angle})"
        fill="var(--viz-text-muted)"
        opacity="0.75"
      />
    {/each}

    <!-- Positive charge -->
    <circle cx={posX} cy={cy} r={chargeR} fill="var(--viz-positive)" />
    <text x={posX} y={cy} text-anchor="middle" dominant-baseline="central" font-size="26" font-weight="700" fill="#fff">+</text>

    <!-- Negative charge -->
    <circle cx={negX} cy={cy} r={chargeR} fill="var(--viz-negative)" />
    <text x={negX} y={cy} text-anchor="middle" dominant-baseline="central" font-size="26" font-weight="700" fill="#fff">&minus;</text>

    <!-- Bottom label -->
    <text x="400" y="380" text-anchor="middle" font-size="14" font-family="'JetBrains Mono', monospace" fill="var(--viz-text)">Electric field lines point from + to &minus;</text>
  </svg>
</figure>

<style>
  .trace-viz {
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);
    --viz-positive: var(--theme-red, #ef4444);
    --viz-negative: var(--theme-blue, #3b82f6);
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
