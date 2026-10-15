# RFC: Modernize v9 on top of the headless layer

---

@dmytrokirpa

Stakeholders: v9 component owners, headless components, react-positioning, react-tabster, docsite, partner teams consuming `@fluentui/react-components`

Authored: 2026-10-15
Target end date for feedback: 2026-10-29

## Summary

Make the headless layer the behavior foundation of v9 without breaking existing consumers:

1. **Converge positioning.** One `usePositioning` implementation for v9 and headless (CSS anchor positioning, with Floating UI where anchor positioning can't express the request), continuing [microsoft/fluentui#36870](https://github.com/microsoft/fluentui/pull/36870).
2. **Bake in the focusgroup polyfill.** Ship a `useFocusGroup` hook next to `usePositioning`, with the polyfill's `FocusGroup` engine built in, so neither consumers nor headless stories have to load a polyfill.
3. **Move v9 components onto headless hooks where behavior is compatible.** Simple components share one hook layer. Flat arrow-key widgets (TabList, Toolbar, MenuList, …) replace Tabster arrow navigation with `useFocusGroup`.
4. **Add V2 components for the overlays whose behavior can't be swapped in place.** Examples are `PopoverV2`, `DialogV2` and `TooltipV2`, built on native `<dialog>`, the Popover API and anchor positioning. They ship alongside the existing components, 10–15 at most.
5. **Author CSS-module style hooks alongside the Griffel ones.** A single build-time import switch selects them.

There is exactly **one build-time switch** (styles). All behavior changes are either compatible in place or opt-in by import (`*V2`).

## Background

- **Base hooks exist.** v9 has 113 `use*Base_unstable` hooks ([base-state-hooks.md](./base-state-hooks.md)). They hold behavior, ARIA and slot structure without design props or styles.
- **The headless preview builds on them.** `@fluentui/react-headless-components-preview` ([headless-components.md](./headless-components.md)) wraps those hooks and adds `data-*` state attributes. For overlays and composites it already uses platform primitives instead of v9's stack:

  | Area | Headless | v9 |
  |---|---|---|
  | Dialog, Popover surface | native `<dialog>` + Popover API | `Portal` + Tabster modalizer |
  | Positioning | CSS anchor positioning (`hooks/usePositioning`) | Floating UI |
  | Arrow-key navigation (TabList, Toolbar, Menu, TagGroup, SwatchPicker, Toast) | native `focusgroup` | Tabster |

- **The dependency points the wrong way.** The headless preview depends on ~50 v9 component packages, so v9 cannot consume anything it adds (data attributes, `usePositioning`, focusgroup wiring) without a cycle (see [layers.md](../../../../../architecture/layers.md)).
- **There's a precedent for build-time style swaps.** The build already emits `*.styles.raw.js` for every package (`tools/workspace-plugin/src/executors/build/lib/babel.ts`), which consumers can resolve instead of the AOT-compiled styles.
- **The focusgroup polyfill is only wired up in dev tooling.** `@microsoft/focusgroup-polyfill` (root `package.json` pins 1.5.0; latest is 1.6.0) is loaded in headless Storybook and Cypress only. Consumers have to load it themselves. `packages/web-components` uses the low-level `FocusGroup` class instead of the global auto-polyfill.

## Problem statement

1. **Two behavior implementations drift.** Headless and v9 implement positioning, overlays and keyboard navigation separately. Fixes land in one and not the other, and partners mixing them get inconsistent behavior.
2. **v9 can't adopt platform primitives without breaking.** Moving Popover to the top layer or Dialog to `<dialog>` changes observable behavior:
   - `mountNode`, `inline` and portal theming stop applying;
   - z-index stacking changes;
   - light-dismiss semantics change;
   - the `backdrop` slot no longer fits `::backdrop`.
3. **Styling is locked to runtime CSS-in-JS.** Teams that want static CSS (CSS modules, `@layer`, no runtime insertion) have no supported path for styled v9 components.
4. **The focusgroup polyfill is unusable as shipped for a component library:**
   - Every entry point has import-time side effects (a global `MutationObserver` on `document.body`; the full build also patches `Element.prototype.attachShadow`), despite `"sideEffects": false`.
   - It is ESM-only, so v9's `lib-commonjs`, older Node and Jest can't `require()` it.
   - It assumes one global `document`, so it ignores `targetDocument` and iframes.
   - It leaks a group when an ancestor (not the owner) is unmounted.
   - The auto-polyfill infers ARIA roles on generic containers.
   - It finds no items under jsdom, because jsdom has no `checkVisibility` and no layout.

## Detailed Design or Proposal

### Principles

- **One behavior layer.** Headless hooks are the single source of truth for behavior. v9 adds design props and styles on top.
- **Observable behavior changes are opt-in by import.** If a change would break a reasonable consumer, it goes into a `*V2` component, not into the existing one.
- **One build-time switch.** Only styles are switched at build time. Keyboard navigation and positioning are not.
- **Layering is respected.** Shared behavior lives in Tier 2 foundation packages. The headless package re-exports it; v9 never imports from headless.

### 1. Converged positioning

Positioning moves to a single implementation in `@fluentui/react-positioning` (Tier 2), as started in #36870:

- `usePositioning` keeps its current `PositioningProps` / `PositioningShorthand` / `PositioningImperativeRef` contract. The headless version already reuses these types.
- It prefers CSS anchor positioning (`anchor-name`, `position-area`, `position-try-fallbacks`) when the browser supports it and the request can be expressed in CSS. Otherwise it uses Floating UI. Options without a CSS equivalent force Floating UI:
  - `overflowBoundary` / `flipBoundary`;
  - custom middleware;
  - virtual targets, if the anchor path can't support them.
- `onPositioningEnd` / the resolved placement keep working on both paths. The anchor path recovers the placement through the existing headless `usePlacementObserver`.
- The headless package re-exports it from `@fluentui/react-headless-components/positioning`; its local copy is deleted.

**Compatibility:** existing v9 components keep Floating UI by default where the anchor path would change observable placement, until VRT shows parity. V2 components use the anchor path by default.

### 2. `useFocusGroup` with a built-in polyfill

A new Tier 2 package, working name **`@fluentui/react-focusgroup`**. `@fluentui/react-focus` is already taken by the v8 FocusZone package. It has no Tabster dependency, so headless bundle isolation (`forbiddenPackages: ["tabster", …]`) still holds. Headless re-exports it from `@fluentui/react-headless-components/focusgroup`, alongside `positioning`.

```ts
export type FocusGroupBehavior = 'toolbar' | 'tablist' | 'radiogroup' | 'listbox' | 'menu' | 'menubar';

export type UseFocusGroupOptions = {
  behavior: FocusGroupBehavior;
  /** Restrict arrow keys to one logical axis. Omit for both axes. */
  axis?: 'inline' | 'block';
  /** Wrap from last to first item and back. */
  wrap?: boolean;
  /** Remember the last focused item when tabbing back in. Default: true. */
  memory?: boolean;
};

export function useFocusGroup<E extends HTMLElement>(
  options: UseFocusGroupOptions,
): {
  ref: React.RefCallback<E>;
  attributes: { focusgroup: string };
};

/** Item helpers */
export function useFocusGroupItem(options: { start?: boolean }): { focusgroupstart?: '' };
export const focusGroupOptOut = { focusgroup: 'none' } as const;
```

Components merge `ref` into the root slot ref and spread `attributes`. The `focusgroup` attribute is always rendered, so SSR output and native-supporting browsers need nothing else.

**Engine, not the auto-polyfill.** When the browser has no native support, the hook creates a `FocusGroup` instance from the polyfill's low-level engine for that element in a layout effect and disposes of it on unmount. It never calls `polyfill()` or `polyfillBodyAndObserve()`.

- **Lifecycle** follows React, so ancestor unmounts don't leak. Teardown restores `tabindex` and removes the polyfill's `data-fg-*` attributes.
- **No role inference.** Components author their roles explicitly.
- **Only Fluent-owned groups are touched.** There is no global observer.

**Fluent item collection.** The hook passes its own implementation of the polyfill's `FocusGroupItemCollection` interface:

- it walks `element.ownerDocument`, not the global `document`, as the first step towards `targetDocument` support;
- it excludes items hidden by Fluent mechanisms the polyfill doesn't observe (`[data-overflowing]` from Overflow), and calls `update()` when those attributes change;
- it treats elements as visible when there is no layout (jsdom), so consumer unit tests can still drive arrow keys.

**Feature detection per behavior:**

```ts
const supportsNativeFocusGroup = (doc: Document | undefined, behavior: FocusGroupBehavior) =>
  !!(doc?.body as { focusGroup?: { supports?(t: string): boolean } })?.focusGroup?.supports?.(behavior);
```

Polyfill 1.6.0 disables itself whenever `'focusgroup' in HTMLElement.prototype`. Chromium 141 behind `--enable-blink-features=Focusgroup` exposes that property without the `focusGroup` token list, so a property check alone is not enough. The polyfill's main branch already detects per behavior.

**Key handling order.** The polyfill listens on the owner element in the bubble phase. React's delegated `onKeyDown` therefore runs *after* it and cannot cancel it. Native focusgroup acts as a default action, which `preventDefault` in `onKeyDown` can cancel. The built-in engine should run after React's handlers and respect `defaultPrevented`, so component handlers behave the same on both engines.

**How the engine is obtained, in order of preference:**

1. **Upstream** (microsoft/polyfills is Microsoft-owned): ask for
   - a side-effect-free `./core` entry exporting `FocusGroup` and the collection interface;
   - a CJS build;
   - per-behavior detection;
   - an undecorate API;
   - a configurable listener phase.

   Then depend on it normally.
2. **Until then, vendor it.** Copy the `FocusGroup` engine (MIT, ~3.7 KB gzip for the shadowless build) into the package source behind a sync script, so the repo's SWC build emits ESM and CJS. Send the fixes upstream.
3. **Rejected:** relying on tree-shaking to drop the auto-polyfill from the published entry. That would start a global observer in dev builds and in bundlers that ignore `sideEffects`.

**Not covered by `useFocusGroup`** (these stay on Tabster for now):

- **2-D grid navigation.** Tabster's `grid`/`grid-linear` follow on-screen positions. focusgroup V2 `grid` is structural (table rows and cells) and not in polyfill 1.6.0.
- **Enter/Escape focus groups** (`useFocusableGroup`). V2 `itemcontrols` is unreleased.
- **`tabbable` arrow groups.**
- **Modals and focus restore.**

### 3. v9 components on headless hooks

**3a. Invert the dependency.** Headless logic moves *down* into each v9 package:

- `toDataAttributeValue` moves to `@fluentui/react-utilities`.
- `use*Base_unstable` hooks emit the headless `data-*` attributes after slot resolution, so base state wins, as headless-components.md requires. This only adds DOM attributes; snapshots churn, but nothing breaks.
- Headless hooks for simple components become re-exports (for example, `useButton` = `useButtonBase_unstable`). Headless keeps its own code only where behavior differs.

**3b. Replace Tabster arrow navigation where focusgroup covers it.** These components switch in place, in a minor release:

| Component | focusgroup value | Required fix |
|---|---|---|
| TabList | `tablist inline\|block wrap nomemory` + `focusgroupstart` on the selected Tab | add arrow-key Cypress tests (none today) |
| Toolbar | `toolbar` (both axes) `wrap` | Overflow-hidden items must be excluded (item collection) |
| MenuList | `menu block wrap` | first-letter search must use finders that ignore the roving `tabindex` |
| TagGroup / TagPickerGroup | `toolbar` (both axes) | TagPickerGroup focuses its input on *every* ArrowRight; add an edge check (as headless `isLastFocusableTag` does). TagGroup dismiss needs non-Tabster finders |
| Breadcrumb (`focusMode="arrow"`) | `toolbar inline wrap` | — |
| CarouselNav, TeachingPopover nav | `tablist inline nomemory` + `focusgroupstart` | Carousel's direct `data-tabster` rewrite (`setTabsterDefault`) toggles `focusgroupstart` instead |
| SwatchPicker (list layout) | `radiogroup` / `toolbar` | — |
| TreeItemLayout actions | `toolbar inline` (`wrap` in tree mode) | — |

**Stay on Tabster** (no in-place change):

- **2-D grids:** DataGrid, Calendars, SwatchPicker grid, MenuGrid, chart grids.
- **Enter/Escape focus groups:** Card, Toast, List with `focusableItems`, CarouselSlider cards.
- **`tabbable` groups:** Accordion, NavDrawerBody.
- **Overlays:** Dialog/Drawer/Popover/Menu modal and focus-restore logic.

**Keyboard differences that become visible** (listed in the changelog):

- Shift+Tab into a group with nothing remembered lands on the first item instead of the last.
- Tab from a text input inside a toolbar moves within the toolbar.
- PageUp/PageDown no longer move focus.
- App `onKeyDown` handlers now receive arrow keys that Tabster used to consume (Tabster calls `preventDefault` + `stopImmediatePropagation`).

**Escape hatch:** for one release, a `FluentProvider` prop restores Tabster arrow navigation for these components. It is a safety valve for partners, not a supported second mode, and is removed after the next release.

**Public API:** `useTabListA11yBehavior_unstable` and `useBreadcrumbA11yBehavior_unstable` (which return `TabsterDOMAttribute`) stay exported and unchanged but are marked deprecated. Components stop calling them.

**Known risk:** a converted component nested inside a Tabster arrow group (for example a Toolbar in a DataGrid cell) won't receive arrow keys. Tabster's window-capture listener resolves the outer group first. Today nested Tabster groups resolve to the innermost one. This must be covered by a Cypress test before 3b ships for each component.

### 4. V2 components for overlays

Components whose behavior can't change in place get a V2 sibling built on headless hooks: native `<dialog>`, Popover API top layer, anchor positioning and `useFocusGroup`.

| V1 (unchanged) | V2 |
|---|---|
| Popover | PopoverV2 |
| Dialog | DialogV2 |
| Drawer (Overlay) | DrawerV2 |
| Tooltip | TooltipV2 |
| Menu | MenuV2 (`popover="auto"` surface + focusgroup list) |
| Combobox, Dropdown | ComboboxV2, DropdownV2 (listbox in top layer) |
| TagPicker | TagPickerV2 |
| InfoLabel | InfoLabelV2 |
| TeachingPopover | TeachingPopoverV2 |
| Toast / Toaster | ToasterV2 (popover-based) |

Rules:

- **Packaging.** V2 components ship from the same package as their V1 (`PopoverV2` from `@fluentui/react-popover`) and are re-exported from `@fluentui/react-components`. No new packages, and no cross-package dependencies between component packages.
- **Same props wherever the semantics carry over.** Props with no meaning on the top layer (`mountNode`, `inline`) are removed from the V2 types. The `backdrop` slot is replaced by `::backdrop` styling.
- **Shared contexts and triggers.** `MenuTrigger`, `PopoverTrigger` etc. work with both. V1 and V2 can be mixed in one tree (for example a V1 Menu inside a DialogV2), and Cypress covers the mixes.
- **Graduation.** V2 becomes the default in the next major. V1 is then deprecated, with a codemod (`Popover` → `PopoverV2` import rewrite plus removed-prop warnings).
- **Cap.** The list above is 11 components. Anything beyond 15 needs its own RFC.

### 5. CSS-module style hooks with a build-time switch

Each component gets a CSS-module style hook next to its Griffel one, with an identical signature:

```
Button/
  useButtonStyles.styles.ts         // Griffel (default)
  useButtonStyles.styles.module.css // CSS module
  useButtonStyles.styles.css.ts     // style hook using the CSS module
```

```ts
// useButtonStyles.styles.css.ts
import styles from './useButtonStyles.styles.module.css';
import { mergeClasses } from '@griffel/react'; // plain-class-safe merge, keeps `className` last
import type { useButtonStyles_unstable as GriffelHook } from './useButtonStyles.styles';

export const useButtonStyles_unstable = ((state: ButtonState) => {
  state.root.className = mergeClasses(
    buttonClassNames.root,
    styles.root,
    styles[state.appearance],
    styles[state.size],
    state.root.className,
  );
  return state;
}) satisfies typeof GriffelHook;
```

**Authoring rules:**

- **Tokens only:** `var(--colorNeutralForeground1)` etc., checked by lint against the token list.
- **State selectors** use the base-hook `data-*` attributes (`[data-disabled]`, `[data-icon-only]`). Design axes use classes.
- **RTL:** logical properties, plus `:dir(rtl)` for transforms and shadows. There is no Griffel-style automatic flipping.
- **Cascade layer:** all Fluent CSS lives in `@layer fluentui.components`, so any unlayered consumer CSS, including Griffel overrides passed via `className`, wins regardless of specificity.
- **Static class names stay:** `fui-Button` etc.
- **Custom style hooks** (`customStyleHooks_unstable`) keep working unchanged.

**Build.** The library build compiles CSS modules into plain `.css` files with stable hashed class names plus a JS class map, so consumers need no CSS-modules loader. Each package's `"sideEffects"` changes from `false` to `["*.css"]`, so bundlers keep the CSS imports.

**The switch** is the single build-time switch in this RFC:

- **Default:** Griffel style hooks; nothing changes.
- **`fluentui-css` export condition** (webpack `resolve.conditionNames`, Vite `resolve.conditions`, esbuild `conditions`, Jest `customExportConditions`): style-hook imports resolve to the `.styles.css.js` variants. Implemented through package `imports` (`#styles/*`) with a condition, emitted by the build executor next to the `.raw` copies, so source files keep relative imports.
- **Alias fallback:** for bundlers without custom conditions. Turbopack, the default Next.js bundler, documents no custom export conditions, so a documented `resolveAlias` mapping is provided.

**Parity gate:** every style hook pair runs the existing VRT suite in both modes. A component ships its CSS variant only when the diff is clean.

### Summary of switches

| Concern | Mechanism | Default | Opt-in |
|---|---|---|---|
| Styles | build-time `fluentui-css` condition | Griffel | CSS modules |
| Positioning | runtime capability check inside `usePositioning` | Floating UI for V1, anchor for V2 | — |
| Arrow-key navigation | in place in a minor (section 3b) | focusgroup for listed components | one-release escape hatch to Tabster |
| Overlays | import | V1 | `*V2` components |

### Rollout

1. **Foundation.** Positioning convergence (#36870) and `@fluentui/react-focusgroup` with the vendored engine. Headless switches to both and drops the consumer-loaded polyfill.
2. **Base hooks.** Move `data-*` attributes into base hooks across packages; headless simple components become re-exports.
3. **Pilot in-place keyboard change.** TabList and Toolbar on `useFocusGroup`, with new Cypress keyboard suites run on Chromium (native where available) and Firefox/WebKit (polyfill). Then MenuList, TagGroup/TagPicker, Breadcrumb, Carousel, SwatchPicker, Tree actions.
4. **V2 overlays.** PopoverV2 and TooltipV2 first, then DialogV2/DrawerV2, MenuV2, the listbox pickers, ToasterV2.
5. **CSS modules.** Button, Link and Text first to validate the build, the condition and VRT parity, then component by component.

### Testing

- **Unit (Jest):** the generated `focusgroup` strings and `data-*` attributes. Arrow navigation also works, thanks to the Fluent item collection.
- **Cypress keyboard suites per converted component,** in native and polyfill modes. Existing suites to reuse: Toolbar, Menu, Breadcrumb, TagPicker, SwatchPicker, Toast, Tree, List. New suites to add: TabList, TagGroup, Carousel.
- **VRT** in Griffel and CSS-module modes.
- **Bundle isolation/monosize:** headless stays Tabster- and Griffel-free; `react-focusgroup` contains no global observer.
- **SSR** fixtures for every converted component (the `focusgroup` attribute is rendered server-side; no hydration mismatch).

### Pros and Cons

**Pros**

- One behavior implementation for v9 and headless. Fixes land once.
- Platform primitives (top layer, anchor positioning, focusgroup) reach v9 users without a major.
- Partners get supported static CSS with `@layer`, and no runtime style insertion.
- The polyfill becomes an implementation detail; consumers no longer load it.
- Only one build-time switch to document and support.

**Cons**

- The in-place focusgroup change is visible keyboard behavior in a minor. It needs a clear changelog, partner validation and the temporary escape hatch.
- Most users run the polyfill engine until native focusgroup ships broadly, and we take on maintaining a vendored copy until upstream lands the fixes.
- V1 and V2 coexist for a full major: more docs, more tests, and mixed V1/V2 trees to support.
- Two style implementations per component until one is retired. VRT parity is a permanent CI cost.
- Tabster stays in the bundle for grids, focusable groups and modals, so there are no bundle-size wins on keyboard navigation yet.

## Discarded Solutions

- **`@fluentui/react-tabster-compat` swapped in via a bundler alias.** Hook options don't say which widget is calling, so the compat can't pick a focusgroup behavior token. Any fixed token infers roles on generic containers. Arrow keys stop being swallowed, which breaks components that rely on it. Grids, focusable groups and modals still need Tabster. And the compat must never import `@fluentui/react-tabster` or prefix-matching aliases make it import itself.
- **A second build-time switch for keyboard navigation (Tabster vs focusgroup).** Tabster stays bundled either way, so it saves nothing and doubles the test matrix.
- **A wrapper package with a Tabster adapter and a runtime mode for arrow navigation.** It works, but keeps two arrow-navigation paths alive indefinitely. Switching flat widgets in place, with a one-release escape hatch, is simpler.
- **Per-component behavior seams (`use*A11yBehavior_unstable` swapped by module resolution).** It needs a split in every component, and the seams still need a switch.
- **Moving v9 overlays to native primitives in place.** That breaks `mountNode`/`inline`, portal theming, z-index stacking, light-dismiss semantics and the `backdrop` slot.
- **Runtime style switching via context** (e.g. extending `customStyleHooks_unstable`). Both implementations would be bundled, and Griffel would still run.
- **Loading the polyfill globally** (`polyfillBodyAndObserve()` from `FluentProvider`). Import-time side effects, no `targetDocument`, ancestor-unmount leaks, role inference, and ESM-only packaging.

## Open Issues

1. Which stable Chrome release first ships focusgroup with V1 behavior tokens and `focusGroup.supports()`? Until then, are we comfortable that most users run the polyfill engine?
2. Upstream asks to microsoft/polyfills (core entry, CJS, undecorate API, listener phase): who owns them, and when do we drop the vendored copy?
3. Should the escape hatch in section 3b exist at all, or does partner validation plus the changelog suffice?
4. Do consumer Jest tests that drive arrow keys through TabList/Toolbar pass with Tabster in jsdom today? That decides how loudly the change is announced.
5. Native focusgroup's spec infers a minimum container role on generic elements. Confirm every converted component authors an explicit role.
6. V2 naming: `PopoverV2` vs a subpath (`@fluentui/react-popover/v2`) vs a new suite entry (`@fluentui/react-components/next`).
7. Turbopack: confirm `resolveAlias` covers the style switch for packages inside `node_modules`, or ask for custom export conditions.
8. focusgroup `grid` and `itemcontrols`: track polyfill and Chromium progress to retire Tabster for DataGrid, Calendar, Card and List in a follow-up RFC.
