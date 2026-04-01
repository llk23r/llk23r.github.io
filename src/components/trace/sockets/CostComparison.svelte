<figure class="trace-viz" role="img" aria-label="Cost comparison: 10ms per query without pooling vs 1ms with pooling">
  <svg viewBox="0 0 560 300" class="cost-svg">

    <!-- ===== LEFT PANEL: Without Pooling ===== -->
    <text x="140" y="22" fill="var(--theme-red, #ef4444)" font-size="11" font-weight="700"
      font-family="JetBrains Mono, monospace" text-anchor="middle">WITHOUT POOLING</text>

    <!-- Bar rows: y starts at 36, each row is 26px tall with 4px gap -->
    <!-- Scale: 1ms = 18px, max bar (10ms total) ≈ 180px. Bars start at x=105, max width 155 -->

    <!-- socket() syscall: 0.002ms — barely visible -->
    <text x="10" y="52" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">socket()</text>
    <rect x="105" y="40" width="2" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.2)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" />
    <text x="111" y="52" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">0.002ms</text>

    <!-- TCP handshake: 0.5ms → 9px -->
    <text x="10" y="78" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">TCP handshake</text>
    <rect x="105" y="66" width="9" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.2)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" />
    <text x="118" y="78" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">0.5ms</text>

    <!-- TLS handshake: 1.0ms → 18px -->
    <text x="10" y="104" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">TLS handshake</text>
    <rect x="105" y="92" width="18" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.2)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" />
    <text x="127" y="104" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">1.0ms</text>

    <!-- PG auth (SCRAM): 2.0ms → 36px -->
    <text x="10" y="130" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">PG auth (SCRAM)</text>
    <rect x="105" y="118" width="36" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.2)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" />
    <text x="145" y="130" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">2.0ms</text>

    <!-- Server fork(): 7.5ms → 135px -->
    <text x="10" y="156" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">Server fork()</text>
    <rect x="105" y="144" width="135" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.2)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" />
    <text x="244" y="156" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">7.5ms</text>

    <!-- Query + response: 1.0ms → 18px -->
    <text x="10" y="182" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">Query + response</text>
    <rect x="105" y="170" width="18" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.2)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" />
    <text x="127" y="182" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">1.0ms</text>

    <!-- TCP teardown: 0.5ms → 9px -->
    <text x="10" y="208" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">TCP teardown</text>
    <rect x="105" y="196" width="9" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.2)" stroke="var(--theme-red, #ef4444)" stroke-width="0.5" />
    <text x="118" y="208" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">0.5ms</text>

    <!-- Separator line above total -->
    <line x1="10" y1="222" x2="270" y2="222" stroke="var(--theme-separator, #333)" stroke-width="0.5" />

    <!-- Total bar: ~10ms → 180px -->
    <text x="10" y="242" fill="var(--theme-red, #ef4444)" font-size="9" font-weight="600"
      font-family="JetBrains Mono, monospace">TOTAL</text>
    <rect x="105" y="230" width="155" height="16" rx="2"
      fill="rgba(239, 68, 68, 0.15)" stroke="var(--theme-red, #ef4444)" stroke-width="1" />
    <text x="140" y="242" fill="var(--theme-red, #ef4444)" font-size="9" font-weight="700"
      font-family="JetBrains Mono, monospace">~10ms</text>

    <!-- TIME_WAIT note -->
    <text x="10" y="264" fill="var(--theme-red, #ef4444)" font-size="7" opacity="0.8"
      font-family="JetBrains Mono, monospace">TIME_WAIT: 60,000 sockets at 1K req/s</text>


    <!-- ===== PANEL DIVIDER ===== -->
    <line x1="280" y1="8" x2="280" y2="270" stroke="var(--theme-separator, #333)" stroke-width="1" />


    <!-- ===== RIGHT PANEL: With Pooling ===== -->
    <text x="420" y="22" fill="var(--theme-green, #10b981)" font-size="11" font-weight="700"
      font-family="JetBrains Mono, monospace" text-anchor="middle">WITH POOLING</text>

    <!-- pool.acquire(): 0.001ms — barely visible -->
    <text x="295" y="52" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">pool.acquire()</text>
    <rect x="400" y="40" width="2" height="16" rx="2"
      fill="rgba(16, 185, 129, 0.2)" stroke="var(--theme-green, #10b981)" stroke-width="0.5" />
    <text x="406" y="52" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">0.001ms</text>

    <!-- Query + response: 1.0ms → 18px -->
    <text x="295" y="78" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">Query + response</text>
    <rect x="400" y="66" width="18" height="16" rx="2"
      fill="rgba(16, 185, 129, 0.2)" stroke="var(--theme-green, #10b981)" stroke-width="0.5" />
    <text x="422" y="78" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">1.0ms</text>

    <!-- pool.release(): 0.001ms — barely visible -->
    <text x="295" y="104" fill="var(--theme-foreground, #888)" font-size="8"
      font-family="JetBrains Mono, monospace">pool.release()</text>
    <rect x="400" y="92" width="2" height="16" rx="2"
      fill="rgba(16, 185, 129, 0.2)" stroke="var(--theme-green, #10b981)" stroke-width="0.5" />
    <text x="406" y="104" fill="var(--theme-foreground, #ccc)" font-size="8"
      font-family="JetBrains Mono, monospace">0.001ms</text>

    <!-- Empty space to emphasize the contrast -->

    <!-- Separator line above total -->
    <line x1="295" y1="222" x2="555" y2="222" stroke="var(--theme-separator, #333)" stroke-width="0.5" />

    <!-- Total bar: ~1ms → 18px -->
    <text x="295" y="242" fill="var(--theme-green, #10b981)" font-size="9" font-weight="600"
      font-family="JetBrains Mono, monospace">TOTAL</text>
    <rect x="400" y="230" width="18" height="16" rx="2"
      fill="rgba(16, 185, 129, 0.15)" stroke="var(--theme-green, #10b981)" stroke-width="1" />
    <text x="422" y="242" fill="var(--theme-green, #10b981)" font-size="9" font-weight="700"
      font-family="JetBrains Mono, monospace">~1ms</text>

    <!-- TIME_WAIT note -->
    <text x="295" y="264" fill="var(--theme-green, #10b981)" font-size="7" opacity="0.8"
      font-family="JetBrains Mono, monospace">TIME_WAIT: ~0</text>


    <!-- ===== 10x BADGE (bottom center) ===== -->
    <rect x="230" y="276" width="100" height="22" rx="11"
      fill="none" stroke="var(--theme-accent, #8b5cf6)" stroke-width="1.5" />
    <text x="280" y="292" fill="var(--theme-accent, #8b5cf6)" font-size="14" font-weight="700"
      font-family="JetBrains Mono, monospace" text-anchor="middle">10x faster</text>

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
  .cost-svg {
    width: 100%;
    max-width: 560px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
