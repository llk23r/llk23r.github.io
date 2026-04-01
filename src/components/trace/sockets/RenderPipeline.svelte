<figure class="trace-viz" role="img" aria-label="Browser rendering pipeline: DOM Mutation, Style Calculation, Layout, Paint, Composite, Display">
  <svg viewBox="0 0 560 150" class="rp-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker id="rp-arrow" viewBox="0 0 10 10" refX="10" refY="5"
        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-separator, #555)" />
      </marker>
    </defs>

    <!-- ===== Stage 1: DOM Mutation ===== -->
    <g>
      <rect x="6" y="18" width="78" height="48" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="6" y="18" width="4" height="48" rx="2"
        fill="var(--theme-red, #ef4444)" />
      <text x="49" y="38" text-anchor="middle"
        fill="var(--theme-red, #ef4444)" font-size="9" font-weight="600">DOM</text>
      <text x="49" y="52" text-anchor="middle"
        fill="var(--theme-red, #ef4444)" font-size="9" font-weight="600">Mutation</text>
    </g>

    <!-- Arrow 1→2 -->
    <line x1="86" y1="42" x2="96" y2="42"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="3 2" marker-end="url(#rp-arrow)" />

    <!-- ===== Stage 2: Style Calc ===== -->
    <g>
      <rect x="100" y="18" width="78" height="48" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="100" y="18" width="4" height="48" rx="2"
        fill="var(--theme-yellow, #f59e0b)" />
      <text x="143" y="38" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600">Style</text>
      <text x="143" y="52" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600">Calc</text>
    </g>

    <!-- Arrow 2→3 -->
    <line x1="180" y1="42" x2="190" y2="42"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="3 2" marker-end="url(#rp-arrow)" />

    <!-- ===== Stage 3: Layout ===== -->
    <g>
      <rect x="194" y="18" width="78" height="48" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="194" y="18" width="4" height="48" rx="2"
        fill="var(--theme-accent, #8b5cf6)" />
      <text x="237" y="46" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="600">Layout</text>
    </g>

    <!-- Arrow 3→4 -->
    <line x1="274" y1="42" x2="284" y2="42"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="3 2" marker-end="url(#rp-arrow)" />

    <!-- ===== Stage 4: Paint ===== -->
    <g>
      <rect x="288" y="18" width="78" height="48" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="288" y="18" width="4" height="48" rx="2"
        fill="var(--theme-cyan, #06b6d4)" />
      <text x="331" y="46" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="10" font-weight="600">Paint</text>
    </g>

    <!-- Arrow 4→5 -->
    <line x1="368" y1="42" x2="378" y2="42"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="3 2" marker-end="url(#rp-arrow)" />

    <!-- ===== Stage 5: Composite ===== -->
    <g>
      <rect x="382" y="18" width="78" height="48" rx="5"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #333)" stroke-width="0.75" />
      <rect x="382" y="18" width="4" height="48" rx="2"
        fill="var(--theme-green, #10b981)" />
      <text x="425" y="38" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="9" font-weight="600">Compo-</text>
      <text x="425" y="52" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="9" font-weight="600">site</text>
    </g>

    <!-- Arrow 5→6 -->
    <line x1="462" y1="42" x2="472" y2="42"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="3 2" marker-end="url(#rp-arrow)" />

    <!-- ===== Stage 6: Display ===== -->
    <g>
      <rect x="476" y="18" width="78" height="48" rx="5"
        fill="rgba(245, 158, 11, 0.06)"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="1.2" />
      <rect x="476" y="18" width="4" height="48" rx="2"
        fill="var(--theme-yellow, #f59e0b)" />
      <text x="519" y="46" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="10" font-weight="600">Display</text>
    </g>

    <!-- ===== Bottom annotations ===== -->
    <!-- Left: trigger -->
    <rect x="6" y="82" width="120" height="24" rx="4"
      fill="rgba(239, 68, 68, 0.06)"
      stroke="var(--theme-red, #ef4444)" stroke-width="0.5" opacity="0.5" />
    <text x="66" y="98"
      fill="var(--theme-red, #ef4444)" font-size="8" text-anchor="middle" opacity="0.9">.textContent = 'Alice'</text>

    <!-- Right: result -->
    <rect x="440" y="82" width="114" height="24" rx="4"
      fill="rgba(16, 185, 129, 0.06)"
      stroke="var(--theme-green, #10b981)" stroke-width="0.5" opacity="0.5" />
    <text x="497" y="98"
      fill="var(--theme-green, #10b981)" font-size="8" text-anchor="middle" opacity="0.9">Pixels on screen</text>

    <!-- Connecting arc between trigger and result -->
    <path d="M 126 94 C 220 130, 350 130, 440 94"
      fill="none" stroke="var(--theme-separator, #444)" stroke-width="0.8"
      stroke-dasharray="4 3" opacity="0.3" />
    <text x="283" y="128"
      fill="var(--theme-foreground, #888)" font-size="7" text-anchor="middle" opacity="0.4">~1–5 ms</text>
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
  .rp-svg {
    width: 100%;
    max-width: 560px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
