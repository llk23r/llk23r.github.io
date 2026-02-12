<script>
  // Static illustration: laptop clock architecture; RTC → OS boot → TSC pipeline
</script>

<figure class="trace-viz" role="img" aria-label="Laptop clock architecture; RTC chip keeps time while off, OS reads it on boot, then the CPU's TSC counter takes over">
  <div class="diagram-container">
    <svg viewBox="0 0 440 230" preserveAspectRatio="xMidYMid meet" class="arch-svg">
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #555)" />
        </marker>
      </defs>

      <!-- Phase label: COMPUTER OFF -->
      <text x="75" y="14" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.35">COMPUTER OFF</text>

      <!-- RTC chip box -->
      <rect x="15" y="22" width="120" height="80" rx="5"
        fill="rgba(139, 92, 246, 0.06)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.5" />
      <text x="75" y="40" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="9.5" font-weight="600"
        font-family="JetBrains Mono, monospace">RTC Chip</text>

      <!-- Crystal inside RTC -->
      <rect x="28" y="50" width="40" height="18" rx="3"
        fill="rgba(139, 92, 246, 0.1)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="0.5" />
      <text x="48" y="62" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="6"
        font-family="JetBrains Mono, monospace">32,768 Hz</text>

      <!-- BCD memory inside RTC -->
      <rect x="78" y="50" width="45" height="18" rx="3"
        fill="rgba(139, 92, 246, 0.1)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="0.5" />
      <text x="100" y="62" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="6"
        font-family="JetBrains Mono, monospace">BCD time</text>

      <!-- Coin cell -->
      <rect x="40" y="78" width="70" height="16" rx="3"
        fill="rgba(245, 158, 11, 0.08)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="0.5" />
      <text x="75" y="90" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="6.5"
        font-family="JetBrains Mono, monospace">coin cell battery</text>

      <!-- Arrow: always counting -->
      <text x="75" y="118" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7" font-style="italic"
        font-family="JetBrains Mono, monospace" opacity="0.4">always counting</text>

      <!-- Phase label: BOOT -->
      <text x="220" y="14" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.35">BOOT</text>

      <!-- Arrow: RTC → OS reads -->
      <line x1="135" y1="55" x2="165" y2="55"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#arch-arrow)" />
      <text x="150" y="48" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.4">read</text>

      <!-- OS kernel box -->
      <rect x="168" y="22" width="105" height="80" rx="5"
        fill="rgba(6, 182, 212, 0.06)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
      <text x="220" y="40" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="9.5" font-weight="600"
        font-family="JetBrains Mono, monospace">OS Kernel</text>

      <!-- Base time stored -->
      <rect x="180" y="50" width="80" height="18" rx="3"
        fill="rgba(6, 182, 212, 0.1)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="0.5" />
      <text x="220" y="62" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="6"
        font-family="JetBrains Mono, monospace">base time</text>

      <!-- ns/tick multiplier -->
      <rect x="180" y="73" width="80" height="18" rx="3"
        fill="rgba(6, 182, 212, 0.1)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="0.5" />
      <text x="220" y="85" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="6"
        font-family="JetBrains Mono, monospace">ns/tick rate</text>

      <!-- Phase label: RUNNING -->
      <text x="365" y="14" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.35">RUNNING</text>

      <!-- Arrow: OS → TSC -->
      <line x1="273" y1="55" x2="303" y2="55"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#arch-arrow)" />
      <text x="288" y="48" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.4">uses</text>

      <!-- TSC counter box -->
      <rect x="306" y="22" width="120" height="80" rx="5"
        fill="rgba(16, 185, 129, 0.06)" stroke="var(--theme-green, #10b981)" stroke-width="1.5" />
      <text x="366" y="40" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="9.5" font-weight="600"
        font-family="JetBrains Mono, monospace">CPU TSC</text>

      <!-- GHz counter -->
      <rect x="318" y="50" width="96" height="18" rx="3"
        fill="rgba(16, 185, 129, 0.1)" stroke="var(--theme-green, #10b981)" stroke-width="0.5" />
      <text x="366" y="62" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="6"
        font-family="JetBrains Mono, monospace">billions of ticks/s</text>

      <!-- High resolution note -->
      <text x="366" y="85" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5" font-style="italic"
        font-family="JetBrains Mono, monospace" opacity="0.4">nanosecond precision</text>

      <!-- Bottom: the formula -->
      <rect x="60" y="140" width="320" height="36" rx="5"
        fill="rgba(255, 255, 255, 0.02)" stroke="var(--theme-separator, #444)" stroke-width="1" />
      <text x="220" y="156" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace">now = base time + (ticks × ns/tick)</text>
      <text x="220" y="170" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.4">every clock_gettime() computes this</text>

      <!-- Arrow from formula to OS kernel -->
      <line x1="220" y1="140" x2="220" y2="108"
        stroke="var(--theme-separator, #444)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.3" />

      <!-- NTP correction annotation -->
      <text x="220" y="205" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">NTP adjusts the ns/tick rate (slew) or the base time</text>
    </svg>
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
    padding: 1rem 0.5rem;
    display: flex;
    justify-content: center;
  }
  .arch-svg {
    width: 100%;
    max-width: 480px;
    height: auto;
  }
</style>
