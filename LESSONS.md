# Lessons Learned

## 2026-08-11 - TRACE Svelte islands need SSR and extracted CSS

**Symptom:** A TRACE interactive first appears with the article's global styles, then changes shape when Svelte hydrates it. Switching the island to `client:only="svelte"` removes that incorrect first frame, but replaces it with empty server HTML, eager JavaScript loading, and no interactive content when JavaScript is unavailable.

**Root cause:** `css: 'injected'` puts each component's scoped CSS in its client JavaScript. A `client:visible` island is server-rendered before that JavaScript runs, so the browser lays out correct component markup without its component stylesheet. Hydration then injects the stylesheet and causes the visible redesign.

**Current invariant:** TRACE Svelte islands use `client:visible`, and the Astro Svelte integration uses its default extracted-CSS mode:

```js
svelte()
```

This gives the browser styled server markup on the first paint, preserves useful content without JavaScript, and hydrates each interactive lazily as it approaches the viewport.

**Verification:** With Astro 6.4.2, `@astrojs/svelte` 8.1.2, and Svelte 5.56.0, all 125 TRACE islands were production-built, scrolled into view, and checked for successful hydration and scoped styling. Stateful representatives were interacted with after SSR hydration. The earlier Svelte 5.53 `lifecycle_outside_component` failure did not recur.

**Historical trap:** External CSS can be omitted for `client:only` islands because they have no server-rendered component entry from which Astro can retain the stylesheet. Do not combine TRACE `client:only` islands with external CSS, and do not restore injected CSS to compensate. Fix or upgrade the hydration path instead.

**Regression guard:** `npm run build` runs `scripts/check-trace-islands.mjs`, which rejects client-only, empty, or unstyled TRACE islands in generated production HTML.

## 2026-08-11 - Lazy hydration must finish before an island is visible

**Symptom:** Even with correct SSR markup and extracted component CSS, an interactive can appear to morph as the reader scrolls it into view.

**Root cause:** A zero-margin `client:visible` directive starts hydration only when the island crosses the viewport boundary. Svelte then normalizes text nodes, form attributes, and bound SVG attributes while the reader is already looking at the component. In development, representative islands needed 50-66 ms for that activation.

**Current invariant:** The LLM-scale TRACE post uses `client:visible={{ rootMargin: '4000px 0px' }}`. This keeps the islands lazy while giving roughly the next two interactives time to hydrate before the reader reaches them.

**Regression guard:** `scripts/check-trace-islands.mjs` verifies that every generated LLM-scale island carries the required hydration margin in its serialized client options.
