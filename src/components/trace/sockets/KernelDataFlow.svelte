<figure class="trace-viz" role="img" aria-label="Data flow from application write() call through kernel socket buffer, TCP segmentation, IP layer, NIC driver, and onto the wire">
  <svg viewBox="0 0 480 360" class="flow-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker
        id="kdf-arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-separator, #555)" />
      </marker>
    </defs>

    <!-- Layer 1: Application -->
    <g>
      <!-- Background gets slightly darker per layer -->
      <rect x="50" y="12" width="380" height="42" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <!-- Colored left border -->
      <rect x="50" y="12" width="4" height="42" rx="2"
        fill="var(--theme-cyan, #06b6d4)" />
      <text x="68" y="37" fill="var(--theme-cyan, #06b6d4)"
        font-size="11" font-weight="600">Application</text>
      <text x="420" y="37" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="9">write(fd=7, buf, len)</text>
    </g>

    <!-- Arrow 1→2 -->
    <line x1="240" y1="54" x2="240" y2="68"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#kdf-arrow)" />

    <!-- Layer 2: Send Buffer -->
    <g>
      <rect x="50" y="70" width="380" height="42" rx="5"
        fill="rgba(255,255,255,0.035)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="50" y="70" width="4" height="42" rx="2"
        fill="var(--theme-green, #10b981)" />
      <text x="68" y="95" fill="var(--theme-green, #10b981)"
        font-size="11" font-weight="600">Send Buffer</text>
      <!-- 3 tiny sk_buff squares linked by arrows -->
      <g transform="translate(270, 83)">
        <rect x="0" y="0" width="16" height="14" rx="2"
          fill="rgba(16,185,129,0.15)"
          stroke="var(--theme-green, #10b981)" stroke-width="0.8" />
        <text x="8" y="10" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="6.5">skb</text>
        <text x="21" y="10" fill="var(--theme-foreground, #888)" font-size="8">→</text>
        <rect x="30" y="0" width="16" height="14" rx="2"
          fill="rgba(16,185,129,0.15)"
          stroke="var(--theme-green, #10b981)" stroke-width="0.8" />
        <text x="38" y="10" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="6.5">skb</text>
        <text x="51" y="10" fill="var(--theme-foreground, #888)" font-size="8">→</text>
        <rect x="60" y="0" width="16" height="14" rx="2"
          fill="rgba(16,185,129,0.15)"
          stroke="var(--theme-green, #10b981)" stroke-width="0.8" />
        <text x="68" y="10" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="6.5">skb</text>
      </g>
    </g>

    <!-- Arrow 2→3 -->
    <line x1="240" y1="112" x2="240" y2="126"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#kdf-arrow)" />

    <!-- Layer 3: TCP -->
    <g>
      <rect x="50" y="128" width="380" height="42" rx="5"
        fill="rgba(255,255,255,0.04)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="50" y="128" width="4" height="42" rx="2"
        fill="var(--theme-accent, #8b5cf6)" />
      <text x="68" y="153" fill="var(--theme-accent, #8b5cf6)"
        font-size="11" font-weight="600">TCP</text>
      <text x="420" y="153" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="9">segment into ≤1,460 byte chunks</text>
    </g>

    <!-- Arrow 3→4 -->
    <line x1="240" y1="170" x2="240" y2="184"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#kdf-arrow)" />

    <!-- Layer 4: IP -->
    <g>
      <rect x="50" y="186" width="380" height="42" rx="5"
        fill="rgba(255,255,255,0.045)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="50" y="186" width="4" height="42" rx="2"
        fill="var(--theme-yellow, #f59e0b)" />
      <text x="68" y="211" fill="var(--theme-yellow, #f59e0b)"
        font-size="11" font-weight="600">IP</text>
      <text x="420" y="211" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="9">add header, routing decision</text>
    </g>

    <!-- Arrow 4→5 -->
    <line x1="240" y1="228" x2="240" y2="242"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#kdf-arrow)" />

    <!-- Layer 5: NIC -->
    <g>
      <rect x="50" y="244" width="380" height="42" rx="5"
        fill="rgba(255,255,255,0.05)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="50" y="244" width="4" height="42" rx="2"
        fill="var(--theme-caution, #f97316)" />
      <text x="68" y="269" fill="var(--theme-caution, #f97316)"
        font-size="11" font-weight="600">NIC</text>
      <text x="420" y="269" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="9">driver, ring buffer, DMA</text>
    </g>

    <!-- Arrow 5→6 -->
    <line x1="240" y1="286" x2="240" y2="300"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#kdf-arrow)" />

    <!-- Layer 6: Wire -->
    <g>
      <rect x="50" y="302" width="380" height="42" rx="5"
        fill="rgba(255,255,255,0.055)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="50" y="302" width="4" height="42" rx="2"
        fill="var(--theme-red, #ef4444)" />
      <text x="68" y="327" fill="var(--theme-red, #ef4444)"
        font-size="11" font-weight="600">Wire</text>
      <text x="420" y="327" text-anchor="end"
        fill="var(--theme-foreground, #888)" font-size="9">electrical signals / light pulses</text>
    </g>
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
  .flow-svg {
    width: 100%;
    max-width: 480px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
