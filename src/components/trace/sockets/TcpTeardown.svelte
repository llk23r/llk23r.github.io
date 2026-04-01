<figure class="trace-viz" role="img" aria-label="TCP four-way teardown showing FIN/ACK exchange and TIME_WAIT state">
  <div class="diagram-container">
    <svg viewBox="0 0 500 380" preserveAspectRatio="xMidYMid meet" class="teardown-svg">
      <defs>
        <marker id="td-arrow-fin" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-red, #ef4444)" />
        </marker>
        <marker id="td-arrow-ack" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--theme-yellow, #f59e0b)" />
        </marker>
      </defs>

      <!-- Column headers -->
      <text x="100" y="22" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="11"
        font-family="JetBrains Mono, monospace" letter-spacing="0.08em"
        opacity="0.6">CLIENT</text>
      <text x="400" y="22" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="11"
        font-family="JetBrains Mono, monospace" letter-spacing="0.08em"
        opacity="0.6">SERVER</text>

      <!-- Vertical timeline lines -->
      <line x1="100" y1="30" x2="100" y2="365"
        stroke="var(--theme-separator, #333)" stroke-width="1.5"
        stroke-dasharray="4,4" opacity="0.5" />
      <line x1="400" y1="30" x2="400" y2="365"
        stroke="var(--theme-separator, #333)" stroke-width="1.5"
        stroke-dasharray="4,4" opacity="0.5" />

      <!-- ===== Row 0: ESTABLISHED on both sides ===== -->
      <g>
        <rect x="55" y="38" width="90" height="22" rx="4"
          fill="rgba(16, 185, 129, 0.12)"
          stroke="var(--theme-green, #10b981)" stroke-width="1" stroke-opacity="0.5" />
        <text x="100" y="53" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">ESTABLISHED</text>
      </g>
      <g>
        <rect x="355" y="38" width="90" height="22" rx="4"
          fill="rgba(16, 185, 129, 0.12)"
          stroke="var(--theme-green, #10b981)" stroke-width="1" stroke-opacity="0.5" />
        <text x="400" y="53" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">ESTABLISHED</text>
      </g>

      <!-- ===== Row 1: FIN from Client to Server ===== -->
      <!-- close(fd=7) annotation -->
      <text x="100" y="80" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.5">close(fd=7)</text>

      <!-- Arrow: Client -> Server -->
      <text x="250" y="87" text-anchor="middle"
        fill="var(--theme-red, #ef4444)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">FIN seq=50000</text>
      <line x1="135" y1="95" x2="365" y2="95"
        stroke="var(--theme-red, #ef4444)" stroke-width="2"
        marker-end="url(#td-arrow-fin)" />

      <!-- Client state: FIN_WAIT_1 -->
      <g>
        <rect x="47" y="105" width="106" height="22" rx="4"
          fill="rgba(245, 158, 11, 0.10)"
          stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" stroke-opacity="0.5" />
        <text x="100" y="120" text-anchor="middle"
          fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">FIN_WAIT_1</text>
      </g>
      <!-- Server state: CLOSE_WAIT -->
      <g>
        <rect x="347" y="105" width="106" height="22" rx="4"
          fill="rgba(245, 158, 11, 0.10)"
          stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" stroke-opacity="0.5" />
        <text x="400" y="120" text-anchor="middle"
          fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">CLOSE_WAIT</text>
      </g>

      <!-- ===== Row 2: ACK from Server to Client ===== -->
      <text x="250" y="152" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">ACK ack=50001</text>
      <line x1="365" y1="160" x2="135" y2="160"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="2"
        marker-end="url(#td-arrow-ack)" />

      <!-- Client state: FIN_WAIT_2 -->
      <g>
        <rect x="47" y="170" width="106" height="22" rx="4"
          fill="rgba(245, 158, 11, 0.10)"
          stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" stroke-opacity="0.5" />
        <text x="100" y="185" text-anchor="middle"
          fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">FIN_WAIT_2</text>
      </g>

      <!-- ===== Row 3: FIN from Server to Client ===== -->
      <text x="250" y="217" text-anchor="middle"
        fill="var(--theme-red, #ef4444)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">FIN seq=80000</text>
      <line x1="365" y1="225" x2="135" y2="225"
        stroke="var(--theme-red, #ef4444)" stroke-width="2"
        marker-end="url(#td-arrow-fin)" />

      <!-- Server state: LAST_ACK -->
      <g>
        <rect x="355" y="235" width="90" height="22" rx="4"
          fill="rgba(245, 158, 11, 0.10)"
          stroke="var(--theme-yellow, #f59e0b)" stroke-width="1" stroke-opacity="0.5" />
        <text x="400" y="250" text-anchor="middle"
          fill="var(--theme-yellow, #f59e0b)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">LAST_ACK</text>
      </g>

      <!-- ===== Row 4: ACK from Client to Server ===== -->
      <text x="250" y="282" text-anchor="middle"
        fill="var(--theme-yellow, #f59e0b)" font-size="8.5" font-weight="600"
        font-family="JetBrains Mono, monospace">ACK ack=80001</text>
      <line x1="135" y1="290" x2="365" y2="290"
        stroke="var(--theme-yellow, #f59e0b)" stroke-width="2"
        marker-end="url(#td-arrow-ack)" />

      <!-- Client state: TIME_WAIT (red with glow) -->
      <g>
        <rect x="47" y="300" width="106" height="22" rx="4"
          fill="rgba(239, 68, 68, 0.12)"
          stroke="var(--theme-red, #ef4444)" stroke-width="1" stroke-opacity="0.6" />
        <rect x="47" y="300" width="106" height="22" rx="4"
          fill="none"
          stroke="var(--theme-red, #ef4444)" stroke-width="0.5" stroke-opacity="0.2"
          style="filter: blur(3px);" />
        <text x="100" y="315" text-anchor="middle"
          fill="var(--theme-red, #ef4444)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">TIME_WAIT</text>
      </g>

      <!-- Server state: CLOSED (green with checkmark) -->
      <g>
        <rect x="355" y="300" width="90" height="22" rx="4"
          fill="rgba(16, 185, 129, 0.12)"
          stroke="var(--theme-green, #10b981)" stroke-width="1" stroke-opacity="0.5" />
        <text x="393" y="315" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">CLOSED</text>
        <text x="425" y="315.5" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="10"
          font-family="JetBrains Mono, monospace">&#x2713;</text>
      </g>

      <!-- ===== Bottom: 60s annotation and final CLOSED ===== -->
      <!-- Dashed line from TIME_WAIT down to CLOSED -->
      <line x1="100" y1="326" x2="100" y2="350"
        stroke="var(--theme-red, #ef4444)" stroke-width="1"
        stroke-dasharray="2,3" opacity="0.4" />

      <!-- 60s timer annotation -->
      <text x="100" y="342" text-anchor="middle"
        fill="var(--theme-foreground, #888)" font-size="8"
        font-family="JetBrains Mono, monospace" opacity="0.5">... 60s ...</text>

      <!-- Client final: CLOSED -->
      <g>
        <rect x="55" y="350" width="90" height="22" rx="4"
          fill="rgba(16, 185, 129, 0.12)"
          stroke="var(--theme-green, #10b981)" stroke-width="1" stroke-opacity="0.5" />
        <text x="93" y="365" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="9" font-weight="600"
          font-family="JetBrains Mono, monospace">CLOSED</text>
        <text x="125" y="365.5" text-anchor="middle"
          fill="var(--theme-green, #10b981)" font-size="10"
          font-family="JetBrains Mono, monospace">&#x2713;</text>
      </g>
    </svg>
  </div>
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

  .diagram-container {
    padding: 0.75rem 0.5rem;
    display: flex;
    justify-content: center;
  }

  .teardown-svg {
    width: 100%;
    max-width: 500px;
    height: auto;
  }
</style>
