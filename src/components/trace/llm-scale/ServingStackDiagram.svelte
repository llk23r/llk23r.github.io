<script>
  const rows = [
    ['Browser / app', 'SSE or WebSocket stream', 'human latency'],
    ['Edge', 'TLS, request ids, regional routing', 'network latency'],
    ['API gateway', 'auth, quota, abuse filters, policy', 'admission control'],
    ['Router', 'model choice, region, warm pool, cache locality', 'placement'],
    ['Inference server', 'tokenization, batching, sampling, streaming', 'scheduling'],
    ['Worker process', 'runtime graph, kernels, KV cache blocks', 'GPU utilization'],
    ['GPU node', 'HBM, tensor cores, NVLink, NIC', 'memory bandwidth'],
    ['Cluster fabric', 'InfiniBand or Ethernet, collectives, storage', 'fleet scale'],
  ]
</script>

<figure class="trace-viz" aria-labelledby="stack-title">
  <h3 id="stack-title">The Production Stack Is Not Just "A Model"</h3>
  <div class="stack">
    {#each rows as row, i}
      <div class="row" style="--i: {i}">
        <div class="name">{row[0]}</div>
        <div class="mechanism">{row[1]}</div>
        <div class="pressure">{row[2]}</div>
      </div>
    {/each}
  </div>

  <noscript>
    <p>
      Static fallback: production LLM serving spans browser/app, edge, gateway, router, inference server, worker process, GPU node, and cluster fabric.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-red, #ec4899));
  }

  h3 {
    margin: 0 0 1rem;
    font-size: 1rem;
  }

  .stack {
    display: grid;
    gap: 0.45rem;
  }

  .row {
    display: grid;
    grid-template-columns: 150px 1fr 130px;
    gap: 0.8rem;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) calc(88% - var(--i) * 3%), var(--theme-red, #ec4899));
  }

  .name {
    font-weight: 800;
  }

  .mechanism {
    color: var(--theme-foreground, #ddd);
  }

  .pressure {
    color: var(--theme-foreground-light, #aaa);
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.72rem;
    text-align: right;
  }

  @media (max-width: 720px) {
    .row {
      grid-template-columns: 1fr;
      gap: 0.25rem;
    }

    .pressure {
      text-align: left;
    }
  }
</style>
