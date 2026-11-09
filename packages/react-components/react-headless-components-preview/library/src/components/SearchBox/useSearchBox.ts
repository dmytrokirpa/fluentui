'use client';

import * as React from 'react';
import { useSearchBoxBase_unstable } from '@fluentui/react-search';
import { mergeCallbacks, slot, useControllableState, useEventCallback, useMergedRefs } from '@fluentui/react-utilities';

import type { SearchBoxProps, SearchBoxState } from './Search.types';
import { toDataAttributeValue } from '../../utils';

/**
 * Returns the state for a SearchBox component, given its props and ref.
 * The returned state can be modified with hooks before being passed to `renderSearchBox`.
 */
export const useSearchBox = (props: SearchBoxProps, ref: React.Ref<HTMLInputElement>): SearchBoxState => {
  const { dismiss, onChange, value: controlledValue, defaultValue, ...baseProps } = props;
  const [value, setValue] = useControllableState({
    state: controlledValue,
    defaultState: defaultValue,
    initialState: '',
  });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const baseState = useSearchBoxBase_unstable(
    {
      ...baseProps,
      dismiss: null,
      value,
      onChange: (event, data) => {
        // The base dismiss slot is disabled, so it only forwards input changes here.
        onChange?.(event as React.ChangeEvent<HTMLInputElement>, data);
        setValue(data.value);
      },
    },
    null,
  );
  const mergedInputRef = useMergedRefs(baseState.input.ref, ref, inputRef);
  const disabled = !!baseState.input.disabled;
  const readOnly = !!baseState.input.readOnly;
  const dismissSlot =
    value && dismiss !== null
      ? slot.optional(dismiss, {
          elementType: 'button',
          renderByDefault: true,
          defaultProps: { type: 'button', 'aria-label': 'clear', tabIndex: 0, disabled: disabled || readOnly },
        })
      : undefined;

  const state: SearchBoxState = {
    ...baseState,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    components: { ...baseState.components, dismiss: 'button' },
    dismiss: dismissSlot,
  };
  state.input.ref = mergedInputRef;

  const onInputKeyDown = useEventCallback(
    // eslint-disable-next-line react-hooks/refs
    mergeCallbacks(state.input.onKeyDown, (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape' && value && !disabled && !readOnly && !event.defaultPrevented) {
        event.preventDefault();
        event.stopPropagation();
        setValue('');
        onChange?.(event, { value: '' });
        inputRef.current?.focus();
      }
    }),
  );
  const onDismissClick = useEventCallback(
    // eslint-disable-next-line react-hooks/refs
    mergeCallbacks(state.dismiss?.onClick, (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !readOnly && !event.defaultPrevented) {
        setValue('');
        onChange?.(event, { value: '' });
        inputRef.current?.focus();
      }
    }),
  );
  state.input.onKeyDown = onInputKeyDown;
  if (state.dismiss) {
    state.dismiss.disabled = disabled || readOnly || state.dismiss.disabled;
    state.dismiss.onClick = onDismissClick;
  }

  // Set data attributes for disabled and focused states to simplify styling of these states.
  state.root['data-disabled'] = toDataAttributeValue(state.disabled);
  state.root['data-focused'] = toDataAttributeValue(state.focused);

  return state;
};
