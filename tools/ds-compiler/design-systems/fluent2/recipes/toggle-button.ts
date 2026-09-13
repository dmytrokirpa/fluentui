import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 ToggleButton recipe.
 * Builds on Button patterns + checked (selected) styles from
 * react-button/useToggleButtonStyles.styles.ts
 *
 * Intentional deltas: same as Button (native focus-visible; no icon filled/regular swap).
 */
export const toggleButtonRecipe = defineSlotRecipe({
  component: 'ToggleButton',
  headless: 'toggle-button',
  slots: ['root', 'icon'],
  source: 'react-button/useToggleButtonStyles.styles.ts',

  localTokens: {
    '--fui-ToggleButton__icon--spacing': '$spacingHorizontalSNudge',
  },

  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      textDecorationLine: 'none',
      verticalAlign: 'middle',
      margin: 0,
      overflow: 'hidden',
      backgroundColor: '$colorNeutralBackground1',
      color: '$colorNeutralForeground1',
      border: '$strokeWidthThin solid $colorNeutralStroke1',
      fontFamily: '$fontFamilyBase',
      outlineStyle: 'none',
      padding: '5px $spacingHorizontalM',
      minWidth: '96px',
      borderRadius: '$borderRadiusMedium',
      fontSize: '$fontSizeBase300',
      fontWeight: '$fontWeightSemibold',
      lineHeight: '$lineHeightBase300',
      transitionDuration: '$durationFaster',
      transitionProperty: 'background, border, color',
      transitionTimingFunction: '$curveEasyEase',
      cursor: 'pointer',
      _hover: {
        backgroundColor: '$colorNeutralBackground1Hover',
        borderColor: '$colorNeutralStroke1Hover',
        color: '$colorNeutralForeground1Hover',
      },
      _active: {
        backgroundColor: '$colorNeutralBackground1Pressed',
        borderColor: '$colorNeutralStroke1Pressed',
        color: '$colorNeutralForeground1Pressed',
      },
      _focusVisible: {
        borderColor: '$colorStrokeFocus2',
        borderWidth: '1px',
        outline: '$strokeWidthThick solid $colorTransparentStroke',
        boxShadow: 'inset 0 0 0 $strokeWidthThin $colorStrokeFocus2',
        zIndex: 1,
      },
      _reducedMotion: { transitionDuration: '0.01ms' },
    },
    icon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      height: '20px',
      width: '20px',
    },
  },

  defaultVariants: {
    appearance: 'secondary',
    size: 'medium',
    shape: 'rounded',
  },

  variants: {
    appearance: {
      secondary: {},
      primary: {
        root: {
          backgroundColor: '$colorBrandBackground',
          borderColor: 'transparent',
          color: '$colorNeutralForegroundOnBrand',
          _hover: {
            backgroundColor: '$colorBrandBackgroundHover',
            borderColor: 'transparent',
            color: '$colorNeutralForegroundOnBrand',
          },
          _active: {
            backgroundColor: '$colorBrandBackgroundPressed',
            borderColor: 'transparent',
            color: '$colorNeutralForegroundOnBrand',
          },
        },
      },
      outline: {
        root: {
          backgroundColor: '$colorTransparentBackground',
          _hover: { backgroundColor: '$colorTransparentBackgroundHover' },
          _active: { backgroundColor: '$colorTransparentBackgroundPressed' },
        },
      },
      subtle: {
        root: {
          backgroundColor: '$colorSubtleBackground',
          borderColor: 'transparent',
          color: '$colorNeutralForeground2',
          _hover: {
            backgroundColor: '$colorSubtleBackgroundHover',
            borderColor: 'transparent',
            color: '$colorNeutralForeground2Hover',
          },
          _active: {
            backgroundColor: '$colorSubtleBackgroundPressed',
            borderColor: 'transparent',
            color: '$colorNeutralForeground2Pressed',
          },
        },
      },
      transparent: {
        root: {
          backgroundColor: '$colorTransparentBackground',
          borderColor: 'transparent',
          color: '$colorNeutralForeground2',
          _hover: {
            backgroundColor: '$colorTransparentBackgroundHover',
            borderColor: 'transparent',
            color: '$colorNeutralForeground2BrandHover',
          },
          _active: {
            backgroundColor: '$colorTransparentBackgroundPressed',
            borderColor: 'transparent',
            color: '$colorNeutralForeground2BrandPressed',
          },
        },
      },
    },
    size: {
      small: {
        root: {
          minWidth: '64px',
          padding: '3px $spacingHorizontalS',
          fontSize: '$fontSizeBase200',
          lineHeight: '$lineHeightBase200',
        },
      },
      medium: {},
      large: {
        root: {
          minWidth: '96px',
          padding: '8px $spacingHorizontalL',
          fontSize: '$fontSizeBase400',
          lineHeight: '$lineHeightBase400',
        },
      },
    },
    shape: {
      rounded: {},
      circular: { root: { borderRadius: '$borderRadiusCircular' } },
      square: { root: { borderRadius: '$borderRadiusNone' } },
    },
  },

  states: {
    checked: {
      root: {
        backgroundColor: '$colorNeutralBackground1Selected',
        borderColor: '$colorNeutralStroke1',
        color: '$colorNeutralForeground1Selected',
        _hover: {
          backgroundColor: '$colorNeutralBackground1Hover',
          borderColor: '$colorNeutralStroke1Hover',
          color: '$colorNeutralForeground1Hover',
        },
        _active: {
          backgroundColor: '$colorNeutralBackground1Pressed',
          borderColor: '$colorNeutralStroke1Pressed',
          color: '$colorNeutralForeground1Pressed',
        },
        _forcedColors: {
          backgroundColor: 'Highlight',
          borderColor: 'Highlight',
          color: 'HighlightText',
        },
      },
    },
    disabled: {
      root: {
        backgroundColor: '$colorNeutralBackgroundDisabled',
        borderColor: '$colorNeutralStrokeDisabled',
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
      },
    },
    disabledFocusable: {
      root: {
        backgroundColor: '$colorNeutralBackgroundDisabled',
        borderColor: '$colorNeutralStrokeDisabled',
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
      },
    },
    iconOnly: {
      root: { minWidth: '32px', maxWidth: '32px', padding: '5px' },
    },
    iconPosition: {
      before: { icon: { marginRight: 'var(--fui-ToggleButton__icon--spacing)' } },
      after: { icon: { marginLeft: 'var(--fui-ToggleButton__icon--spacing)' } },
    },
  },

  compoundVariants: [
    {
      variants: { appearance: 'primary' },
      states: { checked: true },
      css: {
        root: {
          backgroundColor: '$colorBrandBackgroundSelected',
          borderColor: 'transparent',
          color: '$colorNeutralForegroundOnBrand',
          _hover: {
            backgroundColor: '$colorBrandBackgroundHover',
            borderColor: 'transparent',
            color: '$colorNeutralForegroundOnBrand',
          },
          _active: {
            backgroundColor: '$colorBrandBackgroundPressed',
            borderColor: 'transparent',
            color: '$colorNeutralForegroundOnBrand',
          },
        },
      },
    },
    {
      variants: { appearance: 'outline' },
      states: { checked: true },
      css: {
        root: {
          backgroundColor: '$colorTransparentBackgroundSelected',
          borderColor: '$colorNeutralStroke1',
          borderWidth: '$strokeWidthThicker',
        },
      },
    },
    {
      variants: { appearance: 'subtle' },
      states: { checked: true },
      css: {
        root: {
          backgroundColor: '$colorSubtleBackgroundSelected',
          borderColor: 'transparent',
          color: '$colorNeutralForeground2Selected',
        },
      },
    },
    {
      variants: { appearance: 'transparent' },
      states: { checked: true },
      css: {
        root: {
          backgroundColor: '$colorTransparentBackgroundSelected',
          borderColor: 'transparent',
          color: '$colorNeutralForeground2BrandSelected',
        },
      },
    },
  ],
});
