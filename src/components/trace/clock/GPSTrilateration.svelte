<script>
  // Static illustration: why GPS needs 4 satellites (4 unknowns: x, y, z, clock error)
</script>

<figure class="trace-viz" role="img" aria-label="Why GPS needs four satellites: three fix position (x, y, z) but a fourth is needed to solve for clock error">
  <div class="diagram-container">
    <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet" class="gps-svg">
      <defs>
        <marker id="gps-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #555)" />
        </marker>
      </defs>

      <!-- Title -->
      <text x="230" y="16" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.5">WHY FOUR SATELLITES?</text>

      <!-- Left side: 3 satellites (perfect clock) -->
      <text x="110" y="38" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.5">WITH PERFECT CLOCK</text>

      <!-- Three satellites -->
      <rect x="30" y="48" width="50" height="28" rx="4"
        fill="rgba(16, 185, 129, 0.06)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="55" y="66" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">SAT 1</text>

      <rect x="85" y="48" width="50" height="28" rx="4"
        fill="rgba(16, 185, 129, 0.06)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="110" y="66" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">SAT 2</text>

      <rect x="140" y="48" width="50" height="28" rx="4"
        fill="rgba(16, 185, 129, 0.06)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="165" y="66" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">SAT 3</text>

      <!-- Arrows down to equations -->
      <line x1="55" y1="76" x2="55" y2="94" stroke="var(--theme-foreground, #555)" stroke-width="0.75" opacity="0.4" />
      <line x1="110" y1="76" x2="110" y2="94" stroke="var(--theme-foreground, #555)" stroke-width="0.75" opacity="0.4" />
      <line x1="165" y1="76" x2="165" y2="94" stroke="var(--theme-foreground, #555)" stroke-width="0.75" opacity="0.4" />

      <!-- 3 unknowns box -->
      <rect x="25" y="96" width="170" height="52" rx="4"
        fill="rgba(255, 255, 255, 0.02)" stroke="var(--theme-separator, #444)" stroke-width="1" />
      <text x="110" y="112" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace">3 equations</text>
      <text x="110" y="126" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="8"
        font-family="JetBrains Mono, monospace">3 unknowns: x, y, z</text>
      <text x="110" y="140" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">solvable</text>

      <!-- Check mark -->
      <text x="110" y="165" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="10"
        font-family="JetBrains Mono, monospace" opacity="0.7">works (if clock is perfect)</text>

      <!-- Right side: 4 satellites (reality) -->
      <text x="345" y="38" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.5">WITH QUARTZ CLOCK (REALITY)</text>

      <!-- Four satellites -->
      <rect x="254" y="48" width="42" height="28" rx="4"
        fill="rgba(6, 182, 212, 0.06)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="275" y="66" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">SAT 1</text>

      <rect x="301" y="48" width="42" height="28" rx="4"
        fill="rgba(6, 182, 212, 0.06)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="322" y="66" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">SAT 2</text>

      <rect x="348" y="48" width="42" height="28" rx="4"
        fill="rgba(6, 182, 212, 0.06)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="369" y="66" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">SAT 3</text>

      <rect x="395" y="48" width="42" height="28" rx="4"
        fill="rgba(245, 158, 11, 0.06)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
      <text x="416" y="66" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">SAT 4</text>

      <!-- Arrows down -->
      <line x1="275" y1="76" x2="275" y2="94" stroke="var(--theme-foreground, #555)" stroke-width="0.75" opacity="0.4" />
      <line x1="322" y1="76" x2="322" y2="94" stroke="var(--theme-foreground, #555)" stroke-width="0.75" opacity="0.4" />
      <line x1="369" y1="76" x2="369" y2="94" stroke="var(--theme-foreground, #555)" stroke-width="0.75" opacity="0.4" />
      <line x1="416" y1="76" x2="416" y2="94" stroke="var(--theme-foreground, #555)" stroke-width="0.75" opacity="0.4" />

      <!-- 4 unknowns box -->
      <rect x="248" y="96" width="195" height="68" rx="4"
        fill="rgba(255, 255, 255, 0.02)" stroke="var(--theme-separator, #444)" stroke-width="1" />
      <text x="345" y="112" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace">4 equations</text>
      <text x="345" y="127" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="8"
        font-family="JetBrains Mono, monospace">4 unknowns: x, y, z</text>
      <text x="345" y="142" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8" font-weight="600"
        font-family="JetBrains Mono, monospace">+ clock error</text>
      <text x="345" y="156" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">solvable</text>

      <!-- Bottom summary -->
      <line x1="20" y1="185" x2="440" y2="185"
        stroke="var(--theme-separator, #444)" stroke-width="0.5" opacity="0.3" />

      <!-- The key insight -->
      <rect x="55" y="196" width="350" height="50" rx="5"
        fill="rgba(245, 158, 11, 0.04)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
      <text x="230" y="215" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">your phone's quartz clock is an unknown</text>
      <text x="230" y="232" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace" opacity="0.6">every GPS fix simultaneously solves: where you are + what time it is</text>
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
  .gps-svg {
    width: 100%;
    max-width: 520px;
    height: auto;
  }
</style>
