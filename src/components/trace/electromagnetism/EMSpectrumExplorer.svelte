<script>
  const REGIONS = [
    { name: 'Radio', fill: '#8B4513', app: 'WiFi / AM-FM', width: 180 },
    { name: 'Microwave', fill: '#CD853F', app: 'Oven / Radar', width: 140 },
    { name: 'Infrared', fill: '#DC143C', app: 'Remote / Heat', width: 120 },
    { name: 'Visible', fill: 'url(#rainbowGrad)', app: 'Human Vision', width: 60 },
    { name: 'Ultraviolet', fill: '#7B68EE', app: 'Sunburn', width: 100 },
    { name: 'X-ray', fill: '#4169E1', app: 'Medical', width: 120 },
    { name: 'Gamma', fill: '#483D8B', app: 'Nuclear', width: 130 },
  ]

  const TOTAL_W = 850
  const BAND_H = 52
  const PAD_LEFT = 50
  const PAD_TOP = 44
  const SVG_W = 920
  const SVG_H = 206

  // Precompute x-positions for each region
  let regionPositions = []
  let cumX = PAD_LEFT
  for (const r of REGIONS) {
    regionPositions.push({ ...r, x: cumX })
    cumX += r.width
  }

  // Find the visible region for highlight
  const visibleRegion = regionPositions.find(r => r.name === 'Visible')
  const visX = visibleRegion.x
  const visW = visibleRegion.width

  // Wavelength labels along top
  const wavelengthLabels = [
    { text: '10\u00b3 m', x: PAD_LEFT + 60 },
    { text: '10\u207b\u00b2 m', x: PAD_LEFT + 230 },
    { text: '10\u207b\u2075 m', x: PAD_LEFT + 390 },
    { text: '~500 nm', x: visX + visW / 2 },
    { text: '10\u207b\u2078 m', x: PAD_LEFT + 570 },
    { text: '10\u207b\u00b9\u00b0 m', x: PAD_LEFT + 680 },
    { text: '10\u207b\u00b9\u00b2 m', x: PAD_LEFT + 800 },
  ]
</script>

<figure class="trace-viz" data-preserves-color role="img" aria-label="Electromagnetic spectrum from radio waves to gamma rays with visible light highlighted">
  <svg viewBox="0 0 {SVG_W} {SVG_H}" width="100%">
    <defs>
      <!-- Rainbow gradient for visible light -->
      <linearGradient id="rainbowGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ff0000" />
        <stop offset="17%" stop-color="#ff8800" />
        <stop offset="33%" stop-color="#ffff00" />
        <stop offset="50%" stop-color="#00ff00" />
        <stop offset="67%" stop-color="#0088ff" />
        <stop offset="83%" stop-color="#4400ff" />
        <stop offset="100%" stop-color="#8800ff" />
      </linearGradient>
    </defs>

    <!-- Title -->
    <text x={SVG_W / 2} y="18" text-anchor="middle" font-size="14" font-weight="700"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text)" letter-spacing="0.05em">
      Electromagnetic Spectrum
    </text>

    <!-- Wavelength labels -->
    {#each wavelengthLabels as wl}
      <text x={wl.x} y={PAD_TOP - 6} text-anchor="middle" font-size="9"
        font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.6">
        {wl.text}
      </text>
      <line x1={wl.x} y1={PAD_TOP - 2} x2={wl.x} y2={PAD_TOP} stroke="var(--viz-text-muted)" stroke-width="0.5" opacity="0.3" />
    {/each}

    <!-- Spectrum band regions -->
    {#each regionPositions as region, i}
      <rect
        x={region.x}
        y={PAD_TOP}
        width={region.width}
        height={BAND_H}
        fill={region.fill}
        opacity="0.85"
        rx={i === 0 ? 4 : i === REGIONS.length - 1 ? 4 : 0}
      />
      <!-- Region name -->
      <text
        x={region.x + region.width / 2}
        y={PAD_TOP + 22}
        text-anchor="middle"
        font-size={region.name === 'Visible' ? '8' : '10'}
        font-weight="600"
        font-family="'JetBrains Mono', monospace"
        fill="#fff"
        opacity="0.95"
      >
        {region.name}
      </text>
      <!-- Application label -->
      <text
        x={region.x + region.width / 2}
        y={PAD_TOP + 38}
        text-anchor="middle"
        font-size="7"
        font-family="'JetBrains Mono', monospace"
        fill="#fff"
        opacity="0.55"
      >
        {region.app}
      </text>
    {/each}

    <!-- Visible light highlight box -->
    <rect
      x={visX - 2}
      y={PAD_TOP - 16}
      width={visW + 4}
      height={BAND_H + 32}
      fill="none"
      stroke="var(--viz-text)"
      stroke-width="1"
      stroke-dasharray="3,2"
      opacity="0.5"
      rx="3"
    />

    <!-- Bracket lines from visible box to expanded label below -->
    <line x1={visX + visW / 2} y1={PAD_TOP + BAND_H + 16} x2={visX + visW / 2} y2={PAD_TOP + BAND_H + 30}
      stroke="var(--viz-text-muted)" stroke-width="0.75" opacity="0.4" />
    <text
      x={visX + visW / 2}
      y={PAD_TOP + BAND_H + 44}
      text-anchor="middle"
      font-size="8"
      font-family="'JetBrains Mono', monospace"
      fill="var(--viz-text)"
      opacity="0.7"
    >
      380 - 700 nm
    </text>

    <!-- Rainbow expanded bar beneath bracket -->
    <rect
      x={visX - 40}
      y={PAD_TOP + BAND_H + 50}
      width={visW + 80}
      height={8}
      fill="url(#rainbowGrad)"
      rx="4"
      opacity="0.8"
    />
    <!-- Visible expanded labels -->
    <text x={visX - 40} y={PAD_TOP + BAND_H + 72} text-anchor="start" font-size="7"
      font-family="'JetBrains Mono', monospace" fill="#ef4444" opacity="0.7">Red</text>
    <text x={visX + visW / 2 - 10} y={PAD_TOP + BAND_H + 72} text-anchor="middle" font-size="7"
      font-family="'JetBrains Mono', monospace" fill="#22c55e" opacity="0.7">Green</text>
    <text x={visX + visW + 40} y={PAD_TOP + BAND_H + 72} text-anchor="end" font-size="7"
      font-family="'JetBrains Mono', monospace" fill="#8b5cf6" opacity="0.7">Violet</text>

    <!-- Frequency arrow at bottom -->
    <defs>
      <marker id="specArrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--viz-text-muted)" />
      </marker>
    </defs>

    <!-- Wavelength arrow (decreasing, left to right) -->
    <line x1={PAD_LEFT + TOTAL_W - 10} y1={SVG_H - 20} x2={PAD_LEFT + 10} y2={SVG_H - 20}
      stroke="var(--viz-text-muted)" stroke-width="1" opacity="0.4" marker-end="url(#specArrow)" />
    <text x={PAD_LEFT + TOTAL_W / 2} y={SVG_H - 24} text-anchor="middle" font-size="9"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.5" letter-spacing="0.08em">
      wavelength
    </text>

    <!-- Frequency arrow (increasing, left to right) -->
    <line x1={PAD_LEFT + 10} y1={SVG_H - 6} x2={PAD_LEFT + TOTAL_W - 10} y2={SVG_H - 6}
      stroke="var(--viz-text-muted)" stroke-width="1" opacity="0.4" marker-end="url(#specArrow)" />
    <text x={PAD_LEFT + TOTAL_W / 2} y={SVG_H - 9} text-anchor="middle" font-size="9"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.5" letter-spacing="0.08em">
      frequency / energy
    </text>
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
