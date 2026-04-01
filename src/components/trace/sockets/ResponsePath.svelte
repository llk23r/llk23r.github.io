<figure class="trace-viz" role="img" aria-label="Response path: PostgreSQL sends data back through Backend, Load Balancer, and finally to Browser over the same connections">
  <svg viewBox="0 0 560 160" class="resp-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker id="resp-arr" viewBox="0 0 10 10" refX="0" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 10 0 L 0 5 L 10 10 z" fill="var(--theme-green, #10b981)" />
      </marker>
    </defs>

    <!-- All 4 boxes: same size (96 x 50), evenly spaced, y=24 -->
    <!-- Centers: 70, 210, 350, 490 -->

    <!-- Box 1: Browser (destination) -->
    <rect x="22" y="24" width="96" height="50" rx="6"
      fill="rgba(16, 185, 129, 0.06)"
      stroke="var(--theme-green, #10b981)" stroke-width="1.5" />
    <text x="70" y="46" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="11" font-weight="bold">Browser</text>
    <text x="70" y="62" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8">fetch() resolves</text>

    <!-- Arrow: LB → Browser -->
    <line x1="122" y1="49" x2="158" y2="49"
      stroke="var(--theme-green, #10b981)" stroke-width="1.8"
      marker-start="url(#resp-arr)" />
    <text x="140" y="40"
      fill="var(--theme-green, #10b981)" font-size="8" text-anchor="middle" font-weight="600">TLS</text>

    <!-- Box 2: Load Balancer -->
    <rect x="162" y="24" width="96" height="50" rx="6"
      fill="rgba(245, 158, 11, 0.05)"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.2" />
    <text x="210" y="46" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="10" font-weight="bold">Load Balancer</text>
    <text x="210" y="62" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8">re-encrypts</text>

    <!-- Arrow: Backend → LB -->
    <line x1="262" y1="49" x2="298" y2="49"
      stroke="var(--theme-green, #10b981)" stroke-width="1.8"
      marker-start="url(#resp-arr)" />
    <text x="280" y="40"
      fill="var(--theme-green, #10b981)" font-size="8" text-anchor="middle" font-weight="600">HTTP</text>

    <!-- Box 3: Backend -->
    <rect x="302" y="24" width="96" height="50" rx="6"
      fill="rgba(139, 92, 246, 0.05)"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.2" />
    <text x="350" y="46" text-anchor="middle"
      fill="var(--theme-accent, #8b5cf6)" font-size="11" font-weight="bold">Backend</text>
    <text x="350" y="62" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8">JSON serialize</text>

    <!-- Arrow: PG → Backend -->
    <line x1="402" y1="49" x2="438" y2="49"
      stroke="var(--theme-green, #10b981)" stroke-width="1.8"
      marker-start="url(#resp-arr)" />
    <text x="420" y="40"
      fill="var(--theme-green, #10b981)" font-size="8" text-anchor="middle" font-weight="600">PG wire</text>

    <!-- Box 4: PostgreSQL (origin) -->
    <rect x="442" y="24" width="96" height="50" rx="6"
      fill="rgba(6, 182, 212, 0.06)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
    <text x="490" y="46" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="11" font-weight="bold">PostgreSQL</text>
    <text x="490" y="62" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8">result rows</text>

    <!-- Direction indicator: subtle leftward chevrons below arrows -->
    <text x="140" y="64" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="9" opacity="0.4">&#9664;</text>
    <text x="280" y="64" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="9" opacity="0.4">&#9664;</text>
    <text x="420" y="64" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="9" opacity="0.4">&#9664;</text>

    <!-- Bottom: connection reuse callouts, evenly spaced -->
    <line x1="22" y1="92" x2="538" y2="92"
      stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.25" />

    <rect x="40" y="102" width="220" height="20" rx="4"
      fill="rgba(16, 185, 129, 0.05)"
      stroke="var(--theme-green, #10b981)" stroke-width="0.6" opacity="0.4" />
    <text x="150" y="116" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8" opacity="0.7">Same TCP+TLS connection from Q4–Q5</text>

    <rect x="300" y="102" width="220" height="20" rx="4"
      fill="rgba(6, 182, 212, 0.05)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="0.6" opacity="0.4" />
    <text x="410" y="116" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="8" opacity="0.7">Same pooled DB connection from Q9</text>

    <text x="280" y="146" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="8" opacity="0.5">Full-duplex: same sockets, same 4-tuples, reverse direction.</text>
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
  .resp-svg {
    width: 100%;
    max-width: 560px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
