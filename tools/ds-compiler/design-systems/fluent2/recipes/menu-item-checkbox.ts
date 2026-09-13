import { defineSlotRecipe } from '../../../src/schema';
import { menuItemBaseSlots, menuItemInteractionStates } from './menu-item-shared';

/**
 * Fluent 2 MenuItemCheckbox recipe.
 *
 * Transcribed from:
 * - react-menu MenuItemCheckbox styles (MenuItem + useCheckmarkStyles)
 *
 * Checkmark is hidden until `data-checked` is present (headless writes '' for true).
 */
export const menuItemCheckboxRecipe = defineSlotRecipe({
  component: 'MenuItemCheckbox',
  headless: 'menu',
  slots: ['root', 'icon', 'checkmark', 'content', 'secondaryContent', 'subText'],
  source: 'react-menu/useMenuItemCheckboxStyles.styles.ts + selectable/useCheckmarkStyles.styles.ts',

  base: {
    ...menuItemBaseSlots,
    checkmark: {
      ...menuItemBaseSlots.checkmark,
      width: '16px',
      height: '16px',
      visibility: 'hidden',
    },
  },

  states: {
    ...menuItemInteractionStates,
    hasSubmenu: {},
    checked: {
      checkmark: {
        visibility: 'visible',
      },
    },
  },
});
