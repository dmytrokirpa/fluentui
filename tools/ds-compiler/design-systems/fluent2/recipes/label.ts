import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Label recipe.
 * Source: react-label/useLabelStyles.styles.ts
 */
export const labelRecipe = defineSlotRecipe({
  component: 'Label',
  headless: 'label',
  slots: ['root', 'required'],
  source: 'react-label/useLabelStyles.styles.ts',

  base: {
    root: {
      fontFamily: '$fontFamilyBase',
      color: '$colorNeutralForeground1',
    },
    required: {
      color: '$colorPaletteRedForeground3',
      paddingLeft: '$spacingHorizontalXS',
    },
  },

  defaultVariants: {
    size: 'medium',
    weight: 'regular',
  },

  variants: {
    size: {
      small: {
        root: { fontSize: '$fontSizeBase200', lineHeight: '$lineHeightBase200' },
      },
      medium: {
        root: { fontSize: '$fontSizeBase300', lineHeight: '$lineHeightBase300' },
      },
      large: {
        root: {
          fontSize: '$fontSizeBase400',
          lineHeight: '$lineHeightBase400',
          fontWeight: '$fontWeightSemibold',
        },
      },
    },
    weight: {
      regular: {},
      semibold: {
        root: { fontWeight: '$fontWeightSemibold' },
      },
    },
  },

  states: {
    disabled: {
      root: {
        color: '$colorNeutralForegroundDisabled',
        _forcedColors: { color: 'GrayText' },
      },
      required: {
        color: '$colorNeutralForegroundDisabled',
        _forcedColors: { color: 'GrayText' },
      },
    },
    required: {
      // Indicator visibility is structural (slot presence); color lives on required slot.
    },
  },
});
