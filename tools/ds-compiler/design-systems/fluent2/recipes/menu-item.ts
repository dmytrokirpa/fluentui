import { defineSlotRecipe } from '../../../src/schema';
import { menuItemBaseSlots, menuItemInteractionStates, menuItemSubmenuIndicatorSlot } from './menu-item-shared';

/**
 * Fluent 2 MenuItem recipe.
 *
 * Transcribed from:
 * - packages/react-components/react-menu/library/src/components/MenuItem/useMenuItemStyles.styles.ts
 *
 * Intentional differences from Griffel styles:
 * - Focus ring uses native `:focus-visible` (headless excludes tabster focus indicators).
 * - Icon filled/regular swap on hover is omitted (requires icon bundle classes).
 * - Parent-hover → child colors use `_groupHover` / `_groupActive` (Panda group pattern).
 */
export const menuItemRecipe = defineSlotRecipe({
  component: 'MenuItem',
  headless: 'menu',
  slots: ['root', 'icon', 'checkmark', 'submenuIndicator', 'content', 'secondaryContent', 'subText'],
  source: 'react-menu/useMenuItemStyles.styles.ts',

  base: {
    ...menuItemBaseSlots,
    ...menuItemSubmenuIndicatorSlot,
  },

  states: {
    ...menuItemInteractionStates,
    hasSubmenu: {
      // Structural only — no unique visual beyond submenuIndicator slot presence.
    },
  },
});
