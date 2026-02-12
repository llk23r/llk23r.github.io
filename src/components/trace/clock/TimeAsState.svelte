<script>
  import { onDestroy } from 'svelte'

  let hours = $state(23)
  let minutes = $state(59)
  let seconds = $state(55)
  let running = $state(false)
  let speed = $state(1)
  let flashSet = $state(new Set())
  let bitsChanged = $state(0)
  let flashTimer = null
  let interval = null

  function toBCDBits(n) {
    const tens = Math.floor(n / 10)
    const ones = n % 10
    return [
      (tens >> 3) & 1, (tens >> 2) & 1, (tens >> 1) & 1, tens & 1,
      (ones >> 3) & 1, (ones >> 2) & 1, (ones >> 1) & 1, ones & 1,
    ]
  }

  function toHex(n) {
    const tens = Math.floor(n / 10)
    const ones = n % 10
    return '0x' + ((tens << 4) | ones).toString(16).toUpperCase().padStart(2, '0')
  }

  let hBits = $derived(toBCDBits(hours))
  let mBits = $derived(toBCDBits(minutes))
  let sBits = $derived(toBCDBits(seconds))

  function pad(n) {
    return String(n).padStart(2, '0')
  }

  function tick() {
    const oldH = toBCDBits(hours)
    const oldM = toBCDBits(minutes)
    const oldS = toBCDBits(seconds)

    seconds++
    if (seconds >= 60) { seconds = 0; minutes++ }
    if (minutes >= 60) { minutes = 0; hours++ }
    if (hours >= 24) { hours = 0 }

    const newH = toBCDBits(hours)
    const newM = toBCDBits(minutes)
    const newS = toBCDBits(seconds)

    const changed = new Set()
    for (let i = 0; i < 8; i++) {
      if (newH[i] !== oldH[i]) changed.add('h' + i)
      if (newM[i] !== oldM[i]) changed.add('m' + i)
      if (newS[i] !== oldS[i]) changed.add('s' + i)
    }
    flashSet = changed
    bitsChanged = changed.size

    if (flashTimer) clearTimeout(flashTimer)
    flashTimer = setTimeout(() => {
      flashSet = new Set()
      bitsChanged = 0
    }, Math.min(800, 900 / speed))
  }

  $effect(() => {
    if (interval) clearInterval(interval)
    if (running) {
      interval = setInterval(tick, 1000 / speed)
    }
    return () => { if (interval) clearInterval(interval) }
  })

  function jumpTo(h, m, s) {
    hours = h; minutes = m; seconds = s
    flashSet = new Set()
    bitsChanged = 0
  }

  onDestroy(() => {
    if (interval) clearInterval(interval)
    if (flashTimer) clearTimeout(flashTimer)
  })
</script>

{#snippet nibble(bits, offset, prefix)}
  <div class="nibble">
    <div class="weights"><span>8</span><span>4</span><span>2</span><span>1</span></div>
    <div class="cells">
      {#each [0, 1, 2, 3] as j}
        <div
          class="bit"
          class:high={bits[offset + j] === 1}
          class:flash={flashSet.has(prefix + (offset + j))}
        >{bits[offset + j]}</div>
      {/each}
    </div>
    <div class="nibble-dec">
      {bits[offset] * 8 + bits[offset + 1] * 4 + bits[offset + 2] * 2 + bits[offset + 3]}
    </div>
  </div>
{/snippet}

{#snippet bitGroup(label, bits, prefix, value, addr)}
  <div class="group">
    <div class="group-label">{label}</div>
    <div class="nibble-pair">
      {@render nibble(bits, 0, prefix)}
      {@render nibble(bits, 4, prefix)}
    </div>
    <div class="group-footer">
      <span class="decimal">= {value}</span>
      <span class="hex">{addr}</span>
    </div>
  </div>
{/snippet}

<figure class="trace-viz" role="img" aria-label="Time stored as BCD flip-flop states: 24 bits encoding hours, minutes, and seconds">
  <div class="display">
    <span class="time">{pad(hours)}<span class="sep">:</span>{pad(minutes)}<span class="sep">:</span>{pad(seconds)}</span>
    {#if bitsChanged > 0}
      <span class="changed-count">{bitsChanged} of 24 bits flipped</span>
    {/if}
  </div>

  <div class="bits-section">
    {@render bitGroup('HOURS', hBits, 'h', hours, '0x04')}
    <div class="colon">:</div>
    {@render bitGroup('MINUTES', mBits, 'm', minutes, '0x02')}
    <div class="colon">:</div>
    {@render bitGroup('SECONDS', sBits, 's', seconds, '0x00')}
  </div>

  <div class="annotation">
    Each cell = one flip-flop in your watch, one SRAM latch in your laptop's RTC.
    <span class="bit-sample high">1</span> transistor conducting, voltage up.
    <span class="bit-sample low">0</span> transistor off, voltage zero.
  </div>

  <div class="controls">
    <button onclick={() => running = !running}>
      {running ? '⏸ Pause' : '▶ Play'}
    </button>
    <button onclick={tick}>+1 sec</button>
    <button onclick={() => jumpTo(23, 59, 55)}>23:59:55</button>
    <button onclick={() => jumpTo(12, 0, 0)}>12:00:00</button>
    {#if running}
      <label class="speed-label">
        Speed
        <select bind:value={speed} name="playback-speed">
          <option value={1}>1x</option>
          <option value={5}>5x</option>
          <option value={10}>10x</option>
        </select>
      </label>
    {/if}
  </div>
</figure>

<style>
  .trace-viz {
    --cell-size: 24px;
    --cell-gap: 2px;
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .display {
    padding: 1.25rem 1rem 0.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
  }

  .time {
    font-size: 2.4rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--theme-green, #10b981);
  }

  .sep {
    opacity: 0.4;
  }

  .changed-count {
    font-size: 0.65rem;
    color: var(--theme-yellow, #f59e0b);
    opacity: 0.8;
  }

  .bits-section {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.25rem 0.5rem 1rem;
    overflow-x: auto;
  }

  .group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .group-label {
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--theme-foreground, #888);
    opacity: 0.45;
  }

  .nibble-pair {
    display: flex;
    gap: 6px;
  }

  .nibble {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .weights {
    display: flex;
    gap: var(--cell-gap);
  }

  .weights span {
    width: var(--cell-size);
    text-align: center;
    font-size: 0.5rem;
    color: var(--theme-foreground, #888);
    opacity: 0.25;
  }

  .cells {
    display: flex;
    gap: var(--cell-gap);
  }

  .bit {
    width: var(--cell-size);
    height: var(--cell-size);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    border: 1px solid var(--theme-separator, #2a2a3e);
    color: var(--theme-foreground, #444);
    background: rgba(255, 255, 255, 0.015);
    transition: all 0.15s ease;
  }

  .bit.high {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.35);
    color: var(--theme-green, #10b981);
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.15);
  }

  .bit.flash {
    animation: bitFlash 0.6s ease-out;
  }

  @keyframes bitFlash {
    0% {
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.7);
      background: rgba(16, 185, 129, 0.35);
    }
    100% {
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.15);
    }
  }

  .nibble-dec {
    font-size: 0.65rem;
    color: var(--theme-foreground, #888);
    opacity: 0.5;
    margin-top: 1px;
  }

  .colon {
    font-size: 1rem;
    color: var(--theme-foreground, #444);
    align-self: center;
    margin-top: 1.1rem;
  }

  .group-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    margin-top: 0.1rem;
  }

  .decimal {
    font-size: 0.7rem;
    color: var(--theme-foreground, #aaa);
  }

  .hex {
    font-size: 0.55rem;
    color: var(--theme-cyan, #06b6d4);
    opacity: 0.5;
  }

  .annotation {
    padding: 0.6rem 1rem;
    font-size: 0.6rem;
    color: var(--theme-foreground, #888);
    opacity: 0.65;
    text-align: center;
    line-height: 1.8;
    border-top: 1px solid var(--theme-separator, #333);
  }

  .bit-sample {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    font-size: 0.55rem;
    font-weight: 600;
    vertical-align: middle;
    margin: 0 1px;
  }

  .bit-sample.high {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: var(--theme-green, #10b981);
  }

  .bit-sample.low {
    border: 1px solid var(--theme-separator, #2a2a3e);
    color: var(--theme-foreground, #444);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

  .speed-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
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

  @media (max-width: 640px) {
    .trace-viz {
      --cell-size: 20px;
    }
    .bits-section {
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    .colon {
      display: none;
    }
    .time {
      font-size: 1.8rem;
    }
    .bit {
      font-size: 0.55rem;
    }
  }
</style>
