<script>
  /** @type {{ steps: Array<{label: string, depth: string}>, current: number }} */
  let { steps = [], current = 0 } = $props()

  const depthColorVars = {
    human: 'var(--theme-yellow, #f59e0b)',
    hardware: 'var(--theme-cyan, #06b6d4)',
    physics: 'var(--theme-green, #10b981)',
    protocol: 'var(--theme-magenta, #8b5cf6)',
    network: 'var(--theme-caution, #f97316)',
    system: 'var(--theme-red, #ec4899)',
  }

  function getColor(depth) {
    return depthColorVars[depth] || 'var(--theme-foreground, #888)'
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
