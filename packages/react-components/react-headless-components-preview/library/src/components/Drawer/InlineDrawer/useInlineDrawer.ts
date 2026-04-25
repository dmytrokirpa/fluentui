'use client';

import type * as React from 'react';
import { useDrawerBase_unstable } from '@fluentui/react-drawer';
import { getIntrinsicElementProps, slot } from '@fluentui/react-utilities';

import { stringifyDataAttribute } from '../../../utils';
import type { InlineDrawerProps, InlineDrawerState } from './InlineDrawer.types';

/**
 * Returns the state for an InlineDrawer component, given its props and ref.
 */
export const useInlineDrawer = (props: InlineDrawerProps, ref: React.Ref<HTMLElement>): InlineDrawerState => {
  'use no memo';

  const { open, position, unmountOnClose } = useDrawerBase_unstable(props);
  const { separator = false } = props;

  return {
    components: {
      root: 'div',
    },
    root: slot.always(
      getIntrinsicElementProps('div', {
        ...props,
        ref,
        'aria-hidden': !unmountOnClose && !open ? true : undefined,
        'data-open': stringifyDataAttribute(open),
        'data-position': position,
        'data-separator': stringifyDataAttribute(separator),
      }),
      { elementType: 'div' },
    ),
    open,
    position,
    separator,
    unmountOnClose,
  };
};
