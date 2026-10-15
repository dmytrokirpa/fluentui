'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { DrawerHeaderProps } from './DrawerHeader.types';
import { renderDrawerHeader } from './renderDrawerHeader';
import { useDrawerHeader } from './useDrawerHeader';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * DrawerHeader contains header content for a Drawer.
 */
export const DrawerHeader: ForwardRefComponent<DrawerHeaderProps> = /*#__PURE__*/ composeComponent(
  useDrawerHeader,
  renderDrawerHeader,
);

if (process.env.NODE_ENV !== 'production') {
  DrawerHeader.displayName = 'DrawerHeader';
}
