<script>
  // Static illustration: three independent paths to atomic time converging on your phone
</script>

<figure class="trace-viz" role="img" aria-label="Three independent paths; GPS, NTP, and NITZ; converge on your phone, all tracing back to atomic clocks">
  <div class="diagram-container">
    <svg viewBox="0 0 380 260" preserveAspectRatio="xMidYMid meet" class="paths-svg">
      <defs>
        <marker id="tp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #555)" />
        </marker>
      </defs>

      <!-- Atomic clocks (top center) -->
      <rect x="115" y="8" width="150" height="32" rx="5"
        fill="rgba(139, 92, 246, 0.06)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.5" />
      <text x="190" y="28" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="700"
        font-family="JetBrains Mono, monospace">Atomic Clocks</text>

      <!-- Three diverging paths -->

      <!-- Path 1: GPS (left) -->
      <line x1="150" y1="40" x2="70" y2="72"
        stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#tp-arrow)" />

      <rect x="15" y="76" width="110" height="44" rx="4"
        fill="rgba(16, 185, 129, 0.05)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="70" y="94" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace">GPS Satellite</text>
      <text x="70" y="112" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">rubidium clocks</text>

      <!-- Path 2: NTP (center) -->
      <line x1="190" y1="40" x2="190" y2="72"
        stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#tp-arrow)" />

      <rect x="135" y="76" width="110" height="44" rx="4"
        fill="rgba(6, 182, 212, 0.05)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="190" y="94" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace">NTP Server</text>
      <text x="190" y="112" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">stratum hierarchy</text>

      <!-- Path 3: NITZ (right) -->
      <line x1="230" y1="40" x2="310" y2="72"
        stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#tp-arrow)" />

      <rect x="255" y="76" width="110" height="44" rx="4"
        fill="rgba(245, 158, 11, 0.05)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
      <text x="310" y="94" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace">Cell Tower</text>
      <text x="310" y="112" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">NITZ protocol</text>

      <!-- Accuracy labels -->
      <text x="70" y="137" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">~10 ns</text>
      <text x="190" y="137" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">~10 ms</text>
      <text x="310" y="137" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">~few sec</text>

      <!-- Three converging lines to phone -->
      <line x1="70" y1="142" x2="165" y2="196"
        stroke="var(--theme-green, #10b981)" stroke-width="1" stroke-dasharray="3,2" opacity="0.4" />
      <line x1="190" y1="142" x2="190" y2="196"
        stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" stroke-dasharray="3,2" opacity="0.4" />
      <line x1="310" y1="142" x2="215" y2="196"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" stroke-dasharray="3,2" opacity="0.4" />

      <!-- Phone -->
      <rect x="145" y="200" width="90" height="44" rx="5"
        fill="rgba(255, 255, 255, 0.03)" stroke="var(--theme-separator, #444)" stroke-width="1.5" />
      <text x="190" y="220" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Your Phone</text>
      <text x="190" y="236" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">picks the best source</text>
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
  .paths-svg {
    width: 100%;
    max-width: 420px;
    height: auto;
  }
</style>
