<script>
  const rows = [
    ['Browser / app', 'send message, keep answer path open', 'visible wait'],
    ['Nearby web service', 'private connection, request label', 'network wait'],
    ['Front door', 'identity, usage, and safety checks', 'can enter?'],
    ['Router', 'choose a warm machine group', 'right room'],
    ['Model runner', 'prepare input, share turns, release pieces', 'work packing'],
    ['Worker process', 'loaded model copy and saved past work', 'runner health'],
    ['Accelerator machine', 'number-table math on special chips', 'chip time'],
    ['Fleet', 'many machine groups, updates, failures', 'whole service'],
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
      Static fallback: production LLM serving spans the browser, nearby web service, front door, router, model runner, worker process, accelerator machine, and the wider fleet.
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
