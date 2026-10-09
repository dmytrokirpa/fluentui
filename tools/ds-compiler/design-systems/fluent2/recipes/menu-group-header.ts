import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 MenuGroupHeader recipe.
 *
 * Transcribed from:
 * - packages/react-components/react-menu/library/src/components/MenuGroupHeader/useMenuGroupHeaderStyles.styles.ts
 */
export const menuGroupHeaderRecipe = defineSlotRecipe({
  component: 'MenuGroupHeader',
  headless: 'menu',
  slots: ['root'],
  source: 'react-menu/useMenuGroupHeaderStyles.styles.ts',

  base: {
    root: {
      fontSize: '$fontSizeBase200',
      color: '$colorNeutralForeground3',
      paddingLeft: '8px',
      paddingRight: '8px',
      fontWeight: '$fontWeightSemibold',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
    },
  },
});
