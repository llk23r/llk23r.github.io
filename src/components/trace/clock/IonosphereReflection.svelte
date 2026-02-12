<script>
  // Static illustration: ionosphere day vs night radio wave propagation
</script>

<figure class="trace-viz" role="img" aria-label="How WWVB radio signals propagate differently during day and night due to ionosphere changes">
  <div class="diagram-container">
    <svg viewBox="0 0 380 245" preserveAspectRatio="xMidYMid meet" class="iono-svg">
      <defs>
        <marker id="iono-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-cyan, #06b6d4)" />
        </marker>
        <marker id="iono-arrow-yellow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-yellow, #f59e0b)" />
        </marker>
      </defs>

      <!-- ======= DAYTIME (top half) ======= -->
      <text x="190" y="14" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.7">Daytime</text>

      <!-- E-region -->
      <rect x="15" y="22" width="350" height="14" rx="2"
        fill="rgba(139, 92, 246, 0.05)" stroke="none" />
      <text x="355" y="33" text-anchor="end"
        fill="var(--theme-accent, #8b5cf6)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.35">E ~100 km</text>

      <!-- D-region (active — absorbing) -->
      <rect x="15" y="42" width="350" height="18" rx="2"
        fill="rgba(239, 68, 68, 0.08)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" opacity="0.5" />
      <text x="190" y="55" text-anchor="middle"
        fill="var(--theme-red, #ef4444)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.6">D-region — absorbs LF</text>

      <!-- Ground -->
      <line x1="15" y1="100" x2="365" y2="100"
        stroke="var(--theme-green, #10b981)" stroke-width="0.75" opacity="0.25" />

      <!-- Transmitter -->
      <line x1="50" y1="100" x2="50" y2="86" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
      <circle cx="50" cy="84" r="2.5" fill="var(--theme-cyan, #06b6d4)" />
      <text x="50" y="79" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="6" font-weight="600"
        font-family="JetBrains Mono, monospace">WWVB</text>

      <!-- Signal going up — absorbed by D-layer -->
      <line x1="53" y1="84" x2="100" y2="58"
        stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" stroke-dasharray="4,3" opacity="0.35" />
      <text x="108" y="56" fill="var(--theme-red, #ef4444)" font-size="11" font-weight="700"
        font-family="JetBrains Mono, monospace" opacity="0.6">×</text>

      <!-- Ground wave (short range) -->
      <path d="M53,90 Q120,88 180,96"
        fill="none" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" opacity="0.5"
        marker-end="url(#iono-arrow)" />

      <!-- Range labels -->
      <text x="195" y="96" fill="var(--theme-cyan, #06b6d4)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.6">~1,000 km</text>
      <text x="310" y="96" fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.2">too far</text>

      <!-- Sun -->
      <circle cx="340" cy="18" r="6" fill="none" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" opacity="0.3" />
      <circle cx="340" cy="18" r="2" fill="var(--theme-yellow, #f59e0b)" opacity="0.4" />


      <!-- ======= DIVIDER ======= -->
      <line x1="30" y1="118" x2="350" y2="118"
        stroke="var(--theme-separator, #444)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.2" />


      <!-- ======= NIGHTTIME (bottom half) ======= -->
      <text x="190" y="135" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="9" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.7">Nighttime</text>

      <!-- E-region (now reflecting) -->
      <rect x="15" y="142" width="350" height="14" rx="2"
        fill="rgba(139, 92, 246, 0.08)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="0.5" opacity="0.5" />
      <text x="355" y="153" text-anchor="end"
        fill="var(--theme-accent, #8b5cf6)" font-size="6" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.5">E — reflects</text>

      <!-- D-region (gone) -->
      <rect x="15" y="162" width="350" height="18" rx="2"
        fill="none" stroke="var(--theme-separator, #444)" stroke-width="0.5" stroke-dasharray="4,3" opacity="0.15" />
      <text x="190" y="175" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.2">D-region — gone</text>

      <!-- Ground -->
      <line x1="15" y1="220" x2="365" y2="220"
        stroke="var(--theme-green, #10b981)" stroke-width="0.75" opacity="0.25" />

      <!-- Transmitter -->
      <line x1="50" y1="220" x2="50" y2="206" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
      <circle cx="50" cy="204" r="2.5" fill="var(--theme-cyan, #06b6d4)" />
      <text x="50" y="199" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="6" font-weight="600"
        font-family="JetBrains Mono, monospace">WWVB</text>

      <!-- Sky wave: up through vanished D, bounce off E, down far away -->
      <polyline points="53,204 140,156 250,216"
        fill="none" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5" opacity="0.6" />
      <!-- Second skip -->
      <polyline points="250,216 330,156 360,195"
        fill="none" stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" opacity="0.35"
        marker-end="url(#iono-arrow-yellow)" />

      <!-- Bounce dots on E-layer -->
      <circle cx="140" cy="155" r="2" fill="var(--theme-yellow, #f59e0b)" opacity="0.5" />
      <circle cx="330" cy="155" r="2" fill="var(--theme-yellow, #f59e0b)" opacity="0.35" />

      <!-- Range label -->
      <text x="300" y="236" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">~3,000 km sky wave</text>

      <!-- Moon -->
      <text x="348" y="140" fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.2">☾</text>
    </svg>
  </div>

  <div class="annotation">
    Day: solar UV sustains the D-region, which absorbs 60 kHz signals.
    Night: D-region fades; signals skip off the E-region across the continent.
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

  .iono-svg {
    width: 100%;
    max-width: 420px;
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
