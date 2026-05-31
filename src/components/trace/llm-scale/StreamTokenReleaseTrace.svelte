<script>
  const cases = {
    normal: {
      label: 'normal text',
      token: ' answer',
      steps: ['detokenize fragment', 'merge into text buffer', 'frame as stream event', 'browser appends text', 'paint'],
      gate: 'release immediately',
    },
    utf8: {
      label: 'UTF-8 fragment',
      token: 'partial byte',
      steps: ['detokenize bytes', 'buffer until valid character', 'frame complete text', 'browser decodes bytes', 'paint'],
      gate: 'hold until valid text',
    },
    tool: {
      label: 'tool JSON',
      token: '{ "city"',
      steps: ['append JSON fragment', 'wait for valid object', 'validate schema', 'call tool or continue buffering', 'show tool result later'],
      gate: 'hold from user',
    },
    citation: {
      label: 'citation marker',
      token: '[12]',
      steps: ['append marker token', 'look up source metadata', 'verify source span exists', 'attach citation payload', 'paint linked citation'],
      gate: 'release with metadata',
    },
    safety: {
      label: 'risky phrase',
      token: 'unsafe fragment',
      steps: ['buffer phrase', 'wait for surrounding context', 'run output policy', 'redact or allow', 'paint safe text'],
      gate: 'hold for policy',
    },
  }

  let mode = $state('normal')
  let step = $state(2)
  let current = $derived(cases[mode])
  let visibleStep = $derived(Math.min(step, current.steps.length - 1))
</script>

<figure class="trace-viz" aria-labelledby="release-title">
  <div class="header">
    <div>
      <h3 id="release-title">A Generated Token Is Not Always Released</h3>
      <p>
        The model emits token ids. The product releases user-visible text only after byte, tool, citation, and policy gates are satisfied.
      </p>
    </div>
    <div class="status">
      <span>Gate decision</span>
      <strong>{current.gate}</strong>
    </div>
  </div>

  <div class="modes" role="group" aria-label="Stream token case">
    {#each Object.entries(cases) as [key, item]}
      <button type="button" class:active={mode === key} onclick={() => (mode = key)}>
        {item.label}
      </button>
    {/each}
  </div>

  <label>
    Release step
    <input aria-label="Token release step" type="range" min="0" max={current.steps.length - 1} step="1" bind:value={step} />
    <span>{visibleStep + 1}/{current.steps.length}</span>
  </label>

  <div class="token">
    <span>Current token fragment</span>
    <strong>{current.token}</strong>
  </div>

  <div class="rail" aria-label="Token release path">
    {#each current.steps as item, index}
      <div class:done={visibleStep > index} class:active={visibleStep === index}>
        <span>{index + 1}</span>
        <strong>{item}</strong>
      </div>
    {/each}
  </div>

  <noscript>
    <p>
      Static fallback: generated token ids are detokenized, buffered until valid text or structures exist, checked against citation and safety gates, framed as stream events, decoded by the browser, and painted.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-pink, #ec4899));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(160px, 0.32fr);
    gap: 1rem;
    align-items: start;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }

  p,
  .status span,
  .token span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .token,
  .rail div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status span,
  .status strong,
  .token span,
  .token strong,
  .rail strong {
    display: block;
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 1rem 0;
  }

  button {
    min-height: 36px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 7px;
    padding: 0.45rem 0.65rem;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    cursor: pointer;
  }

  button.active {
    background: var(--theme-pink, #ec4899);
    color: var(--theme-background, #111);
  }

  label {
    display: grid;
    grid-template-columns: 120px 1fr 64px;
    gap: 0.6rem;
    align-items: center;
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .token {
    margin-bottom: 1rem;
  }

  .token strong {
    margin-top: 0.2rem;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .rail {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .rail div {
    min-height: 88px;
  }

  .rail div span {
    display: inline-grid;
    width: 1.4rem;
    height: 1.4rem;
    place-items: center;
    margin-bottom: 0.45rem;
    border-radius: 999px;
    background: var(--theme-separator, #333);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.7rem;
  }

  .rail div.done span,
  .rail div.active span {
    background: var(--theme-pink, #ec4899);
    color: var(--theme-background, #111);
  }

  @media (max-width: 800px) {
    .header,
    .rail,
    label {
      grid-template-columns: 1fr;
    }

    .rail div {
      min-height: auto;
    }
  }
</style>
