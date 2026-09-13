import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Button recipe.
 *
 * Transcribed from:
 * - packages/react-components/react-button/library/src/components/Button/useButtonStyles.styles.ts
 * - packages/web-components/src/button/button.styles.ts
 *
 * Intentional differences from Griffel styles:
 * - Focus ring uses native `:focus-visible` (headless excludes tabster focus indicators).
 * - Icon filled/regular swap on subtle/transparent hover is omitted (requires icon bundle classes).
 */
export const buttonRecipe = defineSlotRecipe({
  component: 'Button',
  headless: 'button',
  slots: ['root', 'icon'],
  source: 'react-button/useButtonStyles.styles.ts + web-components/button.styles.ts',

  localTokens: {
    '--fui-Button__icon--spacing': '$spacingHorizontalSNudge',
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
      secondary: {
        // same as base
      },
      primary: {
        root: {
          backgroundColor: '$colorBrandBackground',
          borderColor: 'transparent',
          color: '$colorNeutralForegroundOnBrand',
        },
      },
      outline: {
        root: {
          backgroundColor: '$colorTransparentBackground',
        },
      },
      subtle: {
        root: {
          backgroundColor: '$colorSubtleBackground',
          borderColor: 'transparent',
          color: '$colorNeutralForeground2',
        },
      },
      transparent: {
        root: {
          backgroundColor: '$colorTransparentBackground',
          borderColor: 'transparent',
          color: '$colorNeutralForeground2',
        },
      },
    },
    size: {
      small: {
        root: {
          minWidth: '64px',
          padding: '3px $spacingHorizontalS',
          borderRadius: '$borderRadiusMedium',
          fontSize: '$fontSizeBase200',
          fontWeight: '$fontWeightRegular',
          lineHeight: '$lineHeightBase200',
        },
        icon: {
          fontSize: '20px',
          height: '20px',
          width: '20px',
        },
      },
      medium: {
        // defined in base
      },
      large: {
        root: {
          minWidth: '96px',
          padding: '8px $spacingHorizontalL',
          borderRadius: '$borderRadiusMedium',
          fontSize: '$fontSizeBase400',
          fontWeight: '$fontWeightSemibold',
          lineHeight: '$lineHeightBase400',
        },
        icon: {
          fontSize: '24px',
          height: '24px',
          width: '24px',
        },
      },
    },
    shape: {
      rounded: {
        // defined in base / size
      },
      circular: {
        root: {
          borderRadius: '$borderRadiusCircular',
        },
      },
      square: {
        root: {
          borderRadius: '$borderRadiusNone',
        },
      },
    },
  },

  states: {
    disabled: {
      root: {
        backgroundColor: '$colorNeutralBackgroundDisabled',
        borderColor: '$colorNeutralStrokeDisabled',
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
      },
      icon: {
        color: '$colorNeutralForegroundDisabled',
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
      root: {
        minWidth: '32px',
        maxWidth: '32px',
        padding: '5px',
      },
    },
    iconPosition: {
      before: {
        icon: {
          marginRight: 'var(--fui-Button__icon--spacing)',
        },
      },
      after: {
        icon: {
          marginLeft: 'var(--fui-Button__icon--spacing)',
        },
      },
    },
  },

  compoundVariants: [
    {
      variants: { size: 'small' },
      states: { iconOnly: true },
      css: {
        root: {
          minWidth: '24px',
          maxWidth: '24px',
          padding: '1px',
        },
      },
    },
    {
      variants: { size: 'large' },
      states: { iconOnly: true },
      css: {
        root: {
          minWidth: '40px',
          maxWidth: '40px',
          padding: '7px',
        },
      },
    },
    {
      variants: { appearance: 'primary' },
      states: { disabled: true },
      css: {
        root: {
          backgroundColor: '$colorNeutralBackgroundDisabled',
          borderColor: '$colorNeutralStrokeDisabled',
          color: '$colorNeutralForegroundDisabled',
        },
      },
    },
    {
      variants: { appearance: 'outline' },
      states: { disabled: true },
      css: {
        root: {
          backgroundColor: '$colorTransparentBackground',
        },
      },
    },
    {
      variants: { appearance: 'subtle' },
      states: { disabled: true },
      css: {
        root: {
          backgroundColor: '$colorTransparentBackground',
          borderColor: 'transparent',
        },
      },
    },
    {
      variants: { appearance: 'transparent' },
      states: { disabled: true },
      css: {
        root: {
          backgroundColor: '$colorTransparentBackground',
          borderColor: 'transparent',
        },
      },
    },
  ],

  interactions: {
    root: {
      hover: {
        backgroundColor: '$colorNeutralBackground1Hover',
        borderColor: '$colorNeutralStroke1Hover',
        color: '$colorNeutralForeground1Hover',
      },
      active: {
        backgroundColor: '$colorNeutralBackground1Pressed',
        borderColor: '$colorNeutralStroke1Pressed',
        color: '$colorNeutralForeground1Pressed',
      },
      focusVisible: {
        borderColor: '$colorStrokeFocus2',
        borderWidth: '1px',
        outline: '$strokeWidthThick solid $colorTransparentStroke',
        boxShadow: 'inset 0 0 0 $strokeWidthThin $colorStrokeFocus2',
        zIndex: 1,
      },
    },
  },

  conditions: {
    reducedMotion: {
      root: {
        transitionDuration: '0.01ms',
      },
    },
    forcedColors: {
      root: {
        // System colors — allow-listed literals
        // (full parity with Griffel high-contrast blocks is a follow-up)
      },
    },
  },

  raw: [
    {
      reason: 'Primary appearance hover/active overrides — compound interaction selectors not in schema yet',
      css: `.fui-Button[data-fui-appearance="primary"]:not([data-disabled]):not([data-disabled-focusable]):hover {
  background-color: var(--colorBrandBackgroundHover);
  border-color: transparent;
  color: var(--colorNeutralForegroundOnBrand);
}
.fui-Button[data-fui-appearance="primary"]:not([data-disabled]):not([data-disabled-focusable]):active {
  background-color: var(--colorBrandBackgroundPressed);
  border-color: transparent;
  color: var(--colorNeutralForegroundOnBrand);
}
.fui-Button[data-fui-appearance="subtle"]:not([data-disabled]):not([data-disabled-focusable]):hover {
  background-color: var(--colorSubtleBackgroundHover);
  border-color: transparent;
  color: var(--colorNeutralForeground2Hover);
}
.fui-Button[data-fui-appearance="subtle"]:not([data-disabled]):not([data-disabled-focusable]):active {
  background-color: var(--colorSubtleBackgroundPressed);
  border-color: transparent;
  color: var(--colorNeutralForeground2Pressed);
}
.fui-Button[data-fui-appearance="transparent"]:not([data-disabled]):not([data-disabled-focusable]):hover {
  background-color: var(--colorTransparentBackgroundHover);
  border-color: transparent;
  color: var(--colorNeutralForeground2BrandHover);
}
.fui-Button[data-fui-appearance="transparent"]:not([data-disabled]):not([data-disabled-focusable]):active {
  background-color: var(--colorTransparentBackgroundPressed);
  border-color: transparent;
  color: var(--colorNeutralForeground2BrandPressed);
}
.fui-Button[data-fui-appearance="outline"]:not([data-disabled]):not([data-disabled-focusable]):hover {
  background-color: var(--colorTransparentBackgroundHover);
}
.fui-Button[data-fui-appearance="outline"]:not([data-disabled]):not([data-disabled-focusable]):active {
  background-color: var(--colorTransparentBackgroundPressed);
}`,
    },
  ],
});
