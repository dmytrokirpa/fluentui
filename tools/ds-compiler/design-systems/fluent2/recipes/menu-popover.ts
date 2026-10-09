import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 MenuPopover recipe.
 *
 * Transcribed from:
 * - packages/react-components/react-menu/library/src/components/MenuPopover/useMenuPopoverStyles.styles.ts
 */
export const menuPopoverRecipe = defineSlotRecipe({
  component: 'MenuPopover',
  headless: 'menu',
  slots: ['root'],
  source: 'react-menu/useMenuPopoverStyles.styles.ts',

  base: {
    root: {
      borderRadius: '$borderRadiusMedium',
      backgroundColor: '$colorNeutralBackground1',
      color: '$colorNeutralForeground1',
      boxSizing: 'border-box',
      minWidth: '138px',
      maxWidth: '300px',
      overflowX: 'hidden',
      width: 'max-content',
      boxShadow: '$shadow16',
      padding: '4px',
      border: '1px solid $colorTransparentStroke',
      fontFamily: '$fontFamilyBase',
      fontSize: '$fontSizeBase300',
      fontWeight: '$fontWeightRegular',
      lineHeight: '$lineHeightBase300',
    },
  },
});
