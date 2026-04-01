<figure class="trace-viz" role="img" aria-label="Browser connects to Load Balancer via TLS, which forwards to one of three backend instances over plain HTTP">
  <svg viewBox="0 0 540 180" class="lb-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker
        id="lb-arrow-green"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-green, #10b981)" />
      </marker>
      <marker
        id="lb-arrow-yellow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-yellow, #f59e0b)" />
      </marker>
    </defs>

    <!-- ===== Browser box ===== -->
    <g>
      <rect x="20" y="50" width="90" height="40" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="20" y="50" width="4" height="40" rx="2"
        fill="var(--theme-cyan, #06b6d4)" />
      <text x="65" y="74" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="10" font-weight="600">Browser</text>
    </g>

    <!-- ===== Connection 1: Browser → LB (solid green) ===== -->
    <line x1="110" y1="70" x2="185" y2="70"
      stroke="var(--theme-green, #10b981)" stroke-width="1.2"
      marker-end="url(#lb-arrow-green)" />
    <text x="148" y="62" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="7">TLS + HTTP/2</text>

    <!-- ===== Load Balancer box ===== -->
    <g>
      <rect x="190" y="38" width="130" height="64" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="190" y="38" width="4" height="64" rx="2"
        fill="var(--theme-accent, #8b5cf6)" />
      <text x="255" y="66" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="600">Load</text>
      <text x="255" y="80" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="600">Balancer</text>
    </g>

    <!-- ===== Annotation below LB ===== -->
    <text x="255" y="116" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="7" opacity="0.8">L7: inspects HTTP, terminates TLS</text>

    <!-- ===== Connection 2: LB → Backend (dashed yellow) ===== -->
    <!-- Line to Backend 2 (the chosen one) -->
    <line x1="320" y1="70" x2="390" y2="70"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.2"
      stroke-dasharray="4 3"
      marker-end="url(#lb-arrow-yellow)" />
    <!-- Faint lines to Backend 1 and 3 -->
    <line x1="320" y1="65" x2="390" y2="32"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="0.5"
      stroke-dasharray="3 4" opacity="0.25" />
    <line x1="320" y1="75" x2="390" y2="108"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="0.5"
      stroke-dasharray="3 4" opacity="0.25" />

    <text x="356" y="60" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="6.5">plain HTTP</text>
    <text x="356" y="130" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="6.5">(TLS terminated)</text>

    <!-- ===== Backend 1 ===== -->
    <g>
      <rect x="395" y="16" width="90" height="28" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <text x="440" y="34" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8">Backend 1</text>
      <!-- Health check dot -->
      <circle cx="496" cy="30" r="3" fill="var(--theme-green, #10b981)" opacity="0.8" />
    </g>

    <!-- ===== Backend 2 (chosen) ===== -->
    <g>
      <rect x="395" y="56" width="90" height="28" rx="4"
        fill="rgba(139,92,246,0.08)"
        stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" />
      <text x="440" y="74" text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="8" font-weight="600">Backend 2</text>
      <!-- Health check dot -->
      <circle cx="496" cy="70" r="3" fill="var(--theme-green, #10b981)" opacity="0.8" />
      <!-- "chosen" indicator -->
      <text x="440" y="96" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="6.5" opacity="0.7">&#9650; chosen</text>
    </g>

    <!-- ===== Backend 3 ===== -->
    <g>
      <rect x="395" y="96" width="90" height="28" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <text x="440" y="114" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8">Backend 3</text>
      <!-- Health check dot -->
      <circle cx="496" cy="110" r="3" fill="var(--theme-green, #10b981)" opacity="0.8" />
    </g>

    <!-- ===== Legend: connection types ===== -->
    <line x1="30" y1="156" x2="55" y2="156"
      stroke="var(--theme-green, #10b981)" stroke-width="1.2" />
    <text x="60" y="159"
      fill="var(--theme-foreground, #888)" font-size="7">Client → LB (encrypted)</text>

    <line x1="230" y1="156" x2="255" y2="156"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.2"
      stroke-dasharray="4 3" />
    <text x="260" y="159"
      fill="var(--theme-foreground, #888)" font-size="7">LB → Backend (plain)</text>

    <circle cx="430" cy="156" r="3" fill="var(--theme-green, #10b981)" opacity="0.8" />
    <text x="438" y="159"
      fill="var(--theme-foreground, #888)" font-size="7">healthy</text>
  </svg>
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
  .lb-svg {
    width: 100%;
    max-width: 540px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
