<script>
  const equations = [
    {
      name: "Gauss's Law (E)",
      equation: '\u2207 \u00b7 E = \u03c1/\u03b5\u2080',
      description: 'Electric charges create electric fields',
      color: '#ef4444',
      iconType: 'gauss-e',
    },
    {
      name: "Gauss's Law (B)",
      equation: '\u2207 \u00b7 B = 0',
      description: 'No magnetic monopoles exist',
      color: '#3b82f6',
      iconType: 'gauss-b',
    },
    {
      name: "Faraday's Law",
      equation: '\u2207 \u00d7 E = \u2212\u2202B/\u2202t',
      description: 'Changing magnetic field creates electric field',
      color: '#8b5cf6',
      iconType: 'faraday',
    },
    {
      name: "Amp\u00e8re-Maxwell",
      equation: '\u2207 \u00d7 B = \u03bc\u2080J + \u03bc\u2080\u03b5\u2080\u2202E/\u2202t',
      description: 'Current and changing E field create magnetic field',
      color: '#10b981',
      iconType: 'ampere',
    },
  ]
</script>

<figure class="trace-viz" role="img" aria-label="Maxwell's four equations of electromagnetism">
  <div class="grid">
    {#each equations as eq}
      <div class="card" style="--card-color: {eq.color}">
        <div class="card-icon">
          {#if eq.iconType === 'gauss-e'}
            <!-- Field lines radiating from charge -->
            <svg viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="4" fill={eq.color} />
              {#each [0, 45, 90, 135, 180, 225, 270, 315] as angle}
                <line
                  x1={20 + 6 * Math.cos(angle * Math.PI / 180)}
                  y1={20 + 6 * Math.sin(angle * Math.PI / 180)}
                  x2={20 + 16 * Math.cos(angle * Math.PI / 180)}
                  y2={20 + 16 * Math.sin(angle * Math.PI / 180)}
                  stroke={eq.color} stroke-width="1.5" opacity="0.7"
                />
                <!-- arrowhead -->
                <circle
                  cx={20 + 16 * Math.cos(angle * Math.PI / 180)}
                  cy={20 + 16 * Math.sin(angle * Math.PI / 180)}
                  r="1.2" fill={eq.color} opacity="0.7"
                />
              {/each}
            </svg>
          {:else if eq.iconType === 'gauss-b'}
            <!-- Closed field loops -->
            <svg viewBox="0 0 40 40" width="40" height="40">
              <ellipse cx="20" cy="20" rx="14" ry="8" fill="none" stroke={eq.color} stroke-width="1.5" opacity="0.7" />
              <ellipse cx="20" cy="20" rx="8" ry="14" fill="none" stroke={eq.color} stroke-width="1.5" opacity="0.5" />
              <!-- direction arrows -->
              <polygon points="34,20 31,17.5 31,22.5" fill={eq.color} opacity="0.7" />
              <polygon points="20,6 17.5,9 22.5,9" fill={eq.color} opacity="0.5" />
            </svg>
          {:else if eq.iconType === 'faraday'}
            <!-- Loop with arrow -->
            <svg viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="12" fill="none" stroke={eq.color} stroke-width="1.5" opacity="0.7" />
              <!-- arrow on loop -->
              <polygon points="20,8 17,12 23,12" fill={eq.color} opacity="0.8" />
              <!-- changing B indicator (dashed) -->
              <line x1="20" y1="16" x2="20" y2="24" stroke={eq.color} stroke-width="1.5" stroke-dasharray="2,2" opacity="0.5" />
              <polygon points="20,25 18,22 22,22" fill={eq.color} opacity="0.5" />
            </svg>
          {:else}
            <!-- Wire with loops (Ampere) -->
            <svg viewBox="0 0 40 40" width="40" height="40">
              <!-- wire (vertical) -->
              <line x1="20" y1="4" x2="20" y2="36" stroke={eq.color} stroke-width="2" opacity="0.8" />
              <!-- current arrow -->
              <polygon points="20,4 17,9 23,9" fill={eq.color} opacity="0.8" />
              <!-- concentric loops -->
              <ellipse cx="20" cy="20" rx="10" ry="4" fill="none" stroke={eq.color} stroke-width="1" opacity="0.5" />
              <ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke={eq.color} stroke-width="1" opacity="0.35" />
              <!-- direction dot on loop -->
              <polygon points="30,20 27,18 27,22" fill={eq.color} opacity="0.5" />
            </svg>
          {/if}
        </div>
        <div class="card-name">{eq.name}</div>
        <div class="card-equation">{eq.equation}</div>
        <div class="card-desc">{eq.description}</div>
      </div>
    {/each}
  </div>
  <p class="caption">Together, these four equations describe <em>all</em> electromagnetic phenomena</p>
</figure>

<style>
  .trace-viz {
    --viz-text: var(--theme-foreground, #ccc);
    --viz-text-muted: var(--theme-foreground, #888);
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--theme-separator, #333);
    background: var(--theme-background, #1a1a2e);
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1rem 0.75rem 0.85rem;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-top: 3px solid var(--card-color);
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    gap: 0.4rem;
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.15rem;
  }

  .card-name {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--card-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .card-equation {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--viz-text);
    letter-spacing: 0.02em;
    padding: 0.25rem 0;
  }

  .card-desc {
    font-size: 0.6rem;
    color: var(--viz-text-muted);
    opacity: 0.7;
    line-height: 1.5;
    max-width: 200px;
  }

  .caption {
    text-align: center;
    font-size: 0.7rem;
    font-style: italic;
    color: var(--viz-text-muted);
    opacity: 0.6;
    padding: 0.5rem 1rem 0.85rem;
    border-top: 1px solid var(--theme-separator, #333);
    margin: 0;
  }

  .caption em {
    font-weight: 600;
    color: var(--viz-text);
    opacity: 1;
  }

  @media (max-width: 500px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    .card-equation {
      font-size: 0.9rem;
    }
  }
</style>
