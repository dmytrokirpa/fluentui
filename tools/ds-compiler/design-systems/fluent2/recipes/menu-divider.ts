import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 MenuDivider recipe.
 *
 * Transcribed from:
 * - packages/react-components/react-menu/library/src/components/MenuDivider/useMenuDividerStyles.styles.ts
 */
export const menuDividerRecipe = defineSlotRecipe({
  component: 'MenuDivider',
  headless: 'menu',
  slots: ['root'],
  source: 'react-menu/useMenuDividerStyles.styles.ts',

  base: {
    root: {
      margin: '4px -5px 4px -5px',
      width: 'auto',
      borderBottom: '$strokeWidthThin solid $colorNeutralStroke2',
    },
  },
});
