# Lessons Learned

## 2026-02-21 — Svelte `client:only` components lose all CSS in production builds

**Symptom:** TRACE blog posts render with white gaps where Svelte components should be. No console errors. Components mount and execute JS, but have zero styling.

**Root cause:** Svelte's default CSS mode (`css: 'external'`) extracts component styles into virtual CSS modules (`Component.svelte?svelte&type=style&lang.css`). Vite resolves these during build and replaces the import with `/* empty css */`, expecting the CSS to land in a bundled `.css` chunk. For `client:only` components — which skip SSR entirely — this CSS chunk is silently dropped. The scoped class names (`svelte-XXXXXX`) are applied to DOM elements, but no matching CSS rules exist anywhere in the build output.

**Why it's silent:** Dev mode works fine (Vite serves CSS modules dynamically via HMR). The bug only manifests in production builds. No errors are thrown because the JS executes correctly — it's purely a missing stylesheet.

**Fix:** One line in `astro.config.mjs`:

```js
svelte({ compilerOptions: { css: 'injected' } })
```

This tells Svelte to embed CSS in each component's JS bundle and inject it at runtime via `append_styles()`, bypassing Vite's broken CSS extraction for client-only components.

**Applies when:** All Svelte components use `client:only="svelte"` (required due to Svelte 5.53+ hydration mismatch bugs with Astro SSR).

**Red herring:** Removing `$effect()` and replacing with manual function calls was attempted as a fix but was unrelated. The `$effect` pattern was correct and was restored.
