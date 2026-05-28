<script>
  const scenarios = {
    supported: {
      label: 'supported',
      retrieved: 'Plan A allows refunds within 30 days if usage is under 10 hours.',
      packed: true,
      toolOk: true,
      claim: 'Plan A refunds are available within 30 days under the usage limit.',
      verdict: 'release with citation',
    },
    wrong: {
      label: 'wrong chunk',
      retrieved: 'Plan B allows account transfer but says nothing about refunds.',
      packed: true,
      toolOk: true,
      claim: 'Plan A refunds are available within 30 days.',
      verdict: 'block or answer with uncertainty',
    },
    trimmed: {
      label: 'trimmed evidence',
      retrieved: 'Plan A allows refunds within 30 days if usage is under 10 hours.',
      packed: false,
      toolOk: true,
      claim: 'Plan A refunds are available within 30 days.',
      verdict: 'unsupported: evidence never reached prompt',
    },
    stale: {
      label: 'stale tool',
      retrieved: 'Policy lookup failed; cached result is 54 days old.',
      packed: true,
      toolOk: false,
      claim: 'Plan A refunds are available within 30 days.',
      verdict: 'call tool again or disclose uncertainty',
    },
  }

  const steps = ['query rewrite', 'retrieve candidates', 'rerank source', 'pack evidence', 'generate claim', 'verify support']

  let mode = $state('supported')
  let step = $state(3)
  let current = $derived(scenarios[mode])
  let visibleStep = $derived(Math.min(step, steps.length - 1))
  let toySupport = $derived(current.packed && current.toolOk && current.retrieved.includes('refunds'))
</script>

<figure class="trace-viz" aria-labelledby="claim-title">
  <div class="header">
    <div>
      <h3 id="claim-title">One Claim Needs an Evidence Chain</h3>
      <p>
        Change the failure mode. A grounded answer is not just a retrieved document plus fluent text; the evidence has to be selected, packed, used, and checked.
      </p>
    </div>
    <div class:bad={!toySupport} class="status">
      <span>Final gate</span>
      <strong>{current.verdict}</strong>
    </div>
  </div>

  <div class="modes" role="group" aria-label="Grounding scenario">
    {#each Object.entries(scenarios) as [key, item]}
      <button type="button" class:active={mode === key} on:click={() => (mode = key)}>
        {item.label}
      </button>
    {/each}
  </div>

  <label>
    Evidence step
    <input aria-label="Evidence chain step" type="range" min="0" max={steps.length - 1} step="1" bind:value={step} />
    <span>{visibleStep + 1}/{steps.length}</span>
  </label>

  <div class="rail" aria-label="Grounding chain">
    {#each steps as item, index}
      <div class:done={visibleStep > index} class:active={visibleStep === index}>
        <span>{index + 1}</span>
        <strong>{item}</strong>
      </div>
    {/each}
  </div>

  <div class="panes">
    <div>
      <span>Retrieved / tool evidence</span>
      <strong>{current.retrieved}</strong>
    </div>
    <div>
      <span>Evidence in prompt?</span>
      <strong>{current.packed ? 'yes' : 'no'}</strong>
    </div>
    <div>
      <span>Draft claim</span>
      <strong>{current.claim}</strong>
    </div>
    <div>
      <span>Toy support check</span>
      <strong>{toySupport ? 'claim follows from evidence' : 'claim is not proven by context'}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: a grounded claim requires query processing, retrieval or tool execution, reranking, prompt packing, generation, and a final support check against the evidence that actually reached the model. This miniature uses a toy check; production systems need stronger citation and entailment checks.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-purple, #8b5cf6));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(180px, 0.36fr);
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
  .panes span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .rail div,
  .panes div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status.bad {
    border-color: color-mix(in srgb, var(--theme-yellow, #f59e0b) 75%, var(--theme-separator, #333));
  }

  .status span,
  .status strong,
  .panes span,
  .panes strong {
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
    background: var(--theme-purple, #8b5cf6);
    color: white;
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

  .rail {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.55rem;
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
    background: var(--theme-purple, #8b5cf6);
    color: white;
  }

  .rail strong {
    display: block;
    font-size: 0.8rem;
  }

  .panes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .panes strong {
    margin-top: 0.3rem;
    line-height: 1.35;
  }

  @media (max-width: 820px) {
    .header,
    .rail,
    .panes,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
