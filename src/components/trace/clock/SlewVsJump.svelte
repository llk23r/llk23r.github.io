<script>
  // Static illustration: jump correction vs slew correction
</script>

<figure class="trace-viz" role="img" aria-label="Comparison of jump correction versus slew correction">
  <div class="diagram-container">
    <svg viewBox="0 0 340 175" preserveAspectRatio="xMidYMid meet" class="slew-svg">
      <!-- Jump correction chart -->
      <text x="170" y="12" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.7">Jump correction</text>

      <!-- Correct time reference -->
      <line x1="30" y1="35" x2="310" y2="35"
        stroke="var(--theme-green, #10b981)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.3" />

      <!-- Clock reading: behind, then instant jump -->
      <path d="M30,58 L150,58 L150,35 L310,35"
        fill="none" stroke="var(--theme-cyan, #06b6d4)" stroke-width="2" />

      <!-- Correction point marker -->
      <line x1="150" y1="22" x2="150" y2="68"
        stroke="var(--theme-red, #ef4444)" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.35" />

      <!-- Labels -->
      <text x="315" y="38" fill="var(--theme-green, #10b981)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">correct</text>
      <text x="315" y="61" fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.4">behind</text>
      <text x="158" y="52" fill="var(--theme-red, #ef4444)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.7">gap!</text>

      <!-- Slew correction chart -->
      <text x="170" y="97" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.7">Slew correction</text>

      <!-- Correct time reference -->
      <line x1="30" y1="120" x2="310" y2="120"
        stroke="var(--theme-green, #10b981)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.3" />

      <!-- Clock reading: behind, then smooth curve -->
      <path d="M30,143 L150,143 C200,143 240,120 275,120 L310,120"
        fill="none" stroke="var(--theme-yellow, #f59e0b)" stroke-width="2" />

      <!-- Correction point marker -->
      <line x1="150" y1="107" x2="150" y2="153"
        stroke="var(--theme-red, #ef4444)" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.35" />

      <!-- Labels -->
      <text x="315" y="123" fill="var(--theme-green, #10b981)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">correct</text>
      <text x="315" y="146" fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.4">behind</text>
      <text x="218" y="140" fill="var(--theme-yellow, #f59e0b)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.7">smooth</text>

      <!-- Time axis -->
      <text x="30" y="170" fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.35">time →</text>

      <!-- NTP corrects label -->
      <text x="150" y="170" text-anchor="middle"
        fill="var(--theme-red, #ef4444)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.4">NTP corrects</text>
    </svg>
  </div>

  <div class="annotation">
    Jump: timestamps leap forward; log entries appear out of order.
    Slew: each tick counts for slightly more time; no discontinuity.
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

  .slew-svg {
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
