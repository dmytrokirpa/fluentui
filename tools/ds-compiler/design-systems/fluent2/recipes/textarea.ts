import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Textarea recipe.
 * Source: react-textarea/useTextareaStyles.styles.ts
 *
 * Intentional deltas:
 * - Focus underline approximated with `_focusWithin` border/boxShadow (full ::after animation omitted).
 */
export const textareaRecipe = defineSlotRecipe({
  component: 'Textarea',
  headless: 'textarea',
  slots: ['root', 'textarea'],
  source: 'react-textarea/useTextareaStyles.styles.ts',

  base: {
    root: {
      display: 'inline-flex',
      boxSizing: 'border-box',
      position: 'relative',
      margin: 0,
      borderRadius: '$borderRadiusMedium',
      verticalAlign: 'top',
      backgroundColor: '$colorNeutralBackground1',
      border: '1px solid $colorNeutralStroke1',
      borderBottomColor: '$colorNeutralStrokeAccessible',
      paddingBottom: '$strokeWidthThick',
      _hover: {
        borderColor: '$colorNeutralStroke1Hover',
        borderBottomColor: '$colorNeutralStrokeAccessibleHover',
      },
      _active: {
        borderColor: '$colorNeutralStroke1Pressed',
        borderBottomColor: '$colorNeutralStrokeAccessiblePressed',
      },
      _focusWithin: {
        borderColor: '$colorNeutralStroke1Pressed',
        borderBottomColor: '$colorCompoundBrandStroke',
        outline: '2px solid transparent',
        boxShadow: '0 2px 0 0 $colorCompoundBrandStroke',
      },
    },
    textarea: {
      borderStyle: 'none',
      margin: 0,
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      color: '$colorNeutralForeground1',
      flexGrow: 1,
      fontFamily: '$fontFamilyBase',
      height: '100%',
      outlineStyle: 'none',
      minHeight: '52px',
      maxHeight: '260px',
      padding: '$spacingVerticalSNudge calc($spacingHorizontalMNudge + $spacingHorizontalXXS)',
      fontSize: '$fontSizeBase300',
      lineHeight: '$lineHeightBase300',
      fontWeight: '$fontWeightRegular',
    },
  },

  defaultVariants: {
    appearance: 'outline',
    size: 'medium',
  },

  variants: {
    appearance: {
      outline: {},
      'filled-darker': {
        root: {
          backgroundColor: '$colorNeutralBackground3',
          borderColor: '$colorTransparentStroke',
          borderBottomColor: '$colorTransparentStroke',
          _hover: { borderColor: '$colorTransparentStrokeInteractive' },
          _focusWithin: {
            borderColor: '$colorTransparentStrokeInteractive',
            boxShadow: 'none',
            borderBottomColor: '$colorCompoundBrandStroke',
          },
        },
      },
      'filled-lighter': {
        root: {
          backgroundColor: '$colorNeutralBackground1',
          borderColor: '$colorTransparentStroke',
          borderBottomColor: '$colorTransparentStroke',
          _hover: { borderColor: '$colorTransparentStrokeInteractive' },
          _focusWithin: {
            borderColor: '$colorTransparentStrokeInteractive',
            boxShadow: 'none',
            borderBottomColor: '$colorCompoundBrandStroke',
          },
        },
      },
    },
    size: {
      small: {
        textarea: {
          minHeight: '40px',
          maxHeight: '200px',
          padding: '$spacingVerticalXS calc($spacingHorizontalSNudge + $spacingHorizontalXXS)',
          fontSize: '$fontSizeBase200',
          lineHeight: '$lineHeightBase200',
        },
      },
      medium: {},
      large: {
        textarea: {
          minHeight: '64px',
          maxHeight: '320px',
          padding: '$spacingVerticalS calc($spacingHorizontalM + $spacingHorizontalXXS)',
          fontSize: '$fontSizeBase400',
          lineHeight: '$lineHeightBase400',
        },
      },
    },
  },

  states: {
    disabled: {
      root: {
        backgroundColor: '$colorTransparentBackground',
        borderColor: '$colorNeutralStrokeDisabled',
        cursor: 'not-allowed',
        _hover: { borderColor: '$colorNeutralStrokeDisabled' },
        _focusWithin: {
          borderColor: '$colorNeutralStrokeDisabled',
          boxShadow: 'none',
        },
        _forcedColors: { borderColor: 'GrayText' },
      },
      textarea: {
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
      },
    },
    invalid: {
      root: {
        borderColor: '$colorPaletteRedBorder2',
        borderBottomColor: '$colorPaletteRedBorder2',
        _hover: {
          borderColor: '$colorPaletteRedBorder2',
          borderBottomColor: '$colorPaletteRedBorder2',
        },
      },
    },
    resize: {
      none: { textarea: { resize: 'none' } },
      horizontal: { textarea: { resize: 'horizontal' } },
      vertical: { textarea: { resize: 'vertical' } },
      both: { textarea: { resize: 'both' } },
    },
  },
});
