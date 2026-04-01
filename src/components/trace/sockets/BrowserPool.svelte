<figure class="trace-viz" role="img" aria-label="Browser connection pool showing HTTP/1.1 six connections per origin versus HTTP/2 multiplexed streams on a single connection">
  <svg viewBox="0 0 520 160" class="pool-svg" font-family="JetBrains Mono, monospace">

    <!-- ═══════ HTTP/1.1 SECTION ═══════ -->
    <text x="10" y="14" fill="var(--theme-foreground, #888)" font-size="10" font-weight="bold">HTTP/1.1 — 6 connections per origin</text>

    <!-- conn 1 (idle / green) -->
    <rect x="10" y="22" width="76" height="36" rx="5"
      fill="rgba(16, 185, 129, 0.08)"
      stroke="var(--theme-green, #10b981)" stroke-width="1.2" />
    <text x="48" y="37" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8" font-weight="bold">idle</text>
    <text x="48" y="51" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="7" opacity="0.6">conn 1</text>

    <!-- conn 2 (idle / green) -->
    <rect x="94" y="22" width="76" height="36" rx="5"
      fill="rgba(16, 185, 129, 0.08)"
      stroke="var(--theme-green, #10b981)" stroke-width="1.2" />
    <text x="132" y="37" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8" font-weight="bold">idle</text>
    <text x="132" y="51" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="7" opacity="0.6">conn 2</text>

    <!-- conn 3 (active / cyan) -->
    <rect x="178" y="22" width="76" height="36" rx="5"
      fill="rgba(6, 182, 212, 0.1)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
    <text x="216" y="37" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="8" font-weight="bold">active</text>
    <text x="216" y="51" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="7" opacity="0.6">conn 3</text>

    <!-- conn 4 (empty / dashed) -->
    <rect x="262" y="22" width="76" height="36" rx="5"
      fill="none"
      stroke="var(--theme-separator, #444)" stroke-width="1" stroke-dasharray="4,3" />
    <text x="300" y="44" text-anchor="middle"
      fill="var(--theme-separator, #444)" font-size="7">conn 4</text>

    <!-- conn 5 (empty / dashed) -->
    <rect x="346" y="22" width="76" height="36" rx="5"
      fill="none"
      stroke="var(--theme-separator, #444)" stroke-width="1" stroke-dasharray="4,3" />
    <text x="384" y="44" text-anchor="middle"
      fill="var(--theme-separator, #444)" font-size="7">conn 5</text>

    <!-- conn 6 (empty / dashed) -->
    <rect x="430" y="22" width="76" height="36" rx="5"
      fill="none"
      stroke="var(--theme-separator, #444)" stroke-width="1" stroke-dasharray="4,3" />
    <text x="468" y="44" text-anchor="middle"
      fill="var(--theme-separator, #444)" font-size="7">conn 6</text>

    <!-- Divider -->
    <line x1="10" y1="72" x2="510" y2="72"
      stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.3" />

    <!-- ═══════ HTTP/2 SECTION ═══════ -->
    <text x="10" y="88" fill="var(--theme-foreground, #888)" font-size="10" font-weight="bold">HTTP/2 — 1 multiplexed connection</text>

    <!-- Single large connection rect -->
    <rect x="10" y="96" width="496" height="44" rx="6"
      fill="rgba(255,255,255,0.02)"
      stroke="var(--theme-foreground, #ccc)" stroke-width="1.2" />

    <!-- Stream 1 (cyan) -->
    <rect x="22" y="106" width="104" height="16" rx="3"
      fill="rgba(6, 182, 212, 0.15)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="1" />
    <text x="74" y="117" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="8">stream 1</text>

    <!-- Stream 3 (yellow) -->
    <rect x="136" y="106" width="104" height="16" rx="3"
      fill="rgba(245, 158, 11, 0.12)"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" />
    <text x="188" y="117" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="8">stream 3</text>

    <!-- Stream 5 (green) -->
    <rect x="250" y="106" width="104" height="16" rx="3"
      fill="rgba(16, 185, 129, 0.1)"
      stroke="var(--theme-green, #10b981)" stroke-width="1" />
    <text x="302" y="117" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8">stream 5</text>

    <!-- Stream 7 (accent) -->
    <rect x="364" y="106" width="104" height="16" rx="3"
      fill="rgba(139, 92, 246, 0.1)"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="1" />
    <text x="416" y="117" text-anchor="middle"
      fill="var(--theme-accent, #8b5cf6)" font-size="8">stream 7</text>

    <!-- Annotation -->
    <text x="260" y="150" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8" opacity="0.5">streams multiplexed on single connection</text>
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
  .pool-svg {
    width: 100%;
    max-width: 520px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
