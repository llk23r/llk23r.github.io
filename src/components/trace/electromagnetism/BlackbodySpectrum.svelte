<script>
  import { onMount } from 'svelte'
  import { planckRadiance, rayleighJeans, wienPeak, wavelengthToRGB, temperatureLabel } from './vizUtils.ts'

  let canvas
  let ctx

  let temperature = $state(5778)
  let showClassical = $state(false)

  const T_MIN = 300
  const T_MAX = 10000
  const LOG_MIN = Math.log(T_MIN)
  const LOG_MAX = Math.log(T_MAX)

  function sliderToTemp(v) {
    return Math.round(Math.exp(LOG_MIN + v * (LOG_MAX - LOG_MIN)))
  }

  function tempToSlider(T) {
    return (Math.log(T) - LOG_MIN) / (LOG_MAX - LOG_MIN)
  }

  const PRESETS = [
    { T: 300, label: '300 K Room' },
    { T: 2700, label: '2700 K Bulb' },
    { T: 5778, label: '5778 K Sun' },
    { T: 10000, label: '10000 K Star' },
  ]

  const CANVAS_H = 320
  const MARGIN = { top: 24, right: 20, bottom: 52, left: 72 }

  const LAMBDA_MIN = 100    // nm
  const LAMBDA_MAX = 3000   // nm
  const N_SAMPLES = 500

  const X_TICKS = [100, 200, 500, 750, 1000, 1500, 2000, 2500, 3000]

  function formatSI(v) {
    if (v === 0) return '0'
    const abs = Math.abs(v)
    if (abs >= 1e15) return (v / 1e15).toFixed(1) + 'P'
    if (abs >= 1e12) return (v / 1e12).toFixed(1) + 'T'
    if (abs >= 1e9) return (v / 1e9).toFixed(1) + 'G'
    if (abs >= 1e6) return (v / 1e6).toFixed(1) + 'M'
    if (abs >= 1e3) return (v / 1e3).toFixed(1) + 'k'
    if (abs >= 1) return v.toFixed(1)
    if (abs >= 1e-3) return (v * 1e3).toFixed(1) + 'm'
    if (abs >= 1e-6) return (v * 1e6).toFixed(1) + '\u00b5'
    return v.toExponential(1)
  }

  function niceYTicks(maxVal) {
    if (maxVal <= 0) return [0]
    const rough = maxVal / 5
    const mag = Math.pow(10, Math.floor(Math.log10(rough)))
    const residual = rough / mag
    let nice
    if (residual <= 1.5) nice = 1 * mag
    else if (residual <= 3.5) nice = 2 * mag
    else if (residual <= 7.5) nice = 5 * mag
    else nice = 10 * mag

    const ticks = []
    for (let v = 0; v <= maxVal * 1.05; v += nice) {
      ticks.push(v)
    }
    return ticks
  }

  function draw() {
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    ctx.clearRect(0, 0, w, h)

    const style = getComputedStyle(canvas)
    const axisColor = style.getPropertyValue('--viz-axis').trim() || '#666'
    const gridColor = style.getPropertyValue('--viz-grid').trim() || '#333'
    const textColor = style.getPropertyValue('--viz-text').trim() || '#ccc'
    const textMuted = style.getPropertyValue('--viz-text-muted').trim() || '#888'
    const planckColor = style.getPropertyValue('--viz-curve-planck').trim() || '#ff6b35'
    const classicalColor = style.getPropertyValue('--viz-curve-classical').trim() || '#60a5fa'
    const wienColor = style.getPropertyValue('--viz-wien').trim() || '#f59e0b'

    const plotL = MARGIN.left
    const plotR = w - MARGIN.right
    const plotT = MARGIN.top
    const plotB = h - MARGIN.bottom
    const plotW = plotR - plotL
    const plotH = plotB - plotT

    // Compute Planck data
    const planckData = []
    let maxPlanck = 0
    for (let i = 0; i < N_SAMPLES; i++) {
      const nm = LAMBDA_MIN + (LAMBDA_MAX - LAMBDA_MIN) * (i / (N_SAMPLES - 1))
      const lambda_m = nm * 1e-9
      const val = planckRadiance(lambda_m, temperature)
      planckData.push({ nm, val })
      if (val > maxPlanck) maxPlanck = val
    }

    // Compute Rayleigh-Jeans data (capped at 2x Planck peak)
    let rjData = []
    if (showClassical) {
      const rjCap = maxPlanck * 2
      for (let i = 0; i < N_SAMPLES; i++) {
        const nm = LAMBDA_MIN + (LAMBDA_MAX - LAMBDA_MIN) * (i / (N_SAMPLES - 1))
        const lambda_m = nm * 1e-9
        const val = Math.min(rayleighJeans(lambda_m, temperature), rjCap)
        rjData.push({ nm, val })
      }
    }

    // Y-axis max: use Planck peak, extend a bit
    const yMax = maxPlanck > 0 ? maxPlanck * 1.15 : 1
    const yTicks = niceYTicks(maxPlanck)

    function xToPixel(nm) {
      return plotL + ((nm - LAMBDA_MIN) / (LAMBDA_MAX - LAMBDA_MIN)) * plotW
    }
    function yToPixel(val) {
      return plotB - (val / yMax) * plotH
    }

    // --- Draw visible spectrum band (380-700nm) ---
    for (let nm = 380; nm <= 700; nm += 1) {
      const [r, g, b] = wavelengthToRGB(nm)
      const x = xToPixel(nm)
      const xNext = xToPixel(nm + 1)
      ctx.fillStyle = `rgba(${r},${g},${b},0.15)`
      ctx.fillRect(x, plotT, xNext - x + 0.5, plotH)
    }

    // --- Grid lines ---
    ctx.lineWidth = 0.5
    ctx.strokeStyle = gridColor

    // X grid
    for (const tick of X_TICKS) {
      const x = xToPixel(tick)
      if (x >= plotL && x <= plotR) {
        ctx.beginPath()
        ctx.moveTo(x, plotT)
        ctx.lineTo(x, plotB)
        ctx.stroke()
      }
    }

    // Y grid
    for (const tick of yTicks) {
      const y = yToPixel(tick)
      if (y >= plotT && y <= plotB) {
        ctx.beginPath()
        ctx.moveTo(plotL, y)
        ctx.lineTo(plotR, y)
        ctx.stroke()
      }
    }

    // --- Axes ---
    ctx.strokeStyle = axisColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(plotL, plotT)
    ctx.lineTo(plotL, plotB)
    ctx.lineTo(plotR, plotB)
    ctx.stroke()

    // --- X-axis tick marks and labels ---
    ctx.fillStyle = textMuted
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (const tick of X_TICKS) {
      const x = xToPixel(tick)
      if (x >= plotL && x <= plotR) {
        ctx.beginPath()
        ctx.moveTo(x, plotB)
        ctx.lineTo(x, plotB + 4)
        ctx.strokeStyle = axisColor
        ctx.stroke()
        ctx.fillText(tick.toString(), x, plotB + 6)
      }
    }

    // X-axis label
    ctx.fillStyle = textColor
    ctx.font = '11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('Wavelength (nm)', plotL + plotW / 2, plotB + 22)

    // --- Y-axis tick marks and labels ---
    ctx.fillStyle = textMuted
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (const tick of yTicks) {
      const y = yToPixel(tick)
      if (y >= plotT && y <= plotB) {
        ctx.beginPath()
        ctx.moveTo(plotL - 4, y)
        ctx.lineTo(plotL, y)
        ctx.strokeStyle = axisColor
        ctx.stroke()
        ctx.fillText(formatSI(tick), plotL - 8, y)
      }
    }

    // Y-axis label (rotated)
    ctx.save()
    ctx.fillStyle = textColor
    ctx.font = '11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.translate(14, plotT + plotH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Spectral Radiance', 0, 0)
    ctx.restore()

    // --- Rayleigh-Jeans curve (blue dashed) ---
    if (showClassical && rjData.length > 0) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(plotL, plotT, plotW, plotH)
      ctx.clip()

      ctx.strokeStyle = classicalColor
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      let started = false
      for (const pt of rjData) {
        const x = xToPixel(pt.nm)
        const y = yToPixel(pt.val)
        if (!started) {
          ctx.moveTo(x, y)
          started = true
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    }

    // --- Planck curve (orange solid) ---
    ctx.save()
    ctx.beginPath()
    ctx.rect(plotL, plotT, plotW, plotH)
    ctx.clip()

    ctx.strokeStyle = planckColor
    ctx.lineWidth = 2
    ctx.beginPath()
    let started = false
    for (const pt of planckData) {
      const x = xToPixel(pt.nm)
      const y = yToPixel(pt.val)
      if (!started) {
        ctx.moveTo(x, y)
        started = true
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
    ctx.restore()

    // --- Wien peak dashed line ---
    const peakNm = wienPeak(temperature) * 1e9
    if (peakNm >= LAMBDA_MIN && peakNm <= LAMBDA_MAX) {
      const peakX = xToPixel(peakNm)

      ctx.save()
      ctx.strokeStyle = wienColor
      ctx.lineWidth = 1
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(peakX, plotT)
      ctx.lineTo(peakX, plotB)
      ctx.stroke()
      ctx.setLineDash([])

      // Wien peak label
      ctx.fillStyle = wienColor
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      const labelText = '\u03bb_max = ' + Math.round(peakNm) + ' nm'
      ctx.fillText(labelText, peakX + 5, plotT + 4)
      ctx.restore()
    }

    // --- Temperature readout (top-right) ---
    ctx.fillStyle = textColor
    ctx.font = 'bold 12px "JetBrains Mono", monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(temperature.toLocaleString() + ' K', plotR - 4, plotT + 4)

    ctx.fillStyle = textMuted
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(temperatureLabel(temperature), plotR - 4, plotT + 20)
  }

  $effect(() => {
    temperature
    showClassical
    draw()
  })

  onMount(() => {
    ctx = canvas.getContext('2d')
    draw()

    const resizeObs = new ResizeObserver(() => draw())
    resizeObs.observe(canvas.parentElement)
    return () => resizeObs.disconnect()
  })
</script>

<figure class="trace-viz" data-preserves-color role="img" aria-label="Blackbody spectrum: Planck distribution curve with temperature slider, visible spectrum band, and Wien peak marker">
  <div class="canvas-wrap">
    <canvas bind:this={canvas}></canvas>
  </div>
  <div class="controls">
    <label class="slider-label">
      <span>Temperature: <strong>{temperature.toLocaleString()} K</strong></span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.001"
        value={tempToSlider(temperature)}
        oninput={(e) => temperature = sliderToTemp(parseFloat(e.target.value))}
      />
    </label>
    <div class="preset-row">
      {#each PRESETS as preset}
        <button
          class:active={temperature === preset.T}
          onclick={() => temperature = preset.T}
        >
          {preset.label}
        </button>
      {/each}
    </div>
    <button
      class="toggle-btn"
      class:active={showClassical}
      onclick={() => showClassical = !showClassical}
    >
      {showClassical ? 'Hide' : 'Show'} Classical (R-J)
    </button>
  </div>
</figure>

<style>
  .trace-viz {
    --viz-axis: var(--theme-separator, #666);
    --viz-grid: var(--theme-separator, #333);
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);
    --viz-curve-planck: var(--theme-orange, #ff6b35);
    --viz-curve-classical: var(--theme-blue, #60a5fa);
    --viz-wien: var(--theme-yellow, #f59e0b);

    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .canvas-wrap {
    width: 100%;
    height: 320px;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.6rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.75rem;
  }

  .slider-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--theme-foreground, #aaa);
  }

  .slider-label span {
    white-space: nowrap;
    min-width: 140px;
  }

  .slider-label strong {
    color: var(--theme-orange, #ff6b35);
  }

  .slider-label input[type="range"] {
    flex: 1;
    accent-color: var(--theme-orange, #ff6b35);
    cursor: pointer;
  }

  .preset-row {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    border: 1px solid var(--theme-separator, #444);
    background: transparent;
    color: var(--theme-foreground, #ccc);
    font-family: inherit;
    font-size: 0.7rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  button:hover {
    background: var(--theme-separator, #333);
  }

  button.active {
    border-color: var(--theme-orange, #ff6b35);
    color: var(--theme-orange, #ff6b35);
  }

  .toggle-btn {
    align-self: flex-start;
  }

  .toggle-btn.active {
    border-color: var(--theme-blue, #60a5fa);
    color: var(--theme-blue, #60a5fa);
  }
</style>
