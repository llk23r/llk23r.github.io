<figure class="trace-viz" role="img" aria-label="Nested protocol layers of an HTTP request showing IP packet containing TCP segment containing TLS record containing HTTP/2 frame">
  <svg viewBox="0 0 480 200" class="request-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker id="hr-bracket-top" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
        <path d="M0,6 L3,0 L6,6" fill="none" stroke="var(--theme-foreground, #888)" stroke-width="0.8" />
      </marker>
    </defs>

    <!-- ═══════ LAYER 1: IP Packet (outermost) ═══════ -->
    <rect x="8" y="8" width="400" height="184" rx="7"
      fill="rgba(245, 158, 11, 0.04)"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5" />
    <text x="16" y="24"
      fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="bold">IP Packet</text>

    <!-- ═══════ LAYER 2: TCP Segment ═══════ -->
    <rect x="26" y="34" width="370" height="150" rx="6"
      fill="rgba(139, 92, 246, 0.04)"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.5" />
    <text x="34" y="50"
      fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="bold">TCP Segment</text>

    <!-- ═══════ LAYER 3: TLS Record ═══════ -->
    <rect x="44" y="58" width="340" height="118" rx="5"
      fill="rgba(239, 68, 68, 0.04)"
      stroke="var(--theme-red, #ef4444)" stroke-width="1.5" />
    <text x="52" y="74"
      fill="var(--theme-red, #ef4444)" font-size="9" font-weight="bold">TLS Record</text>

    <!-- ═══════ LAYER 4: HTTP/2 Frame (innermost, highlighted) ═══════ -->
    <rect x="62" y="82" width="310" height="86" rx="5"
      fill="rgba(6, 182, 212, 0.08)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="2" />
    <text x="70" y="98"
      fill="var(--theme-cyan, #06b6d4)" font-size="9" font-weight="bold">HTTP/2 Frame</text>

    <!-- HTTP content inside innermost box -->
    <text x="78" y="118"
      fill="var(--theme-green, #10b981)" font-size="10" font-weight="bold">GET /api/users/42</text>
    <line x1="78" y1="124" x2="310" y2="124"
      stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.3" />
    <text x="78" y="138"
      fill="var(--theme-foreground, #888)" font-size="8" opacity="0.7">Host: api.example.com</text>
    <text x="78" y="152"
      fill="var(--theme-foreground, #888)" font-size="8" opacity="0.7">Accept: application/json</text>
    <text x="78" y="162"
      fill="var(--theme-foreground, #888)" font-size="8" opacity="0.5">:method GET  :path /api/users/42</text>

    <!-- ═══════ RIGHT SIDE: encryption bracket ═══════ -->

    <!-- Bracket line spanning TLS + HTTP/2 layers -->
    <line x1="420" y1="62" x2="420" y2="172"
      stroke="var(--theme-red, #ef4444)" stroke-width="1" opacity="0.7" />
    <!-- Top cap -->
    <line x1="414" y1="62" x2="420" y2="62"
      stroke="var(--theme-red, #ef4444)" stroke-width="1" opacity="0.7" />
    <!-- Bottom cap -->
    <line x1="414" y1="172" x2="420" y2="172"
      stroke="var(--theme-red, #ef4444)" stroke-width="1" opacity="0.7" />

    <!-- "encrypted" label rotated -->
    <text x="434" y="124" text-anchor="middle"
      fill="var(--theme-red, #ef4444)" font-size="8" font-weight="bold"
      transform="rotate(90, 434, 117)">encrypted</text>

    <!-- Bracket line spanning TCP + TLS + HTTP/2 -->
    <line x1="454" y1="38" x2="454" y2="180"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" opacity="0.5" />
    <!-- Top cap -->
    <line x1="448" y1="38" x2="454" y2="38"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" opacity="0.5" />
    <!-- Bottom cap -->
    <line x1="448" y1="180" x2="454" y2="180"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" opacity="0.5" />

    <!-- "reliable" label rotated -->
    <text x="468" y="116" text-anchor="middle"
      fill="var(--theme-accent, #8b5cf6)" font-size="8" opacity="0.6"
      transform="rotate(90, 468, 109)">reliable + ordered</text>
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
  .request-svg {
    width: 100%;
    max-width: 480px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
