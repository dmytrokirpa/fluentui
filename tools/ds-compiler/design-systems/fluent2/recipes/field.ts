import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Field recipe.
 * Source: react-field/useFieldStyles.styles.ts
 *
 * orientation + size are DS variants (omitted from headless FieldBaseProps).
 * validationState is headless (`data-validate-state`).
 */
export const fieldRecipe = defineSlotRecipe({
  component: 'Field',
  headless: 'field',
  slots: ['root', 'label', 'validationMessage', 'validationMessageIcon', 'hint'],
  source: 'react-field/useFieldStyles.styles.ts',

  base: {
    root: {
      display: 'grid',
    },
    label: {
      maxWidth: 'max-content',
      maxHeight: 'max-content',
      paddingTop: '$spacingVerticalXXS',
      paddingBottom: '$spacingVerticalXXS',
      marginBottom: '$spacingVerticalXXS',
    },
    validationMessage: {
      marginTop: '$spacingVerticalXXS',
      color: '$colorNeutralForeground3',
      fontSize: '$fontSizeBase200',
      lineHeight: '$lineHeightBase200',
      fontWeight: '$fontWeightRegular',
    },
    validationMessageIcon: {
      display: 'inline-block',
      fontSize: '12px',
      marginLeft: 'calc(-12px - $spacingHorizontalXS)',
      marginRight: '$spacingHorizontalXS',
      lineHeight: 0,
      verticalAlign: '-1px',
    },
    hint: {
      marginTop: '$spacingVerticalXXS',
      color: '$colorNeutralForeground3',
      fontSize: '$fontSizeBase200',
      lineHeight: '$lineHeightBase200',
      fontWeight: '$fontWeightRegular',
    },
  },

  defaultVariants: {
    orientation: 'vertical',
    size: 'medium',
  },

  variants: {
    orientation: {
      vertical: {},
      horizontal: {
        root: {
          gridTemplateColumns: '33% 1fr',
          gridTemplateRows: 'auto auto auto 1fr',
        },
        label: {
          paddingTop: '$spacingVerticalSNudge',
          paddingBottom: '$spacingVerticalSNudge',
          marginRight: '$spacingHorizontalM',
          marginBottom: 0,
          gridRowStart: '1',
          gridRowEnd: '-1',
        },
      },
    },
    size: {
      small: {},
      medium: {},
      large: {
        label: {
          paddingTop: '1px',
          paddingBottom: '1px',
          marginBottom: '$spacingVerticalXS',
        },
      },
    },
  },

  compoundVariants: [
    {
      variants: { orientation: 'horizontal', size: 'small' },
      css: {
        label: {
          paddingTop: '$spacingVerticalXS',
          paddingBottom: '$spacingVerticalXS',
        },
      },
    },
    {
      variants: { orientation: 'horizontal', size: 'large' },
      css: {
        label: {
          paddingTop: '9px',
          paddingBottom: '9px',
          marginBottom: 0,
        },
      },
    },
  ],

  states: {
    validationState: {
      error: {
        validationMessage: { color: '$colorPaletteRedForeground1' },
        validationMessageIcon: { color: '$colorPaletteRedForeground1' },
      },
      warning: {
        validationMessageIcon: { color: '$colorPaletteDarkOrangeForeground1' },
      },
      success: {
        validationMessageIcon: { color: '$colorPaletteGreenForeground1' },
      },
      none: {},
    },
  },
});
