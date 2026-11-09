'use client';

import * as React from 'react';
import { useToaster as useToasterState, useToastAnnounce } from '@fluentui/react-toast';
import type { ToastAnnounce, ToastPosition } from '@fluentui/react-toast';
import type { ToasterProps, ToasterState } from './Toaster.types';
import type { ExtractSlotProps, Slot } from '@fluentui/react-utilities';
import {
  getIntrinsicElementProps,
  isHTMLElement,
  slot,
  useEventCallback,
  useIsomorphicLayoutEffect,
  useMergedRefs,
} from '@fluentui/react-utilities';
import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import { Escape } from '@fluentui/keyboard-keys';
import { ToastContainer } from '../ToastContainer';
import { useLayerOpenState } from '../../../hooks/top-layer';

/**
 * Create the state required to render the Toaster.
 */
export const useToaster = (props: ToasterProps): ToasterState => {
  const {
    toasterId,
    position,
    timeout,
    pauseOnWindowBlur,
    pauseOnHover = true,
    priority,
    offset,
    shortcuts,
    limit,
    announce: announceProp,
    ...rest
  } = props;

  const playAllToastsRef = React.useRef<() => void>(() => undefined);
  const toasterShortcuts = React.useMemo(
    () =>
      shortcuts
        ? {
            focus: (e: KeyboardEvent) => {
              const isFocusShortcut = shortcuts.focus(e);
              if (isFocusShortcut) {
                Promise.resolve().then(() => playAllToastsRef.current());
              }
              return isFocusShortcut;
            },
          }
        : undefined,
    [shortcuts],
  );
  const { toastsToRender, isToastVisible, playAllToasts, tryRestoreFocus } = useToasterState<HTMLDivElement>({
    toasterId,
    position,
    timeout,
    pauseOnWindowBlur,
    pauseOnHover,
    priority,
    shortcuts: toasterShortcuts,
    limit,
  });
  useIsomorphicLayoutEffect(() => {
    playAllToastsRef.current = playAllToasts;
  }, [playAllToasts]);

  const announceRef = React.useRef<ToastAnnounce>(() => null);
  const announce = React.useCallback<ToastAnnounce>((message, options) => announceRef.current(message, options), []);
  const { dir, targetDocument } = useFluent();
  const focusBeforeToaster = React.useRef<HTMLElement | null>(null);

  const {
    onFocus: onFocusProp,
    onKeyDown: onKeyDownProp,
    ...rootProps
  } = slot.always(getIntrinsicElementProps<ExtractSlotProps<Slot<'div'>>>('div', rest), {
    elementType: 'div',
  });
  const onFocus = useEventCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const previous = e.relatedTarget;
    if (isHTMLElement(previous) && !previous.closest('[data-toaster-position]')) {
      focusBeforeToaster.current = previous;
    }
    onFocusProp?.(e);
  });
  const onKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDownProp?.(e);
    if (e.key === Escape && e.isDefaultPrevented()) {
      e.stopPropagation();
    }
  });
  const restoreFocus = useEventCallback(() => {
    if (targetDocument?.activeElement && targetDocument.activeElement !== targetDocument.body) {
      return;
    }

    tryRestoreFocus();
    if (targetDocument?.activeElement === targetDocument?.body && focusBeforeToaster.current?.isConnected) {
      focusBeforeToaster.current.focus();
    }
  });

  const usePositionSlot = (toastPosition: ToastPosition) => {
    const { announceToast, toasterRef } = useToastAnnounce(announceProp ?? announce);
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const positionHasToasts = toastsToRender.has(toastPosition);

    // Unmounted when the position has no toasts. Toasts restore focus themselves.
    useLayerOpenState(popoverRef, { open: positionHasToasts, mode: 'manual' });

    return slot.optional<ExtractSlotProps<Slot<'div'>>>(positionHasToasts ? {} : null, {
      defaultProps: {
        ref: useMergedRefs(toasterRef, popoverRef),
        children: toastsToRender.get(toastPosition)?.map(toast => (
          <ToastContainer
            {...toast}
            tryRestoreFocus={restoreFocus}
            intent={toast.intent}
            announce={announceToast}
            key={toast.toastId}
            visible={isToastVisible(toast.toastId)}
          >
            {toast.content as React.ReactNode}
          </ToastContainer>
        )),
        focusgroup: 'toolbar block itemcontrols',
        onFocus,
        onKeyDown,
        popover: 'manual' as const,
        'data-toaster-position': toastPosition,
        role: 'list',
        ...rootProps,
      } as ExtractSlotProps<Slot<'div'>>,
      elementType: 'div',
    });
  };

  const bottomStart = usePositionSlot('bottom-start');
  const bottomEnd = usePositionSlot('bottom-end');
  const topStart = usePositionSlot('top-start');
  const topEnd = usePositionSlot('top-end');
  const top = usePositionSlot('top');
  const bottom = usePositionSlot('bottom');

  return {
    dir,
    components: {
      root: 'div',
      bottomStart: 'div',
      bottomEnd: 'div',
      topStart: 'div',
      topEnd: 'div',
      top: 'div',
      bottom: 'div',
    },
    root: slot.always(rootProps, { elementType: 'div' }),
    bottomStart,
    bottomEnd,
    topStart,
    topEnd,
    top,
    bottom,
    announceRef,
    offset,
    announce: announceProp ?? announce,
    renderAriaLive: !announceProp,
  };
};
