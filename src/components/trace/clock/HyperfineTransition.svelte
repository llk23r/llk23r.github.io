<script>
  // Static illustration: cesium-133 hyperfine energy level transition
</script>

<figure class="trace-viz" role="img" aria-label="Cesium-133 hyperfine transition; an electron absorbs a microwave photon and jumps between two energy levels">
  <div class="diagram-container">
    <svg viewBox="0 0 340 180" preserveAspectRatio="xMidYMid meet" class="hyperfine-svg">
      <!-- Upper energy level -->
      <line x1="80" y1="40" x2="260" y2="40"
        stroke="var(--theme-accent, #8b5cf6)" stroke-width="2" />
      <text x="270" y="38" text-anchor="start"
        fill="var(--theme-accent, #8b5cf6)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">F = 4</text>
      <text x="270" y="50" text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.45">excited</text>

      <!-- Lower energy level -->
      <line x1="80" y1="130" x2="260" y2="130"
        stroke="var(--theme-green, #10b981)" stroke-width="2" />
      <text x="270" y="128" text-anchor="start"
        fill="var(--theme-green, #10b981)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">F = 3</text>
      <text x="270" y="140" text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.45">ground</text>

      <!-- Electron on lower level -->
      <circle cx="140" cy="125" r="5"
        fill="var(--theme-green, #10b981)" opacity="0.7" />
      <text x="140" y="128" text-anchor="middle"
        fill="var(--theme-background, #1a1a2e)" font-size="5" font-weight="700"
        font-family="JetBrains Mono, monospace">e⁻</text>

      <!-- Upward arrow (transition) -->
      <line x1="170" y1="122" x2="170" y2="48"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5"
        stroke-dasharray="none" />
      <polygon points="170,46 165,56 175,56"
        fill="var(--theme-yellow, #f59e0b)" />

      <!-- Electron on upper level (after transition) -->
      <circle cx="200" cy="35" r="5"
        fill="var(--theme-accent, #8b5cf6)" opacity="0.7" />
      <text x="200" y="38" text-anchor="middle"
        fill="var(--theme-background, #1a1a2e)" font-size="5" font-weight="700"
        font-family="JetBrains Mono, monospace">e⁻</text>

      <!-- Microwave photon (wavy line) approaching from left -->
      <path d="M50,85 Q60,75 70,85 Q80,95 90,85 Q100,75 110,85 Q120,95 130,85 Q140,75 150,85"
        fill="none" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5" opacity="0.6" />
      <text x="55" y="76" text-anchor="start"
        fill="var(--theme-yellow, #f59e0b)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">microwave</text>

      <!-- Arrow from photon to transition -->
      <line x1="155" y1="85" x2="165" y2="85"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" opacity="0.4" />

      <!-- Frequency label -->
      <text x="170" y="90" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.7">absorb</text>

      <!-- Energy label -->
      <text x="60" y="40" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.3">higher energy</text>
      <text x="60" y="134" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.3">lower energy</text>

      <!-- The number -->
      <rect x="70" y="148" width="200" height="24" rx="4"
        fill="rgba(245, 158, 11, 0.06)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
      <text x="170" y="164" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="700"
        font-family="JetBrains Mono, monospace">9,192,631,770 Hz</text>
    </svg>
  </div>
  <div class="annotation">
    When a microwave at exactly this frequency hits a cesium-133 atom,
    the electron absorbs the photon and jumps to the higher energy level.
    This frequency is identical for every cesium atom in the universe.
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
  .hyperfine-svg {
    width: 100%;
    max-width: 380px;
    height: auto;
  }
  .annotation {
    padding: 0.5rem 0.75rem;
    font-size: 0.6rem;
    color: var(--theme-foreground, #888);
    opacity: 0.6;
    text-align: center;
    line-height: 1.8;
    border-top: 1px solid var(--theme-separator, #333);
  }
</style>
