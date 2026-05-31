<script>
  const cases = {
    chat: {
      label: 'ordinary chat',
      note: 'Common words and spaces merge into larger pieces.',
      initial: ['T', 'h', 'e', ' ', 'm', 'o', 'd', 'e', 'l', ' ', 'a', 'n', 's', 'w', 'e', 'r', 's'],
      merges: [
        ['T', 'h', 'Th'],
        ['Th', 'e', 'The'],
        ['m', 'o', 'mo'],
        ['mo', 'd', 'mod'],
        ['mod', 'e', 'mode'],
        ['mode', 'l', 'model'],
        ['a', 'n', 'an'],
        ['s', 'w', 'sw'],
        ['e', 'r', 'er'],
        ['sw', 'er', 'swer'],
        ['an', 'swer', 'answer'],
        ['answer', 's', 'answers'],
      ],
    },
    code: {
      label: 'code or logs',
      note: 'Long identifiers can split into many less common pieces.',
      initial: ['g', 'e', 't', '_', 'u', 's', 'e', 'r', '_', 'p', 'r', 'o', 'f', 'i', 'l', 'e', '_', 'v', '2'],
      merges: [
        ['g', 'e', 'ge'],
        ['ge', 't', 'get'],
        ['u', 's', 'us'],
        ['us', 'e', 'use'],
        ['use', 'r', 'user'],
        ['p', 'r', 'pr'],
        ['pr', 'o', 'pro'],
        ['f', 'i', 'fi'],
        ['l', 'e', 'le'],
        ['pro', 'fi', 'profi'],
        ['profi', 'le', 'profile'],
        ['v', '2', 'v2'],
      ],
    },
    encoded: {
      label: 'encoded blob',
      note: 'Random-looking strings often stay split into small pieces.',
      initial: ['Q', 'm', '9', 'v', 'c', '3', 'Q', 'u', 'e', 'H', 'l', '6', 'L', 'T', 'A', '='],
      merges: [
        ['Q', 'm', 'Qm'],
        ['c', '3', 'c3'],
        ['Q', 'u', 'Qu'],
        ['e', 'H', 'eH'],
        ['l', '6', 'l6'],
        ['L', 'T', 'LT'],
      ],
    },
    unicode: {
      label: 'mixed scripts and emoji',
      note: 'Uncommon characters may stay as smaller pieces.',
      initial: ['N', 'a', 'm', 'a', 's', 't', 'e', ' ', 'न', 'म', 'स', '्', 'त', 'े', ' ', '🙂'],
      merges: [
        ['N', 'a', 'Na'],
        ['Na', 'm', 'Nam'],
        ['a', 's', 'as'],
        ['as', 't', 'ast'],
        ['ast', 'e', 'aste'],
        ['Nam', 'aste', 'Namaste'],
        ['न', 'म', 'नम'],
        ['त', 'े', 'ते'],
      ],
    },
  }

  let mode = $state('chat')
  let step = $state(6)
  let current = $derived(cases[mode])
  let maxStep = $derived(current.merges.length)

  function applyMerge(tokens, [left, right, merged]) {
    const out = []
    let i = 0
    while (i < tokens.length) {
      if (tokens[i] === left && tokens[i + 1] === right) {
        out.push(merged)
        i += 2
      } else {
        out.push(tokens[i])
        i += 1
      }
    }
    return out
  }

  let visibleStep = $derived(Math.min(step, maxStep))
  let pieces = $derived.by(() => {
    let tokens = current.initial
    for (let i = 0; i < visibleStep; i++) tokens = applyMerge(tokens, current.merges[i])
    return tokens
  })
  let activeMerge = $derived(current.merges[Math.max(0, visibleStep - 1)] ?? null)

  function idFor(piece) {
    let h = 0
    for (let i = 0; i < piece.length; i++) h = (h * 33 + piece.charCodeAt(i)) % 90000
    return h + 1000
  }

  function setMode(next) {
    mode = next
    step = Math.min(step, cases[next].merges.length)
  }
</script>

<figure class="trace-viz" aria-labelledby="merge-title">
  <div class="header">
    <div>
      <h3 id="merge-title">A Tokenizer Is a Fixed Merge Recipe</h3>
      <p>
        This toy BPE trace starts with small pieces and applies learned merges. Real tokenizers use much larger vocabularies, but the serving rule is the same.
      </p>
    </div>
    <div class="modes" role="group" aria-label="Tokenization input type">
      {#each Object.entries(cases) as [key, item]}
        <button type="button" class:active={mode === key} onclick={() => setMode(key)}>
          {item.label}
        </button>
      {/each}
    </div>
  </div>

  <label>
    Merge steps
    <input aria-label="Merge steps" type="range" min="0" max={maxStep} step="1" bind:value={step} />
    <span>{visibleStep}/{maxStep}</span>
  </label>

  <div class="active">
    <span>Current rule</span>
    <strong>{activeMerge ? `${activeMerge[0]} + ${activeMerge[1]} -> ${activeMerge[2]}` : 'start from smallest pieces'}</strong>
    <small>{current.note}</small>
  </div>

  <div class="pieces" aria-live="polite">
    {#each pieces as piece, index}
      <div class="piece">
        <strong>{piece === ' ' ? 'space' : piece}</strong>
        <span>id {idFor(piece)}</span>
        <small>pos {index}</small>
      </div>
    {/each}
  </div>

  <div class="readout">
    <div>
      <span>Initial pieces</span>
      <strong>{current.initial.length}</strong>
    </div>
    <div>
      <span>Current token count</span>
      <strong>{pieces.length}</strong>
    </div>
    <div>
      <span>Context cost</span>
      <strong>{pieces.length} positions</strong>
    </div>
  </div>

  <noscript>
    <p>
      Static fallback: BPE-style tokenizers repeatedly merge common adjacent pieces. The final pieces are mapped to fixed integer ids that must match the model's embedding table.
    </p>
  </noscript>
</figure>

<style>
  .trace-viz {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-background, #111) 92%, var(--theme-green, #10b981));
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
  .active span,
  .active small,
  .piece span,
  .piece small,
  .readout span {
    color: var(--theme-foreground-light, #aaa);
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.35rem;
    max-width: 360px;
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
    background: var(--theme-green, #10b981);
    color: var(--theme-background, #111);
  }

  label {
    display: grid;
    grid-template-columns: 120px 1fr 70px;
    gap: 0.6rem;
    align-items: center;
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .active,
  .readout div,
  .piece {
    border: 1px solid var(--theme-separator, #333);
    border-radius: 8px;
    padding: 0.7rem;
  }

  .active strong,
  .active span,
  .active small,
  .piece strong,
  .piece span,
  .piece small,
  .readout span,
  .readout strong {
    display: block;
  }

  .active {
    margin-bottom: 0.8rem;
  }

  .active strong {
    margin: 0.2rem 0;
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
  }

  .pieces {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
    gap: 0.5rem;
  }

  .piece {
    min-height: 74px;
    background: color-mix(in srgb, var(--theme-green, #10b981) 9%, transparent);
    overflow-wrap: anywhere;
  }

  .piece strong {
    min-height: 1.3rem;
  }

  .piece span,
  .piece small {
    font-family: var(--theme-font-mono, 'JetBrains Mono', monospace);
    font-size: 0.68rem;
  }

  .readout {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    margin-top: 1rem;
  }

  @media (max-width: 700px) {
    .header,
    .readout {
      grid-template-columns: 1fr;
    }

    .modes {
      justify-content: flex-start;
    }

    label {
      grid-template-columns: 1fr;
    }
  }
</style>
