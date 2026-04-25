import type { DrawerBaseDefaultedProps, DrawerBaseProps } from '@fluentui/react-drawer';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';
import type { DialogProps } from '../../Dialog';

export type OverlayDrawerSlots = {
  root: Slot<'dialog'>;
};

export type OverlayDrawerProps = ComponentProps<OverlayDrawerSlots> &
  DrawerBaseProps &
  Pick<DialogProps, 'inertTrapFocus' | 'modalType' | 'onOpenChange'>;

export type OverlayDrawerState = ComponentState<OverlayDrawerSlots> &
  DrawerBaseDefaultedProps &
  Required<Pick<DialogProps, 'inertTrapFocus' | 'modalType'>> &
  Pick<DialogProps, 'onOpenChange'>;
