'use client';

import type * as React from 'react';
import { useDrawerHeaderTitleBase_unstable } from '@fluentui/react-drawer';
import { useDialogContext } from '../../Dialog';
import type { DrawerHeaderTitleProps, DrawerHeaderTitleState } from './DrawerHeaderTitle.types';

/**
 * Returns the state for a DrawerHeaderTitle component, given its props and ref.
 */
export const useDrawerHeaderTitle = (
  props: DrawerHeaderTitleProps,
  ref: React.Ref<HTMLDivElement>,
): DrawerHeaderTitleState => {
  'use no memo';

  const { dialogTitleId } = useDialogContext();

  return useDrawerHeaderTitleBase_unstable(props, ref, dialogTitleId);
};
