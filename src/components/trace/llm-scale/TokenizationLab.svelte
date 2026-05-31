<script>
  let text = $state('Tell me why GPUs make LLMs fast.')

  function hashToken(token) {
    let h = 2166136261
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return Math.abs(h % 50000)
  }

  function splitChunk(chunk) {
    if (/^\s+$/.test(chunk) || chunk.length <= 6) return [chunk]
    const parts = []
    let start = 0
    const first = Math.min(4, chunk.length)
    parts.push(chunk.slice(0, first))
    start = first
    while (start < chunk.length) {
      const end = Math.min(start + 3, chunk.length)
      parts.push('##' + chunk.slice(start, end))
      start = end
    }
    return parts
  }

  function isSpace(token) {
    return /^\s+$/.test(token)
  }

  let tokens = $derived(
    text
      .match(/\s+|[A-Za-z0-9]+|[^\sA-Za-z0-9]/g)
      ?.flatMap(splitChunk)
      .filter(Boolean) ?? []
  )

  let bytes = $derived(new TextEncoder().encode(text).length)
  let chars = $derived(Array.from(text).length)
</script>

<figure class="trace-viz" aria-labelledby="tokenizer-title">
  <div class="header">
    <div>
      <h3 id="tokenizer-title">The Model Sees Token IDs</h3>
      <p>This is a toy tokenizer: it is not any provider's vocabulary. It shows the important shape: text becomes chunks, and chunks become integers.</p>
    </div>
    <div class="stats" aria-label="Tokenization counts">
      <span>{chars} chars</span>
      <span>{bytes} bytes</span>
      <span>{tokens.length} tokens</span>
    </div>
  </div>

  <label class="input-label">
    Prompt text
    <textarea bind:value={text} rows="3" maxlength="180"></textarea>
  </label>

  <div class="token-grid" aria-live="polite">
    {#each tokens as token, i}
      <div class="token" class:space={isSpace(token)}>
        <span class="piece">{isSpace(token) ? 'space' : token}</span>
        <span class="id">id {hashToken(token)}</span>
        <span class="index">#{i}</span>
      </div>
    {/each}
  </div>

  <div class="lesson">
    <strong>Why this matters:</strong> context size, waiting time, memory use, and billing all count tokens. A long word, code identifier, emoji, or pasted log can cost more token positions than your eyes expect.
  </div>

  <noscript>
    <p>
      Static fallback: tokenizers split text into reusable pieces, then map each piece to an integer id. The model receives those ids, not raw words or characters.
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
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
  }

  h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: var(--theme-foreground-light, #aaa);
    line-height: 1.5;
  }

  .stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.75rem;
    white-space: nowrap;
    color: var(--theme-cyan, #06b6d4);
  }

  .input-label {
    display: grid;
    gap: 0.4rem;
    margin: 1rem 0;
    color: var(--theme-foreground, #ddd);
    font-weight: 650;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.75rem;
    background: var(--theme-background, #111);
    color: var(--theme-foreground, #ddd);
    font: inherit;
    line-height: 1.45;
  }

  .token-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 0.5rem;
  }

  .token {
    position: relative;
    min-height: 68px;
    border: 1px solid color-mix(in srgb, var(--theme-cyan, #06b6d4) 45%, var(--theme-separator, #333));
    border-radius: 8px;
    padding: 0.55rem;
    background: color-mix(in srgb, var(--theme-cyan, #06b6d4) 10%, transparent);
    overflow-wrap: anywhere;
  }

  .token.space {
    border-style: dashed;
    opacity: 0.85;
  }

  .piece {
    display: block;
    min-height: 1.35rem;
    font-weight: 700;
  }

  .id,
  .index {
    display: block;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.68rem;
    color: var(--theme-foreground-light, #aaa);
  }

  .index {
    position: absolute;
    right: 0.45rem;
    bottom: 0.35rem;
  }

  .lesson {
    margin-top: 1rem;
    padding: 0.75rem;
    border-left: 3px solid var(--theme-cyan, #06b6d4);
    color: var(--theme-foreground-light, #aaa);
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .header {
      flex-direction: column;
    }

    .stats {
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
</style>
