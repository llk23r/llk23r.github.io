<script>
  // Static illustration: piezoelectric oscillator feedback cycle
</script>

<figure class="trace-viz" role="img" aria-label="Piezoelectric oscillator feedback cycle; crystal flexes, generates voltage, circuit amplifies and feeds it back">
  <div class="diagram-container">
    <svg viewBox="0 0 400 230" preserveAspectRatio="xMidYMid meet" class="piezo-svg">
      <defs>
        <marker id="pz-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #555)" />
        </marker>
        <marker id="pz-arrow-yellow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-yellow, #f59e0b)" />
        </marker>
      </defs>

      <!-- Node 1: Crystal flexes (top-left) -->
      <rect x="20" y="20" width="155" height="48" rx="4"
        fill="rgba(139, 92, 246, 0.06)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" />
      <text x="97" y="40" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Crystal flexes</text>
      <text x="97" y="58" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">mechanical vibration</text>

      <!-- Arrow: flexes → voltage (right) -->
      <line x1="175" y1="44" x2="222" y2="44"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#pz-arrow)" />
      <text x="198" y="37" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.45">squeeze</text>

      <!-- Node 2: Generates voltage (top-right) -->
      <rect x="225" y="20" width="155" height="48" rx="4"
        fill="rgba(16, 185, 129, 0.06)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="302" y="40" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Tiny voltage</text>
      <text x="302" y="58" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">piezoelectric effect</text>

      <!-- Arrow: voltage → amplify (down) -->
      <line x1="302" y1="68" x2="302" y2="108"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#pz-arrow)" />

      <!-- Node 3: Circuit amplifies (bottom-right) -->
      <rect x="225" y="112" width="155" height="48" rx="4"
        fill="rgba(6, 182, 212, 0.06)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="302" y="132" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Circuit amplifies</text>
      <text x="302" y="150" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">boosts the signal</text>

      <!-- Arrow: amplify → back to crystal (left) -->
      <line x1="225" y1="136" x2="178" y2="136"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#pz-arrow)" />

      <!-- Node 4: Voltage fed back (bottom-left) -->
      <rect x="20" y="112" width="155" height="48" rx="4"
        fill="rgba(245, 158, 11, 0.06)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
      <text x="97" y="132" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Voltage applied</text>
      <text x="97" y="150" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">crystal flexes again</text>

      <!-- Arrow: fed back → crystal (up, highlighted) -->
      <line x1="97" y1="112" x2="97" y2="72"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5" marker-end="url(#pz-arrow-yellow)" />
      <text x="79" y="95" text-anchor="end"
        fill="var(--theme-yellow, #f59e0b)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.6">feedback</text>

      <!-- Center annotation -->
      <text x="200" y="90" text-anchor="middle"
        fill="var(--theme-foreground, #aaa)" font-size="8" font-style="italic"
        font-family="JetBrains Mono, monospace" opacity="0.45">sustains 32,768 Hz</text>

      <!-- Result -->
      <rect x="115" y="182" width="170" height="30" rx="5"
        fill="rgba(16, 185, 129, 0.08)" stroke="var(--theme-green, #10b981)" stroke-width="1.5" />
      <text x="200" y="202" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="10" font-weight="700"
        font-family="JetBrains Mono, monospace">self-sustaining oscillation</text>
    </svg>
  </div>
  <div class="annotation">
    Without the circuit, the crystal damps out in microseconds.
    The feedback keeps it vibrating; like a hand pushing a swing at the top of each arc.
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
  .piezo-svg {
    width: 100%;
    max-width: 440px;
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
