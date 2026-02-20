<script>
  import { onMount } from 'svelte'

  let frequency = $state(500)        // THz (range: 200-1200)
  let intensity = $state(3)          // number of photons (1-5)

  let wavelengthNm = $derived(Math.round(299792 / frequency))
  let photonEnergy = $derived(+(frequency * 4.136e-3).toFixed(3))  // eV (h = 4.136e-15 eV*s, freq in THz = 1e12)
  const thresholdFreq = 540          // THz (~2.24 eV for cesium)
  const workFunction = 2.24          // eV
  let aboveThreshold = $derived(frequency >= thresholdFreq)
  let kineticEnergy = $derived(aboveThreshold ? +(photonEnergy - workFunction).toFixed(3) : 0)

  // Animation time for photon/electron movement
  let time = $state(0)
  let animFrame = $state(null)

  function animate(timestamp) {
    time = (timestamp / 1000) % 100  // wrapping seconds
    animFrame = requestAnimationFrame(animate)
  }

  onMount(() => {
    animFrame = requestAnimationFrame(animate)
    return () => {
      if (animFrame) cancelAnimationFrame(animFrame)
    }
  })

  // Wavelength to RGB (inline, from vizUtils pattern)
  function wavelengthToRGB(nm) {
    let r = 0, g = 0, b = 0
    if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1 }
    else if (nm >= 440 && nm < 490) { g = (nm - 440) / 50; b = 1 }
    else if (nm >= 490 && nm < 510) { g = 1; b = -(nm - 510) / 20 }
    else if (nm >= 510 && nm < 580) { r = (nm - 510) / 70; g = 1 }
    else if (nm >= 580 && nm < 645) { r = 1; g = -(nm - 645) / 65 }
    else if (nm >= 645 && nm <= 780) { r = 1 }
    // Intensity fall-off at edges
    let factor
    if (nm >= 380 && nm < 420) factor = 0.3 + 0.7 * (nm - 380) / 40
    else if (nm >= 420 && nm <= 700) factor = 1
    else if (nm > 700 && nm <= 780) factor = 0.3 + 0.7 * (780 - nm) / 80
    else factor = 0.15 // outside visible: dim gray
    return `rgb(${Math.round(r * factor * 255)}, ${Math.round(g * factor * 255)}, ${Math.round(b * factor * 255)})`
  }

  let photonColor = $derived(wavelengthToRGB(wavelengthNm))

  // Generate photon positions (animated, cycling left to right)
  function photonX(index, t) {
    const speed = 80 // px per second
    const startOffset = index * 0.4 // stagger
    const cycleLen = 3.0 // seconds for full traverse
    const progress = ((t + startOffset) % cycleLen) / cycleLen
    return 40 + progress * 260 // from x=40 to x=300 (metal plate at ~320)
  }

  function photonY(index) {
    const spread = 50
    const center = 180
    const count = intensity
    if (count === 1) return center
    return center - spread / 2 + (index / (count - 1)) * spread
  }

  // Electron positions (only if above threshold)
  function electronX(index, t) {
    if (!aboveThreshold) return 370
    const speed = 40 + kineticEnergy * 30
    const startOffset = index * 0.6
    const cycleLen = 2.5
    const progress = ((t + startOffset) % cycleLen) / cycleLen
    return 370 + progress * 200
  }

  function electronY(index, t) {
    const baseY = photonY(index)
    if (!aboveThreshold) return baseY
    const startOffset = index * 0.6
    const cycleLen = 2.5
    const progress = ((t + startOffset) % cycleLen) / cycleLen
    // Slight upward arc
    return baseY - Math.sin(progress * Math.PI) * (20 + kineticEnergy * 15)
  }

  // Metal plate
  const plateX = 310
  const plateW = 30
  const plateY1 = 110
  const plateY2 = 260

  // Energy diagram constants
  const eBarMax = 160
  const eBarH = 8
  const maxDisplayEv = 5
  let photonBarW = $derived(Math.min(photonEnergy / maxDisplayEv, 1) * eBarMax)
  let threshBarW = $derived((workFunction / maxDisplayEv) * eBarMax)
</script>

<figure class="trace-viz" data-preserves-color role="img" aria-label="Interactive photoelectric effect: adjust frequency and intensity to see electron ejection">
  <svg viewBox="0 0 700 400" width="100%">
    <defs>
      <!-- Photon wave pattern -->
      <marker id="peArrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto">
        <path d="M 0 1 L 9 5 L 0 9 z" fill={photonColor} />
      </marker>
    </defs>

    <!-- Background labels -->
    <text x="160" y="90" text-anchor="middle" font-size="11" font-weight="600"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text)" opacity="0.6">
      Incoming photons
    </text>

    <text x="530" y="90" text-anchor="middle" font-size="11" font-weight="600"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text)" opacity="0.6">
      {#if aboveThreshold}Ejected electrons{:else}No ejection{/if}
    </text>

    <!-- Metal plate -->
    <rect x={plateX} y={plateY1} width={plateW} height={plateY2 - plateY1}
      fill="var(--viz-text-muted)" opacity="0.3" rx="2" />
    <rect x={plateX + 2} y={plateY1 + 2} width={plateW - 4} height={plateY2 - plateY1 - 4}
      fill="none" stroke="var(--viz-text-muted)" stroke-width="0.5" opacity="0.3" rx="1" />

    <!-- Metal label -->
    <text x={plateX + plateW / 2} y={plateY2 + 16} text-anchor="middle" font-size="9"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.6">
      Metal (Cs)
    </text>
    <text x={plateX + plateW / 2} y={plateY2 + 28} text-anchor="middle" font-size="8"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.4">
      W = {workFunction} eV
    </text>

    <!-- Threshold indicator line -->
    <line x1={plateX - 4} y1={plateY1 - 8} x2={plateX - 4} y2={plateY2 + 4}
      stroke={aboveThreshold ? 'var(--viz-accept)' : 'var(--viz-reject)'}
      stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5" />

    <!-- Incoming photons (animated waves/arrows) -->
    {#each Array(intensity) as _, i}
      {@const px = photonX(i, time)}
      {@const py = photonY(i)}

      <!-- Photon wave visualization: small sine segments -->
      {#each [0, 1, 2] as seg}
        {@const sx = px - 25 + seg * 10}
        <line
          x1={sx} y1={py - 4}
          x2={sx + 5} y2={py + 4}
          stroke={photonColor} stroke-width="2" opacity="0.7"
        />
        <line
          x1={sx + 5} y1={py + 4}
          x2={sx + 10} y2={py - 4}
          stroke={photonColor} stroke-width="2" opacity="0.7"
        />
      {/each}

      <!-- Photon arrow tip -->
      <polygon
        points="{px + 8},{py} {px + 2},{py - 4} {px + 2},{py + 4}"
        fill={photonColor} opacity="0.8"
      />

      <!-- If photon has hit plate and below threshold, show bounce/stop -->
      {#if !aboveThreshold && px > plateX - 20}
        <text x={plateX + plateW + 20} y={py + 4} font-size="10"
          font-family="'JetBrains Mono', monospace" fill="var(--viz-reject)" opacity="0.7">
          &cross;
        </text>
      {/if}
    {/each}

    <!-- Ejected electrons (only if above threshold) -->
    {#if aboveThreshold}
      {#each Array(intensity) as _, i}
        {@const ex = electronX(i, time)}
        {@const ey = electronY(i, time)}

        <!-- Electron circle -->
        <circle cx={ex} cy={ey} r="8" fill="var(--viz-electron-fill)" opacity="0.8" />
        <text x={ex} y={ey + 1} text-anchor="middle" dominant-baseline="central"
          font-size="8" font-weight="700"
          font-family="'JetBrains Mono', monospace" fill="#fff">
          e&minus;
        </text>

        <!-- Speed lines -->
        <line x1={ex - 14} y1={ey - 2} x2={ex - 22} y2={ey - 2}
          stroke="var(--viz-electron-fill)" stroke-width="1" opacity="0.4" />
        <line x1={ex - 14} y1={ey + 2} x2={ex - 20} y2={ey + 2}
          stroke="var(--viz-electron-fill)" stroke-width="1" opacity="0.3" />
      {/each}
    {:else}
      <!-- "No ejection" indicator -->
      <text x="530" y="190" text-anchor="middle" font-size="18"
        font-family="'JetBrains Mono', monospace" fill="var(--viz-reject)" opacity="0.5">
        No ejection!
      </text>
      <text x="530" y="210" text-anchor="middle" font-size="9"
        font-family="'JetBrains Mono', monospace" fill="var(--viz-text-muted)" opacity="0.4">
        photon energy &lt; work function
      </text>
    {/if}

    <!-- Energy diagram (bottom-right) -->
    <rect x="490" y="290" width="190" height="80" rx="4"
      fill="rgba(255,255,255,0.03)" stroke="var(--viz-text-muted)" stroke-width="0.5" opacity="0.3" />

    <!-- Threshold line in energy diagram -->
    <line x1="500" y1="340" x2="670" y2="340"
      stroke="var(--viz-reject)" stroke-width="1" stroke-dasharray="3,2" opacity="0.4" />
    <text x="672" y="343" text-anchor="start" font-size="7"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-reject)" opacity="0.5">
      W
    </text>

    <!-- Photon energy bar -->
    <rect x="505" y="316" width={photonBarW} height={eBarH} rx="2"
      fill={photonColor} opacity="0.7" />
    <text x="505" y="310" font-size="7"
      font-family="'JetBrains Mono', monospace" fill="var(--viz-text)" opacity="0.6">
      E = {photonEnergy} eV
    </text>

    {#if aboveThreshold}
      <!-- Kinetic energy portion -->
      <rect x={505 + threshBarW} y="350" width={photonBarW - threshBarW} height={eBarH} rx="2"
        fill="var(--viz-electron-fill)" opacity="0.7" />
      <text x="505" y="366" font-size="7"
        font-family="'JetBrains Mono', monospace" fill="var(--viz-electron-fill)" opacity="0.6">
        KE = {kineticEnergy} eV
      </text>
    {/if}
  </svg>

  <!-- Controls -->
  <div class="controls">
    <div class="control-row">
      <label>
        Frequency
        <input
          type="range"
          bind:value={frequency}
          min={200} max={1200} step={10}
          name="frequency"
          style="accent-color: {photonColor}"
        />
        <span class="range-value">{frequency} THz</span>
      </label>
      <span class="wavelength-badge" style="color: {photonColor}">
        {wavelengthNm} nm
      </span>
    </div>
    <div class="control-row">
      <label>
        Intensity
        <input
          type="range"
          bind:value={intensity}
          min={1} max={5} step={1}
          name="intensity"
        />
        <span class="range-value">{intensity} photon{intensity > 1 ? 's' : ''}</span>
      </label>
    </div>
  </div>

  <!-- Status bar -->
  <div class="status" class:above={aboveThreshold} class:below={!aboveThreshold}>
    <span>Photon: <strong>{photonEnergy} eV</strong></span>
    <span class="sep">|</span>
    <span>Threshold: <strong>{workFunction} eV</strong></span>
    <span class="sep">|</span>
    <span>
      KE:
      <strong class:ejected={aboveThreshold}>
        {#if aboveThreshold}{kineticEnergy} eV{:else}0 eV{/if}
      </strong>
    </span>
  </div>
</figure>

<style>
  .trace-viz {
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);
    --viz-reject: var(--theme-red, #ef4444);
    --viz-accept: var(--theme-green, #10b981);
    --viz-electron-fill: var(--theme-blue, #3b82f6);
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

  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.6rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
  }

  input[type='range'] {
    width: 120px;
  }

  .range-value {
    min-width: 5rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
  }

  .wavelength-badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    border: 1px solid currentColor;
    opacity: 0.7;
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.65rem;
    color: var(--theme-foreground, #888);
    border-top: 1px solid var(--theme-separator, #333);
    flex-wrap: wrap;
  }

  .status.above {
    background: color-mix(in srgb, var(--viz-accept) 5%, transparent);
  }

  .status.below {
    background: color-mix(in srgb, var(--viz-reject) 5%, transparent);
  }

  .status strong {
    color: var(--theme-foreground, #ccc);
  }

  .status .ejected {
    color: var(--viz-electron-fill);
  }

  .sep {
    opacity: 0.3;
  }

  @media (max-width: 500px) {
    .control-row {
      flex-wrap: wrap;
    }
    input[type='range'] {
      width: 80px;
    }
    .status {
      font-size: 0.6rem;
      gap: 0.3rem;
    }
  }
</style>
