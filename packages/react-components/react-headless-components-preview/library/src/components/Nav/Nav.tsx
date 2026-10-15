'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useNav } from './useNav';
import { renderNav } from './renderNav';
import { useNavContextValues } from './useNavContextValues';
import type { NavProps } from './Nav.types';
import { composeComponent } from '../../utils/composeComponent';

/**
 * Nav - A headless component that provides up to two levels of nesting for navigation.
 */
export const Nav: ForwardRefComponent<NavProps> = /*#__PURE__*/ composeComponent(
  useNav,
  renderNav,
  useNavContextValues,
);

if (process.env.NODE_ENV !== 'production') {
  Nav.displayName = 'Nav';
}
