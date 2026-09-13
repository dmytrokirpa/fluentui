# DS compiler spike — Fluent 2 first

## Goal

Validate that a structured recipe + deterministic compiler can emit styled
wrappers over headless components, using Fluent 2 Button as the first target
(ground-truth Griffel + web-components CSS).

## Layout

| Path                      | Role                              |
| ------------------------- | --------------------------------- |
| `src/schema.ts`           | Recipe / preset types             |
| `src/manifest.ts`         | Headless slot + `data-*` contract |
| `src/validate.ts`         | Token + state safety checks       |
| `src/compile.ts`          | IR (class names, variant attrs)   |
| `src/emit-*.ts`           | CSS / TSX / Storybook emitters    |
| `design-systems/fluent2/` | Fluent 2 preset + Button recipe   |
| `generated/fluent2/`      | Committed build output            |

## Exit criteria — results

| #   | Criterion                                              | Result                                                                                                                     |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Schema expressiveness — Button validates; raw ≤ 3      | **PASS** — 1 raw block (compound interaction selectors)                                                                    |
| 2   | State safety — unknown headless state fails            | **PASS** — tested in `__tests__/button-recipe.test.ts`                                                                     |
| 3   | Token safety — raw color literals fail                 | **PASS** — `#ff0000` rejected                                                                                              |
| 4   | Determinism — rebuild identical                        | **PASS** — emitter is pure string generation                                                                               |
| 5   | Emit quality — `@layer` + `data-*` + headless hooks    | **PASS** — see `generated/fluent2/button/`                                                                                 |
| 6   | Fluent 2 coverage — appearance × size × shape + states | **PASS** — secondary/primary/outline/subtle/transparent × s/m/l × rounded/circular/square + disabled/iconOnly/iconPosition |

## Commands

```bash
yarn ts-node --transpile-only tools/ds-compiler/src/cli/main.ts check
yarn ts-node --transpile-only tools/ds-compiler/src/cli/main.ts build
yarn jest tools/ds-compiler --config tools/ds-compiler/jest.config.ts
```

## Findings

### What worked

- **Recipe → CSS mapping is straightforward.** Variants become `[data-fui-*]` selectors; headless states reuse the existing `data-disabled` / `data-icon-only` / `data-icon-position` contract. No conflict between DS attrs and headless attrs.
- **`@layer` ordering replaces Griffel's mergeClasses precedence.** `base → variants → states → compound → interactions → conditions → raw` is enough for Button.
- **Thin wrappers are ~80 lines of generated TSX** that only (a) peel variant props, (b) stamp `data-fui-*` + class names, (c) call headless `use`/`render`.
- **Validation caught real mistakes early** (unknown states, raw hex colors, malformed token shorthands).

### Schema gaps (documented via `raw`)

1. **Compound interaction selectors** — e.g. `[data-fui-appearance=primary]:hover:not([data-disabled])` is not expressible as `interactions.root.hover` alone, because hover styles differ per appearance. Needed one `raw` block for primary/subtle/transparent/outline hover+active. **Next:** `interactions` should accept optional `variants`/`states` guards (same shape as `compoundVariants`).

### Intentional deltas vs Griffel Button

- Focus ring uses native `:focus-visible` (headless excludes tabster custom focus indicators).
- Icon filled/regular swap on subtle/transparent hover omitted (requires `@fluentui/react-icons` bundle classnames — out of scope for CSS-only emit).
- High-contrast / forced-colors: stub only; full parity is a follow-up.

### Recommended next steps

**Priority: Fluent 2 recipe coverage first** (not prose/agent DS).

1. ~~Nested conditions / Button `raw` elimination.~~ **Done**
2. ~~Checkbox + Menu family (+ selectable + `_groupHover`).~~ **Done**
3. ~~Label, Link, ToggleButton, Switch, Input.~~ **Done** (0 raw)
4. **Next Fluent 2 recipes:** Field, Textarea, Slider, RadioGroup, Spinner, Dialog/Drawer surfaces
5. Griffel AST → recipe coverage measurement (only after a critical mass of hand recipes).
6. Prose/agent-first DS — **deferred** until Fluent 2 recipe set validates the compiler end-to-end.

## Nested condition syntax (Panda CSS)

Recipes may nest condition keys anywhere a `Style` object is accepted:

```ts
primary: {
  root: {
    backgroundColor: '$colorBrandBackground',
    _hover: { backgroundColor: '$colorBrandBackgroundHover' },
    _active: { backgroundColor: '$colorBrandBackgroundPressed' },
    _focusVisible: { outline: '…' },
    _forcedColors: { backgroundColor: 'Highlight' },
    _reducedMotion: { transitionDuration: '0.01ms' },
  },
}
```

Supported keys: `_hover`, `_active`, `_focus`, `_focusVisible`, `_focusWithin`, `_groupHover`, `_groupActive`, `_groupFocusVisible`, `_after`, `_before`, `_child`, `_forcedColors`, `_reducedMotion`, `_rtl`.
Hover/active automatically append `:not([data-disabled]):not([data-disabled-focusable])`.

This replaced the Button recipe's last `raw` block (per-appearance hover/active overrides).
Flat `interactions` / `conditions` fields remain as a deprecated alternate form.

## Checkbox + Menu (Fluent 2)

Added after Button to pressure-test:

| Component       | Headless states                                       | DS variants     | Raw blocks |
| --------------- | ----------------------------------------------------- | --------------- | ---------- |
| Checkbox        | `disabled`, `checked` (`''`/`mixed`), `labelPosition` | `size`, `shape` | 0          |
| MenuPopover     | —                                                     | —               | 0          |
| MenuItem        | `disabled`, `hasSubmenu`, `submenuOpen`               | —               | 0          |
| MenuDivider     | —                                                     | —               | 0          |
| MenuGroupHeader | —                                                     | —               | 0          |

### Schema additions

- `EnumAttr.attrValues` — map recipe enum keys to DOM attribute values (Checkbox `checked=true` → `data-checked=""`).
- `_focusWithin` condition (Checkbox focus ring).
- Custom property keys (`--fui-…`) are emitted verbatim (not camel-cased).
- Build merges recipes that share a headless subpath (`menu/*`) into one barrel `index.ts`.

### Intentional deltas

- Checkbox: native `:focus-within` outline instead of tabster focus indicator.
- MenuItem: icon filled/regular swap omitted; parent-hover → child color for icon/subText approximated via root color inheritance (no parent→child combinator in schema yet).

## Group conditions (`_groupHover` / `_groupActive`)

Child slots can react to the **root** being hovered/pressed without raw CSS:

```ts
icon: {
  _groupHover: { color: '$colorNeutralForeground2BrandSelected' },
},
subText: {
  _groupHover: { color: '$colorNeutralForeground3Hover' },
  _groupActive: { color: '$colorNeutralForeground3Pressed' },
},
```

Emits `.fui-MenuItem:not([data-disabled]):hover .fui-MenuItem__icon { … }` (Panda/Chakra group pattern).

## MenuItemCheckbox / MenuItemRadio

Selectable menu items reuse MenuItem base styles + `data-checked` presence to toggle checkmark `visibility`. Still **0 raw**.

## Form + action recipes (Fluent 2)

| Component    | Headless highlights                                     | DS variants                   | Raw |
| ------------ | ------------------------------------------------------- | ----------------------------- | --- |
| Label        | `disabled`, `required`                                  | `size`, `weight`              | 0   |
| Link         | `disabled`, `disabledFocusable`                         | `appearance`, `inline`        | 0   |
| ToggleButton | Button states + `checked`                               | `appearance`, `size`, `shape` | 0   |
| Switch       | `checked`, `labelPosition`, `_child` thumb slide        | `size`                        | 0   |
| Input        | `disabled`, `invalid`, `_focusWithin` underline approx. | `appearance`, `size`          | 0   |

### Schema additions for this wave

- `_after` / `_before` — `::after` / `::before` pseudo-elements
- `_child` — direct-child combinator (`selector > *`) for Switch thumb
- Transform functions (`translateX(…)`, `scale(…)`, …) allowed without `raw`
