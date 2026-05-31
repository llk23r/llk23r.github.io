<script>
  const steps = [
    {
      label: 'Learned numbers',
      layer: 'model',
      detail: 'Training already produced the fixed learned numbers that will run this request.',
    },
    {
      label: 'Your message',
      layer: 'human',
      detail: 'Text leaves the chat box with conversation history, account labels, and a request id.',
    },
    {
      label: 'Nearby service',
      layer: 'network',
      detail: 'The browser finds a nearby service and opens a private web connection.',
    },
    {
      label: 'Front door',
      layer: 'system',
      detail: 'Identity checks, usage limits, safety checks, and machine choice decide where the request may go.',
    },
    {
      label: 'Text pieces',
      layer: 'model',
      detail: 'Text becomes numbered pieces. The model never sees words directly.',
    },
    {
      label: 'Shared turn',
      layer: 'system',
      detail: 'Many users share model turns so expensive GPU chips stay busy.',
    },
    {
      label: 'Read input',
      layer: 'model',
      detail: 'The model reads every input piece once and saves useful work for later reuse.',
    },
    {
      label: 'Repeat',
      layer: 'model',
      detail: 'One new piece is chosen, appended, and fed back into the model.',
    },
    {
      label: 'GPU',
      layer: 'hardware',
      detail: 'Large number-table operations run on special chips with very fast storage nearby.',
    },
    {
      label: 'Stream',
      layer: 'network',
      detail: 'Generated text pieces return as small chunks before the full answer is complete.',
    },
    {
      label: 'Pixels',
      layer: 'human',
      detail: 'The browser turns arriving text fragments into visible text, and your eyes see the answer grow.',
    },
  ]

  let current = $state(0)

  const colors = {
    human: 'var(--theme-yellow, #f59e0b)',
    network: 'var(--theme-caution, #f97316)',
    system: 'var(--theme-red, #ec4899)',
    model: 'var(--theme-magenta, #8b5cf6)',
    hardware: 'var(--theme-cyan, #06b6d4)',
  }

  function select(index) {
    current = index
  }
</script>

<figure class="trace-viz" aria-labelledby="llm-journey-title">
  <div class="header">
    <div>
      <h3 id="llm-journey-title">One Chat Request, Many Layers</h3>
      <p>{steps[current].detail}</p>
    </div>
    <span class="counter">{current + 1}/{steps.length}</span>
  </div>

  <div class="rail" role="list" aria-label="LLM request journey">
    {#each steps as step, i}
      <button
        class:active={i === current}
        class:done={i < current}
        style="--step-color: {colors[step.layer]}"
        type="button"
        onclick={() => select(i)}
        aria-current={i === current ? 'step' : undefined}
      >
        <span class="dot"></span>
        <span class="label">{step.label}</span>
        <span class="layer">{step.layer}</span>
      </button>
    {/each}
  </div>

  <svg class="diagram" viewBox="0 0 760 210" role="img" aria-label="Layered path from user message to streamed answer">
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="var(--theme-foreground, #ddd)" opacity="0.8" />
      </marker>
    </defs>
    <path class="backbone" d="M55 105 H710" marker-end="url(#arrow)" />
    {#each steps as step, i}
      {@const x = 55 + i * 65}
      <g class:focused={i === current} class:past={i < current}>
        <circle cx={x} cy="105" r={i === current ? 22 : 16} fill={colors[step.layer]} opacity={i <= current ? 0.9 : 0.2} />
        <text x={x} y={i % 2 === 0 ? 63 : 156} text-anchor="middle">{step.label}</text>
        <line x1={x} y1="105" x2={x} y2={i % 2 === 0 ? 72 : 141} stroke={colors[step.layer]} opacity="0.45" />
      </g>
    {/each}
    <text class="caption" x="380" y="198" text-anchor="middle">To you it feels linear; inside, it is queues, shared turns, and saved work.</text>
  </svg>

  <noscript>
    <p>
      Static fallback: a chat request moves from message assembly to nearby networking, front-door checks, text splitting, shared GPU work, repeated piece generation, streaming, and finally browser painting.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-foreground, #fff));
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: var(--theme-foreground-light, #aaa);
    line-height: 1.5;
  }

  .counter {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    color: var(--theme-foreground-light, #aaa);
    white-space: nowrap;
  }

  .rail {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 0.45rem;
  }

  button {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.2rem 0.45rem;
    align-items: center;
    min-height: 58px;
    padding: 0.55rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    text-align: left;
    cursor: pointer;
  }

  button.active {
    border-color: var(--step-color);
    background: color-mix(in srgb, var(--step-color) 14%, transparent);
  }

  .dot {
    width: 0.65rem;
    height: 0.65rem;
    border: 2px solid var(--step-color);
    border-radius: 50%;
    background: transparent;
  }

  button.done .dot,
  button.active .dot {
    background: var(--step-color);
  }

  .label {
    font-weight: 650;
    font-size: 0.82rem;
  }

  .layer {
    grid-column: 2;
    color: var(--step-color);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.62rem;
    text-transform: uppercase;
  }

  .diagram {
    width: 100%;
    height: auto;
    margin-top: 1rem;
    overflow: visible;
  }

  .backbone {
    stroke: var(--theme-foreground, #ddd);
    stroke-width: 2;
    opacity: 0.4;
  }

  text {
    fill: var(--theme-foreground, #ddd);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 12px;
  }

  .caption {
    fill: var(--theme-foreground-light, #aaa);
    font-size: 11px;
  }

  .focused text {
    font-weight: 700;
  }

  .past text {
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    .diagram {
      display: none;
    }

    .header {
      flex-direction: column;
    }
  }
</style>
