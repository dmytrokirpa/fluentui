import { defineSlotRecipe } from '../../../src/schema';
import { menuItemBaseSlots, menuItemInteractionStates } from './menu-item-shared';

/**
 * Fluent 2 MenuItemRadio recipe.
 *
 * Transcribed from:
 * - react-menu MenuItemRadio styles (MenuItem + useCheckmarkStyles)
 *
 * Checkmark is hidden until `data-checked` is present (headless writes '' for true).
 */
export const menuItemRadioRecipe = defineSlotRecipe({
  component: 'MenuItemRadio',
  headless: 'menu',
  slots: ['root', 'icon', 'checkmark', 'content', 'secondaryContent', 'subText'],
  source: 'react-menu/useMenuItemRadioStyles.styles.ts + selectable/useCheckmarkStyles.styles.ts',

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
