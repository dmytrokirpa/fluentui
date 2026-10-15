'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { DrawerFooterProps } from './DrawerFooter.types';
import { renderDrawerFooter } from './renderDrawerFooter';
import { useDrawerFooter } from './useDrawerFooter';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * DrawerFooter contains footer content for a Drawer.
 */
export const DrawerFooter: ForwardRefComponent<DrawerFooterProps> = /*#__PURE__*/ composeComponent(
  useDrawerFooter,
  renderDrawerFooter,
);

if (process.env.NODE_ENV !== 'production') {
  DrawerFooter.displayName = 'DrawerFooter';
}
