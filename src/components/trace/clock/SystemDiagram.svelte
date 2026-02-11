<script>
  // Static illustration: no state, no animation
  // Shows how the two independent paths (watch & laptop) converge on atomic clocks
</script>

<figure class="trace-viz" role="img" aria-label="System diagram: how your watch and laptop both trace back to atomic clocks">
  <div class="diagram-container">
    <svg viewBox="0 0 460 596" preserveAspectRatio="xMidYMid meet" class="system-svg">
      <defs>
        <marker id="sys-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #666)" />
        </marker>
        <marker id="sys-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-green, #10b981)" />
        </marker>
      </defs>

      <!-- Column headers -->
      <text x="120" y="18" text-anchor="middle"
        fill="var(--theme-foreground, #aaa)" font-size="11" font-weight="700"
        font-family="JetBrains Mono, monospace" letter-spacing="0.06em">YOUR WATCH</text>
      <text x="340" y="18" text-anchor="middle"
        fill="var(--theme-foreground, #aaa)" font-size="11" font-weight="700"
        font-family="JetBrains Mono, monospace" letter-spacing="0.06em">YOUR LAPTOP</text>

      <!-- Vertical timeline lines -->
      <line x1="120" y1="28" x2="120" y2="285"
        stroke="var(--theme-separator, #333)" stroke-width="1" stroke-dasharray="3,3" />
      <line x1="340" y1="28" x2="340" y2="285"
        stroke="var(--theme-separator, #333)" stroke-width="1" stroke-dasharray="3,3" />

      <!-- === LEFT COLUMN: Your Watch === -->

      <!-- Quartz crystal -->
      <rect x="35" y="36" width="170" height="42" rx="4"
        fill="rgba(16, 185, 129, 0.05)" stroke="var(--theme-green, #10b981)" stroke-width="1" opacity="0.7" />
      <text x="120" y="53" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Quartz crystal</text>
      <text x="120" y="69" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="9"
        font-family="JetBrains Mono, monospace" opacity="0.6">32,768 Hz</text>

      <!-- Arrow + divider label -->
      <line x1="120" y1="78" x2="120" y2="102" stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#sys-arrow)" />
      <text x="145" y="94" text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.5">÷2 × 15</text>

      <!-- 1 Hz tick -->
      <rect x="35" y="106" width="170" height="42" rx="4"
        fill="rgba(255,255,255,0.02)" stroke="var(--theme-separator, #444)" stroke-width="1" />
      <text x="120" y="123" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">1 tick per second</text>
      <text x="120" y="139" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.7">drifts ~15 sec/month</text>

      <!-- Arrow -->
      <line x1="120" y1="148" x2="120" y2="172" stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#sys-arrow)" />

      <!-- Radio correction -->
      <rect x="35" y="176" width="170" height="42" rx="4"
        fill="rgba(6, 182, 212, 0.05)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" opacity="0.7" />
      <text x="120" y="193" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Radio correction</text>
      <text x="120" y="209" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.5">WWVB from Colorado</text>

      <!-- Arrow down to convergence -->
      <line x1="120" y1="218" x2="120" y2="260" stroke="var(--theme-foreground, #555)" stroke-width="1" />

      <!-- === RIGHT COLUMN: Your Laptop === -->

      <!-- Quartz oscillator -->
      <rect x="255" y="36" width="170" height="42" rx="4"
        fill="rgba(16, 185, 129, 0.05)" stroke="var(--theme-green, #10b981)" stroke-width="1" opacity="0.7" />
      <text x="340" y="53" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Quartz oscillator</text>
      <text x="340" y="69" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="9"
        font-family="JetBrains Mono, monospace" opacity="0.6">in the chipset</text>

      <!-- Arrow -->
      <line x1="340" y1="78" x2="340" y2="102" stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#sys-arrow)" />

      <!-- System clock -->
      <rect x="255" y="106" width="170" height="42" rx="4"
        fill="rgba(255,255,255,0.02)" stroke="var(--theme-separator, #444)" stroke-width="1" />
      <text x="340" y="123" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">System clock</text>
      <text x="340" y="139" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.7">also drifts</text>

      <!-- Arrow -->
      <line x1="340" y1="148" x2="340" y2="172" stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#sys-arrow)" />

      <!-- NTP correction -->
      <rect x="255" y="176" width="170" height="42" rx="4"
        fill="rgba(6, 182, 212, 0.05)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" opacity="0.7" />
      <text x="340" y="193" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">NTP correction</text>
      <text x="340" y="209" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.5">via internet time servers</text>

      <!-- Arrow down to convergence -->
      <line x1="340" y1="218" x2="340" y2="260" stroke="var(--theme-foreground, #555)" stroke-width="1" />

      <!-- === CONVERGENCE === -->

      <!-- Diagonal lines meeting at center -->
      <line x1="120" y1="260" x2="230" y2="295" stroke="var(--theme-foreground, #555)" stroke-width="1" />
      <line x1="340" y1="260" x2="230" y2="295" stroke="var(--theme-foreground, #555)" stroke-width="1" />

      <!-- Atomic Clocks (center) -->
      <rect x="100" y="300" width="260" height="50" rx="5"
        fill="rgba(139, 92, 246, 0.06)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.5" />
      <text x="230" y="320" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="12" font-weight="700"
        font-family="JetBrains Mono, monospace">Atomic Clocks</text>
      <text x="230" y="340" text-anchor="middle"
        fill="var(--theme-foreground, #aaa)" font-size="9"
        font-family="JetBrains Mono, monospace">Cesium-133 at national standards labs</text>

      <!-- Arrow -->
      <line x1="230" y1="350" x2="230" y2="370" stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#sys-arrow)" />

      <!-- GPS note (centered between atomic clocks and definition) -->
      <text x="230" y="388" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.6">GPS carries these same clocks to orbit — +38 μs/day (Einstein)</text>

      <!-- Arrow -->
      <line x1="230" y1="396" x2="230" y2="416" stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#sys-arrow)" />

      <!-- The definition -->
      <rect x="80" y="420" width="300" height="44" rx="4"
        fill="rgba(255,255,255,0.02)" stroke="var(--theme-separator, #444)" stroke-width="1" />
      <text x="230" y="439" text-anchor="middle"
        fill="var(--theme-foreground, #ddd)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">9,192,631,770 oscillations</text>
      <text x="230" y="455" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="9"
        font-family="JetBrains Mono, monospace">= exactly 1 second</text>

      <!-- Separator -->
      <line x1="60" y1="488" x2="400" y2="488" stroke="var(--theme-separator, #333)" stroke-width="0.5" />

      <!-- Bottom message -->
      <text x="230" y="516" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="10"
        font-family="JetBrains Mono, monospace" font-style="italic" opacity="0.6">Two paths. No shared wire.</text>
      <text x="230" y="536" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="10"
        font-family="JetBrains Mono, monospace" font-style="italic" opacity="0.6">Both listening to the same atoms.</text>

      <!-- Final result -->
      <rect x="155" y="552" width="150" height="34" rx="5"
        fill="rgba(16, 185, 129, 0.08)" stroke="var(--theme-green, #10b981)" stroke-width="1.5" />
      <text x="230" y="574" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="14" font-weight="700"
        font-family="JetBrains Mono, monospace">3:00:00 PM ✓</text>
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

  .system-svg {
    width: 100%;
    max-width: 480px;
    height: auto;
  }
</style>
