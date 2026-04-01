<script>
  import { onMount, onDestroy } from 'svelte'

  let minSize = $state(3)
  let maxSize = $state(8)
  let queryDuration = $state(1500)

  let connections = $state([])
  let requestQueue = $state([])
  let completedCount = $state(0)
  let nextConnId = $state(1)
  let nextReqId = $state(1)
  let animFrame = $state(null)
  let now = $state(Date.now())

  let idleCount = $derived(connections.filter(c => c.state === 'idle').length)
  let activeCount = $derived(connections.filter(c => c.state === 'active').length)

  let totalCount = $derived(connections.filter(c => c.state !== 'empty').length)

  // Layout constants
  const SVG_W = 580
  const SVG_H = 340
  const SLOT_W = 60
  const SLOT_H = 40
  const SLOT_GAP = 6
  const SLOT_Y = 50
  const POOL_LABEL_Y = 30

  let slotPositions = $derived(
    Array.from({ length: maxSize }, (_, i) => {
      const totalWidth = maxSize * SLOT_W + (maxSize - 1) * SLOT_GAP
      const startX = (SVG_W - totalWidth) / 2
      return { x: startX + i * (SLOT_W + SLOT_GAP), y: SLOT_Y }
    })
  )

  // Queue section
  const QUEUE_Y = 140
  const QUEUE_CIRCLE_R = 8
  const QUEUE_GAP = 22

  // Stats section
  const STATS_Y = 200

  function initPool() {
    connections = []
    for (let i = 0; i < maxSize; i++) {
      if (i < minSize) {
        connections.push({ id: nextConnId++, state: 'idle', endTime: null, queryDuration: null })
      } else {
        connections.push({ id: 0, state: 'empty', endTime: null, queryDuration: null })
      }
    }
  }

  function sendRequest() {
    now = Date.now()
    const currentNow = now

    // 1. Try to find an idle connection
    const idleIdx = connections.findIndex(c => c.state === 'idle')
    if (idleIdx !== -1) {
      connections[idleIdx].state = 'active'
      connections[idleIdx].endTime = currentNow + queryDuration
      connections[idleIdx].queryDuration = queryDuration
      return
    }

    // 2. Try to create a new connection (find an empty slot)
    const emptyIdx = connections.findIndex(c => c.state === 'empty')
    if (emptyIdx !== -1) {
      connections[emptyIdx].id = nextConnId++
      connections[emptyIdx].state = 'connecting'
      connections[emptyIdx].endTime = currentNow + 500
      connections[emptyIdx].queryDuration = null
      // The request is implicitly waiting for this connection
      requestQueue.push({ id: nextReqId++, startTime: currentNow, assignedSlot: emptyIdx })
      return
    }

    // 3. Pool exhausted - queue the request
    requestQueue.push({ id: nextReqId++, startTime: currentNow, assignedSlot: -1 })
  }

  function sendBurst() {
    for (let i = 0; i < 5; i++) {
      sendRequest()
    }
  }

  function resetSim() {
    if (animFrame) cancelAnimationFrame(animFrame)
    completedCount = 0
    nextConnId = 1
    nextReqId = 1
    requestQueue = []
    initPool()
    animFrame = requestAnimationFrame(tick)
  }

  function tryAssignRequest(connIdx) {
    // Find first unassigned request, or a request assigned to this slot
    let reqIdx = requestQueue.findIndex(r => r.assignedSlot === connIdx)
    if (reqIdx === -1) {
      reqIdx = requestQueue.findIndex(r => r.assignedSlot === -1)
    }
    if (reqIdx !== -1) {
      requestQueue.splice(reqIdx, 1)
      const currentNow = Date.now()
      connections[connIdx].state = 'active'
      connections[connIdx].endTime = currentNow + queryDuration
      connections[connIdx].queryDuration = queryDuration
      return true
    }
    return false
  }

  function tick(timestamp) {
    now = Date.now()
    const currentNow = now

    for (let i = 0; i < connections.length; i++) {
      const conn = connections[i]
      if (conn.state === 'active' && conn.endTime !== null && currentNow >= conn.endTime) {
        // Query finished
        connections[i].state = 'idle'
        connections[i].endTime = null
        connections[i].queryDuration = null
        completedCount++
        // Check if a request is waiting
        tryAssignRequest(i)
      } else if (conn.state === 'connecting' && conn.endTime !== null && currentNow >= conn.endTime) {
        // Connection established
        connections[i].endTime = null
        connections[i].state = 'idle'
        // Check if a request is waiting for this connection
        tryAssignRequest(i)
      }
    }

    // Also try to assign any unassigned queued requests to newly idle connections
    for (let i = 0; i < connections.length; i++) {
      if (connections[i].state === 'idle' && requestQueue.some(r => r.assignedSlot === -1)) {
        tryAssignRequest(i)
      }
    }

    animFrame = requestAnimationFrame(tick)
  }

  function ensureMinConnections() {
    let currentReal = connections.filter(c => c.state !== 'empty').length
    for (let i = 0; i < connections.length && currentReal < minSize; i++) {
      if (connections[i].state === 'empty') {
        connections[i] = { id: nextConnId++, state: 'idle', endTime: null, queryDuration: null }
        currentReal++
      }
    }
  }

  // When minSize changes, ensure enough idle connections
  $effect(() => {
    minSize // track
    ensureMinConnections()
  })

  // When maxSize changes, rebuild the slots array
  $effect(() => {
    const newMax = maxSize
    if (connections.length < newMax) {
      // Add empty slots
      while (connections.length < newMax) {
        connections.push({ id: 0, state: 'empty', endTime: null, queryDuration: null })
      }
    } else if (connections.length > newMax) {
      // Remove from the end, only empty slots
      while (connections.length > newMax) {
        const last = connections[connections.length - 1]
        if (last.state === 'empty') {
          connections.pop()
        } else {
          break
        }
      }
    }
    ensureMinConnections()
  })

  // Clamp minSize when maxSize changes
  $effect(() => {
    if (minSize > maxSize) {
      minSize = maxSize
    }
  })

  function getSlotFill(state) {
    switch (state) {
      case 'idle': return 'rgba(16, 185, 129, 0.15)'
      case 'active': return 'rgba(139, 92, 246, 0.2)'
      case 'connecting': return 'rgba(245, 158, 11, 0.15)'
      default: return 'transparent'
    }
  }

  function getSlotStroke(state) {
    switch (state) {
      case 'idle': return 'var(--theme-green, #10b981)'
      case 'active': return 'var(--theme-accent, #8b5cf6)'
      case 'connecting': return 'var(--theme-yellow, #f59e0b)'
      default: return 'var(--theme-separator, #444)'
    }
  }

  function getSlotTextColor(state) {
    switch (state) {
      case 'idle': return 'var(--theme-green, #10b981)'
      case 'active': return 'var(--theme-accent, #8b5cf6)'
      case 'connecting': return 'var(--theme-yellow, #f59e0b)'
      default: return 'var(--theme-separator, #555)'
    }
  }

  function getProgressRatio(conn) {
    if (conn.state !== 'active' || !conn.endTime || !conn.queryDuration) return 0
    const remaining = Math.max(0, conn.endTime - now)
    return remaining / conn.queryDuration
  }

  function getConnectingProgress(conn) {
    if (conn.state !== 'connecting' || !conn.endTime) return 0
    const remaining = Math.max(0, conn.endTime - now)
    return 1 - remaining / 500
  }

  onMount(() => {
    initPool()
    animFrame = requestAnimationFrame(tick)
  })

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })
</script>

<figure class="trace-viz" role="img" aria-label="Connection pool simulator showing connections being acquired and released">
  <svg viewBox="0 0 {SVG_W} {SVG_H}" width="100%" preserveAspectRatio="xMidYMid meet">
    <!-- POOL label -->
    <text
      x={SVG_W / 2}
      y={POOL_LABEL_Y}
      text-anchor="middle"
      font-size="11"
      font-weight="700"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)"
      letter-spacing="0.12em"
      opacity="0.6"
    >POOL</text>

    <!-- Connection slots -->
    {#each connections as conn, i}
      {#if i < slotPositions.length}
        {@const pos = slotPositions[i]}
        <g>
          <!-- Slot background -->
          <rect
            x={pos.x}
            y={pos.y}
            width={SLOT_W}
            height={SLOT_H}
            rx="6"
            fill={getSlotFill(conn.state)}
            stroke={getSlotStroke(conn.state)}
            stroke-width={conn.state === 'empty' ? 1 : 1.5}
            stroke-dasharray={conn.state === 'empty' ? '4,3' : 'none'}
          />

          <!-- Connecting pulse overlay -->
          {#if conn.state === 'connecting'}
            <rect
              x={pos.x}
              y={pos.y}
              width={SLOT_W}
              height={SLOT_H}
              rx="6"
              fill="rgba(245, 158, 11, 0.08)"
              stroke="none"
            >
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.8s" repeatCount="indefinite" />
            </rect>
            <!-- Connecting progress bar at bottom of slot -->
            {@const progress = getConnectingProgress(conn)}
            <rect
              x={pos.x + 4}
              y={pos.y + SLOT_H - 6}
              width={Math.max(0, (SLOT_W - 8) * progress)}
              height={3}
              rx="1.5"
              fill="var(--theme-yellow, #f59e0b)"
              opacity="0.6"
            />
          {/if}

          <!-- Active progress bar (countdown, shrinks) -->
          {#if conn.state === 'active'}
            {@const ratio = getProgressRatio(conn)}
            <rect
              x={pos.x + 4}
              y={pos.y + SLOT_H - 6}
              width={Math.max(0, (SLOT_W - 8) * ratio)}
              height={3}
              rx="1.5"
              fill="var(--theme-accent, #8b5cf6)"
              opacity="0.7"
            />
          {/if}

          <!-- Connection ID -->
          {#if conn.state !== 'empty'}
            <text
              x={pos.x + SLOT_W / 2}
              y={pos.y + 17}
              text-anchor="middle"
              font-size="11"
              font-weight="600"
              font-family="JetBrains Mono, monospace"
              fill={getSlotTextColor(conn.state)}
            >C{conn.id}</text>
          {:else}
            <text
              x={pos.x + SLOT_W / 2}
              y={pos.y + 17}
              text-anchor="middle"
              font-size="10"
              font-family="JetBrains Mono, monospace"
              fill="var(--theme-separator, #555)"
              opacity="0.5"
            >--</text>
          {/if}

          <!-- State label -->
          <text
            x={pos.x + SLOT_W / 2}
            y={pos.y + 31}
            text-anchor="middle"
            font-size="7"
            font-family="JetBrains Mono, monospace"
            fill={getSlotTextColor(conn.state)}
            opacity={conn.state === 'empty' ? 0.3 : 0.7}
          >{conn.state}</text>
        </g>
      {/if}
    {/each}

    <!-- REQUEST QUEUE section -->
    <text
      x={30}
      y={QUEUE_Y}
      font-size="9"
      font-weight="600"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)"
      opacity="0.5"
      letter-spacing="0.08em"
    >QUEUE</text>

    {#if requestQueue.length > 0}
      {#each requestQueue as req, i}
        {#if i < 20}
          <circle
            cx={90 + i * QUEUE_GAP}
            cy={QUEUE_Y - 4}
            r={QUEUE_CIRCLE_R}
            fill="rgba(239, 68, 68, 0.15)"
            stroke="var(--theme-red, #ef4444)"
            stroke-width="1"
          >
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <text
            x={90 + i * QUEUE_GAP}
            y={QUEUE_Y - 1}
            text-anchor="middle"
            font-size="6"
            font-family="JetBrains Mono, monospace"
            fill="var(--theme-red, #ef4444)"
            opacity="0.8"
          >R{req.id}</text>
        {/if}
      {/each}
      <text
        x={90 + Math.min(requestQueue.length, 20) * QUEUE_GAP + 10}
        y={QUEUE_Y - 1}
        font-size="8"
        font-family="JetBrains Mono, monospace"
        fill="var(--theme-red, #ef4444)"
        opacity="0.6"
      >Waiting: {requestQueue.length}</text>
    {:else}
      <text
        x={90}
        y={QUEUE_Y - 1}
        font-size="8"
        font-family="JetBrains Mono, monospace"
        fill="var(--theme-foreground, #888)"
        opacity="0.3"
      >empty</text>
    {/if}

    <!-- Separator line -->
    <line
      x1="20" y1={QUEUE_Y + 20}
      x2={SVG_W - 20} y2={QUEUE_Y + 20}
      stroke="var(--theme-separator, #333)"
      stroke-width="0.5"
      opacity="0.4"
    />

    <!-- Stats line -->
    <text
      x={SVG_W / 2}
      y={STATS_Y}
      text-anchor="middle"
      font-size="10"
      font-family="JetBrains Mono, monospace"
      fill="var(--theme-foreground, #888)"
    >
      <tspan fill="var(--theme-foreground, #aaa)">total:</tspan>
      <tspan fill="var(--theme-foreground, #ccc)" font-weight="600">{totalCount}</tspan>
      <tspan fill="var(--theme-separator, #555)"> | </tspan>
      <tspan fill="var(--theme-green, #10b981)">idle:</tspan>
      <tspan fill="var(--theme-green, #10b981)" font-weight="600">{idleCount}</tspan>
      <tspan fill="var(--theme-separator, #555)"> | </tspan>
      <tspan fill="var(--theme-accent, #8b5cf6)">active:</tspan>
      <tspan fill="var(--theme-accent, #8b5cf6)" font-weight="600">{activeCount}</tspan>
      <tspan fill="var(--theme-separator, #555)"> | </tspan>
      <tspan fill="var(--theme-red, #ef4444)">waiting:</tspan>
      <tspan fill="var(--theme-red, #ef4444)" font-weight="600">{requestQueue.length}</tspan>
      <tspan fill="var(--theme-separator, #555)"> | </tspan>
      <tspan fill="var(--theme-foreground, #aaa)">done:</tspan>
      <tspan fill="var(--theme-foreground, #ccc)" font-weight="600">{completedCount}</tspan>
    </text>

    <!-- Visual legend -->
    <g transform="translate(30, {STATS_Y + 20})">
      <rect x="0" y="0" width="10" height="10" rx="2" fill="rgba(16, 185, 129, 0.15)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="14" y="9" font-size="7" font-family="JetBrains Mono, monospace" fill="var(--theme-foreground, #888)" opacity="0.6">idle</text>

      <rect x="50" y="0" width="10" height="10" rx="2" fill="rgba(139, 92, 246, 0.2)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" />
      <text x="64" y="9" font-size="7" font-family="JetBrains Mono, monospace" fill="var(--theme-foreground, #888)" opacity="0.6">active</text>

      <rect x="110" y="0" width="10" height="10" rx="2" fill="rgba(245, 158, 11, 0.15)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
      <text x="124" y="9" font-size="7" font-family="JetBrains Mono, monospace" fill="var(--theme-foreground, #888)" opacity="0.6">connecting</text>

      <rect x="190" y="0" width="10" height="10" rx="2" fill="transparent" stroke="var(--theme-separator, #444)" stroke-width="1" stroke-dasharray="3,2" />
      <text x="204" y="9" font-size="7" font-family="JetBrains Mono, monospace" fill="var(--theme-foreground, #888)" opacity="0.6">empty</text>
    </g>
  </svg>

  <div class="controls">
    <button onclick={sendRequest}>Send Request</button>
    <button class="burst-btn" onclick={sendBurst}>Send Burst (5x)</button>
    <button onclick={resetSim}>Reset</button>

    <div class="control-group">
      <label>
        Query
        <input type="range" bind:value={queryDuration} min={500} max={3000} step={100} name="query-duration" />
        <span class="range-value">{queryDuration}ms</span>
      </label>
    </div>

    <div class="control-group">
      <label>
        min
        <input type="range" bind:value={minSize} min={1} max={5} step={1} name="min-pool-size" />
        <span class="range-value">{minSize}</span>
      </label>
    </div>

    <div class="control-group">
      <label>
        max
        <input type="range" bind:value={maxSize} min={3} max={12} step={1} name="max-pool-size" />
        <span class="range-value">{maxSize}</span>
      </label>
    </div>
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
    max-width: 100%;
    height: auto;
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

  .burst-btn {
    border-color: var(--theme-red, #ef4444);
    color: var(--theme-red, #ef4444);
  }

  .burst-btn:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .control-group {
    display: flex;
    align-items: center;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
  }

  input[type='range'] {
    width: 70px;
    accent-color: var(--theme-accent, #8b5cf6);
  }

  .range-value {
    min-width: 2rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
  }
</style>
