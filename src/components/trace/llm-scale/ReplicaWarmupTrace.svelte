<script>
  const modes = {
    healthy: { label: 'healthy', failAt: -1 },
    tokenizer: { label: 'tokenizer mismatch', failAt: 2 },
    cold: { label: 'cold storage', failAt: 3 },
    parallelism: { label: 'wrong split count', failAt: 1 },
  }

  const steps = [
    {
      name: 'alias resolve',
      detail: 'chat-model-large -> snapshot 2026-05-28-a',
      check: 'model card, safety envelope, region policy',
    },
    {
      name: 'split plan',
      detail: 'this worker owns one slice of each large table',
      check: 'layer names, split count, worker placement',
    },
    {
      name: 'recipe check',
      detail: 'table names, shapes, number formats, text-piece count',
      check: 'embedding rows must match token ids',
    },
    {
      name: 'read pieces',
      detail: 'storage -> ordinary memory through local disk or network path',
      check: 'fingerprints, file positions, loading speed',
    },
    {
      name: 'copy to GPU memory',
      detail: 'ordinary memory -> GPU memory for weights and workspace',
      check: 'enough GPU memory after weights, scratch, and remembered-token room',
    },
    {
      name: 'warm runtime',
      detail: 'prepare GPU programs, communication setup, and remembered-token pool',
      check: 'test prompt read and one-piece loop',
    },
    {
      name: 'register healthy',
      detail: 'router can send real sequences to this replica group',
      check: 'first-token probe, metrics, rollback tag',
    },
  ]

  let mode = $state('healthy')
  let step = $state(4)
  let currentMode = $derived(modes[mode])
  let visibleStep = $derived(Math.min(step, steps.length - 1))
  let ready = $derived(currentMode.failAt < 0 && visibleStep === steps.length - 1)
  let blocked = $derived(currentMode.failAt >= 0 && visibleStep >= currentMode.failAt)
  let message = $derived.by(() => {
    if (ready) return 'ready for routing'
    if (!blocked) return 'warming, not yet routable'
    if (mode === 'tokenizer') return 'stop: token ids would point at the wrong embedding rows'
    if (mode === 'cold') return 'slow path: replica exists but first token will wait on weight movement'
    return 'stop: model pieces do not match the split plan'
  })
</script>

<figure class="trace-viz" aria-labelledby="warmup-title">
  <div class="header">
    <div>
      <h3 id="warmup-title">A Model Snapshot Becomes a Warm Replica</h3>
      <p>
        The router should not send a chat to weights that are merely stored somewhere. The replica must load, verify, allocate, warm, and register.
      </p>
    </div>
    <div class:ready class:blocked class="status">
      <span>Replica state</span>
      <strong>{message}</strong>
    </div>
  </div>

  <div class="modes" role="group" aria-label="Replica warmup scenario">
    {#each Object.entries(modes) as [key, item]}
      <button type="button" class:active={mode === key} onclick={() => (mode = key)}>
        {item.label}
      </button>
    {/each}
  </div>

  <label>
    Warmup step
    <input aria-label="Warmup step" type="range" min="0" max={steps.length - 1} step="1" bind:value={step} />
    <span>{visibleStep + 1}/{steps.length}</span>
  </label>

  <div class="rail" aria-label="Replica warmup steps">
    {#each steps as item, index}
      {@const failed = currentMode.failAt === index && visibleStep >= index}
      <div class:done={visibleStep > index && !failed} class:active={visibleStep === index && !failed} class:failed>
        <span>{index + 1}</span>
        <strong>{item.name}</strong>
        <small>{item.detail}</small>
      </div>
    {/each}
  </div>

  <div class="inspect">
    <div>
      <span>Current artifact</span>
      <strong>{steps[visibleStep].name}</strong>
    </div>
    <div>
      <span>Check being enforced</span>
      <strong>{steps[visibleStep].check}</strong>
    </div>
    <div>
      <span>Routing answer</span>
      <strong>{ready ? 'eligible' : 'not eligible'}</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: a large model replica must choose the right snapshot, load the correct model pieces, validate the text-splitting rule and table shapes, copy weights into GPU memory, reserve room for remembered tokens, warm GPU programs, and register healthy before traffic reaches it.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-yellow, #f59e0b));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(180px, 0.38fr);
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
  .inspect span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .rail div,
  .inspect div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status.ready {
    border-color: color-mix(in srgb, var(--theme-green, #10b981) 65%, var(--theme-separator, #333));
  }

  .status.blocked {
    border-color: color-mix(in srgb, var(--theme-yellow, #f59e0b) 75%, var(--theme-separator, #333));
  }

  .status strong,
  .status span,
  .inspect span,
  .inspect strong,
  .rail strong,
  .rail small {
    display: block;
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
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
    background: var(--theme-yellow, #f59e0b);
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

  .rail {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .rail div {
    min-height: 122px;
    background: color-mix(in srgb, var(--theme-foreground, #ddd) 3%, transparent);
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
    background: var(--theme-green, #10b981);
    color: var(--theme-background, #111);
  }

  .rail div.failed {
    border-color: color-mix(in srgb, var(--theme-yellow, #f59e0b) 70%, var(--theme-separator, #333));
  }

  .rail div.failed span {
    background: var(--theme-yellow, #f59e0b);
    color: var(--theme-background, #111);
  }

  .rail small {
    margin-top: 0.35rem;
    line-height: 1.35;
  }

  .inspect {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  @media (max-width: 900px) {
    .rail {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .header,
    .inspect,
    .rail {
      grid-template-columns: 1fr;
    }

    label {
      grid-template-columns: 1fr;
    }
  }
</style>
