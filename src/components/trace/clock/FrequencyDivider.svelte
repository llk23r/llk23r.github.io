<script>
  let running = $state(true)
  let time = $state(0)
  let animFrame = $state(null)

  const stages = [
    { freq: 32768, label: '32,768 Hz' },
    { freq: 16384, label: '16,384 Hz' },
    { freq: 8192, label: '8,192 Hz' },
    { freq: 4096, label: '4,096 Hz' },
    { freq: 2048, label: '2,048 Hz' },
    { freq: 1024, label: '1,024 Hz' },
    { freq: 512, label: '512 Hz' },
    { freq: 256, label: '256 Hz' },
    { freq: 128, label: '128 Hz' },
    { freq: 64, label: '64 Hz' },
    { freq: 32, label: '32 Hz' },
    { freq: 16, label: '16 Hz' },
    { freq: 8, label: '8 Hz' },
    { freq: 4, label: '4 Hz' },
    { freq: 2, label: '2 Hz' },
    { freq: 1, label: '1 Hz' },
  ]

  // We show detail for the last 6 stages (visible waveforms)
  const visibleStart = 10
  const visibleStages = stages.slice(visibleStart)

  let canvas
  let ctx

  function drawWave(yOffset, height, freq, t, alpha) {
    if (!ctx) return
    const w = canvas.width / (window.devicePixelRatio || 1)
    const labelW = 80
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--wave-color').trim() || '#10b981'
    ctx.lineWidth = 2

    ctx.beginPath()
    const drawW = w - labelW
    for (let x = 0; x < drawW; x++) {
      // Normalize frequency so the slowest (1 Hz) shows ~1 cycle
      const normFreq = freq / stages[visibleStart].freq
      const cycles = normFreq * 3
      const phase = t * freq * 0.001
      const px = labelW + x
      const y = yOffset + height / 2 + Math.sin((x / drawW) * cycles * Math.PI * 2 + phase) * (height * 0.32)
      if (x === 0) ctx.moveTo(px, y)
      else ctx.lineTo(px, y)
    }
    ctx.stroke()
    ctx.restore()
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

    const rowHeight = h / visibleStages.length
    const labelW = 80

    visibleStages.forEach((stage, i) => {
      const yBase = i * rowHeight

      // Divider line across full width
      if (i > 0) {
        ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--border-color').trim() || '#333'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(0, yBase)
        ctx.lineTo(w, yBase)
        ctx.stroke()
      }

      // Frequency label (right-aligned in label column)
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--label-color').trim() || '#888'
      ctx.font = '12px "JetBrains Mono", monospace'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillText(stage.label, labelW - 12, yBase + rowHeight / 2)

      // ÷2 label between rows (centered in label column, on the divider line)
      if (i > 0) {
        ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--arrow-color').trim() || '#555'
        ctx.font = '9px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('÷2', labelW / 2, yBase)
      }

      // Waveform (clipped to area right of labels)
      ctx.save()
      ctx.beginPath()
      ctx.rect(labelW, yBase, w - labelW, rowHeight)
      ctx.clip()
      drawWave(yBase, rowHeight, stage.freq, time, i === visibleStages.length - 1 ? 1 : 0.65)
      ctx.restore()
    })

    // Subtle highlight on the 1 Hz output row
    const lastY = (visibleStages.length - 1) * rowHeight
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--highlight-color').trim() || 'rgba(16, 185, 129, 0.06)'
    ctx.fillRect(0, lastY, w, rowHeight)
  }

  function animate(timestamp) {
    if (running) {
      time = timestamp * 0.5
      draw()
    }
    animFrame = requestAnimationFrame(animate)
  }

  import { onMount, onDestroy } from 'svelte'

  onMount(() => {
    ctx = canvas.getContext('2d')
    animFrame = requestAnimationFrame(animate)

    const resizeObs = new ResizeObserver(() => draw())
    resizeObs.observe(canvas.parentElement)
    return () => resizeObs.disconnect()
  })

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })
</script>

<figure class="trace-viz" role="img" aria-label="Frequency divider chain: 15 flip-flops divide 32,768 Hz down to 1 Hz">
  <div class="top-stages">
    <div class="chain-summary">
      32,768 Hz → 16,384 → 8,192 → ... → 128 → 64 → <strong>32 Hz</strong>
    </div>
    <div class="chain-note">10 flip-flop stages, each ÷2</div>
  </div>
  <div class="canvas-wrap">
    <canvas bind:this={canvas}></canvas>
  </div>
  <div class="controls">
    <button onclick={() => running = !running} aria-label={running ? 'Pause' : 'Play'}>
      {running ? '⏸ Pause' : '▶ Play'}
    </button>
    <span class="output-label">Output: <strong>1 tick per second</strong></span>
  </div>
</figure>

<style>
  .trace-viz {
    --wave-color: var(--theme-green, #10b981);
    --border-color: var(--theme-separator, #333);
    --label-color: var(--theme-foreground, #888);
    --arrow-color: var(--theme-separator, #555);
    --highlight-color: rgba(16, 185, 129, 0.06);

    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .top-stages {
    padding: 0.6rem 0.75rem;
    border-bottom: 1px solid var(--theme-separator, #333);
    text-align: center;
  }

  .chain-summary {
    font-size: 0.7rem;
    color: var(--theme-foreground, #888);
    opacity: 0.7;
    line-height: 1.6;
  }

  .chain-summary strong {
    color: var(--theme-green, #10b981);
    opacity: 1;
  }

  .chain-note {
    font-size: 0.6rem;
    color: var(--theme-foreground, #888);
    opacity: 0.4;
    margin-top: 0.15rem;
  }

  .canvas-wrap {
    width: 100%;
    height: 360px;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.75rem;
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

  button:hover {
    background: var(--theme-separator, #333);
  }

  .output-label {
    color: var(--theme-foreground, #aaa);
  }

  .output-label strong {
    color: var(--theme-green, #10b981);
  }
</style>
