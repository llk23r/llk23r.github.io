<figure class="trace-viz" role="img" aria-label="Architecture comparison: direct connection pooling vs PgBouncer proxy pooling">
  <svg viewBox="0 0 560 390" class="pool-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker id="pool-arr" viewBox="0 0 10 10" refX="10" refY="5"
        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-separator, #555)" />
      </marker>
      <marker id="pool-arr-g" viewBox="0 0 10 10" refX="10" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-green, #10b981)" />
      </marker>
    </defs>

    <!-- ==================== TOP PANEL ==================== -->

    <text x="20" y="22" fill="var(--theme-red, #ef4444)" font-size="10" font-weight="bold"
      letter-spacing="0.1em">WITHOUT PGBOUNCER</text>

    <!-- 5 App boxes: each 76x24, starting at y=34, spaced 28px apart -->
    <!-- Center of app column: x=58 -->
    {#each [0, 1, 2, 3, 4] as i}
      {@const by = 34 + i * 28}
      <rect x="20" y={by} width="76" height="24" rx="4"
        fill="rgba(255,255,255,0.04)"
        stroke="var(--theme-separator, #555)" stroke-width="1" />
      <text x="58" y={by + 16} text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="9">App {i + 1}</text>
      <text x="106" y={by + 16}
        fill="var(--theme-foreground, #666)" font-size="8">(20)</text>
      <!-- Line converging to PG box left edge (x=340) at vertical center (y=76) -->
      <line x1="130" y1={by + 12} x2="340" y2={76 + (i - 2) * 4}
        stroke="var(--theme-red, #ef4444)" stroke-width="1" opacity="0.3"
        marker-end="url(#pool-arr)" />
    {/each}

    <!-- PostgreSQL box: x=346, w=190, h=56, centered at y=76 -->
    <rect x="346" y="48" width="190" height="56" rx="6"
      fill="rgba(6, 182, 212, 0.04)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
    <text x="441" y="72" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="12" font-weight="bold">PostgreSQL</text>
    <text x="441" y="90" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8">max_connections = 100</text>

    <!-- Red badge below PG box -->
    <rect x="376" y="112" width="130" height="20" rx="10"
      fill="rgba(239, 68, 68, 0.1)"
      stroke="var(--theme-red, #ef4444)" stroke-width="0.8" opacity="0.6" />
    <text x="441" y="126" text-anchor="middle"
      fill="var(--theme-red, #ef4444)" font-size="9" font-weight="bold">100 connections</text>

    <text x="441" y="146" text-anchor="middle"
      fill="var(--theme-red, #ef4444)" font-size="8" opacity="0.5">No room to scale</text>

    <!-- ==================== DIVIDER ==================== -->
    <line x1="20" y1="178" x2="540" y2="178"
      stroke="var(--theme-separator, #444)" stroke-width="1" />

    <!-- ==================== BOTTOM PANEL ==================== -->

    <text x="20" y="200" fill="var(--theme-green, #10b981)" font-size="10" font-weight="bold"
      letter-spacing="0.1em">WITH PGBOUNCER</text>

    <!-- 5 App boxes: same layout as top panel, y starts at 212 -->
    {#each [0, 1, 2, 3, 4] as i}
      {@const by = 212 + i * 28}
      <rect x="20" y={by} width="76" height="24" rx="4"
        fill="rgba(255,255,255,0.04)"
        stroke="var(--theme-separator, #555)" stroke-width="1" />
      <text x="58" y={by + 16} text-anchor="middle"
        fill="var(--theme-foreground, #ccc)" font-size="9">App {i + 1}</text>
      <text x="106" y={by + 16}
        fill="var(--theme-foreground, #666)" font-size="8">(20)</text>
      <!-- Lines converge to PgBouncer left edge (x=220) at vertical center (y=254) -->
      <line x1="130" y1={by + 12} x2="220" y2={254 + (i - 2) * 5}
        stroke="var(--theme-separator, #666)" stroke-width="1" opacity="0.35"
        marker-end="url(#pool-arr)" />
    {/each}

    <!-- PgBouncer box: x=224, w=130, h=56, centered at y=254 -->
    <rect x="224" y="226" width="130" height="56" rx="6"
      fill="rgba(139, 92, 246, 0.04)"
      stroke="var(--theme-separator, #555)" stroke-width="1.2" />
    <rect x="224" y="230" width="4" height="48" rx="2"
      fill="var(--theme-accent, #8b5cf6)" />
    <text x="289" y="250" text-anchor="middle"
      fill="var(--theme-accent, #8b5cf6)" font-size="12" font-weight="bold">PgBouncer</text>
    <text x="289" y="268" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8">100 in, 20 out</text>

    <!-- 3 thick green output lines from PgBouncer right edge (x=354) to PG left edge (x=400) -->
    <line x1="354" y1="244" x2="400" y2="248"
      stroke="var(--theme-green, #10b981)" stroke-width="2.5"
      marker-end="url(#pool-arr-g)" />
    <line x1="354" y1="254" x2="400" y2="254"
      stroke="var(--theme-green, #10b981)" stroke-width="2.5"
      marker-end="url(#pool-arr-g)" />
    <line x1="354" y1="264" x2="400" y2="260"
      stroke="var(--theme-green, #10b981)" stroke-width="2.5"
      marker-end="url(#pool-arr-g)" />

    <rect x="406" y="226" width="130" height="56" rx="6"
      fill="rgba(6, 182, 212, 0.04)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
    <text x="471" y="250" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="12" font-weight="bold">PostgreSQL</text>
    <text x="471" y="268" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8">20 connections</text>

    <!-- Green badge below PG box -->
    <rect x="416" y="290" width="110" height="20" rx="10"
      fill="rgba(16, 185, 129, 0.1)"
      stroke="var(--theme-green, #10b981)" stroke-width="0.8" opacity="0.6" />
    <text x="471" y="304" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="9" font-weight="bold">20 connections</text>

    <!-- Savings callout centered -->
    <rect x="200" y="330" width="160" height="22" rx="6"
      fill="rgba(139, 92, 246, 0.06)"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="0.8" opacity="0.5" />
    <text x="280" y="345" text-anchor="middle"
      fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="600">5x fewer connections</text>

    <text x="280" y="370" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8" opacity="0.4">80% less server memory</text>
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
    max-width: 580px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
