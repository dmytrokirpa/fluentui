A list presents a collection of related items, optionally with selection.

`List` owns the semantics of the collection — it resolves the `list`, `listbox`, or `grid` role, coordinates selection, and passes that state to its children. `ListItem` must always be rendered inside a `List`.

When `selectionMode` is set, each item renders a native `input[type="checkbox"]` in its `checkmark` slot, exposes `aria-selected`, and can be toggled by clicking the item, clicking the checkmark, or pressing <kbd>Space</kbd>. Items with an `onAction` handler also respond to <kbd>Enter</kbd>.

Provide an accessible name for the list with `aria-label` or `aria-labelledby` whenever the surrounding content does not already label it.

Item navigation uses the web-platform `focusgroup` attribute rather than Tabster. In browsers without native support, load the focusgroup polyfill described in the browser support overview.

With `navigationMode="composite"`, the list uses `focusgroup="toolbar block itemcontrols"` from [Focusgroup V2](https://open-ui.org/components/focusgroup-v2.explainer/#itemcontrols): rows are the focusgroup items, <kbd>Up</kbd>, <kbd>Down</kbd>, <kbd>Home</kbd>, and <kbd>End</kbd> move between rows, and the list keeps a single tab stop that remembers the last active row. Mark the controls inside a row with `focusgroup="none"` so they stay out of row navigation. <kbd>Tab</kbd> from the active row then reaches that row's controls before leaving the list, and the controls of inactive rows are removed from the tab order.

`itemcontrols` will be supported by the polyfill once [microsoft/polyfills#66](https://github.com/microsoft/polyfills/pull/66) is merged and released. Until then, the token is ignored and every row's opted-out controls stay in the tab order; arrow-key row navigation works either way.

For a selectable listbox, use `checkmark={null}` and style the selection through `data-selected` to avoid nesting interactive checkboxes inside options. In a composite grid, the native checkmark is wrapped in a grid cell opted out with `focusgroup="none"`. By default it is not a tab stop; select with <kbd>Space</kbd> on the row or click the checkmark. To make it one of the row's controls, give it both an accessible name and a tab index, for example `checkmark={{ 'aria-label': 'Select Alex Wilber', tabIndex: 0 }}`.
