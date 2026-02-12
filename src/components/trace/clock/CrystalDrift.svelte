<script>
  let driftPPM = $state(6) // ~15 sec/month for a good watch
  let speedMultiplier = $state(86400) // 1 second of real time = 1 day of sim time
  let running = $state(false)
  let elapsedSimSeconds = $state(0)
  let animFrame = $state(null)
  let lastTimestamp = $state(null)
  let lastCorrectionTime = $state(0)

  const speedOptions = [
    { value: 3600, label: '1 hour/sec' },
    { value: 86400, label: '1 day/sec' },
    { value: 86400 * 7, label: '1 week/sec' },
    { value: 86400 * 30, label: '1 month/sec' },
  ]

  let driftSeconds = $derived((elapsedSimSeconds - lastCorrectionTime) * driftPPM * 1e-6)
  let elapsedDays = $derived(elapsedSimSeconds / 86400)

  let referenceTime = $derived({
    h: Math.floor((elapsedSimSeconds / 3600) % 24),
    m: Math.floor((elapsedSimSeconds / 60) % 60),
    s: Math.floor(elapsedSimSeconds % 60),
  })

  let driftingSimSeconds = $derived(elapsedSimSeconds + driftSeconds)
  let driftingTime = $derived({
    h: Math.floor(((driftingSimSeconds < 0 ? 0 : driftingSimSeconds) / 3600) % 24),
    m: Math.floor(((driftingSimSeconds < 0 ? 0 : driftingSimSeconds) / 60) % 60),
    s: Math.floor((driftingSimSeconds < 0 ? 0 : driftingSimSeconds) % 60),
  })

  function pad(n) {
    return String(n).padStart(2, '0')
  }

  function formatDrift(d) {
    const abs = Math.abs(d)
    if (abs < 1) return abs.toFixed(3) + 's'
    if (abs < 60) return abs.toFixed(1) + 's'
    if (abs < 3600) return (abs / 60).toFixed(1) + ' min'
    return (abs / 3600).toFixed(1) + ' hrs'
  }

  function animate(timestamp) {
    if (lastTimestamp !== null && running) {
      const dt = (timestamp - lastTimestamp) / 1000 // real seconds elapsed
      elapsedSimSeconds += dt * speedMultiplier
    }
    lastTimestamp = timestamp
    animFrame = requestAnimationFrame(animate)
  }

  function reset() {
    elapsedSimSeconds = 0
    lastCorrectionTime = 0
    lastTimestamp = null
    running = false
  }

  function correct() {
    lastCorrectionTime = elapsedSimSeconds
  }

  import { onMount, onDestroy } from 'svelte'

  onMount(() => {
    animFrame = requestAnimationFrame(animate)
  })

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })
</script>

<figure class="trace-viz" role="img" aria-label="Crystal drift simulator: two clocks diverging over time">
  <div class="clocks">
    <div class="clock-column">
      <div class="clock-label">Reference (perfect)</div>
      <div class="clock-display reference">
        {pad(referenceTime.h)}:{pad(referenceTime.m)}:{pad(referenceTime.s)}
      </div>
    </div>
    <div class="drift-indicator">
      <div class="drift-value" class:significant={Math.abs(driftSeconds) > 1}>
        {driftSeconds >= 0 ? '+' : '-'}{formatDrift(driftSeconds)}
      </div>
      <div class="drift-label">drift</div>
    </div>
    <div class="clock-column">
      <div class="clock-label">Quartz watch ({driftPPM} ppm)</div>
      <div class="clock-display drifting">
        {pad(driftingTime.h)}:{pad(driftingTime.m)}:{pad(driftingTime.s)}
      </div>
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <span class="stat-label">Elapsed</span>
      <span class="stat-value">
        {#if elapsedDays < 1}
          {(elapsedDays * 24).toFixed(1)} hours
        {:else if elapsedDays < 30}
          {elapsedDays.toFixed(1)} days
        {:else if elapsedDays < 365}
          {(elapsedDays / 30).toFixed(1)} months
        {:else}
          {(elapsedDays / 365).toFixed(1)} years
        {/if}
      </span>
    </div>
    <div class="stat">
      <span class="stat-label">Accumulated error</span>
      <span class="stat-value error">{formatDrift(driftSeconds)}</span>
    </div>
  </div>

  <div class="controls">
    <button onclick={() => running = !running}>
      {running ? '⏸ Pause' : '▶ Play'}
    </button>
    <button onclick={reset}>↺ Reset</button>
    <button class="correct-btn" onclick={correct}>📡 Correct</button>
    <div class="control-group">
      <label>
        Speed
        <select bind:value={speedMultiplier} name="speed-multiplier">
          {#each speedOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </label>
    </div>
    <div class="control-group">
      <label>
        Drift
        <input type="range" bind:value={driftPPM} min={1} max={30} step={1} name="drift-ppm" />
        <span class="range-value">{driftPPM} ppm</span>
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

  .clocks {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }

  .clock-column {
    text-align: center;
  }

  .clock-label {
    font-size: 0.65rem;
    color: var(--theme-foreground, #888);
    opacity: 0.6;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .clock-display {
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--theme-separator, #333);
  }

  .clock-display.reference {
    color: var(--theme-green, #10b981);
  }

  .clock-display.drifting {
    color: var(--theme-yellow, #f59e0b);
  }

  .drift-indicator {
    text-align: center;
    min-width: 80px;
  }

  .drift-value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--theme-red, #ef4444);
    transition: color 0.3s;
  }

  .drift-value:not(.significant) {
    color: var(--theme-foreground, #888);
    opacity: 0.5;
  }

  .drift-label {
    font-size: 0.6rem;
    color: var(--theme-foreground, #888);
    opacity: 0.4;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid var(--theme-separator, #333);
    border-bottom: 1px solid var(--theme-separator, #333);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }

  .stat-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--theme-foreground, #888);
    opacity: 0.5;
  }

  .stat-value {
    font-size: 0.85rem;
    color: var(--theme-foreground, #ccc);
  }

  .stat-value.error {
    color: var(--theme-red, #ef4444);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
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

  .correct-btn {
    border-color: var(--theme-cyan, #06b6d4);
    color: var(--theme-cyan, #06b6d4);
  }

  .correct-btn:hover {
    background: rgba(6, 182, 212, 0.1);
  }

  .control-group {
    display: flex;
    align-items: center;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
  }

  select {
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    border: 1px solid var(--theme-separator, #444);
    background: transparent;
    color: var(--theme-foreground, #ccc);
    font-family: inherit;
    font-size: 0.7rem;
  }

  input[type='range'] {
    width: 80px;
    accent-color: var(--theme-accent, #8b5cf6);
  }

  .range-value {
    min-width: 3rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
  }

  @media (max-width: 600px) {
    .clocks {
      flex-direction: column;
      gap: 0.75rem;
    }
    .clock-display {
      font-size: 1.4rem;
    }
    .drift-indicator {
      order: 3;
    }
  }
</style>
