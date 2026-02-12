<script>
  let correctionOn = $state(true)
  let day = $state(0)
  let running = $state(false)
  let animFrame = $state(null)
  let lastTimestamp = $state(null)

  // 38 microseconds/day drift → 11.4 km/day position error
  const KM_PER_DAY = 11.4
  const MAX_DAYS = 7

  let errorKm = $derived(correctionOn ? 0 : day * KM_PER_DAY)

  // Position on a grid; drift in a roughly northeast direction
  let actualX = $derived(50) // percentage
  let actualY = $derived(50)
  let gpsX = $derived(actualX + (correctionOn ? 0 : day * 2.5))
  let gpsY = $derived(actualY - (correctionOn ? 0 : day * 1.8))

  function animate(timestamp) {
    if (lastTimestamp !== null && running) {
      const dt = (timestamp - lastTimestamp) / 1000
      day = Math.min(day + dt * 0.5, MAX_DAYS) // 1 day per 2 seconds
      if (day >= MAX_DAYS) running = false
    }
    lastTimestamp = timestamp
    animFrame = requestAnimationFrame(animate)
  }

  function reset() {
    day = 0
    running = false
    lastTimestamp = null
  }

  function toggleCorrection() {
    correctionOn = !correctionOn
    day = 0
    lastTimestamp = null
  }

  import { onMount, onDestroy } from 'svelte'

  onMount(() => {
    animFrame = requestAnimationFrame(animate)
  })

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
  })
</script>

<figure class="trace-viz" role="img" aria-label="GPS relativistic correction: position error without Einstein's correction">
  <div class="grid-container">
    <svg viewBox="0 0 300 300" class="position-grid">
      <!-- Grid lines -->
      {#each Array(7) as _, i}
        <line
          x1={i * 50} y1="0" x2={i * 50} y2="300"
          stroke="var(--grid-line, #222)" stroke-width="0.5"
        />
        <line
          x1="0" y1={i * 50} x2="300" y2={i * 50}
          stroke="var(--grid-line, #222)" stroke-width="0.5"
        />
      {/each}

      <!-- Scale reference -->
      <line x1="20" y1="280" x2="70" y2="280" stroke="var(--scale-color, #555)" stroke-width="1.5" />
      <text x="45" y="274" text-anchor="middle" fill="var(--scale-color, #555)" font-size="8" font-family="JetBrains Mono, monospace">10 km</text>

      <!-- Error line connecting actual to GPS position -->
      {#if errorKm > 0.1}
        <line
          x1={actualX * 3} y1={actualY * 3}
          x2={gpsX * 3} y2={gpsY * 3}
          stroke="var(--error-line, #ef4444)" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"
        />
      {/if}

      <!-- Actual position -->
      <circle
        cx={actualX * 3} cy={actualY * 3} r="6"
        fill="var(--actual-color, #10b981)" opacity="0.9"
      />
      <circle
        cx={actualX * 3} cy={actualY * 3} r="10"
        fill="none" stroke="var(--actual-color, #10b981)" stroke-width="1" opacity="0.3"
      />
      <text x={actualX * 3 + 14} y={actualY * 3 + 4} fill="var(--actual-color, #10b981)" font-size="9" font-family="JetBrains Mono, monospace">You</text>

      <!-- GPS calculated position -->
      <circle
        cx={gpsX * 3} cy={gpsY * 3} r="5"
        fill="var(--gps-color, #f59e0b)" opacity="0.9"
      />
      {#if errorKm > 0.5}
        <text x={gpsX * 3 + 12} y={gpsY * 3 + 4} fill="var(--gps-color, #f59e0b)" font-size="9" font-family="JetBrains Mono, monospace">GPS says</text>
      {/if}

      <!-- Error radius circle -->
      {#if errorKm > 0.5}
        <circle
          cx={actualX * 3} cy={actualY * 3} r={errorKm * 5}
          fill="none" stroke="var(--error-line, #ef4444)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4"
        />
      {/if}
    </svg>
  </div>

  {#if !correctionOn && day > 0.1}
    <div class="conversion-note">
      <span class="conversion-formula">{(day * 38).toFixed(0)} μs clock error × speed of light</span>
      <span class="conversion-arrow">→</span>
      <span class="conversion-result">{errorKm.toFixed(1)} km position error</span>
    </div>
  {/if}

  <div class="stats">
    <div class="stat">
      <span class="stat-label">Day</span>
      <span class="stat-value">{day.toFixed(1)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Clock error</span>
      <span class="stat-value">{(day * 38).toFixed(0)} μs</span>
    </div>
    <div class="stat">
      <span class="stat-label">Position error</span>
      <span class="stat-value" class:error={errorKm > 1}>
        {errorKm < 0.1 ? '< 3 m' : errorKm.toFixed(1) + ' km'}
      </span>
    </div>
    <div class="stat">
      <span class="stat-label">Correction</span>
      <span class="stat-value" class:on={correctionOn} class:off={!correctionOn}>
        {correctionOn ? 'ON' : 'OFF'}
      </span>
    </div>
  </div>

  <div class="controls">
    <button onclick={() => running = !running}>
      {running ? '⏸ Pause' : '▶ Play'}
    </button>
    <button onclick={reset}>↺ Reset</button>
    <button class="toggle-btn" class:active={!correctionOn} onclick={toggleCorrection}>
      {correctionOn ? 'Turn Correction OFF' : 'Turn Correction ON'}
    </button>
    <div class="control-group">
      <label>
        Day
        <input type="range" bind:value={day} min={0} max={MAX_DAYS} step={0.1} name="day" />
      </label>
    </div>
  </div>

  {#if day >= 5 && !correctionOn}
    <div class="callout">
      By day {Math.floor(day)}, your phone thinks you're {errorKm.toFixed(0)} km away from where you actually are.
      {#if errorKm > 50}
        That's a different city.
      {/if}
    </div>
  {/if}
</figure>

<style>
  .trace-viz {
    --grid-line: var(--theme-separator, #222);
    --scale-color: var(--theme-foreground, #555);
    --actual-color: var(--theme-green, #10b981);
    --gps-color: var(--theme-yellow, #f59e0b);
    --error-line: var(--theme-red, #ef4444);

    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .grid-container {
    padding: 1rem;
    display: flex;
    justify-content: center;
  }

  .position-grid {
    width: 100%;
    max-width: 300px;
    height: auto;
    aspect-ratio: 1;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid var(--theme-separator, #333);
    border-bottom: 1px solid var(--theme-separator, #333);
    flex-wrap: wrap;
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
    font-weight: 600;
  }

  .stat-value.on {
    color: var(--theme-green, #10b981);
  }

  .stat-value.off {
    color: var(--theme-red, #ef4444);
  }

  .conversion-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.7rem;
    color: var(--theme-foreground, #888);
    border-top: 1px solid var(--theme-separator, #333);
    flex-wrap: wrap;
  }

  .conversion-formula {
    opacity: 0.7;
  }

  .conversion-arrow {
    color: var(--theme-yellow, #f59e0b);
    font-weight: 600;
  }

  .conversion-result {
    color: var(--theme-red, #ef4444);
    font-weight: 600;
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
    transition: all 0.2s;
  }

  button:hover {
    background: var(--theme-separator, #333);
  }

  .toggle-btn.active {
    border-color: var(--theme-red, #ef4444);
    color: var(--theme-red, #ef4444);
    background: rgba(239, 68, 68, 0.08);
  }

  .control-group label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--theme-foreground, #888);
    font-size: 0.7rem;
  }

  input[type='range'] {
    width: 80px;
    accent-color: var(--theme-accent, #8b5cf6);
  }

  .callout {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    color: var(--theme-red, #ef4444);
    background: rgba(239, 68, 68, 0.06);
    border-top: 1px solid rgba(239, 68, 68, 0.15);
    text-align: center;
  }

  @media (max-width: 500px) {
    .stats {
      gap: 1rem;
    }
  }
</style>
