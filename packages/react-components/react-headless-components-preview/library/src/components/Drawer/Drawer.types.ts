import type * as React from 'react';
import type { ComponentProps, DistributiveOmit, EventHandler } from '@fluentui/react-utilities';
import type { DialogOpenChangeData } from '../Dialog';
import type { InlineDrawerOpenChangeData, InlineDrawerProps, InlineDrawerSlots } from './InlineDrawer';
import type { OverlayDrawerProps, OverlayDrawerSlots } from './OverlayDrawer';

export type DrawerSlots = Pick<OverlayDrawerSlots, 'root'> | Pick<InlineDrawerSlots, 'root'>;

export type DrawerOpenChangeData = DialogOpenChangeData | InlineDrawerOpenChangeData;

export type DrawerProps = {
  onOpenChange?: EventHandler<DrawerOpenChangeData>;
} & (
  | (ComponentProps<DrawerSlots> & {
      /**
       * Type of the drawer.
       *
       * @default overlay
       */
      type?: 'overlay';
    } & DistributiveOmit<OverlayDrawerProps, 'onOpenChange'>)
  | (ComponentProps<DrawerSlots> & {
      /**
       * Type of the drawer.
       *
       * - 'overlay' - Drawer is hidden by default and can be opened by clicking on the trigger.
       * - 'inline' - Drawer is stacked with the content.
       */
      type: 'inline';
    } & DistributiveOmit<InlineDrawerProps, 'onOpenChange'>)
);

export type DrawerState = {
  components: {
    root: React.FC<InlineDrawerProps | OverlayDrawerProps>;
  };
  root: InlineDrawerProps | OverlayDrawerProps;
};
