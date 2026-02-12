<script>
  // Static illustration: cesium atomic clock feedback loop
</script>

<figure class="trace-viz" role="img" aria-label="Cesium atomic clock feedback loop: microwave source, cesium atoms, detector, and frequency lock">
  <div class="diagram-container">
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet" class="feedback-svg">
      <defs>
        <marker id="fb-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #555)" />
        </marker>
        <marker id="fb-arrow-yellow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-yellow, #f59e0b)" />
        </marker>
      </defs>

      <!-- Microwave Source (top-left) -->
      <rect x="20" y="24" width="155" height="48" rx="4"
        fill="rgba(139, 92, 246, 0.06)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" />
      <text x="97" y="44" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Microwave source</text>
      <text x="97" y="62" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.6">~9.192 GHz</text>

      <!-- Arrow: Source → Cesium -->
      <line x1="175" y1="48" x2="222" y2="48"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#fb-arrow)" />
      <text x="198" y="41" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">microwaves</text>

      <!-- Cesium Atoms (top-right) -->
      <rect x="225" y="24" width="155" height="48" rx="4"
        fill="rgba(16, 185, 129, 0.06)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="302" y="44" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Cesium-133 atoms</text>
      <text x="302" y="62" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.6">hyperfine transition</text>

      <!-- Arrow: Cesium → Detector (down) -->
      <line x1="302" y1="72" x2="302" y2="120"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#fb-arrow)" />
      <text x="320" y="93" text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">atoms that</text>
      <text x="320" y="103" text-anchor="start"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">transitioned</text>

      <!-- Detector (bottom-right) -->
      <rect x="225" y="124" width="155" height="48" rx="4"
        fill="rgba(6, 182, 212, 0.06)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="302" y="144" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Detector</text>
      <text x="302" y="162" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.6">counts transitions</text>

      <!-- Arrow: Detector → Feedback (left) -->
      <line x1="225" y1="148" x2="178" y2="148"
        stroke="var(--theme-foreground, #555)" stroke-width="1" marker-end="url(#fb-arrow)" />
      <text x="201" y="141" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">error signal</text>

      <!-- Feedback Controller (bottom-left) -->
      <rect x="20" y="124" width="155" height="48" rx="4"
        fill="rgba(245, 158, 11, 0.06)" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
      <text x="97" y="144" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Feedback loop</text>
      <text x="97" y="162" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.6">adjusts frequency</text>

      <!-- Arrow: Feedback → Source (up, prominent) -->
      <line x1="97" y1="124" x2="97" y2="76"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5" marker-end="url(#fb-arrow-yellow)" />
      <text x="75" y="103" text-anchor="end"
        fill="var(--theme-yellow, #f59e0b)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.7">nudge</text>

      <!-- Annotation -->
      <text x="200" y="200" text-anchor="middle"
        fill="var(--theme-foreground, #aaa)" font-size="9" font-style="italic"
        font-family="JetBrains Mono, monospace" opacity="0.6">At peak absorption → frequency is locked</text>

      <!-- Result box -->
      <rect x="100" y="215" width="200" height="34" rx="5"
        fill="rgba(16, 185, 129, 0.08)" stroke="var(--theme-green, #10b981)" stroke-width="1.5" />
      <text x="200" y="237" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="12" font-weight="700"
        font-family="JetBrains Mono, monospace">9,192,631,770 Hz</text>
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

  .feedback-svg {
    width: 100%;
    max-width: 420px;
    height: auto;
  }
</style>
