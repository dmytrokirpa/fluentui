'use client';

import type * as React from 'react';
import { useDrawerBase_unstable } from '@fluentui/react-drawer';
import { getIntrinsicElementProps, slot } from '@fluentui/react-utilities';

import { stringifyDataAttribute } from '../../../utils';
import type { OverlayDrawerProps, OverlayDrawerState } from './OverlayDrawer.types';

/**
 * Returns the state for an OverlayDrawer component, given its props and ref.
 */
export const useOverlayDrawer = (props: OverlayDrawerProps, ref: React.Ref<HTMLDialogElement>): OverlayDrawerState => {
  'use no memo';

  const { open, position, unmountOnClose } = useDrawerBase_unstable(props);
  const {
    inertTrapFocus = false,
    modalType = 'modal',
    onOpenChange,
    open: _open,
    position: _position,
    unmountOnClose: _unmountOnClose,
    ...rootProps
  } = props;

  return {
    components: {
      root: 'dialog',
    },
    root: slot.always(
      getIntrinsicElementProps('dialog', {
        ...rootProps,
        ref,
        'data-open': stringifyDataAttribute(open),
        'data-position': position,
      }),
      { elementType: 'dialog' },
    ),
    inertTrapFocus,
    modalType,
    onOpenChange,
    open,
    position,
    unmountOnClose,
  };
};
