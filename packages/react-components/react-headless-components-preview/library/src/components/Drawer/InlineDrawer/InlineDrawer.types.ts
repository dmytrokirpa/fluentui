import type * as React from 'react';
import type { InlineDrawerBaseProps, InlineDrawerBaseState } from '@fluentui/react-drawer';
import type { EventHandler } from '@fluentui/react-utilities';

export type { InlineDrawerSlots } from '@fluentui/react-drawer';

export type InlineDrawerOpenChangeData = {
  type: 'escapeKeyDown';
  open: false;
  event: React.KeyboardEvent<HTMLElement>;
};

export type InlineDrawerProps = InlineDrawerBaseProps & {
  /**
   * Called when Escape requests that the controlled drawer close.
   */
  onOpenChange?: EventHandler<InlineDrawerOpenChangeData>;
  /**
   * Focus target after the drawer closes, if focus has not moved outside. Must be programmatically focusable.
   * Defaults to the element focused when the drawer opened.
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export type InlineDrawerState = InlineDrawerBaseState & {
  root: {
    /**
     * Indicates whether the drawer is open, used for styling purposes.
     */
    'data-open'?: string;
    /**
     * The position of the drawer, used for styling purposes.
     */
    'data-position'?: InlineDrawerBaseProps['position'];
  };
};
