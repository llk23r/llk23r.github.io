<script>
  // Static illustration: quartz frequency-temperature parabola
</script>

<figure class="trace-viz" role="img" aria-label="Quartz crystal frequency deviation versus temperature; an inverted parabola peaking near 25 degrees C">
  <div class="diagram-container">
    <svg viewBox="0 0 380 200" preserveAspectRatio="xMidYMid meet" class="temp-svg">
      <!-- Y axis -->
      <line x1="50" y1="20" x2="50" y2="170"
        stroke="var(--theme-foreground, #555)" stroke-width="0.75" />
      <text x="25" y="95" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5"
        transform="rotate(-90, 25, 95)">frequency deviation (ppm)</text>

      <!-- X axis -->
      <line x1="50" y1="170" x2="360" y2="170"
        stroke="var(--theme-foreground, #555)" stroke-width="0.75" />
      <text x="205" y="192" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">temperature (°C)</text>

      <!-- Y axis labels -->
      <text x="45" y="37" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">0</text>
      <line x1="47" y1="35" x2="53" y2="35"
        stroke="var(--theme-foreground, #555)" stroke-width="0.5" opacity="0.3" />

      <text x="45" y="72" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">-5</text>
      <line x1="47" y1="70" x2="53" y2="70"
        stroke="var(--theme-foreground, #555)" stroke-width="0.5" opacity="0.3" />

      <text x="45" y="107" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">-10</text>
      <line x1="47" y1="105" x2="53" y2="105"
        stroke="var(--theme-foreground, #555)" stroke-width="0.5" opacity="0.3" />

      <text x="45" y="142" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">-15</text>
      <line x1="47" y1="140" x2="53" y2="140"
        stroke="var(--theme-foreground, #555)" stroke-width="0.5" opacity="0.3" />

      <!-- X axis labels -->
      <text x="70" y="182" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">-10</text>
      <text x="120" y="182" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">0</text>
      <text x="170" y="182" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">10</text>
      <text x="220" y="182" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">20</text>
      <text x="245" y="182" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="6.5" font-weight="600"
        font-family="JetBrains Mono, monospace" opacity="0.7">25</text>
      <text x="270" y="182" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">30</text>
      <text x="320" y="182" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">40</text>
      <text x="355" y="182" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">50</text>

      <!-- Wrist temperature band (18-32°C approx) -->
      <rect x="195" y="20" width="85" height="150" rx="0"
        fill="rgba(16, 185, 129, 0.04)" stroke="none" />
      <text x="237" y="165" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.4">wrist temp range</text>

      <!-- The parabola: peaks at 25°C (x=245), inverted parabola -->
      <!-- f(T) ≈ -0.035 * (T-25)^2 ppm; mapped to SVG coordinates -->
      <!-- At 25°C: 0 ppm (y=35). At 0°C: -21.9 ppm (y≈167). At 50°C: -21.9 ppm (y≈167) -->
      <path d="M60,165 Q80,152 100,138 Q130,112 160,80 Q190,48 220,37 Q235,33 245,32 Q255,33 270,37 Q300,48 320,80 Q340,112 355,155"
        fill="none" stroke="var(--theme-cyan, #06b6d4)" stroke-width="2" />

      <!-- Peak marker at 25°C -->
      <circle cx="245" cy="32" r="3" fill="var(--theme-green, #10b981)" />
      <line x1="245" y1="35" x2="245" y2="170"
        stroke="var(--theme-green, #10b981)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.3" />
      <text x="245" y="25" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="7" font-weight="600"
        font-family="JetBrains Mono, monospace">peak at 25°C</text>

      <!-- Arrows showing "colder = slower" and "hotter = slower" -->
      <text x="90" y="130" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.4">colder → slower</text>
      <text x="330" y="100" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.4">hotter → slower</text>

      <!-- Zero line -->
      <line x1="50" y1="35" x2="360" y2="35"
        stroke="var(--theme-foreground, #555)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.15" />
    </svg>
  </div>
  <div class="annotation">
    The parabola peaks near room temperature. Any deviation; colder or hotter; slows the crystal.
    A few degrees off the peak costs a few parts per million.
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
  .temp-svg {
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
