<figure class="trace-viz" role="img" aria-label="Comparison of TCP keepalive, HTTP keep-alive, connection pooling, and HTTP/2 multiplexing">
  <svg viewBox="0 0 520 200" class="comparison-svg">
    <defs>
      <marker id="ka-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--theme-separator, #555)" />
      </marker>
    </defs>

    <!-- Row backgrounds -->
    <rect x="10" y="12" width="500" height="38" rx="4" fill="rgba(239,68,68,0.06)" />
    <rect x="10" y="58" width="500" height="38" rx="4" fill="rgba(245,158,11,0.06)" />
    <rect x="10" y="104" width="500" height="38" rx="4" fill="rgba(139,92,246,0.06)" />
    <rect x="10" y="150" width="500" height="38" rx="4" fill="rgba(16,185,129,0.06)" />

    <!-- Row 1: TCP keepalive -->
    <text x="24" y="36" fill="var(--theme-red, #ef4444)" font-size="10" font-weight="600"
      font-family="JetBrains Mono, monospace">TCP keepalive</text>
    <text x="170" y="36" fill="var(--theme-foreground, #ccc)" font-size="9.5"
      font-family="JetBrains Mono, monospace">"Is the peer still alive?"</text>
    <text x="390" y="36" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace" opacity="0.6">kernel probes</text>

    <!-- Row 2: HTTP keep-alive -->
    <text x="24" y="82" fill="var(--theme-yellow, #f59e0b)" font-size="10" font-weight="600"
      font-family="JetBrains Mono, monospace">HTTP keep-alive</text>
    <text x="170" y="82" fill="var(--theme-foreground, #ccc)" font-size="9.5"
      font-family="JetBrains Mono, monospace">"Reuse this TCP connection"</text>
    <text x="390" y="82" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace" opacity="0.6">serial requests</text>

    <!-- Row 3: Connection pool -->
    <text x="24" y="128" fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="600"
      font-family="JetBrains Mono, monospace">Connection pool</text>
    <text x="170" y="128" fill="var(--theme-foreground, #ccc)" font-size="9.5"
      font-family="JetBrains Mono, monospace">"Manage N keep-alive connections"</text>
    <text x="390" y="128" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace" opacity="0.6">concurrent requests</text>

    <!-- Row 4: HTTP/2 multiplex -->
    <text x="24" y="174" fill="var(--theme-green, #10b981)" font-size="10" font-weight="600"
      font-family="JetBrains Mono, monospace">HTTP/2 multiplex</text>
    <text x="170" y="174" fill="var(--theme-foreground, #ccc)" font-size="9.5"
      font-family="JetBrains Mono, monospace">"Interleave streams on 1 conn"</text>
    <text x="390" y="174" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace" opacity="0.6">concurrent on one</text>

    <!-- Layer depth indicator (right side, subtle arrow going deeper) -->
    <line x1="505" y1="30" x2="505" y2="170" stroke="var(--theme-separator, #444)" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#ka-arrow)" />
    <text x="498" y="10" fill="var(--theme-foreground, #888)" font-size="7" text-anchor="end"
      font-family="JetBrains Mono, monospace" opacity="0.4">KERNEL</text>
    <text x="498" y="194" fill="var(--theme-foreground, #888)" font-size="7" text-anchor="end"
      font-family="JetBrains Mono, monospace" opacity="0.4">APP</text>
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
  .comparison-svg {
    width: 100%;
    max-width: 520px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
