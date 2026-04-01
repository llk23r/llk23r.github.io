<figure class="trace-viz" role="img" aria-label="File descriptor to kernel data structure hierarchy showing how fd 7 maps through struct file, struct socket, struct sock to the TCP 4-tuple">
  <svg viewBox="0 0 520 380" class="stack-svg" font-family="JetBrains Mono, monospace">
    <defs>
      <marker
        id="fd-arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-separator, #555)" />
      </marker>
    </defs>

    <!-- Box 1: fd[7] -->
    <rect x="200" y="10" width="120" height="40" rx="6"
      fill="rgba(255,255,255,0.03)"
      stroke="var(--theme-cyan, #06b6d4)" stroke-width="1.5" />
    <text x="260" y="35" text-anchor="middle"
      fill="var(--theme-cyan, #06b6d4)" font-size="14" font-weight="bold">fd[7]</text>

    <!-- Arrow 1→2 -->
    <line x1="260" y1="50" x2="260" y2="70"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#fd-arrow)" />

    <!-- Box 2: struct file -->
    <g>
      <!-- Border -->
      <rect x="90" y="70" width="340" height="60" rx="6"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #444)" stroke-width="1" />
      <!-- Header bar -->
      <rect x="90" y="70" width="340" height="22" rx="6"
        fill="rgba(255,255,255,0.06)" />
      <!-- Clip bottom corners of header so they don't round over the body -->
      <rect x="90" y="82" width="340" height="10"
        fill="rgba(255,255,255,0.06)" />
      <text x="260" y="86" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="11" font-weight="bold">struct file</text>
      <!-- Fields -->
      <text x="105" y="108" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">f_op</text>
      <text x="141" y="108" fill="var(--theme-foreground, #ccc)" font-size="9.5">→ socket_ops</text>
      <text x="255" y="108" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">f_flags</text>
      <text x="365" y="108" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">private_data →</text>
    </g>

    <!-- Arrow 2→3 -->
    <line x1="260" y1="130" x2="260" y2="155"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#fd-arrow)" />

    <!-- Box 3: struct socket -->
    <g>
      <rect x="90" y="155" width="340" height="60" rx="6"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #444)" stroke-width="1" />
      <rect x="90" y="155" width="340" height="22" rx="6"
        fill="rgba(255,255,255,0.06)" />
      <rect x="90" y="167" width="340" height="10"
        fill="rgba(255,255,255,0.06)" />
      <text x="260" y="171" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="11" font-weight="bold">struct socket</text>
      <!-- Fields -->
      <text x="105" y="193" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">state:</text>
      <text x="147" y="193" fill="var(--theme-foreground, #ccc)" font-size="9.5">SS_CONNECTED</text>
      <text x="265" y="193" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">type:</text>
      <text x="300" y="193" fill="var(--theme-foreground, #ccc)" font-size="9.5">SOCK_STREAM</text>
      <text x="400" y="193" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">sk →</text>
    </g>

    <!-- Arrow 3→4 -->
    <line x1="260" y1="215" x2="260" y2="240"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#fd-arrow)" />

    <!-- Box 4: struct sock / tcp_sock -->
    <g>
      <rect x="70" y="240" width="380" height="80" rx="6"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #444)" stroke-width="1" />
      <rect x="70" y="240" width="380" height="22" rx="6"
        fill="rgba(255,255,255,0.06)" />
      <rect x="70" y="252" width="380" height="10"
        fill="rgba(255,255,255,0.06)" />
      <text x="260" y="256" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="11" font-weight="bold">struct sock / tcp_sock</text>
      <!-- Fields: 3 rows -->
      <text x="85" y="278" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">sk_state:</text>
      <text x="149" y="278" fill="var(--theme-foreground, #ccc)" font-size="9.5">TCP_ESTABLISHED</text>
      <text x="85" y="294" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">sk_rcvbuf:</text>
      <text x="157" y="294" fill="var(--theme-foreground, #ccc)" font-size="9.5">131,072</text>
      <text x="270" y="294" fill="var(--theme-foreground, #888)" font-size="9.5" opacity="0.6">sk_sndbuf:</text>
      <text x="342" y="294" fill="var(--theme-foreground, #ccc)" font-size="9.5">16,384</text>
    </g>

    <!-- Arrow 4→5 -->
    <line x1="260" y1="320" x2="260" y2="340"
      stroke="var(--theme-separator, #555)" stroke-width="1.2"
      stroke-dasharray="4 3" marker-end="url(#fd-arrow)" />

    <!-- Box 5: 4-tuple -->
    <rect x="90" y="340" width="340" height="35" rx="6"
      fill="rgba(255,255,255,0.03)"
      stroke="var(--theme-green, #10b981)" stroke-width="1.5" />
    <text x="260" y="362" text-anchor="middle"
      fill="var(--theme-green, #10b981)" font-size="10.5" font-weight="bold">192.168.1.50:49152 ↔ 10.0.0.5:5432</text>
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
  .stack-svg {
    width: 100%;
    max-width: 520px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
