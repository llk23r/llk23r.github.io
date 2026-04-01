<script>
  import { onMount, onDestroy } from 'svelte'

  const TOTAL_EPHEMERAL_PORTS = 28232
  const TIME_WAIT_DURATION = 60 // simulated seconds
  const SIM_SPEED = 10 // 1 real second = 10 simulated seconds

  let reqRate = $state(100)
  let running = $state(false)
  let simTime = $state(0) // simulated seconds elapsed
  let animFrame = $state(null)
  let lastTimestamp = $state(null)

  // Without pooling state
  let timeWaitCount = $state(0)
  let totalConnectionsNoPool = $state(0)

  // With pooling state
  let poolReuseCount = $state(0)
  let poolTimeWaitCount = $state(0)

  // Animated dots for visual life
  let noPoolDots = $state([])
  let poolDots = $state([])
  let dotIdCounter = $state(0)

  // Derived values
  let steadyState = $derived(reqRate * TIME_WAIT_DURATION)
  let portUsage = $derived(Math.min(timeWaitCount, TOTAL_EPHEMERAL_PORTS))
  let portPercent = $derived((portUsage / TOTAL_EPHEMERAL_PORTS) * 100)
  let portExhaustion = $derived(timeWaitCount > 25000)
  let portBarColor = $derived(
    portPercent < 50 ? 'var(--theme-green, #10b981)' :
    portPercent < 80 ? 'var(--theme-yellow, #f59e0b)' :
    'var(--theme-red, #ef4444)'
  )

  function formatCount(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return String(n)
  }

  function animate(timestamp) {
    if (lastTimestamp !== null && running) {
      const realDt = (timestamp - lastTimestamp) / 1000
      const simDt = realDt * SIM_SPEED
      simTime += simDt

      // Without pooling: create new connections, accumulate TIME_WAIT
      const newConns = Math.round(reqRate * simDt)
      totalConnectionsNoPool += newConns

      // TIME_WAIT count: grows until steady state = reqRate * 60
      // Each second, reqRate new sockets enter TIME_WAIT
      // Each second, sockets from 60 seconds ago expire
      if (simTime < TIME_WAIT_DURATION) {
        // Before steady state: only accumulating
        timeWaitCount = Math.min(Math.round(reqRate * simTime), TOTAL_EPHEMERAL_PORTS)
      } else {
        // At steady state: inflow = outflow
        timeWaitCount = Math.min(steadyState, TOTAL_EPHEMERAL_PORTS)
      }

      // With pooling: reuse connections, no TIME_WAIT accumulation
      poolReuseCount += newConns
      poolTimeWaitCount = 0

      // Create visual dots (limit to avoid performance issues)
      if (noPoolDots.length < 12 && Math.random() < realDt * 4) {
        const id = dotIdCounter++
        noPoolDots = [...noPoolDots, {
          id,
          x: 30 + Math.random() * 220,
          y: 60 + Math.random() * 120,
          opacity: 1,
          born: timestamp,
        }]
      }
      if (poolDots.length < 8 && Math.random() < realDt * 3) {
        const id = dotIdCounter++
        poolDots = [...poolDots, {
          id,
          x: 30 + Math.random() * 220,
          y: 60 + Math.random() * 120,
          opacity: 1,
          born: timestamp,
        }]
      }

      // Fade and remove old dots
      noPoolDots = noPoolDots
        .map(d => ({ ...d, opacity: Math.max(0, 1 - (timestamp - d.born) / 1500) }))
        .filter(d => d.opacity > 0)
      poolDots = poolDots
        .map(d => ({ ...d, opacity: Math.max(0, 1 - (timestamp - d.born) / 800) }))
        .filter(d => d.opacity > 0)
    }
    lastTimestamp = timestamp
    animFrame = requestAnimationFrame(animate)
  }

  function toggleRunning() {
    running = !running
    if (running) {
      lastTimestamp = null
    }
  }

  function reset() {
    running = false
    simTime = 0
    timeWaitCount = 0
    totalConnectionsNoPool = 0
    poolReuseCount = 0
    poolTimeWaitCount = 0
    noPoolDots = []
    poolDots = []
    lastTimestamp = null
  }

  onMount(() => {
    animFrame = requestAnimationFrame(animate)
  })

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })

  // SVG layout constants
  const W = 580
  const H = 280
  const PANEL_W = 270
  const LEFT_X = 10
  const RIGHT_X = 300
  const TITLE_Y = 22
  const COUNT_Y = 70
  const BAR_Y = 200
  const BAR_H = 14
  const BAR_W = 220
  const BAR_X_OFFSET = 30
  const STATUS_Y = 240
  const DIVIDER_X = 289

  // Port bar fill width
  let portBarFillW = $derived((portPercent / 100) * BAR_W)
</script>

<figure class="trace-viz" role="img" aria-label="TIME_WAIT socket accumulation with and without connection pooling">
  <svg viewBox="0 0 {W} {H}" width="100%">
    <!-- Divider between panels -->
    <line
      x1={DIVIDER_X} y1="6" x2={DIVIDER_X} y2={H - 6}
      stroke="var(--theme-separator, #333)" stroke-width="1"
    />

    <!-- ===== LEFT PANEL: Without Pooling ===== -->
    <text
      x={LEFT_X + PANEL_W / 2} y={TITLE_Y}
      text-anchor="middle" font-size="11" font-weight="700"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #ccc)" letter-spacing="0.03em"
    >
      Without Pooling
    </text>

    <!-- TIME_WAIT count label -->
    <text
      x={LEFT_X + PANEL_W / 2} y={COUNT_Y - 16}
      text-anchor="middle" font-size="8"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)" opacity="0.6"
      text-transform="uppercase" letter-spacing="0.08em"
    >
      TIME_WAIT SOCKETS
    </text>

    <!-- TIME_WAIT count (large number) -->
    <text
      x={LEFT_X + PANEL_W / 2} y={COUNT_Y + 16}
      text-anchor="middle" font-size="36" font-weight="700"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-red, #ef4444)"
    >
      {formatCount(timeWaitCount)}
    </text>

    <!-- Steady state label -->
    <text
      x={LEFT_X + PANEL_W / 2} y={COUNT_Y + 34}
      text-anchor="middle" font-size="8"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)" opacity="0.5"
    >
      steady state: {formatCount(steadyState)}
    </text>

    <!-- Visual bar showing TIME_WAIT as proportion of steady state -->
    {#if steadyState > 0}
      {@const fillRatio = Math.min(timeWaitCount / steadyState, 1)}
      <rect
        x={LEFT_X + BAR_X_OFFSET} y={COUNT_Y + 44}
        width={BAR_W} height={6}
        rx="3" fill="rgba(255,255,255,0.05)"
      />
      <rect
        x={LEFT_X + BAR_X_OFFSET} y={COUNT_Y + 44}
        width={Math.max(fillRatio * BAR_W, 0)} height={6}
        rx="3" fill="var(--theme-red, #ef4444)" opacity="0.7"
      />
    {/if}

    <!-- Animated dots (connections appearing / TIME_WAIT expiring) -->
    {#each noPoolDots as dot (dot.id)}
      <circle
        cx={LEFT_X + dot.x}
        cy={dot.y + 40}
        r="2"
        fill="var(--theme-red, #ef4444)"
        opacity={dot.opacity * 0.6}
      />
    {/each}

    <!-- Ephemeral port usage bar -->
    <text
      x={LEFT_X + BAR_X_OFFSET} y={BAR_Y - 6}
      font-size="8" font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)" opacity="0.6"
    >
      Ephemeral ports: {formatCount(portUsage)} / {formatCount(TOTAL_EPHEMERAL_PORTS)}
    </text>
    <rect
      x={LEFT_X + BAR_X_OFFSET} y={BAR_Y}
      width={BAR_W} height={BAR_H}
      rx="4" fill="rgba(255,255,255,0.05)"
    />
    <rect
      x={LEFT_X + BAR_X_OFFSET} y={BAR_Y}
      width={Math.max(portBarFillW, 0)} height={BAR_H}
      rx="4" fill={portBarColor} opacity="0.8"
    />
    <!-- Port percentage label inside bar -->
    {#if portPercent > 8}
      <text
        x={LEFT_X + BAR_X_OFFSET + portBarFillW - 4} y={BAR_Y + 10}
        text-anchor="end" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace"
        fill="#fff" opacity="0.9"
      >
        {portPercent.toFixed(0)}%
      </text>
    {/if}

    <!-- Warning text for port exhaustion -->
    {#if portExhaustion}
      <text
        x={LEFT_X + PANEL_W / 2} y={STATUS_Y}
        text-anchor="middle" font-size="9" font-weight="700"
        font-family="JetBrains Mono, monospace"
        fill="var(--theme-red, #ef4444)"
      >
        PORT EXHAUSTION
      </text>
    {:else if timeWaitCount > 0}
      <text
        x={LEFT_X + PANEL_W / 2} y={STATUS_Y}
        text-anchor="middle" font-size="9"
        font-family="JetBrains Mono, monospace"
        fill="var(--theme-foreground, #888)" opacity="0.5"
      >
        {totalConnectionsNoPool} connections created
      </text>
    {/if}

    <!-- Small warning indicator -->
    {#if portExhaustion}
      <circle cx={LEFT_X + PANEL_W / 2 - 68} cy={STATUS_Y - 4} r="3"
        fill="var(--theme-red, #ef4444)" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1s" repeatCount="indefinite" />
      </circle>
    {/if}

    <!-- ===== RIGHT PANEL: With Pooling ===== -->
    <text
      x={RIGHT_X + PANEL_W / 2} y={TITLE_Y}
      text-anchor="middle" font-size="11" font-weight="700"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #ccc)" letter-spacing="0.03em"
    >
      With Pooling
    </text>

    <!-- TIME_WAIT count label -->
    <text
      x={RIGHT_X + PANEL_W / 2} y={COUNT_Y - 16}
      text-anchor="middle" font-size="8"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)" opacity="0.6"
      text-transform="uppercase" letter-spacing="0.08em"
    >
      TIME_WAIT SOCKETS
    </text>

    <!-- TIME_WAIT count (large number, stays at 0) -->
    <text
      x={RIGHT_X + PANEL_W / 2} y={COUNT_Y + 16}
      text-anchor="middle" font-size="36" font-weight="700"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-green, #10b981)"
    >
      {poolTimeWaitCount}
    </text>

    <!-- Connections reused counter -->
    <text
      x={RIGHT_X + PANEL_W / 2} y={COUNT_Y + 34}
      text-anchor="middle" font-size="8"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)" opacity="0.5"
    >
      connections reused: {formatCount(poolReuseCount)}
    </text>

    <!-- Health indicator bar (always green and low) -->
    <rect
      x={RIGHT_X + BAR_X_OFFSET} y={COUNT_Y + 44}
      width={BAR_W} height={6}
      rx="3" fill="rgba(255,255,255,0.05)"
    />
    <rect
      x={RIGHT_X + BAR_X_OFFSET} y={COUNT_Y + 44}
      width={poolReuseCount > 0 ? 4 : 0} height={6}
      rx="3" fill="var(--theme-green, #10b981)" opacity="0.7"
    />

    <!-- Animated dots (connections being reused, green, quicker fade) -->
    {#each poolDots as dot (dot.id)}
      <circle
        cx={RIGHT_X + dot.x}
        cy={dot.y + 40}
        r="2"
        fill="var(--theme-green, #10b981)"
        opacity={dot.opacity * 0.5}
      />
    {/each}

    <!-- Ephemeral port bar for pooling side -->
    <text
      x={RIGHT_X + BAR_X_OFFSET} y={BAR_Y - 6}
      font-size="8" font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)" opacity="0.6"
    >
      Ephemeral ports: 0 / {formatCount(TOTAL_EPHEMERAL_PORTS)}
    </text>
    <rect
      x={RIGHT_X + BAR_X_OFFSET} y={BAR_Y}
      width={BAR_W} height={BAR_H}
      rx="4" fill="rgba(255,255,255,0.05)"
    />

    <!-- Green health indicator -->
    <text
      x={RIGHT_X + PANEL_W / 2} y={STATUS_Y}
      text-anchor="middle" font-size="9"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-green, #10b981)"
      opacity={poolReuseCount > 0 ? 1 : 0.4}
    >
      {poolReuseCount > 0 ? 'HEALTHY' : 'IDLE'}
    </text>
    <!-- Green dot indicator -->
    {#if poolReuseCount > 0}
      <circle cx={RIGHT_X + PANEL_W / 2 - 36} cy={STATUS_Y - 4} r="3"
        fill="var(--theme-green, #10b981)" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
    {/if}

    <!-- Simulated time display centered at bottom -->
    <text
      x={W / 2} y={H - 8}
      text-anchor="middle" font-size="9"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)" opacity="0.5"
    >
      simulated time: {Math.floor(simTime)}s
    </text>
  </svg>

  <div class="controls">
    <button onclick={toggleRunning}>
      {running ? 'Pause' : 'Start'}
    </button>
    <button onclick={reset}>Reset</button>
    <label class="slider-group">
      <span class="control-label">Request Rate</span>
      <input type="range" bind:value={reqRate} min={10} max={500} step={10} name="request-rate" />
      <span class="range-value">{reqRate}/s</span>
    </label>
    <span class="sim-time">Simulated: {Math.floor(simTime)}s</span>
  </div>
</figure>

<style>
  .trace-viz {
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
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
    font-size: 0.75rem;
    flex-wrap: wrap;
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

  .slider-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
  }

  .control-label {
    white-space: nowrap;
  }

  input[type='range'] {
    width: 100px;
    accent-color: var(--theme-accent, #8b5cf6);
  }

  .range-value {
    min-width: 2.5rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
  }

  .sim-time {
    margin-left: auto;
    font-size: 0.7rem;
    color: var(--theme-foreground, #888);
    opacity: 0.6;
  }

  @media (max-width: 600px) {
    .controls {
      gap: 0.5rem;
    }
    .sim-time {
      margin-left: 0;
      width: 100%;
    }
  }
</style>
