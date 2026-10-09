import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Link recipe.
 * Source: react-link/useLinkStyles.styles.ts
 *
 * Intentional delta: focus uses native :focus-visible underline (no tabster double-underline helper).
 */
export const linkRecipe = defineSlotRecipe({
  component: 'Link',
  headless: 'link',
  slots: ['root'],
  source: 'react-link/useLinkStyles.styles.ts',

  base: {
    root: {
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      color: '$colorBrandForegroundLink',
      cursor: 'pointer',
      display: 'inline',
      fontFamily: '$fontFamilyBase',
      fontSize: '$fontSizeBase300',
      fontWeight: '$fontWeightRegular',
      margin: 0,
      padding: 0,
      textAlign: 'left',
      textDecorationLine: 'none',
      textDecorationThickness: '$strokeWidthThin',
      userSelect: 'text',
      outlineStyle: 'none',
      _hover: {
        textDecorationLine: 'underline',
        color: '$colorBrandForegroundLinkHover',
      },
      _active: {
        textDecorationLine: 'underline',
        color: '$colorBrandForegroundLinkPressed',
      },
      _focusVisible: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'double',
        textDecorationColor: '$colorStrokeFocus2',
      },
    },
  },

  defaultVariants: {
    appearance: 'default',
    inline: 'false',
  },

  variants: {
    appearance: {
      default: {},
      subtle: {
        root: {
          color: '$colorNeutralForeground2Link',
          _hover: {
            textDecorationLine: 'underline',
            color: '$colorNeutralForeground2LinkHover',
          },
          _active: {
            textDecorationLine: 'underline',
            color: '$colorNeutralForeground2LinkPressed',
          },
        },
      },
    },
    inline: {
      false: {},
      true: {
        root: { textDecorationLine: 'underline' },
      },
    },
  },

  states: {
    disabled: {
      root: {
        textDecorationLine: 'none',
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
        _hover: {
          textDecorationLine: 'none',
          color: '$colorNeutralForegroundDisabled',
        },
        _active: {
          textDecorationLine: 'none',
          color: '$colorNeutralForegroundDisabled',
        },
        _forcedColors: {
          color: 'GrayText',
          _hover: { color: 'GrayText' },
          _active: { color: 'GrayText' },
        },
      },
    },
    disabledFocusable: {
      root: {
        textDecorationLine: 'none',
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
      },
    },
  },
});
