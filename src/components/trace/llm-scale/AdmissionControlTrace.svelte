<script>
  const tiers = {
    free: { label: 'Free', budget: 12000, latency: 'best effort' },
    pro: { label: 'Pro', budget: 36000, latency: 'interactive' },
    enterprise: { label: 'Enterprise', budget: 90000, latency: 'strict speed target' },
  }

  let tier = $state('pro')
  let promptTokens = $state(8000)
  let maxOutput = $state(1200)
  let reasoningMultiplier = $state(2)
  let memoryFreeBlocks = $state(64)
  let regionLocked = $state(true)

  let currentTier = $derived(tiers[tier])
  let hiddenReasoningTokens = $derived(Math.round(maxOutput * Math.max(0, reasoningMultiplier - 1)))
  let estimatedTokens = $derived(promptTokens + maxOutput + hiddenReasoningTokens)
  let memoryBlocksNeeded = $derived(Math.ceil((promptTokens + maxOutput + hiddenReasoningTokens) / 256))
  let quotaOk = $derived(estimatedTokens <= currentTier.budget)
  let memoryOk = $derived(memoryBlocksNeeded <= memoryFreeBlocks)
  let nearMemory = $derived(!memoryOk && memoryBlocksNeeded <= Math.ceil(memoryFreeBlocks * 1.25))
  let decision = $derived.by(() => {
    if (!quotaOk) return 'reject or ask for a smaller max output'
    if (regionLocked && !memoryOk && !nearMemory) return 'queue, downgrade, or return capacity error'
    if (!memoryOk && nearMemory) return 'queue briefly or read the prompt in smaller pieces'
    if (!memoryOk) return 'route to another loaded region if policy allows'
    if (estimatedTokens > currentTier.budget * 0.85) return 'admit with high-cost accounting tag'
    return 'admit to an already-loaded model group'
  })
  let state = $derived.by(() => {
    if (!quotaOk) return 'quota failed'
    if (!memoryOk) return nearMemory ? 'capacity tight' : 'capacity failed'
    return 'admitted'
  })
  let requestId = $derived(`req-${String(promptTokens + maxOutput + hiddenReasoningTokens).slice(0, 2)}${memoryBlocksNeeded}${tier[0]}`)
</script>

<figure class="trace-viz" aria-labelledby="admission-title">
  <div class="header">
    <div>
      <h3 id="admission-title">Admission Control Counts Tokens, Not Just Requests</h3>
      <p>
        Change the prompt, output, tier, and free memory blocks. The front door is deciding whether this request can safely enter the model queue.
      </p>
    </div>
    <div class:warn={state !== 'admitted'} class="verdict">
      <span>{state}</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <div class="controls">
    <div class="tiers" role="group" aria-label="Account tier">
      {#each Object.entries(tiers) as [key, option]}
        <button type="button" class:active={tier === key} onclick={() => (tier = key)}>
          {option.label}
        </button>
      {/each}
    </div>

    <label>
      Prompt tokens
      <input aria-label="Prompt tokens" type="range" min="500" max="60000" step="500" bind:value={promptTokens} />
      <span>{promptTokens.toLocaleString()}</span>
    </label>
    <label>
      Max output
      <input aria-label="Maximum output tokens" type="range" min="128" max="8000" step="128" bind:value={maxOutput} />
      <span>{maxOutput.toLocaleString()}</span>
    </label>
    <label>
      Reasoning multiplier
      <input aria-label="Reasoning multiplier" type="range" min="1" max="5" step="0.5" bind:value={reasoningMultiplier} />
      <span>{reasoningMultiplier.toFixed(1)}x</span>
    </label>
    <label>
      Free memory blocks
      <input aria-label="Free memory blocks" type="range" min="8" max="420" step="4" bind:value={memoryFreeBlocks} />
      <span>{memoryFreeBlocks}</span>
    </label>
    <label class="toggle">
      <input aria-label="Region locked" type="checkbox" bind:checked={regionLocked} />
      region locked by policy
    </label>
  </div>

  <div class="accounting">
    <div>
      <span>Request id</span>
      <strong>{requestId}</strong>
    </div>
    <div>
      <span>Tier token budget</span>
      <strong>{currentTier.budget.toLocaleString()}</strong>
    </div>
    <div>
      <span>Estimated total tokens</span>
      <strong>{estimatedTokens.toLocaleString()}</strong>
    </div>
    <div>
      <span>Hidden reasoning estimate</span>
      <strong>{hiddenReasoningTokens.toLocaleString()}</strong>
    </div>
    <div>
      <span>Memory blocks needed</span>
      <strong>{memoryBlocksNeeded}/{memoryFreeBlocks}</strong>
    </div>
    <div>
      <span>Latency objective</span>
      <strong>{currentTier.latency}</strong>
    </div>
  </div>

  <div class="pipeline" aria-label="Admission path">
    <div class:ok={true}>
      <strong>identity</strong>
      <span>session, org, model alias</span>
    </div>
    <div class:ok={quotaOk} class:bad={!quotaOk}>
      <strong>quota</strong>
      <span>tokens per minute, spend cap</span>
    </div>
    <div class:ok={quotaOk} class:bad={!quotaOk}>
      <strong>policy</strong>
      <span>region, abuse, safety precheck</span>
    </div>
    <div class:ok={memoryOk} class:bad={!memoryOk}>
      <strong>capacity</strong>
      <span>loaded model and memory blocks</span>
    </div>
    <div class:ok={quotaOk && memoryOk} class:bad={!quotaOk || !memoryOk}>
      <strong>route</strong>
      <span>{decision}</span>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: admission control estimates prompt tokens, output tokens, hidden reasoning work, account quota, policy constraints, and free conversation-memory blocks before sending a request to an already-loaded model group.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-cyan, #06b6d4));
  }

  .header {
    display: grid;
    grid-template-columns: 1fr minmax(190px, 0.45fr);
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
  .accounting span,
  .pipeline span,
  .verdict span {
    color: var(--theme-foreground-light, #aaa);
  }

  .verdict,
  .accounting div,
  .pipeline div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .verdict {
    border-color: color-mix(in srgb, var(--theme-green, #10b981) 55%, var(--theme-separator, #333));
  }

  .verdict.warn {
    border-color: color-mix(in srgb, var(--theme-yellow, #f59e0b) 65%, var(--theme-separator, #333));
  }

  .verdict strong {
    display: block;
    margin-top: 0.25rem;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  .tiers {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  button {
    min-height: 36px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 7px;
    padding: 0.45rem 0.7rem;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    cursor: pointer;
  }

  button.active {
    background: var(--theme-cyan, #06b6d4);
    color: var(--theme-background, #111);
  }

  label {
    display: grid;
    grid-template-columns: 160px 1fr 86px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .toggle {
    grid-template-columns: auto 1fr;
  }

  .accounting {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    margin-bottom: 1rem;
  }

  .accounting strong,
  .accounting span,
  .pipeline strong,
  .pipeline span {
    display: block;
  }

  .accounting strong {
    margin-top: 0.2rem;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    overflow-wrap: anywhere;
  }

  .pipeline {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .pipeline div {
    position: relative;
    min-height: 92px;
  }

  .pipeline div::before {
    content: '';
    display: block;
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 999px;
    margin-bottom: 0.45rem;
    background: var(--theme-foreground-light, #aaa);
  }

  .pipeline div.ok::before {
    background: var(--theme-green, #10b981);
  }

  .pipeline div.bad::before {
    background: var(--theme-yellow, #f59e0b);
  }

  .pipeline span {
    margin-top: 0.25rem;
    font-size: 0.78rem;
    line-height: 1.35;
  }

  @media (max-width: 760px) {
    .header,
    .accounting,
    .pipeline {
      grid-template-columns: 1fr;
    }

    label {
      grid-template-columns: 1fr;
    }
  }
</style>
