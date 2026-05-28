<script>
  let tileM = $state(64)
  let tileN = $state(128)
  let tileK = $state(128)
  let bytesEach = $state(2)
  let peakTflops = $state(1000)
  let bandwidthTBs = $state(3.35)

  let flops = $derived(2 * tileM * tileN * tileK)
  let bytesMoved = $derived((tileM * tileK + tileK * tileN + tileM * tileN) * bytesEach)
  let intensity = $derived(flops / bytesMoved)
  let ridge = $derived(peakTflops / bandwidthTBs)
  let attainable = $derived(Math.min(peakTflops, bandwidthTBs * intensity))
  let bound = $derived(intensity >= ridge ? 'compute-bound tile' : 'memory-bound tile')
  let mathShare = $derived(Math.min(100, (attainable / peakTflops) * 100))
</script>

<figure class="trace-viz" aria-labelledby="roofline-title">
  <div class="header">
    <div>
      <h3 id="roofline-title">FLOPs Only Matter If Data Arrives Fast Enough</h3>
      <p>
        Change a matrix tile. The same operation can be limited by tensor-core math or by HBM bandwidth, depending on arithmetic intensity.
      </p>
    </div>
    <div class="status">
      <span>Current regime</span>
      <strong>{bound}</strong>
    </div>
  </div>

  <div class="controls">
    <label>
      Tile M
      <input aria-label="Tile M" type="range" min="16" max="256" step="16" bind:value={tileM} />
      <span>{tileM}</span>
    </label>
    <label>
      Tile N
      <input aria-label="Tile N" type="range" min="16" max="256" step="16" bind:value={tileN} />
      <span>{tileN}</span>
    </label>
    <label>
      Tile K
      <input aria-label="Tile K" type="range" min="16" max="512" step="16" bind:value={tileK} />
      <span>{tileK}</span>
    </label>
    <label>
      Bytes per value
      <input aria-label="Bytes per value" type="range" min="1" max="2" step="1" bind:value={bytesEach} />
      <span>{bytesEach}</span>
    </label>
  </div>

  <div class="equation" aria-label="Tile work and memory movement">
    <div>
      <span>Math work</span>
      <strong>2 x M x N x K</strong>
      <small>{(flops / 1e6).toFixed(2)} MFLOPs</small>
    </div>
    <div>
      <span>Minimum traffic</span>
      <strong>A tile + B tile + output</strong>
      <small>{(bytesMoved / 1024).toFixed(1)} KiB</small>
    </div>
    <div>
      <span>Arithmetic intensity</span>
      <strong>{intensity.toFixed(1)} FLOPs/byte</strong>
      <small>ridge point: {ridge.toFixed(1)}</small>
    </div>
  </div>

  <div class="roof" aria-label="Roofline utilization">
    <div class="fill" style="width: {mathShare}%"></div>
    <span>{attainable.toFixed(0)} TFLOP/s attainable under this toy roofline</span>
  </div>

  <div class="lesson">
    <strong>Trace rule:</strong> a faster advertised FLOP number helps only after the kernel keeps enough data on chip and feeds the tensor cores.
  </div>

  <noscript>
    <p>
      Static fallback: matrix multiplication cost is about 2*M*N*K FLOPs, but runtime also depends on bytes read and written. Low arithmetic intensity makes a kernel memory-bound.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-yellow, #f59e0b));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(190px, 0.34fr);
    gap: 1rem;
    align-items: start;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }

  p,
  .status span,
  .equation span,
  .equation small {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .equation div,
  .lesson {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .status strong,
  .equation strong,
  .equation small,
  label span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  label {
    display: grid;
    grid-template-columns: 130px 1fr 80px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .equation {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .equation span,
  .equation strong,
  .equation small {
    display: block;
  }

  .roof {
    position: relative;
    min-height: 42px;
    margin: 1rem 0;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    overflow: hidden;
  }

  .fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: linear-gradient(90deg, var(--theme-yellow, #f59e0b), var(--theme-green, #10b981));
  }

  .roof span {
    position: relative;
    z-index: 1;
    display: block;
    padding: 0.75rem;
    color: var(--theme-background, #111);
    font-weight: 800;
  }

  .lesson {
    color: var(--theme-foreground, #ddd);
  }

  @media (max-width: 760px) {
    .header,
    .equation,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
