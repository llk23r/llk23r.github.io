<script>
  const paths = {
    rag: {
      label: 'RAG citation',
      steps: [
        ['ingest', 'policy.pdf is cleaned, chunked, embedded, and indexed before the chat'],
        ['retrieve', 'the new question searches sparse and dense indexes'],
        ['rerank', 'top chunks are reordered for relevance and source quality'],
        ['pack', 'the best chunk is trimmed into the prompt with citation metadata'],
        ['generate', 'the answer must use the chunk, not just sound plausible'],
      ],
      failure: 'wrong chunk retrieved or evidence pushed out by token budget',
    },
    tool: {
      label: 'tool call',
      steps: [
        ['schema', 'the prompt includes a callable function and argument shape'],
        ['emit', 'the model emits structured arguments instead of final prose'],
        ['validate', 'product code checks auth, types, and policy'],
        ['execute', 'the outside system returns data or an error'],
        ['continue', 'the tool result becomes new context for the next model pass'],
      ],
      failure: 'malformed arguments, stale API result, or ignored tool output',
    },
    memory: {
      label: 'conversation memory',
      steps: [
        ['select', 'recent turns and durable facts compete for context space'],
        ['summarize', 'older material may be compressed into a shorter memory'],
        ['retrieve', 'important details are fetched from a memory store'],
        ['pack', 'memory joins system text, user text, and retrieved chunks'],
        ['answer', 'the model only uses memory that reached the prompt'],
      ],
      failure: 'summary loses a detail or old memory overrides current user intent',
    },
    vlm: {
      label: 'image input',
      steps: [
        ['patch', 'the image is split or encoded into visual representations'],
        ['project', 'vision vectors are mapped near the language model space'],
        ['pack', 'image-derived tokens or cross-attention state join text'],
        ['attend', 'language tokens can condition on visual evidence'],
        ['answer', 'the final text should cite what was actually visible'],
      ],
      failure: 'visual encoder misses a detail or the text answer overstates it',
    },
  }

  let mode = $state('rag')
  let tokenBudget = $state(3200)
  let step = $state(2)
  let current = $derived(paths[mode])
  let visibleStep = $derived(Math.min(step, current.steps.length - 1))
  let packed = $derived(mode === 'rag' ? 780 : mode === 'tool' ? 460 : mode === 'memory' ? 620 : 1100)
  let budgetState = $derived(packed <= tokenBudget ? 'evidence fits' : 'evidence gets trimmed')
</script>

<figure class="trace-viz" aria-labelledby="evidence-title">
  <div class="header">
    <div>
      <h3 id="evidence-title">Evidence Has to Reach the Prompt</h3>
      <p>
        Pick an evidence path. The model can use only what survives retrieval, validation, packing, and the token budget.
      </p>
    </div>
    <div class="status">
      <span>Prompt outcome</span>
      <strong>{budgetState}</strong>
    </div>
  </div>

  <div class="modes" role="group" aria-label="Prompt evidence path">
    {#each Object.entries(paths) as [key, item]}
      <button type="button" class:active={mode === key} on:click={() => (mode = key)}>
        {item.label}
      </button>
    {/each}
  </div>

  <div class="controls">
    <label>
      Trace step
      <input aria-label="Prompt evidence trace step" type="range" min="0" max={current.steps.length - 1} step="1" bind:value={step} />
      <span>{visibleStep + 1}/{current.steps.length}</span>
    </label>
    <label>
      Evidence token budget
      <input aria-label="Evidence token budget" type="range" min="256" max="2400" step="128" bind:value={tokenBudget} />
      <span>{tokenBudget}</span>
    </label>
  </div>

  <div class="rail" aria-label="Evidence trace">
    {#each current.steps as item, index}
      <div class:done={visibleStep > index} class:active={visibleStep === index}>
        <span>{index + 1}</span>
        <strong>{item[0]}</strong>
        <small>{item[1]}</small>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Evidence tokens requested</span>
      <strong>{packed}</strong>
    </div>
    <div>
      <span>Budget result</span>
      <strong>{budgetState}</strong>
    </div>
    <div>
      <span>Failure mode</span>
      <strong>{current.failure}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: RAG, tools, memory, and image inputs help only when their evidence is retrieved or executed, validated, packed into the prompt, and actually used by the final generation.
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
    grid-template-columns: 1fr minmax(160px, 0.35fr);
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
  small,
  .status span,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .rail div,
  .readout div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status span,
  .status strong,
  .readout span,
  .readout strong,
  .rail strong,
  .rail small {
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

  .controls {
    display: grid;
    gap: 0.55rem;
    margin-bottom: 1rem;
  }

  label {
    display: grid;
    grid-template-columns: 150px 1fr 72px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .rail {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .rail div {
    min-height: 118px;
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

  .rail small,
  .readout strong {
    margin-top: 0.35rem;
    line-height: 1.35;
  }

  .readout {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  @media (max-width: 820px) {
    .header,
    .rail,
    .readout,
    label {
      grid-template-columns: 1fr;
    }

    .rail div {
      min-height: auto;
    }
  }
</style>
