import type { PresenceDirection, PresenceMotionSlotProps } from '@fluentui/react-motion';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

import type { DrawerMotionParams } from '../../shared/drawerMotions';
import type { DrawerBaseProps, DrawerBaseState } from '../../shared/DrawerBase.types';
import type { DrawerSizeProps } from '../../shared/DrawerSize.types';

export type SurfaceMotionSlotProps = PresenceMotionSlotProps<DrawerMotionParams>;

export type InlineDrawerSlots = {
  root: Slot<'div', 'aside'>;
  surfaceMotion?: Slot<SurfaceMotionSlotProps>;
};

export type InlineDrawerBaseSlots = Omit<InlineDrawerSlots, 'surfaceMotion'>;

/**
 * InlineDrawer Props
 */
export type InlineDrawerProps = ComponentProps<InlineDrawerSlots> &
  DrawerBaseProps &
  DrawerSizeProps & {
    /**
     * Whether the drawer has a separator line.
     *
     * @default false
     */
    separator?: boolean;
  };

export type InlineDrawerBaseProps = ComponentProps<InlineDrawerBaseSlots> & DrawerBaseProps;

/**
 * State used in rendering InlineDrawer
 */
export type InlineDrawerState = Required<
  ComponentState<NonNullable<InlineDrawerSlots>> &
    DrawerBaseState &
    DrawerSizeProps &
    Pick<InlineDrawerProps, 'separator'> & {
      animationDirection: PresenceDirection;
    }
>;

export type InlineDrawerBaseState = Required<
  ComponentState<InlineDrawerBaseSlots> & Omit<DrawerBaseState, 'motion'> & Pick<InlineDrawerProps, 'separator'>
>;
