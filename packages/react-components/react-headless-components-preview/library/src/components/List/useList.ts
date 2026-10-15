'use client';

import type * as React from 'react';
import {
  useListBase_unstable,
  useListContextValues_unstable,
  validateListItemElement,
} from '@fluentui/react-list';
import { useEventCallback } from '@fluentui/react-utilities';

import type { ListContextValues, ListProps, ListState } from './List.types';
import { toDataAttributeValue } from '../../utils';

export { useListContext_unstable as useListContext } from '@fluentui/react-list';

const CONTROL_SELECTOR =
  'a[href], area[href], button, input, select, textarea, iframe, ' +
  '[contenteditable=""], [contenteditable="true" i], [contenteditable="plaintext-only" i], [tabindex]';

/**
 * `itemcontrols` sets `tabindex="-1"` on the controls of inactive rows, so a control opted out with
 * `focusgroup="none"` still counts as focusable content of its row.
 */
const hasRowControls = (row: HTMLElement): boolean =>
  Array.from(row.querySelectorAll<HTMLElement>(CONTROL_SELECTOR)).some(
    element =>
      !element.matches(':disabled, [hidden], input[type="hidden"]') &&
      (element.tabIndex >= 0 || element.closest('[focusgroup~="none" i]') !== null),
  );

/**
 * Returns the state for a List component, given its props and ref.
 * The returned state can be modified with hooks before being passed to `renderList`.
 */
export const useList = (
  props: ListProps,
  ref: React.Ref<HTMLDivElement | HTMLUListElement | HTMLOListElement>,
): ListState => {
  const baseState = useListBase_unstable(props, ref);
  const isComposite = baseState.navigationMode === 'composite';

  const validateListItem = useEventCallback((element: HTMLElement) => {
    if (!isComposite) {
      baseState.validateListItem(element);
      return;
    }
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    validateListItemElement(element, {
      // Mirrors the base hook, which renders a composite list as a `div` by default.
      listRenderedAs: props.as || 'div',
      listRole: baseState.root.role ?? '',
      hasSelection: !!baseState.selection,
      hasFocusableChildren: hasRowControls(element),
    });
  });

  return {
    ...baseState,
    validateListItem,
    root: {
      ...baseState.root,
      'data-navigation-mode': baseState.navigationMode,
      'data-selectable': toDataAttributeValue(!!baseState.selection),
      // Composite rows are focusgroup items; controls inside them opt out with `focusgroup="none"`
      // and `itemcontrols` keeps only the active row's controls in the sequential focus order.
      focusgroup: isComposite ? 'toolbar block itemcontrols' : 'toolbar block',
    },
  };
};

/**
 * Maps the state of the list to the values that are passed through context to its children.
 */
export const useListContextValues: (state: ListState) => ListContextValues = useListContextValues_unstable;
