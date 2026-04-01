<figure class="trace-viz" role="img" aria-label="Structure of a TCP SYN packet showing IP and TCP header fields">
  <svg viewBox="0 0 460 200" class="packet-svg" font-family="JetBrains Mono, monospace">

    <!-- ═══════ IP HEADER SECTION ═══════ -->
    <g>
      <!-- Outer border -->
      <rect x="10" y="6" width="440" height="68" rx="6"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #444)" stroke-width="1" />
      <!-- Header bar -->
      <rect x="10" y="6" width="440" height="22" rx="6"
        fill="rgba(6, 182, 212, 0.12)" />
      <rect x="10" y="18" width="440" height="10"
        fill="rgba(6, 182, 212, 0.12)" />
      <text x="230" y="21" text-anchor="middle"
        fill="var(--theme-cyan, #06b6d4)" font-size="10" font-weight="bold">IP HEADER</text>

      <!-- src label + value -->
      <text x="45" y="50" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">src:</text>
      <text x="70" y="50" fill="var(--theme-foreground, #ccc)" font-size="11">192.168.1.50</text>

      <!-- Arrow -->
      <text x="220" y="51" text-anchor="middle"
        fill="var(--theme-green, #10b981)" font-size="13" font-weight="bold">→</text>

      <!-- dst label + value -->
      <text x="270" y="50" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">dst:</text>
      <text x="293" y="50" fill="var(--theme-foreground, #ccc)" font-size="11">10.0.0.5</text>
    </g>

    <!-- ═══════ TCP HEADER SECTION ═══════ -->
    <g>
      <!-- Outer border -->
      <rect x="10" y="80" width="440" height="114" rx="6"
        fill="rgba(255,255,255,0.03)"
        stroke="var(--theme-separator, #444)" stroke-width="1" />
      <!-- Header bar -->
      <rect x="10" y="80" width="440" height="22" rx="6"
        fill="rgba(139, 92, 246, 0.12)" />
      <rect x="10" y="92" width="440" height="10"
        fill="rgba(139, 92, 246, 0.12)" />
      <text x="230" y="95" text-anchor="middle"
        fill="var(--theme-accent, #8b5cf6)" font-size="10" font-weight="bold">TCP HEADER</text>

      <!-- Row 1: src_port | dst_port -->
      <text x="30" y="120" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">src_port:</text>
      <text x="90" y="120" fill="var(--theme-foreground, #ccc)" font-size="11">49152</text>
      <line x1="230" y1="108" x2="230" y2="125"
        stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.5" />
      <text x="250" y="120" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">dst_port:</text>
      <text x="310" y="120" fill="var(--theme-foreground, #ccc)" font-size="11">5432</text>

      <!-- Divider -->
      <line x1="25" y1="128" x2="435" y2="128"
        stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.3" />

      <!-- Row 2: seq | ack -->
      <text x="30" y="142" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">seq:</text>
      <text x="55" y="142" fill="var(--theme-foreground, #ccc)" font-size="11">1000 (ISN)</text>
      <line x1="230" y1="131" x2="230" y2="147"
        stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.5" />
      <text x="250" y="142" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">ack:</text>
      <text x="276" y="142" fill="var(--theme-foreground, #ccc)" font-size="11">0</text>

      <!-- Divider -->
      <line x1="25" y1="150" x2="435" y2="150"
        stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.3" />

      <!-- Row 3: flags: SYN (highlighted pill) -->
      <text x="30" y="165" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">flags:</text>
      <rect x="65" y="155" width="42" height="16" rx="4"
        fill="var(--theme-cyan, #06b6d4)" opacity="0.9" />
      <text x="86" y="166" text-anchor="middle"
        fill="var(--theme-background, #1a1a2e)" font-size="10" font-weight="bold">SYN</text>

      <!-- Divider -->
      <line x1="25" y1="175" x2="435" y2="175"
        stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.3" />

      <!-- Row 4: window | options -->
      <text x="30" y="189" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">window:</text>
      <text x="80" y="189" fill="var(--theme-foreground, #ccc)" font-size="11">65535</text>
      <line x1="230" y1="178" x2="230" y2="193"
        stroke="var(--theme-separator, #333)" stroke-width="0.5" opacity="0.5" />
      <text x="250" y="189" fill="var(--theme-foreground, #888)" font-size="9" opacity="0.6">options:</text>
      <text x="302" y="189" fill="var(--theme-foreground, #ccc)" font-size="11">MSS=1460, timestamps</text>
    </g>
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
  .packet-svg {
    width: 100%;
    max-width: 460px;
    height: auto;
    display: block;
    margin: 0 auto;
    padding: 0.5rem;
  }
</style>
