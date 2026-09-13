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

1. Extend `interactions` with compound guards → eliminate the Button `raw` block.
2. Port Checkbox + Menu (composite) to pressure-test slots/context.
3. Add a Griffel AST → recipe extractor against `useButtonStyles.styles.ts` and measure coverage %.
4. Only then bring the prose/agent-first DS through the same compiler.
