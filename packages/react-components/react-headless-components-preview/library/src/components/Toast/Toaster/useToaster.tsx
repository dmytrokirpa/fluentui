'use client';

import * as React from 'react';
import { useToaster as useToasterState, useToastAnnounce } from '@fluentui/react-toast';
import type { Announce, ToastPosition } from '@fluentui/react-toast';
import type { ToasterProps, ToasterState } from './Toaster.types';
import type { ExtractSlotProps, Slot } from '@fluentui/react-utilities';
import { getIntrinsicElementProps, slot, useEventCallback, useMergedRefs } from '@fluentui/react-utilities';
import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import { Escape } from '@fluentui/keyboard-keys';
import { ToastContainer } from '../ToastContainer';

/**
 * Create the state required to render the Toaster.
 */
export const useToaster = (props: ToasterProps): ToasterState => {
  'use no memo';

  const { mountNode, inline = false, toasterId, offset, shortcuts, announce: announceProp, ...rest } = props;

  const { toastsToRender, isToastVisible, tryRestoreFocus, closeAllToasts } = useToasterState<HTMLDivElement>({
    toasterId,
    offset,
    shortcuts,
  });

  const announceRef = React.useRef<Announce>(() => null);
  const announce = React.useCallback<Announce>((message, options) => announceRef.current(message, options), []);
  const { dir } = useFluent();

  const { onKeyDown: onKeyDownProp, ...rootProps } = slot.always(
    getIntrinsicElementProps<ExtractSlotProps<Slot<'div'>>>('div', rest),
    {
      elementType: 'div',
    },
  );
  const onKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === Escape) {
      e.preventDefault();
      closeAllToasts();
    }
    onKeyDownProp?.(e);
  });

  const usePositionSlot = (toastPosition: ToastPosition) => {
    const { announceToast, toasterRef } = useToastAnnounce(announceProp ?? announce);

    return slot.optional<ExtractSlotProps<Slot<'div'>>>(toastsToRender.has(toastPosition) ? rootProps : null, {
      defaultProps: {
        ref: useMergedRefs(toasterRef),
        children: toastsToRender.get(toastPosition)?.map(toast => (
          <ToastContainer
            {...toast}
            tryRestoreFocus={tryRestoreFocus}
            intent={toast.intent}
            announce={announceToast}
            key={toast.toastId}
            visible={isToastVisible(toast.toastId)}
          >
            {toast.content as React.ReactNode}
          </ToastContainer>
        )),
        onKeyDown,
        'data-toaster-position': toastPosition,
        role: 'list',
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
    mountNode,
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
    inline,
  };
};
