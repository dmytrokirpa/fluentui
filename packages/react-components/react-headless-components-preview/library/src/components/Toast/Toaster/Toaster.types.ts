import type { Slot } from '@fluentui/react-utilities';

export type { ToasterSlots, ToasterProps, ToasterState } from '@fluentui/react-toast';

export type ToasterSlotsInternal = {
  root: Slot<'div'>;
  bottomEnd?: Slot<'div'>;
  bottomStart?: Slot<'div'>;
  topEnd?: Slot<'div'>;
  topStart?: Slot<'div'>;
  top?: Slot<'div'>;
  bottom?: Slot<'div'>;
};
