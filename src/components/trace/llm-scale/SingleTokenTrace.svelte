<script>
  let step = $state(0)
  let batch = $state(24)
  let context = $state(8192)
  let hidden = $state(8192)
  let layers = $state(80)
  let tensorParallel = $state(4)
  let kvHeads = $state(8)
  let headDim = $state(128)
  let bytes = $state(2)

  let activationKiB = $derived((batch * hidden * bytes) / 1024)
  let kvWriteMiB = $derived((batch * layers * 2 * kvHeads * headDim * bytes) / 1024 ** 2)
  let kvReadMiBOneLayer = $derived((batch * context * 2 * kvHeads * headDim * bytes) / 1024 ** 2)
  let logitsMiB = $derived((batch * 128000 * bytes) / 1024 ** 2)
  let shardHidden = $derived(Math.ceil(hidden / tensorParallel))

  function selectStep(event) {
    step = Number(event.currentTarget.dataset.step)
  }

  let steps = $derived.by(() => [
    {
      title: '1. Scheduler admits a decode iteration',
      layer: 'serving runtime',
      shape: 'active batch: [B sequences]',
      memory: 'checks queue, KV blocks, priority, cancellation',
      sync: 'none yet',
      result: 'your sequence is placed beside other sequences for one token step',
    },
    {
      title: '2. Runtime gathers the last-token vectors',
      layer: 'GPU memory',
      shape: 'X: [B, 1, H]',
      memory: 'read current hidden state and pointers to KV pages',
      sync: 'batch metadata must agree with cache allocator',
      result: 'the worker has the vectors needed for this step',
    },
    {
      title: '3. Attention projections run',
      layer: 'tensor cores',
      shape: 'Q: [B, heads, 1, head_dim]',
      memory: 'read Wq/Wk/Wv shards from HBM, tile into on-chip memory',
      sync: 'tensor-parallel shards may all-gather partial projections',
      result: 'new query/key/value tensors exist for this layer',
    },
    {
      title: '4. Attention reads the KV cache',
      layer: 'HBM -> SRAM tiles',
      shape: 'scores: [B, heads, 1, T]',
      memory: 'stream previous keys and values from KV pages',
      sync: 'none inside a single shard; bandwidth is the limiter',
      result: 'the new token attends to the whole visible past',
    },
    {
      title: '5. Attention output crosses shards',
      layer: 'multi-GPU node',
      shape: 'partial output: [B, 1, H / TP]',
      memory: 'communication buffers hold partial activation shards',
      sync: 'all-reduce or all-gather depending on sharding',
      result: 'every shard has the activation shape needed for the next sublayer',
    },
    {
      title: '6. MLP expands and contracts the vector',
      layer: 'tensor cores',
      shape: 'MLP: [B, 1, H] -> [B, 1, 4H-ish] -> [B, 1, H]',
      memory: 'read large MLP weights; keep tiles hot if possible',
      sync: 'tensor-parallel collective after the projection',
      result: 'the layer has edited the token representation',
    },
    {
      title: '7. Repeat through every layer',
      layer: 'model stack',
      shape: `layers: ${layers}`,
      memory: 'activation streams through layer after layer',
      sync: 'pipeline stages send activations if layers are split',
      result: 'the final hidden vector is ready',
    },
    {
      title: '8. Vocabulary projection makes logits',
      layer: 'output head',
      shape: 'logits: [B, vocab]',
      memory: 'read output matrix; write raw vocabulary scores',
      sync: 'vocab or tensor shards may need gather/reduce',
      result: 'one score exists for every possible next token',
    },
    {
      title: '9. Sampler chooses one token id',
      layer: 'runtime policy',
      shape: 'token id: [B]',
      memory: 'apply masks, temperature, top-p, structured-output rules',
      sync: 'CPU/GPU boundary depends on runtime implementation',
      result: 'your next token is selected, but not yet text',
    },
    {
      title: '10. KV cache appends the new key/value',
      layer: 'KV allocator',
      shape: 'new KV: [layers, 2, kv_heads, head_dim]',
      memory: 'write new K/V blocks and update sequence length',
      sync: 'allocator metadata must remain consistent',
      result: 'future tokens can attend to this token',
    },
    {
      title: '11. Detokenizer converts id to bytes',
      layer: 'serving process',
      shape: 'token id -> byte piece',
      memory: 'lookup tokenizer table and merge fragments',
      sync: 'may wait for UTF-8 or policy buffer',
      result: 'the token becomes a streamable text fragment',
    },
    {
      title: '12. Stream flushes to the browser',
      layer: 'network/UI',
      shape: 'SSE/WebSocket event',
      memory: 'connection buffers carry bytes back to the edge',
      sync: 'cancellation can free the remaining scheduled work',
      result: 'your screen changes, then the next decode iteration begins',
    },
  ])

  let current = $derived(steps[step])
</script>

<figure class="trace-viz" aria-labelledby="single-token-title">
  <div class="header">
    <div>
      <h3 id="single-token-title">One Token, Fully Traced</h3>
      <p>Scrub one decode iteration. The user sees one text fragment; the system sees scheduling, tensors, cache reads, collectives, sampling, and streaming.</p>
    </div>
    <div class="step-readout">
      <span>Step</span>
      <strong>{step + 1}/{steps.length}</strong>
    </div>
  </div>

  <label class="scrub">
    Trace position
    <input type="range" min="0" max={steps.length - 1} step="1" bind:value={step} />
  </label>

  <div class="timeline" aria-label="Single token trace steps">
    {#each steps as item, i}
      <button type="button" class:active={i === step} aria-pressed={i === step} data-step={i} onclick={selectStep} aria-label={item.title}>
        {i + 1}
      </button>
    {/each}
  </div>

  <div class="stage">
    <div>
      <span>Current layer</span>
      <strong>{current.layer}</strong>
    </div>
    <div>
      <span>Tensor shape</span>
      <strong>{current.shape}</strong>
    </div>
    <div>
      <span>Memory movement</span>
      <strong>{current.memory}</strong>
    </div>
    <div>
      <span>Synchronization</span>
      <strong>{current.sync}</strong>
    </div>
  </div>

  <p class="result">{current.result}</p>

  <div class="controls">
    <label>
      Active sequences
      <input type="range" min="1" max="128" step="1" bind:value={batch} />
      <span>{batch}</span>
    </label>
    <label>
      Context tokens
      <input type="range" min="1024" max="32768" step="1024" bind:value={context} />
      <span>{context.toLocaleString()}</span>
    </label>
    <label>
      Hidden width
      <input type="range" min="2048" max="16384" step="1024" bind:value={hidden} />
      <span>{hidden.toLocaleString()}</span>
    </label>
    <label>
      Tensor-parallel GPUs
      <input type="range" min="1" max="8" step="1" bind:value={tensorParallel} />
      <span>{tensorParallel}</span>
    </label>
  </div>

  <div class="numbers">
    <div>
      <span>Activation per layer</span>
      <strong>{activationKiB.toFixed(0)} KiB</strong>
      <small>[B, 1, H] at {bytes} bytes</small>
    </div>
    <div>
      <span>KV read per layer</span>
      <strong>{kvReadMiBOneLayer.toFixed(1)} MiB</strong>
      <small>past K/V for active batch</small>
    </div>
    <div>
      <span>KV write per token step</span>
      <strong>{kvWriteMiB.toFixed(1)} MiB</strong>
      <small>new K/V across all layers</small>
    </div>
    <div>
      <span>Hidden per TP shard</span>
      <strong>{shardHidden.toLocaleString()}</strong>
      <small>idealized shard width</small>
    </div>
    <div>
      <span>Logits buffer</span>
      <strong>{logitsMiB.toFixed(1)} MiB</strong>
      <small>assuming 128k vocabulary</small>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: one generated token moves through scheduler admission, last-token activation, attention projections, KV-cache reads, collectives, MLP, final logits, sampling, KV append, detokenization, and network streaming.
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
    grid-template-columns: 1fr auto;
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
  .stage span,
  .numbers span,
  .step-readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .step-readout {
    min-width: 88px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
    text-align: right;
  }

  .step-readout strong {
    display: block;
    color: var(--theme-cyan, #06b6d4);
    font-size: 1.4rem;
  }

  .scrub {
    display: grid;
    gap: 0.4rem;
    margin: 1rem 0 0.75rem;
    font-size: 0.82rem;
  }

  input {
    width: 100%;
  }

  .timeline {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 0.3rem;
    margin-bottom: 0.75rem;
  }

  button {
    min-height: 36px;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 6px;
    background: transparent;
    color: var(--theme-foreground, #ddd);
    cursor: pointer;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  button.active {
    background: var(--theme-cyan, #06b6d4);
    color: var(--theme-background, #111);
  }

  .stage {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
    gap: 0.55rem;
  }

  .stage div,
  .numbers div {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .stage strong,
  .numbers strong {
    display: block;
    margin-top: 0.35rem;
    color: var(--theme-cyan, #06b6d4);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.88rem;
    line-height: 1.35;
  }

  .result {
    margin: 0.9rem 0;
    padding-left: 0.75rem;
    border-left: 3px solid var(--theme-cyan, #06b6d4);
  }

  .controls {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0;
  }

  .controls label {
    display: grid;
    grid-template-columns: 145px 1fr 92px;
    gap: 0.7rem;
    align-items: center;
    font-size: 0.82rem;
  }

  .controls span {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .numbers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.55rem;
  }

  .numbers strong {
    font-size: 0.95rem;
  }

  @media (max-width: 640px) {
    .header,
    .controls label {
      grid-template-columns: 1fr;
    }

    .step-readout {
      text-align: left;
    }

    .timeline {
      grid-template-columns: repeat(6, 1fr);
    }
  }
</style>
