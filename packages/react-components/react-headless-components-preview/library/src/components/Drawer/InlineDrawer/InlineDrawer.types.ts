import type { DrawerBaseDefaultedProps, DrawerBaseProps } from '@fluentui/react-drawer';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type InlineDrawerSlots = {
  root: Slot<'div', 'aside'>;
};

export type InlineDrawerProps = ComponentProps<InlineDrawerSlots> &
  DrawerBaseProps & {
    /**
     * Whether the drawer has a separator line.
     *
     * @default false
     */
    separator?: boolean;
  };

export type InlineDrawerState = ComponentState<InlineDrawerSlots> &
  DrawerBaseDefaultedProps &
  Required<Pick<InlineDrawerProps, 'separator'>>;
