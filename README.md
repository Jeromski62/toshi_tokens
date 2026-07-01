# Toshi Design System

![Toshi Design System](readMe_banner.jpg)

**An agent-built design system: DTCG design tokens, an Angular/PrimeNG component library, and the multi-agent harness that builds both.**

Toshi started as a design token boilerplate and has grown into a working design system with three parts:

1. **Tokens** — a multi-tier, W3C DTCG-compliant token architecture (`tokens/`)
2. **Components** — an Angular 18 component library (`@toshi/components`) built on unstyled PrimeNG, styled exclusively through the tokens above
3. **Harness** — a documented multi-agent pipeline (`harness/`) that Token/Component/Docs/Context/Reviewer agents follow to extend the system consistently

---

## Token architecture

Tokens are organized in tiers, each with a clear responsibility:

```
scaling/factors         → global dimension scale (brand-independent)
brand/[brandX]/*        → brand-specific primitives (color, font, shape)
breakpoint/[bp]/*       → context tokens (dimension, typescale, border, grid, layout)
mode/dark|light         → light and dark mode color mappings
alias/*                 → PUBLIC API — the only tier consumed by components/Figma/Storybook
```

Only the `alias/` tier is ever referenced outside the token system itself. Everything else exists to keep brand and mode swappable without touching consumers. Full rules: [`docs/TOKEN-CONVENTIONS.md`](./docs/TOKEN-CONVENTIONS.md).

Tokens are authored as DTCG JSON (`tokens/**/*.json`, one file per tier/set) and managed with [Tokens Studio for Figma](https://tokens.studio/). `tokens/$themes.json` and `tokens/$metadata.json` are Tokens Studio configuration — do not edit by hand.

### Token build pipeline

Alias tokens are compiled into CSS custom properties via [Style Dictionary](https://styledictionary.com/) + `@tokens-studio/sd-transforms`:

```
npm run tokens:build
```

This produces one CSS file per brand × mode combination (`brandA-light`, `brandA-dark`, `brandB-light`, `brandB-dark`) under `projects/components/src/lib/tokens/` (gitignored — regenerate, don't edit). Each file is scoped with a `[data-brand][data-mode]` attribute selector, so switching theme at runtime is a matter of setting those two attributes on `<html>`. The build runs automatically before `storybook`, `build-storybook`, and `build`.

---

## Component library

`@toshi/components` is a publishable Angular 18 library (`projects/components/`) wrapping unstyled [PrimeNG](https://primeng.org/) components (PrimeNG's own theme CSS is disabled via `provideToshiPrimeNG()`). Every visual property is bound to an alias-token CSS custom property — no hardcoded values.

Currently built:

| Component | Variants | Location |
|---|---|---|
| Button | Primary | `projects/components/src/lib/button/` |

Component-level documentation (purpose, usage, token reference, accessibility notes) lives under `docs/components/`.

### Storybook

```
npm run storybook          # dev server on :6006
npm run build-storybook    # static build
```

---

## The agent harness

`harness/` documents a five-pipeline production line for extending this system — new component, new token, new variant, token value change, or bug fix — each running through some combination of a Token Agent, Component Agent, Docs Agent, Context Agent, and a Reviewer that gates every step against `harness/AGENTS.md`.

Start here if you're extending the system with an AI agent:

- [`harness/AGENTS.md`](./harness/AGENTS.md) — the rules every agent (and human) follows; read this first
- [`harness/skills/`](./harness/skills) — one skill file per agent role
- [`harness/agents/pipeline.md`](./harness/agents/pipeline.md) — the five pipelines in full
- [`harness/agents/orchestrator-prompt.md`](./harness/agents/orchestrator-prompt.md) — copy-paste prompts to kick off a pipeline
- [`CLAUDE.md`](./CLAUDE.md) — entry point for Claude Code

A machine-readable context layer (`context/tokens.json`, `context/components.json`, `context/changelog.json`) gives any agent a compact, current picture of what exists in the system without re-reading every token file.

Every pipeline session is logged (`harness/observability/`) and rolled up into `harness/observability/metrics.md` via a Stop hook, so token/reviewer-fail/duration trends are visible over time.

---

## Getting started

```
npm install
npm run tokens:build
npm run storybook
```

To extend the system by hand (not through the agent harness):

1. Add or change tokens in `tokens/` (alias tier is the only one components should reference)
2. Run `npm run tokens:build` to regenerate the CSS custom properties
3. Build or adjust components in `projects/components/src/lib/`, referencing only `alias.*` tokens
4. Add Storybook stories and update `docs/components/*.md`
5. Update `context/*.json` to reflect the change

---

## Feedback

If you have any feedback or notice any issues, I would be grateful to hear from you.
