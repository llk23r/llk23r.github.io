<script>
  /** @type {{ steps: Array<{label: string, depth: string}>, current: number }} */
  let { steps = [], current = 0 } = $props()

  const depthColors = {
    human: '#f59e0b',
    hardware: '#06b6d4',
    physics: '#10b981',
    protocol: '#8b5cf6',
    network: '#f97316',
    system: '#ec4899',
  }

  function getColor(depth) {
    return depthColors[depth] || '#888'
  }

  function isCompleted(i) {
    return current === -1 || i < current
  }

  function isActive(i) {
    return i === current
  }
</script>

<div class="journey-map" role="navigation" aria-label="Journey progress">
  {#each steps as step, i}
    <div
      class="step"
      class:completed={isCompleted(i)}
      class:active={isActive(i)}
      class:future={!isCompleted(i) && !isActive(i)}
    >
      <div class="track">
        <div
          class="dot"
          style="background: {isCompleted(i) || isActive(i) ? getColor(step.depth) : 'transparent'}; border-color: {getColor(step.depth)}"
        ></div>
        {#if i < steps.length - 1}
          <div
            class="line"
            style="background: {isCompleted(i) ? getColor(step.depth) : 'var(--theme-separator, #444)'}; opacity: {isCompleted(i) ? 0.5 : 0.2}"
          ></div>
        {/if}
      </div>
      <div class="label">
        <span class="depth-tag" style="color: {getColor(step.depth)}">{step.depth}</span>
        <span class="step-label">{step.label}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .journey-map {
    padding: 1rem 0;
    margin: 1.5rem 0;
    font-family: var(--theme-font, 'JetBrains Mono', monospace);
    font-size: 0.8rem;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    transition: opacity 0.3s ease;
  }

  .step.future {
    opacity: 0.4;
  }

  .step.active {
    opacity: 1;
  }

  .step.completed {
    opacity: 0.75;
  }

  .track {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 12px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .step.active .dot {
    width: 12px;
    height: 12px;
    box-shadow: 0 0 8px currentColor;
  }

  .line {
    width: 2px;
    height: 20px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .label {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-bottom: 0.5rem;
    line-height: 1.3;
  }

  .depth-tag {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.8;
  }

  .step-label {
    color: var(--theme-foreground, #ccc);
  }

  .step.active .step-label {
    font-weight: 600;
  }
</style>
