<figure class="trace-viz" role="img" aria-label="Path from a button click event through JavaScript to fetch() and the browser networking layer">
  <svg viewBox="0 0 520 140" class="click-fetch-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker id="ctf-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
        <path d="M0,0 L7,2.5 L0,5" fill="var(--theme-separator, #666)" />
      </marker>
    </defs>

    <!-- Step 1: Click Event -->
    <rect x="8" y="28" width="86" height="52" rx="6"
      fill="rgba(245, 158, 11, 0.08)"
      stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.5" />
    <text x="51" y="50" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="10" font-weight="bold">Click</text>
    <text x="51" y="66" text-anchor="middle"
      fill="var(--theme-yellow, #f59e0b)" font-size="10" font-weight="bold">Event</text>

    <!-- Arrow 1→2 -->
    <line x1="96" y1="54" x2="112" y2="54"
      stroke="var(--theme-separator, #666)" stroke-width="1.2"
      stroke-dasharray="4,3" marker-end="url(#ctf-arrow)" />

    <!-- Step 2: Event Listener -->
    <rect x="116" y="28" width="86" height="52" rx="6"
      fill="rgba(255,255,255,0.03)"
      stroke="var(--theme-separator, #555)" stroke-width="1.2" />
    <text x="159" y="50" text-anchor="middle"
      fill="var(--theme-foreground, #ccc)" font-size="10" font-weight="600">Event</text>
    <text x="159" y="66" text-anchor="middle"
      fill="var(--theme-foreground, #ccc)" font-size="10" font-weight="600">Listener</text>

    <!-- Arrow 2→3 -->
    <line x1="204" y1="54" x2="220" y2="54"
      stroke="var(--theme-separator, #666)" stroke-width="1.2"
      stroke-dasharray="4,3" marker-end="url(#ctf-arrow)" />

    <!-- Step 3: JavaScript (event loop) -->
    <rect x="224" y="28" width="72" height="52" rx="6"
      fill="rgba(139, 92, 246, 0.08)"
      stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.5" />
    <text x="260" y="50" text-anchor="middle"
      fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="bold">Event</text>
    <text x="260" y="66" text-anchor="middle"
      fill="var(--theme-accent, #8b5cf6)" font-size="9" font-weight="bold">Loop</text>

    <!-- Arrow 3→4 -->
    <line x1="298" y1="54" x2="314" y2="54"
      stroke="var(--theme-separator, #666)" stroke-width="1.2"
      stroke-dasharray="4,3" marker-end="url(#ctf-arrow)" />

    <!-- Step 4: fetch() — highlighted, larger -->
    <rect x="318" y="20" width="106" height="68" rx="8"
      fill="rgba(6, 182, 212, 0.10)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="2" />
    <text x="371" y="48" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="13" font-weight="bold">fetch()</text>
    <text x="371" y="66" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="8" opacity="0.7">/api/users/42</text>

    <!-- Arrow 4→5 -->
    <line x1="426" y1="54" x2="442" y2="54"
      stroke="var(--theme-separator, #666)" stroke-width="1.2"
      stroke-dasharray="4,3" marker-end="url(#ctf-arrow)" />

    <!-- Step 5: Browser Networking -->
    <rect x="446" y="28" width="66" height="52" rx="6"
      fill="rgba(16, 185, 129, 0.08)"
      stroke="var(--theme-green, #10b981)" stroke-width="1.5" />
    <text x="479" y="50" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8" font-weight="bold">Browser</text>
    <text x="479" y="63" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="8" font-weight="bold">Network</text>

    <!-- Depth labels -->
    <text x="159" y="102" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="7" opacity="0.4"
      letter-spacing="0.15em">USER SPACE</text>
    <line x1="260" y1="96" x2="260" y2="106"
      stroke="var(--theme-separator, #444)" stroke-width="0.5" />
    <text x="400" y="102" text-anchor="middle"
      fill="var(--theme-foreground, #888)" font-size="7" opacity="0.4"
      letter-spacing="0.15em">BROWSER INTERNALS</text>

    <!-- Decorative: subtle gradient line below steps -->
    <line x1="8" y1="115" x2="512" y2="115"
      stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.3" />
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
  .click-fetch-svg {
    width: 100%;
    max-width: 520px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
