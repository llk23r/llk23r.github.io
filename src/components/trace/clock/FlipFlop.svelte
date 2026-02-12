<script>
  import { onMount, onDestroy } from 'svelte'

  // State for the divide-by-2 chain demonstration
  let pulseCount = $state(0)
  let stages = $state([
    { label: '÷2', inputFreq: '8 Hz', outputFreq: '4 Hz', state: false, pulses: 0 },
    { label: '÷2', inputFreq: '4 Hz', outputFreq: '2 Hz', state: false, pulses: 0 },
    { label: '÷2', inputFreq: '2 Hz', outputFreq: '1 Hz', state: false, pulses: 0 },
  ])
  let outputPulses = $state(0)
  let autoRunning = $state(false)
  let autoTimer = $state(null)
  let flashInput = $state(false)
  let flashStages = $state([false, false, false])
  let flashOutput = $state(false)

  function sendPulse() {
    pulseCount++
    flashInput = true
    setTimeout(() => flashInput = false, 150)

    // Propagate through flip-flop chain
    let carry = true
    for (let i = 0; i < stages.length; i++) {
      if (!carry) break
      stages[i].pulses++
      stages[i].state = !stages[i].state
      // A flip-flop outputs a pulse (carry) on every falling edge (HIGH→LOW)
      if (!stages[i].state) {
        carry = true
        flashStages[i] = true
        setTimeout((idx) => { flashStages[idx] = false }, 150 * (i + 1), i)
      } else {
        carry = false
      }
    }
    if (carry) {
      outputPulses++
      flashOutput = true
      setTimeout(() => flashOutput = false, 200)
    }
    // Trigger reactivity
    stages = [...stages]
    flashStages = [...flashStages]
  }

  function reset() {
    pulseCount = 0
    outputPulses = 0
    stages = stages.map(s => ({ ...s, state: false, pulses: 0 }))
    stopAuto()
  }

  function toggleAuto() {
    if (autoRunning) {
      stopAuto()
    } else {
      autoRunning = true
      autoTimer = setInterval(sendPulse, 350)
    }
  }

  function stopAuto() {
    autoRunning = false
    if (autoTimer) {
      clearInterval(autoTimer)
      autoTimer = null
    }
  }

  onDestroy(() => {
    stopAuto()
  })
</script>

<figure class="trace-viz" role="img" aria-label="Interactive flip-flop chain: send pulses and watch divide-by-2 behavior through three stages, turning 8 Hz into 1 Hz">
  <div class="diagram-container">
    <svg viewBox="0 0 520 185" preserveAspectRatio="xMidYMid meet" class="flipflop-svg">
      <defs>
        <marker id="ff-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #555)" />
        </marker>
      </defs>

      <!-- Title -->
      <text x="260" y="16" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.5">DIVIDE-BY-2 CHAIN</text>

      <!-- Input pulse indicator -->
      <rect x="10" y="52" width="60" height="40" rx="4"
        fill={flashInput ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.06)'}
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5"
        style="transition: fill 0.15s" />
      <text x="40" y="68" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace">INPUT</text>
      <text x="40" y="82" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.7">{pulseCount}</text>

      <!-- Arrow: input → stage 0 -->
      <line x1="70" y1="72" x2="98" y2="72"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#ff-arrow)" />

      <!-- Flip-flop stages -->
      {#each stages as stage, i}
        {@const x = 100 + i * 120}

        <!-- Flip-flop box -->
        <rect x={x} y="38" width="80" height="68" rx="5"
          fill={flashStages[i] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.04)'}
          stroke="var(--theme-green, #10b981)" stroke-width="1.5"
          style="transition: fill 0.15s" />

        <!-- Label -->
        <text x={x + 40} y="54" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="9" font-weight="700"
          font-family="JetBrains Mono, monospace">flip-flop</text>

        <!-- Current state -->
        <rect x={x + 15} y="60" width="50" height="18" rx="3"
          fill={stage.state ? 'rgba(16, 185, 129, 0.25)' : 'rgba(139, 92, 246, 0.15)'}
          stroke={stage.state ? 'var(--theme-green, #10b981)' : 'var(--theme-accent, #8b5cf6)'}
          stroke-width="0.75"
          style="transition: fill 0.15s, stroke 0.15s" />
        <text x={x + 40} y="73" text-anchor="middle"
          fill={stage.state ? 'var(--theme-green, #10b981)' : 'var(--theme-accent, #8b5cf6)'}
          font-size="8" font-weight="600"
          font-family="JetBrains Mono, monospace"
          style="transition: fill 0.15s">{stage.state ? 'HIGH' : 'LOW'}</text>

        <!-- Pulse count -->
        <text x={x + 40} y="97" text-anchor="middle"
          fill="var(--theme-foreground, #888)" font-size="7"
          font-family="JetBrains Mono, monospace" opacity="0.5">pulses: {stage.pulses}</text>

        <!-- Arrow to next stage -->
        {#if i < stages.length - 1}
          <line x1={x + 80} y1="72" x2={x + 118} y2="72"
            stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#ff-arrow)" />
          <text x={x + 99} y="65" text-anchor="middle"
            fill="var(--theme-foreground, #888)" font-size="6"
            font-family="JetBrains Mono, monospace" opacity="0.4">÷2</text>
        {/if}
      {/each}

      <!-- Arrow: last stage → output -->
      <line x1="420" y1="72" x2="448" y2="72"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#ff-arrow)" />
      <text x="434" y="65" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.4">÷2</text>

      <!-- Output indicator -->
      <rect x="450" y="52" width="60" height="40" rx="4"
        fill={flashOutput ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.06)'}
        stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5"
        style="transition: fill 0.15s" />
      <text x="480" y="68" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace">OUTPUT</text>
      <text x="480" y="82" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.7">{outputPulses}</text>

      <!-- Explanation row -->
      <text x="45" y="122" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="7.5" font-weight="600"
        font-family="JetBrains Mono, monospace">8 pulses in</text>
      <text x="260" y="122" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">each stage halves the frequency</text>
      <text x="480" y="122" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="7.5" font-weight="600"
        font-family="JetBrains Mono, monospace">1 pulse out</text>

      <!-- Bottom: the real scale -->
      <line x1="30" y1="145" x2="490" y2="145"
        stroke="var(--theme-separator, #444)" stroke-width="0.5" opacity="0.3" />
      <text x="260" y="160" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7" font-style="italic"
        font-family="JetBrains Mono, monospace" opacity="0.45">in your watch: 15 of these in series</text>
      <text x="260" y="174" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.45">32,768 Hz → 16,384 → 8,192 → ... → 2 → 1 Hz</text>
    </svg>
  </div>

  <div class="controls">
    <button onclick={sendPulse} disabled={autoRunning}>
      Send pulse
    </button>
    <button onclick={toggleAuto}>
      {autoRunning ? 'Stop' : 'Auto (8 Hz)'}
    </button>
    <button onclick={reset}>
      Reset
    </button>
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
  .diagram-container {
    padding: 0.75rem 0.5rem;
    display: flex;
    justify-content: center;
  }
  .flipflop-svg {
    width: 100%;
    max-width: 500px;
    height: auto;
  }
  .controls {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem 0.75rem;
    border-top: 1px solid var(--theme-separator, #333);
  }
  .controls button {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--theme-separator, #444);
    color: var(--theme-foreground, #ccc);
    padding: 0.3rem 0.7rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .controls button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--theme-green, #10b981);
  }
  .controls button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
