import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Input recipe.
 * Source: react-input/useInputStyles.styles.ts
 *
 * Intentional deltas:
 * - Focus underline approximated with `_focusWithin` border/boxShadow (full ::after animation omitted).
 * - contentBefore/contentAfter padding compounds simplified to size variants.
 */
export const inputRecipe = defineSlotRecipe({
  component: 'Input',
  headless: 'input',
  slots: ['root', 'input', 'contentBefore', 'contentAfter'],
  source: 'react-input/useInputStyles.styles.ts',

  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      gap: '$spacingHorizontalXXS',
      borderRadius: '$borderRadiusMedium',
      position: 'relative',
      boxSizing: 'border-box',
      verticalAlign: 'middle',
      minHeight: '32px',
      fontFamily: '$fontFamilyBase',
      fontSize: '$fontSizeBase300',
      lineHeight: '$lineHeightBase300',
      fontWeight: '$fontWeightRegular',
      backgroundColor: '$colorNeutralBackground1',
      border: '1px solid $colorNeutralStroke1',
      borderBottomColor: '$colorNeutralStrokeAccessible',
      paddingLeft: '$spacingHorizontalMNudge',
      paddingRight: '$spacingHorizontalMNudge',
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
    input: {
      alignSelf: 'stretch',
      boxSizing: 'border-box',
      flexGrow: 1,
      minWidth: 0,
      borderStyle: 'none',
      padding: '0 $spacingHorizontalXXS',
      color: '$colorNeutralForeground1',
      backgroundColor: 'transparent',
      outlineStyle: 'none',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
    },
    contentBefore: {
      boxSizing: 'border-box',
      color: '$colorNeutralForeground3',
      display: 'flex',
      // restored in size compounds if needed
    },
    contentAfter: {
      boxSizing: 'border-box',
      color: '$colorNeutralForeground3',
      display: 'flex',
    },
  },

  defaultVariants: {
    appearance: 'outline',
    size: 'medium',
  },

  variants: {
    appearance: {
      outline: {},
      underline: {
        root: {
          backgroundColor: '$colorTransparentBackground',
          borderRadius: 0,
          borderTopStyle: 'none',
          borderRightStyle: 'none',
          borderLeftStyle: 'none',
          _focusWithin: {
            boxShadow: '0 2px 0 0 $colorCompoundBrandStroke',
          },
        },
      },
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
        root: {
          minHeight: '24px',
          fontSize: '$fontSizeBase200',
          lineHeight: '$lineHeightBase200',
          paddingLeft: '$spacingHorizontalSNudge',
          paddingRight: '$spacingHorizontalSNudge',
        },
      },
      medium: {},
      large: {
        root: {
          minHeight: '40px',
          fontSize: '$fontSizeBase400',
          lineHeight: '$lineHeightBase400',
          gap: '$spacingHorizontalSNudge',
          paddingLeft: '$spacingHorizontalM',
          paddingRight: '$spacingHorizontalM',
        },
      },
    },
  },

  states: {
    disabled: {
      root: {
        backgroundColor: '$colorTransparentBackground',
        borderColor: '$colorNeutralStrokeDisabled',
        borderBottomColor: '$colorNeutralStrokeDisabled',
        cursor: 'not-allowed',
        _hover: {
          borderColor: '$colorNeutralStrokeDisabled',
          borderBottomColor: '$colorNeutralStrokeDisabled',
        },
        _focusWithin: {
          borderColor: '$colorNeutralStrokeDisabled',
          borderBottomColor: '$colorNeutralStrokeDisabled',
          boxShadow: 'none',
        },
      },
      input: {
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
      },
      contentBefore: { color: '$colorNeutralForegroundDisabled' },
      contentAfter: { color: '$colorNeutralForegroundDisabled' },
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
  },
});
