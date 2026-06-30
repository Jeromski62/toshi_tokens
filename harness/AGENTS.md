# Design System Agent — Rules & Context

## Stack

| Layer | Tool | Role |
|---|---|---|
| Token Source of Truth | JSON files | Canonical token definitions |
| Token Management | Tokens Studio | Authoring & Figma sync |
| Design Components | Figma Library | Visual implementation |
| Dev Components | PrimeNG (unstyled) | Code implementation |
| Dev Documentation | Storybook | Component API & states |
| Human Documentation | ZeroHeight | Imports Figma + Storybook |
| Machine Documentation | Context Layer | To be built — for agent consumption |

## Token Architecture

Tokens are organized in multiple source layers that cross-reference each other:

```
brand/         ┐
scale/         ├── Internal source layers (cross-reference allowed)
breakpoints/   ┘
mode/
    ↓
alias/         ← PUBLIC API — the only layer consumed by Figma, PrimeNG, Storybook
```

**Naming convention:** `alias.{category}.{role}.{state}`
**Example:** `alias.color.primary.interaction`

**Language:** English — all token names, comments, and documentation in English.

## Hard Rules

These rules are non-negotiable. Never violate them, even if asked.

1. **No hardcoded values** — Never use raw hex values, numbers, or literal values anywhere. Every value must reference a token.
2. **Alias is the public API** — Never expose or have consumers reference source layer tokens directly. Only alias tokens are public.
3. **Source layer discipline** — Never write to a source layer without updating the corresponding alias layer in the same operation.
4. **No invented token names** — Never reference or generate a token name that does not already exist in the token files. Check first.
5. **No duplicate components** — Before building a new component, check if one already exists. If a component exists, add a variant instead of creating a new one.
6. **No alias token deletion or renaming** — Never rename or delete an existing alias token without an explicit migration order. Doing so breaks Figma, PrimeNG, Storybook, and ZeroHeight simultaneously.
7. **WCAG AA contrast required** — Never insert or modify a color token value without verifying contrast ratio meets WCAG AA (4.5:1 for text, 3:1 for UI components).

## Scope

**In scope — base components only:**
- Foundational, single-purpose UI components (Button, Input, Checkbox, Badge, etc.)
- Design tokens (all tiers)
- Component documentation (Storybook + ZeroHeight)

**Out of scope — do not build:**
- Complex patterns or blocks (e.g. forms, cards with multiple components, navigation patterns)
- Product-level compositions
- Page templates
- Anything that combines multiple base components into a higher-order pattern

When in doubt: if it combines more than one base component with business logic, it belongs on the product level, not here.

## Workflow Order

Always follow this sequence. Do not skip steps.

1. **Check tokens** — Does the required token exist? If not, create it in the correct source layer AND update alias before proceeding.
2. **Check components** — Does a component already exist that covers this use case? If yes, add a variant instead.
3. **Build** — Implement using only existing alias tokens. No hardcoded values.
4. **Verify** — Run contrast checks on all color values. Confirm all referenced tokens exist.
5. **Document** — Update Storybook documentation. Flag ZeroHeight for sync.
