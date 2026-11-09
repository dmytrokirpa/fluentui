'use client';

import * as React from 'react';
import { useInlineDrawerBase_unstable } from '@fluentui/react-drawer';
import { useFocusFinders } from '@fluentui/react-tabster';
import { useEventCallback, useIsomorphicLayoutEffect, useMergedRefs } from '@fluentui/react-utilities';

import { getActiveElement, getDeepActiveElement } from '../../../hooks/top-layer/utils';
import { toDataAttributeValue } from '../../../utils';
import type { InlineDrawerProps, InlineDrawerState } from './InlineDrawer.types';

/**
 * Returns the state for an InlineDrawer component, given its props and ref.
 */
export const useInlineDrawer = (props: InlineDrawerProps, ref: React.Ref<HTMLElement>): InlineDrawerState => {
  const { onOpenChange, returnFocusRef, ...baseProps } = props;
  const drawerRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(ref, drawerRef);
  const { findFirstFocusable } = useFocusFinders();
  const state: InlineDrawerState = useInlineDrawerBase_unstable(baseProps, mergedRef);

  const restoreFocus = useEventCallback((drawer: HTMLElement, previous: HTMLElement | null) => {
    const activeElement = getActiveElement(drawer);
    if (activeElement && activeElement !== drawer.ownerDocument.body && !drawer.contains(activeElement)) {
      return;
    }

    const target = returnFocusRef?.current ?? previous;
    if (target?.isConnected && !drawer.contains(target)) {
      target.focus();
    }
  });

  useIsomorphicLayoutEffect(() => {
    drawerRef.current?.toggleAttribute('inert', !state.open);
  }, [state.open]);

  useIsomorphicLayoutEffect(() => {
    const drawer = drawerRef.current;
    if (!state.open || !drawer) {
      return;
    }

    const activeElement = getActiveElement(drawer);
    const previous =
      activeElement && !drawer.contains(activeElement)
        ? (getDeepActiveElement(drawer.ownerDocument) as HTMLElement | null)
        : null;
    if (!drawer.contains(activeElement)) {
      (findFirstFocusable(drawer) ?? drawer).focus();
    }

    return () => restoreFocus(drawer, previous);
  }, [state.open, findFirstFocusable, restoreFocus]);

  const onKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(event);
    if (event.key === 'Escape' && !event.isDefaultPrevented() && onOpenChange) {
      onOpenChange(event, { type: 'escapeKeyDown', open: false, event });
      event.stopPropagation();
    }
  });

  // eslint-disable-next-line react-hooks/immutability
  state.root.role = state.root.role ?? 'complementary';
  // eslint-disable-next-line react-hooks/immutability
  state.root.tabIndex = state.root.tabIndex ?? -1;
  // eslint-disable-next-line react-hooks/immutability
  state.root.hidden = !state.open || state.root.hidden;
  // eslint-disable-next-line react-hooks/immutability
  state.root.onKeyDown = onKeyDown;
  // eslint-disable-next-line react-hooks/immutability
  state.root['data-open'] = toDataAttributeValue(state.open);
  // eslint-disable-next-line react-hooks/immutability
  state.root['data-position'] = state.position;

  return state;
};
