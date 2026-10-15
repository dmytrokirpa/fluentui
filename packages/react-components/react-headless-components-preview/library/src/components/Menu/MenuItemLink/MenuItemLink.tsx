'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useMenuItemLink } from './useMenuItemLink';
import { renderMenuItemLink } from './renderMenuItemLink';
import type { MenuItemLinkProps } from './MenuItemLink.types';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * Headless MenuItemLink component.
 *
 * Renders an anchor (`<a>`) with `role="menuitem"` for navigational menu
 * items. Click follows the supplied `href`.
 */
export const MenuItemLink: ForwardRefComponent<MenuItemLinkProps> = /*#__PURE__*/ composeComponent(
  useMenuItemLink,
  renderMenuItemLink,
);

if (process.env.NODE_ENV !== 'production') {
  MenuItemLink.displayName = 'MenuItemLink';
}
