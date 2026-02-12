<script>
  import { onMount } from 'svelte'
  import { planckRadiance, rayleighJeans, wavelengthToRGB } from './vizUtils.ts'

  let canvas
  let ctx

  const T = 5000
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
    const catastropheColor = style.getPropertyValue('--viz-catastrophe').trim() || '#ef4444'

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
      const val = planckRadiance(lambda_m, T)
      planckData.push({ nm, val })
      if (val > maxPlanck) maxPlanck = val
    }

    // Compute Rayleigh-Jeans data (capped at 3x Planck peak)
    const rjCap = maxPlanck * 3
    const rjData = []
    for (let i = 0; i < N_SAMPLES; i++) {
      const nm = LAMBDA_MIN + (LAMBDA_MAX - LAMBDA_MIN) * (i / (N_SAMPLES - 1))
      const lambda_m = nm * 1e-9
      const val = Math.min(rayleighJeans(lambda_m, T), rjCap)
      rjData.push({ nm, val })
    }

    // Y-axis max: account for R-J cap
    const yMax = rjCap * 1.1
    const yTicks = niceYTicks(rjCap)

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
    ctx.save()
    ctx.beginPath()
    ctx.rect(plotL, plotT, plotW, plotH)
    ctx.clip()

    ctx.strokeStyle = classicalColor
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    let rjStarted = false
    for (const pt of rjData) {
      const x = xToPixel(pt.nm)
      const y = yToPixel(pt.val)
      if (!rjStarted) {
        ctx.moveTo(x, y)
        rjStarted = true
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // --- Planck curve (orange solid) ---
    ctx.save()
    ctx.beginPath()
    ctx.rect(plotL, plotT, plotW, plotH)
    ctx.clip()

    ctx.strokeStyle = planckColor
    ctx.lineWidth = 2
    ctx.beginPath()
    let planckStarted = false
    for (const pt of planckData) {
      const x = xToPixel(pt.nm)
      const y = yToPixel(pt.val)
      if (!planckStarted) {
        ctx.moveTo(x, y)
        planckStarted = true
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
    ctx.restore()

    // --- "CATASTROPHE!" annotation ---
    // Find where R-J first hits the cap (divergence point) or use a UV wavelength
    // The divergence is most dramatic around 200-300nm range
    const annotNm = 250
    const annotRjVal = Math.min(rayleighJeans(annotNm * 1e-9, T), rjCap)
    const annotX = xToPixel(annotNm)
    const annotY = yToPixel(annotRjVal)

    // Arrow pointing to the R-J curve divergence
    const arrowStartX = annotX + 40
    const arrowStartY = annotY + 30
    const arrowEndX = annotX + 4
    const arrowEndY = annotY + 4

    ctx.save()
    ctx.strokeStyle = catastropheColor
    ctx.fillStyle = catastropheColor
    ctx.lineWidth = 1.5

    // Arrow line
    ctx.beginPath()
    ctx.moveTo(arrowStartX, arrowStartY)
    ctx.lineTo(arrowEndX, arrowEndY)
    ctx.stroke()

    // Arrowhead
    const angle = Math.atan2(arrowEndY - arrowStartY, arrowEndX - arrowStartX)
    const headLen = 8
    ctx.beginPath()
    ctx.moveTo(arrowEndX, arrowEndY)
    ctx.lineTo(
      arrowEndX - headLen * Math.cos(angle - Math.PI / 6),
      arrowEndY - headLen * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
      arrowEndX - headLen * Math.cos(angle + Math.PI / 6),
      arrowEndY - headLen * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fill()

    // Label
    ctx.font = 'bold 11px "JetBrains Mono", monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('CATASTROPHE!', arrowStartX + 4, arrowStartY - 2)

    ctx.font = '9px "JetBrains Mono", monospace'
    ctx.fillStyle = textMuted
    ctx.fillText('Classical prediction', arrowStartX + 4, arrowStartY + 12)
    ctx.fillText('diverges to infinity', arrowStartX + 4, arrowStartY + 24)
    ctx.restore()

    // --- Legend (top-right) ---
    const legendX = plotR - 8
    const legendY = plotT + 8

    // Title
    ctx.fillStyle = textColor
    ctx.font = 'bold 11px "JetBrains Mono", monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText('T = ' + T.toLocaleString() + ' K', legendX, legendY)

    // Planck legend entry
    const entryY1 = legendY + 20
    ctx.strokeStyle = planckColor
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(legendX - 120, entryY1 + 5)
    ctx.lineTo(legendX - 80, entryY1 + 5)
    ctx.stroke()

    ctx.fillStyle = textColor
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('Planck (quantum)', legendX - 76, entryY1)

    // R-J legend entry
    const entryY2 = entryY1 + 16
    ctx.strokeStyle = classicalColor
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(legendX - 120, entryY2 + 5)
    ctx.lineTo(legendX - 80, entryY2 + 5)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = textColor
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('Rayleigh-Jeans (classical)', legendX - 76, entryY2)
  }

  onMount(() => {
    ctx = canvas.getContext('2d')
    draw()

    const resizeObs = new ResizeObserver(() => draw())
    resizeObs.observe(canvas.parentElement)
    return () => resizeObs.disconnect()
  })
</script>

<figure class="trace-viz" role="img" aria-label="Ultraviolet catastrophe: Rayleigh-Jeans classical prediction diverges at short wavelengths while Planck quantum prediction remains bounded">
  <div class="canvas-wrap">
    <canvas bind:this={canvas}></canvas>
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
    --viz-catastrophe: var(--theme-red, #ef4444);

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
</style>
