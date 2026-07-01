# Button — Primary

## Purpose

The primary button is the highest-emphasis call to action on a screen — use it for the one action you want the user to take.

## Usage guidelines

- Use one primary button per view or section; if several actions compete, pair it with a secondary or text button instead of adding a second primary.
- Use for the main, positive-path action (e.g. "Save", "Continue", "Submit").
- Do not use for destructive actions — pair the `critical` intent color role instead once a Critical/Destructive variant exists.
- Do not use for low-emphasis or supplementary actions — those belong on a Secondary or Ghost variant (not yet built).

## Token reference

| Property | State | Token |
|---|---|---|
| Background | Default | `alias.color.primary.brand` |
| Label | Default | `alias.color.primary.onBrand` |
| Background overlay | Hover | `alias.color.state.hover` |
| Background overlay | Press/Active | `alias.color.state.press` |
| Outline | Focus-visible | `alias.border.focusOutline` |
| Outline offset | Focus-visible | `alias.borderWidth.sm` |
| Background | Disabled | `alias.color.state.disable` |
| Label | Disabled | `alias.color.state.onDisable` |
| Corner radius | All | `alias.radius.md` |
| Padding | All | `alias.space.xs` (block), `alias.space.md` (inline) |
| Label gap | All | `alias.space.2xs` |
| Typography | All | `alias.font.label.short` |

`alias.color.primary.interaction` / `alias.color.primary.onInteraction` were considered for the fill but rejected — that pairing measures 4.35:1 contrast in Brand A / Light Mode, below the 4.5:1 WCAG AA text minimum. `alias.color.primary.brand` / `alias.color.primary.onBrand` measure 7.46:1 and are the token pair intended for solid brand-colored fills.

## Accessibility notes

- **Text contrast (Default):** `alias.color.primary.brand` / `alias.color.primary.onBrand` = 7.46:1 in Brand A / Light Mode — passes WCAG AA (4.5:1 required).
- **Disabled state:** exempt from contrast requirements per WCAG (disabled controls are not required to meet contrast minimums); background/label pairing left as-is via `alias.color.state.disable` / `alias.color.state.onDisable`.
- **Focus outline:** uses the system-wide `alias.border.focusOutline` token (`alias.color.border.focusOutline`, an info-intent blue). Contrast against a near-white surface (`alias.color.background.highEmphasis`) measures ~3.2–3.4:1, passing the 3:1 UI-component minimum. Contrast against the gray `alias.color.background.body` surface measures ~2.6:1, **below** the 3:1 minimum. This is an existing, system-wide token used by every focusable component — not something specific to this button — but placing a primary button directly on the `body` background surface will produce an under-contrast focus ring. Flagged to the Token Agent as a follow-up outside this component's scope.
- **Keyboard:** native `<button>` element via PrimeNG's `pButton` directive — fully keyboard operable (Tab to focus, Enter/Space to activate) with no additional wiring.
- **Screen readers:** label is rendered as visible text content, so no additional `aria-label` is required. If an icon-only variant is added later, `pButton`'s `label` input must still be set (visually hidden) so the accessible name is preserved.
