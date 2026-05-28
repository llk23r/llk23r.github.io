<script>
  let modelAlias = $state('reasoning-large')
  let stream = $state(true)
  let tools = $state(true)
  let maxOutput = $state(1200)
  let cancel = $state(true)

  let envelope = $derived([
    ['conversation_id', 'conv_8f31'],
    ['request_id', 'req_91ca'],
    ['model', modelAlias],
    ['stream', stream ? 'true' : 'false'],
    ['max_output_tokens', String(maxOutput)],
    ['tools', tools ? 'search, calculator' : 'none'],
    ['cancel_handle', cancel ? 'attached' : 'missing'],
  ])

  let downstream = $derived([
    ['gateway', `charge quota against ${modelAlias}`],
    ['router', tools ? 'requires tool-capable model pool' : 'can use text-only pool'],
    ['scheduler', `reserve output budget near ${maxOutput} tokens`],
    ['streamer', stream ? 'hold connection open and flush chunks' : 'return one final body'],
    ['cleanup', cancel ? 'client stop can free KV pages' : 'disconnect may leak work until timeout'],
  ])
</script>

<figure class="trace-viz" aria-labelledby="envelope-title">
  <div class="header">
    <div>
      <h3 id="envelope-title">The Browser Sends a Control Envelope</h3>
      <p>
        Your visible message is inside a request envelope. Change the fields and watch how they become routing, scheduling, and cleanup constraints.
      </p>
    </div>
    <div class="status">
      <span>Critical field</span>
      <strong>{cancel ? 'cancel handle present' : 'cleanup waits for timeout'}</strong>
    </div>
  </div>

  <div class="controls">
    <div class="models" role="group" aria-label="Model alias">
      {#each ['fast-small', 'general-large', 'reasoning-large'] as alias}
        <button type="button" class:active={modelAlias === alias} on:click={() => (modelAlias = alias)}>
          {alias}
        </button>
      {/each}
    </div>
    <label>
      Max output
      <input aria-label="Request maximum output tokens" type="range" min="128" max="4096" step="128" bind:value={maxOutput} />
      <span>{maxOutput}</span>
    </label>
    <label class="toggle">
      <input aria-label="Stream response" type="checkbox" bind:checked={stream} />
      stream response
    </label>
    <label class="toggle">
      <input aria-label="Allow tools" type="checkbox" bind:checked={tools} />
      allow tools
    </label>
    <label class="toggle">
      <input aria-label="Attach cancel handle" type="checkbox" bind:checked={cancel} />
      attach cancel handle
    </label>
  </div>

  <div class="columns">
    <div>
      <h4>request envelope</h4>
      {#each envelope as row}
        <p><code>{row[0]}</code><span>{row[1]}</span></p>
      {/each}
    </div>
    <div>
      <h4>downstream consequence</h4>
      {#each downstream as row}
        <p><code>{row[0]}</code><span>{row[1]}</span></p>
      {/each}
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: an LLM request carries conversation id, request id, model alias, stream preference, tool permissions, output budget, and cancellation state. Those fields become routing, scheduling, accounting, and cleanup constraints.
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
    grid-template-columns: 1fr minmax(180px, 0.36fr);
    gap: 1rem;
    align-items: start;
  }

  h3,
  h4,
  p {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }

  h4 {
    margin-bottom: 0.65rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .header p,
  .status span,
  .columns span {
    color: var(--theme-foreground-light, #aaa);
  }

  .status,
  .columns > div,
  .columns p {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .status span,
  .status strong {
    display: block;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  .models {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
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

  label {
    display: grid;
    grid-template-columns: 120px 1fr 70px;
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

  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .columns p {
    display: grid;
    grid-template-columns: minmax(130px, 0.42fr) 1fr;
    gap: 0.7rem;
    margin-top: 0.45rem;
    background: color-mix(in srgb, var(--theme-cyan, #06b6d4) 7%, transparent);
  }

  code {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.75rem;
    overflow-wrap: anywhere;
  }

  @media (max-width: 760px) {
    .header,
    .columns,
    .columns p,
    label {
      grid-template-columns: 1fr;
    }
  }
</style>
