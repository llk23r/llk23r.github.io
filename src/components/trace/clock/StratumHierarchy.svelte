<script>
  // Static illustration: NTP stratum hierarchy with fan-out and redundant queries
</script>

<figure class="trace-viz" role="img" aria-label="NTP stratum hierarchy showing fan-out from atomic clocks to your laptop, with redundant queries">
  <div class="diagram-container">
    <svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid meet" class="hierarchy-svg">
      <defs>
        <marker id="str-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-foreground, #555)" />
        </marker>
        <marker id="str-arrow-cyan" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-cyan, #06b6d4)" />
        </marker>
      </defs>

      <!-- Stratum 0: Atomic Clocks -->
      <rect x="120" y="10" width="160" height="44" rx="5"
        fill="rgba(139, 92, 246, 0.06)" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.5" />
      <text x="200" y="29" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="700"
        font-family="JetBrains Mono, monospace">Stratum 0</text>
      <text x="200" y="45" text-anchor="middle"
        fill="var(--theme-foreground, #aaa)" font-size="7.5"
        font-family="JetBrains Mono, monospace">cesium, GPS, hydrogen maser</text>

      <!-- Fan-out arrows to Stratum 1 -->
      <line x1="170" y1="54" x2="115" y2="84" stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#str-arrow)" />
      <line x1="230" y1="54" x2="285" y2="84" stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#str-arrow)" />
      <text x="200" y="72" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">wire / GPS antenna</text>

      <!-- Stratum 1: Two servers -->
      <rect x="30" y="88" width="160" height="40" rx="4"
        fill="rgba(16, 185, 129, 0.05)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="110" y="106" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="9.5" font-weight="600"
        font-family="JetBrains Mono, monospace">Stratum 1</text>
      <text x="110" y="120" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">time.nist.gov</text>

      <rect x="210" y="88" width="160" height="40" rx="4"
        fill="rgba(16, 185, 129, 0.05)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
      <text x="290" y="106" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="9.5" font-weight="600"
        font-family="JetBrains Mono, monospace">Stratum 1</text>
      <text x="290" y="120" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.5">ptbtime1.ptb.de</text>

      <!-- Count annotation -->
      <text x="392" y="111" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.25">~300 worldwide</text>

      <!-- Fan-out arrows to Stratum 2 -->
      <line x1="80" y1="128" x2="62" y2="168" stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#str-arrow)" />
      <line x1="140" y1="128" x2="200" y2="168" stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#str-arrow)" />
      <line x1="260" y1="128" x2="200" y2="168" stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#str-arrow)" />
      <line x1="320" y1="128" x2="338" y2="168" stroke="var(--theme-foreground, #555)" stroke-width="0.75" marker-end="url(#str-arrow)" />
      <text x="200" y="155" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.4">NTP</text>

      <!-- Stratum 2: Three servers -->
      <rect x="10" y="172" width="110" height="40" rx="4"
        fill="rgba(6, 182, 212, 0.05)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="65" y="190" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">Stratum 2</text>
      <text x="65" y="204" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">time.apple.com</text>

      <rect x="130" y="172" width="140" height="40" rx="4"
        fill="rgba(6, 182, 212, 0.05)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="200" y="190" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">Stratum 2</text>
      <text x="200" y="204" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">pool.ntp.org</text>

      <rect x="280" y="172" width="110" height="40" rx="4"
        fill="rgba(6, 182, 212, 0.05)" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
      <text x="335" y="190" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">Stratum 2</text>
      <text x="335" y="204" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="6.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">time.google.com</text>

      <!-- Count annotation -->
      <text x="392" y="195" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="6"
        font-family="JetBrains Mono, monospace" opacity="0.25">~thousands</text>

      <!-- Multiple query arrows from laptop to stratum 2 (redundancy) -->
      <line x1="160" y1="278" x2="65" y2="216" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" stroke-dasharray="3,2" opacity="0.4" marker-end="url(#str-arrow-cyan)" />
      <line x1="190" y1="278" x2="200" y2="216" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" stroke-dasharray="3,2" opacity="0.4" marker-end="url(#str-arrow-cyan)" />
      <line x1="230" y1="278" x2="335" y2="216" stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" stroke-dasharray="3,2" opacity="0.4" marker-end="url(#str-arrow-cyan)" />

      <!-- Redundancy annotation -->
      <text x="310" y="258" text-anchor="start"
        fill="var(--theme-cyan, #06b6d4)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.45">queries multiple,</text>
      <text x="310" y="269" text-anchor="start"
        fill="var(--theme-cyan, #06b6d4)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.45">cross-checks</text>

      <!-- Your Laptop -->
      <rect x="105" y="282" width="190" height="48" rx="4"
        fill="rgba(255, 255, 255, 0.03)" stroke="var(--theme-separator, #444)" stroke-width="1" />
      <text x="200" y="303" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="10" font-weight="600"
        font-family="JetBrains Mono, monospace">Your Laptop</text>
      <text x="200" y="320" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7.5"
        font-family="JetBrains Mono, monospace" opacity="0.5">stratum 3 or 4</text>

      <!-- Scale indicator -->
      <text x="200" y="348" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="7"
        font-family="JetBrains Mono, monospace" opacity="0.25">each layer multiplies the number of available servers</text>
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

  .hierarchy-svg {
    width: 100%;
    max-width: 440px;
    height: auto;
  }
</style>
