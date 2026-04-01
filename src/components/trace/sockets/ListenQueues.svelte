<figure class="trace-viz" role="img" aria-label="TCP listening socket internal queue architecture showing SYN queue for half-open connections flowing into Accept queue for established connections, then to application via accept()">
  <svg viewBox="0 0 480 320" class="queues-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker
        id="lq-arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-separator, #555)" />
      </marker>
      <marker
        id="lq-arrow-cyan"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-cyan, #06b6d4)" />
      </marker>
    </defs>

    <!-- Outer container -->
    <rect x="80" y="10" width="380" height="300" rx="8"
      fill="rgba(255,255,255,0.02)"
      stroke="var(--theme-separator, #444)" stroke-width="1.5" />

    <!-- Header: Listening Socket (port 5432) -->
    <text x="270" y="35" text-anchor="middle"
      fill="var(--theme-foreground, #ccc)" font-size="13" font-weight="bold">Listening Socket (port 5432)</text>

    <!-- State badge: TCP_LISTEN -->
    <rect x="218" y="42" width="104" height="20" rx="10"
      fill="var(--theme-accent, #8b5cf6)" />
    <text x="270" y="56" text-anchor="middle"
      fill="#fff" font-size="10" font-weight="bold">TCP_LISTEN</text>

    <!-- ═══ SYN Queue Section ═══ -->
    <text x="105" y="88"
      fill="var(--theme-yellow, #f59e0b)" font-size="11" font-weight="bold">SYN Queue (half-open)</text>

    <!-- SYN queue box 1 -->
    <rect x="108" y="95" width="70" height="30" rx="5"
      fill="rgba(245, 158, 11, 0.08)"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
    <text x="143" y="114" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="8.5">req_sock</text>

    <!-- SYN queue box 2 -->
    <rect x="188" y="95" width="70" height="30" rx="5"
      fill="rgba(245, 158, 11, 0.08)"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
    <text x="223" y="114" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="8.5">req_sock</text>

    <!-- SYN queue box 3 -->
    <rect x="268" y="95" width="70" height="30" rx="5"
      fill="rgba(245, 158, 11, 0.08)"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
    <text x="303" y="114" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="8.5">req_sock</text>

    <!-- Arrow: SYN queue → Accept queue -->
    <line x1="230" y1="130" x2="230" y2="160"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#lq-arrow)" />
    <text x="265" y="150"
      fill="var(--theme-foreground, #888)" font-size="9">ACK received</text>

    <!-- ═══ Accept Queue Section ═══ -->
    <text x="105" y="180"
      fill="var(--theme-green, #10b981)" font-size="11" font-weight="bold">Accept Queue (established)</text>

    <!-- Accept queue box 1 -->
    <rect x="108" y="188" width="70" height="30" rx="5"
      fill="rgba(16, 185, 129, 0.08)"
      stroke="var(--theme-green, #10b981)" stroke-width="1" />
    <text x="143" y="207" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8.5">tcp_sock</text>

    <!-- Accept queue box 2 -->
    <rect x="188" y="188" width="70" height="30" rx="5"
      fill="rgba(16, 185, 129, 0.08)"
      stroke="var(--theme-green, #10b981)" stroke-width="1" />
    <text x="223" y="207" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8.5">tcp_sock</text>

    <!-- Arrow: Accept queue → accept() -->
    <line x1="230" y1="223" x2="230" y2="253"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#lq-arrow)" />
    <text x="252" y="243"
      fill="var(--theme-foreground, #888)" font-size="9">accept()</text>

    <!-- Bottom: New fd → application -->
    <text x="270" y="275" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="12" font-weight="bold">New fd → application</text>

    <!-- ═══ Left side: "SYN arrives" arrow ═══ -->
    <line x1="10" y1="110" x2="100" y2="110"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.3"
      stroke-dasharray="4 3" marker-end="url(#lq-arrow-cyan)" />
    <text x="12" y="102"
      fill="var(--theme-cyan, #06b6d4)" font-size="9" font-weight="bold">SYN arrives</text>
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
  .queues-svg {
    width: 100%;
    max-width: 480px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
