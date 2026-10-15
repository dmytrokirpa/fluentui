'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import { useNavDrawerFooter } from './useNavDrawerFooter';
import { renderNavDrawerFooter } from './renderNavDrawerFooter';
import type { NavDrawerFooterProps } from './NavDrawerFooter.types';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * NavDrawerFooter component — the footer area of a NavDrawer.
 */
export const NavDrawerFooter: ForwardRefComponent<NavDrawerFooterProps> = /*#__PURE__*/ composeComponent(
  useNavDrawerFooter,
  renderNavDrawerFooter,
);

if (process.env.NODE_ENV !== 'production') {
  NavDrawerFooter.displayName = 'NavDrawerFooter';
}
