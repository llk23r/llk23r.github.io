<script>
  const tiers = {
    standard: { label: 'standard', tpm: 120000, priority: 1, hidden: 0.9 },
    pro: { label: 'pro', tpm: 600000, priority: 2, hidden: 1.2 },
    enterprise: { label: 'enterprise', tpm: 2400000, priority: 3, hidden: 1.5 },
  }

  let tier = $state('pro')
  let promptTokens = $state(8000)
  let maxOutput = $state(1200)
  let reasoning = $state(2)
  let queueMs = $state(420)
  let kvFree = $state(72)

  let current = $derived(tiers[tier])
  let hiddenTokens = $derived(Math.round(maxOutput * reasoning * current.hidden))
  let reservedTokens = $derived(promptTokens + maxOutput + hiddenTokens)
  let tokenPct = $derived(Math.min(100, Math.round((reservedTokens / current.tpm) * 100)))
  let kvNeeded = $derived(Math.min(100, Math.round((promptTokens / 1000) + (maxOutput / 400) + reasoning * 7)))
  let admitted = $derived(tokenPct < 80 && kvNeeded < kvFree && queueMs < 1200)
  let decision = $derived.by(() => {
    if (!admitted && kvNeeded >= kvFree) return 'route, downgrade, or reject: KV budget is tight'
    if (!admitted && tokenPct >= 80) return 'reject or queue: token budget would be overrun'
    if (!admitted) return 'queue or shed: latency guardrail is already hot'
    return 'admit and reserve capacity'
  })
</script>

<figure class="trace-viz" aria-labelledby="reservation-title">
  <div class="header">
    <div>
      <h3 id="reservation-title">Admission Is a Reservation, Not a Boolean</h3>
      <p>
        The gateway turns a request into estimated future work: prompt tokens, visible output, hidden reasoning, queue time, and KV-cache pressure.
      </p>
    </div>
    <div class:bad={!admitted} class="status">
      <span>Decision</span>
      <strong>{decision}</strong>
    </div>
  </div>

  <div class="tiers" role="group" aria-label="Account tier">
    {#each Object.entries(tiers) as [key, item]}
      <button type="button" class:active={tier === key} on:click={() => (tier = key)}>
        {item.label}
      </button>
    {/each}
  </div>

  <div class="controls">
    <label>
      Prompt tokens
      <input aria-label="Prompt tokens" type="range" min="512" max="64000" step="512" bind:value={promptTokens} />
      <span>{promptTokens.toLocaleString()}</span>
    </label>
    <label>
      Max output
      <input aria-label="Maximum output tokens" type="range" min="128" max="8000" step="128" bind:value={maxOutput} />
      <span>{maxOutput.toLocaleString()}</span>
    </label>
    <label>
      Reasoning budget
      <input aria-label="Reasoning budget" type="range" min="0" max="4" step="1" bind:value={reasoning} />
      <span>{reasoning}x</span>
    </label>
    <label>
      Queue age
      <input aria-label="Queue age milliseconds" type="range" min="0" max="2500" step="50" bind:value={queueMs} />
      <span>{queueMs} ms</span>
    </label>
    <label>
      Free KV blocks
      <input aria-label="Free KV budget percent" type="range" min="15" max="95" step="1" bind:value={kvFree} />
      <span>{kvFree}%</span>
    </label>
  </div>

  <div class="ledger">
    <div>
      <span>Reserved tokens</span>
      <strong>{reservedTokens.toLocaleString()}</strong>
      <small>{tokenPct}% of tier TPM</small>
    </div>
    <div>
      <span>Hidden work estimate</span>
      <strong>{hiddenTokens.toLocaleString()}</strong>
      <small>not necessarily shown to user</small>
    </div>
    <div>
      <span>KV pressure</span>
      <strong>{kvNeeded}% needed</strong>
      <small>{kvFree}% free</small>
    </div>
    <div>
      <span>Routing priority</span>
      <strong>{current.priority}</strong>
      <small>used only after policy and residency checks</small>
    </div>
  </div>

  <p class="estimate">Teaching estimate: real admission systems use model-specific profilers, measured prompt tokenization, per-region capacity, policy state, and scheduler feedback. The point here is the reservation shape, not the exact formula.</p>

  <noscript>
    <p>
      Static fallback: admission estimates prompt tokens, output tokens, hidden reasoning work, queue age, and KV-cache pressure before allowing GPU work.
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
    grid-template-columns: 1fr minmax(210px, 0.36fr);
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
  .ledger span,
  .estimate,
  .ledger small {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .ledger div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .status.bad {
    border-color: var(--theme-yellow, #f59e0b);
  }

  .tiers {
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
    background: var(--theme-cyan, #06b6d4);
    color: var(--theme-background, #111);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
  }

  label {
    display: grid;
    grid-template-columns: 140px 1fr 92px;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  .ledger {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .status strong,
  .ledger strong,
  .ledger small,
  label span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .ledger span,
  .ledger strong,
  .ledger small {
    display: block;
  }

  .estimate {
    margin-top: 0.85rem;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  @media (max-width: 760px) {
    .header,
    .ledger,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
