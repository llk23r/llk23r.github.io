<script>
  // Static illustration: logarithmic clock accuracy comparison scale
</script>

<figure class="trace-viz" role="img" aria-label="Logarithmic scale comparing clock accuracy; quartz watch, cesium atomic clock, optical lattice clock">
  <div class="diagram-container">
    <svg viewBox="0 0 540 180" preserveAspectRatio="xMidYMid meet" class="scale-svg">
      <!-- Scale bar -->
      <line x1="35" y1="80" x2="505" y2="80"
        stroke="var(--theme-separator, #444)" stroke-width="1" />

      <!-- Tick marks and labels (log scale, properly spaced) -->
      <!-- 1 second / day -->
      <line x1="55" y1="75" x2="55" y2="85"
        stroke="var(--theme-foreground, #555)" stroke-width="1" />
      <text x="55" y="98" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">1s / day</text>

      <!-- 1 second / year -->
      <line x1="145" y1="75" x2="145" y2="85"
        stroke="var(--theme-foreground, #555)" stroke-width="1" />
      <text x="145" y="98" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">1s / year</text>

      <!-- 1 second / 1000 years -->
      <line x1="245" y1="75" x2="245" y2="85"
        stroke="var(--theme-foreground, #555)" stroke-width="1" />
      <text x="245" y="98" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">1s / 1K yr</text>

      <!-- 1 second / 1M years -->
      <line x1="335" y1="75" x2="335" y2="85"
        stroke="var(--theme-foreground, #555)" stroke-width="1" />
      <text x="335" y="98" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">1s / 1M yr</text>

      <!-- 1 second / 300M years (cesium) -->
      <line x1="410" y1="75" x2="410" y2="85"
        stroke="var(--theme-foreground, #555)" stroke-width="1" />
      <text x="410" y="98" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">1s / 300M yr</text>

      <!-- 1 second / 30B years (optical) -->
      <line x1="490" y1="75" x2="490" y2="85"
        stroke="var(--theme-foreground, #555)" stroke-width="1" />
      <text x="490" y="98" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">1s / 30B yr</text>

      <!-- Arrow showing direction -->
      <text x="515" y="84" text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.25">→</text>
      <text x="40" y="112" text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.25">less accurate</text>
      <text x="505" y="112" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.25">more accurate</text>

      <!-- Quartz watch marker -->
      <circle cx="70" cy="80" r="6"
        fill="var(--theme-yellow, #f59e0b)" opacity="0.8" />
      <line x1="70" y1="72" x2="70" y2="40"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.4" />
      <text x="70" y="34" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace">Quartz watch</text>
      <text x="70" y="46" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.45">±0.5s / day</text>

      <!-- Cesium marker -->
      <circle cx="410" cy="80" r="6"
        fill="var(--theme-green, #10b981)" opacity="0.8" />
      <line x1="410" y1="72" x2="410" y2="40"
        stroke="var(--theme-green, #10b981)" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.4" />
      <text x="410" y="34" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace">Cesium (NIST-F2)</text>
      <text x="410" y="46" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.45">1s / 300M years</text>

      <!-- Optical lattice marker (staggered higher to avoid overlap) -->
      <circle cx="490" cy="80" r="6"
        fill="var(--theme-accent, #8b5cf6)" opacity="0.8" />
      <line x1="490" y1="72" x2="490" y2="24"
        stroke="var(--theme-accent, #8b5cf6)" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.4" />
      <text x="490" y="18" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace">Optical lattice</text>
      <text x="490" y="30" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.45">1s / 30B years</text>

      <!-- 100x improvement bracket -->
      <line x1="410" y1="130" x2="490" y2="130"
        stroke="var(--theme-foreground, #888)" stroke-width="0.5" opacity="0.3" />
      <line x1="410" y1="126" x2="410" y2="134"
        stroke="var(--theme-foreground, #888)" stroke-width="0.5" opacity="0.3" />
      <line x1="490" y1="126" x2="490" y2="134"
        stroke="var(--theme-foreground, #888)" stroke-width="0.5" opacity="0.3" />
      <text x="450" y="145" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.4">100× better</text>

      <!-- Age of universe reference -->
      <text x="450" y="162" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="6" font-style="italic"
        font-family="JetBrains Mono, monospace" opacity="0.35">longer than the universe has existed</text>
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
    padding: 0.75rem 0.5rem;
    display: flex;
    justify-content: center;
  }
  .scale-svg {
    width: 100%;
    max-width: 580px;
    height: auto;
  }
</style>
