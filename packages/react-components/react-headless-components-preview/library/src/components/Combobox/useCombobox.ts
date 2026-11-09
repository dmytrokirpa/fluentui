'use client';

import * as React from 'react';
import { mergeCallbacks, useEventCallback, useId, useMergedRefs, slot } from '@fluentui/react-utilities';
import { useComboboxExpandIconSlot, useInputTriggerSlot } from '@fluentui/react-combobox';
import type { ComboboxProps, ComboboxState } from './Combobox.types';
import { Listbox } from '../Dropdown/Listbox';
import { toDataAttributeValue } from '../../utils';
import { useListboxPopupState } from '../Dropdown/useListboxPopupState';

export const useCombobox = (props: ComboboxProps, ref: React.Ref<HTMLInputElement>): ComboboxState => {
  const { freeform } = props;
  const [initialFocus, setInitialFocus] = React.useState<'first' | 'last' | 'none'>('first');

  const {
    props: mergedProps,
    triggerRef,
    activeParentRef,
    activeDescendantController,
    triggerNativeProps,
    internalState,
    listbox,
    rootSlot,
  } = useListboxPopupState<ComboboxProps, HTMLInputElement>(props, {
    primarySlotTagName: 'input',
    fieldControlOptions: { supportsLabelFor: true, supportsRequired: true },
    baseStateExtras: () => ({ editable: true, initialFocus }),
    supportsMultiselectClear: true,
  });

  const { appearance: _appearance, size: _size, ...baseState } = internalState;
  const { clearable, clearSelection, disabled, getOptionsMatchingValue, hasFocus, multiselect, open, selectedOptions } =
    baseState;
  const expandIconRef = React.useRef<HTMLSpanElement>(null);
  const clearButtonRef = React.useRef<HTMLButtonElement>(null);
  const pendingEditRef = React.useRef<{ committedValue: string }>(undefined);
  const preservePendingOnCloseRef = React.useRef(false);
  const [selectedOptionTexts, setSelectedOptionTexts] = React.useState(() => new Map<string, string>());

  const selectOption = useEventCallback((...args: Parameters<typeof internalState.selectOption>) => {
    const option = args[1];
    if (!option.disabled) {
      if (multiselect && !selectedOptions.includes(option.value)) {
        setSelectedOptionTexts(previous => new Map(previous).set(option.value, option.text));
      } else if (!multiselect) {
        pendingEditRef.current = undefined;
      }
    }
    internalState.selectOption(...args);
  });

  React.useEffect(() => {
    if (!multiselect) {
      return;
    }

    const mountedOptions = getOptionsMatchingValue(value => selectedOptions.includes(value));
    // Keep selected labels after the option collection unregisters filtered or closed options.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOptionTexts(previous => {
      const next = new Map(Array.from(previous).filter(([value]) => selectedOptions.includes(value)));
      mountedOptions.forEach(option => next.set(option.value, option.text));
      if (next.size === previous.size && Array.from(next).every(([value, text]) => previous.get(value) === text)) {
        return previous;
      }
      return next;
    });
  }, [getOptionsMatchingValue, mergedProps.children, multiselect, open, selectedOptions]);

  const finishPendingEdit = useEventCallback(
    (event?: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
      const pendingEdit = pendingEditRef.current;
      if (!pendingEdit || (freeform && !event)) {
        return;
      }

      pendingEditRef.current = undefined;
      if (!freeform) {
        internalState.setValue(pendingEdit.committedValue);
      } else if (event && selectedOptions.length && internalState.value !== pendingEdit.committedValue) {
        clearSelection(event);
      }
    },
  );

  const baseTriggerSlot = useInputTriggerSlot(
    mergedProps.input ?? {},
    useMergedRefs(triggerRef, activeParentRef, ref),
    {
      state: {
        ...internalState,
        selectOption,
        clearSelection: () => undefined,
      },
      freeform,
      defaultProps: {
        type: 'text',
        value: baseState.value ?? '',
        'aria-controls': open ? listbox?.id : undefined,
        ...triggerNativeProps,
      },
      activeDescendantController,
      shouldCloseOnBlur: event =>
        !event.relatedTarget ||
        (event.relatedTarget !== expandIconRef.current && event.relatedTarget !== clearButtonRef.current),
    },
  );

  React.useEffect(() => {
    if (!open) {
      // The opening intent applies only to the current popup lifecycle.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialFocus('first');
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      if (!preservePendingOnCloseRef.current) {
        finishPendingEdit();
      }
      preservePendingOnCloseRef.current = false;
    }
  }, [finishPendingEdit, open]);

  const onTriggerKeyDown = baseTriggerSlot.onKeyDown;
  const onUserKeyDown = slot.resolveShorthand(mergedProps.input ?? {}).onKeyDown ?? triggerNativeProps.onKeyDown;
  const onUserBlur = slot.resolveShorthand(mergedProps.input ?? {}).onBlur ?? triggerNativeProps.onBlur;
  const onInputChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!internalState.multiselect) {
      pendingEditRef.current = {
        committedValue: pendingEditRef.current?.committedValue ?? internalState.value ?? '',
      };
    }
    baseTriggerSlot.onChange?.(event);
    if (!activeDescendantController.active()) {
      setInitialFocus('none');
    }
  });
  const onInputBlur = useEventCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const shouldClose =
      !event.relatedTarget ||
      (event.relatedTarget !== expandIconRef.current && event.relatedTarget !== clearButtonRef.current);
    if (shouldClose) {
      internalState.setOpen(event, false);
      internalState.setHasFocus(false);
    }
    onUserBlur?.(event);
    if (shouldClose) {
      finishPendingEdit(event);
    }
  });
  const onInputKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Home' || event.key === 'End') {
      onUserKeyDown?.(event);
      return;
    }

    if (!open && event.key === 'Enter') {
      event.preventDefault();
      finishPendingEdit(event);
      onUserKeyDown?.(event);
      return;
    }

    if (event.key === 'Escape' && pendingEditRef.current) {
      event.preventDefault();
      event.stopPropagation();
      if (open) {
        preservePendingOnCloseRef.current = true;
        internalState.setOpen(event, false);
        internalState.setValue(internalState.value);
      } else {
        internalState.setValue(pendingEditRef.current.committedValue);
        pendingEditRef.current = undefined;
      }
      onUserKeyDown?.(event);
      return;
    }

    if (event.altKey && event.key === 'ArrowUp') {
      event.preventDefault();
      if (open) {
        preservePendingOnCloseRef.current = true;
        internalState.setOpen(event, false);
        internalState.setValue(internalState.value);
      }
      onUserKeyDown?.(event);
      return;
    }

    if (event.shiftKey && event.key === 'Tab' && open) {
      preservePendingOnCloseRef.current = true;
      internalState.setOpen(event, false);
      onUserKeyDown?.(event);
      return;
    }

    if (event.altKey && event.key === 'ArrowDown' && open) {
      event.preventDefault();
      onUserKeyDown?.(event);
      return;
    }

    if (!open && event.key === 'ArrowDown') {
      setInitialFocus(event.altKey ? 'none' : 'first');
    } else if (!open && event.key === 'ArrowUp') {
      setInitialFocus('last');
    }

    if (open && event.key === 'Enter' && !activeDescendantController.active()) {
      onTriggerKeyDown?.(event);
      finishPendingEdit(event);
      return;
    }

    onTriggerKeyDown?.(event);
  });
  const triggerSlot = {
    ...baseTriggerSlot,
    onChange: onInputChange,
    onBlur: onInputBlur,
    onKeyDown: onInputKeyDown,
  } as typeof baseTriggerSlot;

  const selectionDisplayId = useId(
    'fluent-combobox-selection',
    slot.resolveShorthand(mergedProps.selectionDisplay)?.id,
  );
  const selectionDisplay = multiselect
    ? slot.optional(mergedProps.selectionDisplay, {
        elementType: 'span',
        renderByDefault: true,
        defaultProps: {
          id: selectionDisplayId,
          'aria-live': 'polite',
          children: selectedOptions
            .map(value => mergedProps.getSelectedOptionText?.(value) ?? selectedOptionTexts.get(value) ?? value)
            .join(', '),
        },
      })
    : undefined;
  triggerSlot['aria-describedby'] =
    [triggerSlot['aria-describedby'], selectionDisplay?.id].filter(Boolean).join(' ') || undefined;

  const showClearIcon =
    !!clearable &&
    (!!triggerSlot.value || selectedOptions.length > 0) &&
    !disabled &&
    !triggerSlot.disabled &&
    !triggerSlot.readOnly &&
    mergedProps.clearButton !== null &&
    (mergedProps.clearIcon !== null || mergedProps.clearButton !== undefined);
  const placeholderVisible = !baseState.value && !!mergedProps.placeholder;

  const state: ComboboxState = {
    ...baseState,
    selectOption,
    components: {
      root: 'div',
      input: 'input',
      expandIcon: 'span',
      clearIcon: 'span',
      clearButton: 'button',
      selectionDisplay: 'span',
      listbox: Listbox,
    },
    root: {
      ...rootSlot,
      'data-open': toDataAttributeValue(open),
      'data-disabled': toDataAttributeValue(triggerSlot.disabled),
      'data-placeholder': toDataAttributeValue(placeholderVisible),
      'data-invalid': toDataAttributeValue(triggerSlot['aria-invalid']),
      'data-clearable': toDataAttributeValue(showClearIcon),
    },
    input: triggerSlot,
    selectionDisplay,
    listbox: open || hasFocus ? listbox : undefined,
    clearIcon: slot.optional(mergedProps.clearIcon, {
      defaultProps: { 'aria-hidden': 'true' },
      elementType: 'span',
      renderByDefault: true,
    }),
    clearButton: showClearIcon
      ? slot.optional(mergedProps.clearButton, {
          defaultProps: { type: 'button', 'aria-label': 'Clear' },
          elementType: 'button',
          renderByDefault: true,
        })
      : undefined,
    expandIcon: useComboboxExpandIconSlot(mergedProps.expandIcon, {
      disabled,
      hideFromTabOrder: showClearIcon,
      open,
      'aria-label': mergedProps['aria-label'],
      'aria-labelledby': mergedProps['aria-labelledby'],
      triggerLabelledBy: triggerSlot['aria-labelledby'],
    }),
    showClearIcon,
    activeDescendantController,
  };

  const openOnPointerDownRef = React.useRef<boolean | undefined>(undefined);

  const onExpandIconMouseDown = useEventCallback(
    // eslint-disable-next-line react-hooks/refs
    mergeCallbacks(state.expandIcon?.onMouseDown, (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      openOnPointerDownRef.current = open;
    }),
  );

  const onExpandIconClick = useEventCallback(
    // eslint-disable-next-line react-hooks/refs
    mergeCallbacks(state.expandIcon?.onClick, (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      // Click-only activation must not consume a canceled pointer gesture.
      const wasOpenOnPointerDown = event.detail > 0 ? openOnPointerDownRef.current : undefined;
      const nextOpen = !(wasOpenOnPointerDown ?? open);
      openOnPointerDownRef.current = undefined;
      // A pointer interaction that starts while open light-dismisses an auto popover on pointerup.
      // Let the popover's toggle event issue the close notification so onOpenChange fires only once.
      if (!disabled && (!wasOpenOnPointerDown || listbox?.popover === 'manual')) {
        internalState.setOpen(event, nextOpen);
      }
      triggerRef.current?.focus();
    }),
  );

  const onExpandIconKeyDown = useEventCallback(
    // eslint-disable-next-line react-hooks/refs
    mergeCallbacks(state.expandIcon?.onKeyDown, event => {
      if (open && event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        internalState.setOpen(event, false);
        triggerRef.current?.focus();
        return;
      }

      if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const nextOpen = !open;
        internalState.setOpen(event, nextOpen);
        triggerRef.current?.focus();
      }
    }),
  );
  const expandIconSlotRef = useMergedRefs(state.expandIcon?.ref, expandIconRef);

  if (state.expandIcon) {
    state.expandIcon.ref = expandIconSlotRef;
    state.expandIcon.role = undefined;
    state.expandIcon['aria-hidden'] = true;
    state.expandIcon['aria-label'] = undefined;
    state.expandIcon['aria-labelledby'] = undefined;
    state.expandIcon['aria-expanded'] = undefined;
    state.expandIcon.tabIndex = -1;
    state.expandIcon.onMouseDown = onExpandIconMouseDown;
    state.expandIcon.onClick = onExpandIconClick;
    state.expandIcon.onKeyDown = onExpandIconKeyDown;
  }

  state.root.onBlur = mergeCallbacks(state.root.onBlur, event => {
    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
      if (event.target !== event.currentTarget.querySelector('input')) {
        internalState.setOpen(event as unknown as React.FocusEvent<HTMLInputElement>, false);
      }
      internalState.setHasFocus(false);
    }
  });

  const onClearButtonMouseDown = useEventCallback(
    mergeCallbacks(state.clearButton?.onMouseDown, (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
    }),
  );
  const onClearButtonClick = useEventCallback(
    // eslint-disable-next-line react-hooks/refs
    mergeCallbacks(state.clearButton?.onClick, (ev: React.MouseEvent<HTMLButtonElement>) => {
      if (
        !disabled &&
        !triggerSlot.disabled &&
        !triggerSlot.readOnly &&
        !state.clearButton?.disabled &&
        !ev.defaultPrevented
      ) {
        pendingEditRef.current = undefined;
        internalState.setValue('');
        clearSelection(ev);
        triggerRef.current?.focus();
      }
    }),
  );
  const clearButtonSlotRef = useMergedRefs(state.clearButton?.ref, clearButtonRef);

  if (state.clearButton) {
    state.clearButton.ref = clearButtonSlotRef;
    state.clearButton.onMouseDown = onClearButtonMouseDown;
    state.clearButton.onClick = onClearButtonClick;
  }

  return state;
};
