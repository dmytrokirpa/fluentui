import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Checkbox recipe.
 *
 * Transcribed from:
 * - packages/react-components/react-checkbox/library/src/components/Checkbox/useCheckboxStyles.styles.ts
 *
 * Intentional differences from Griffel styles:
 * - Focus ring uses native `:focus-within` (headless excludes tabster focus indicators).
 * - Indicator colors are driven via local CSS variables set on root (matches Griffel vars pattern).
 */
export const checkboxRecipe = defineSlotRecipe({
  component: 'Checkbox',
  headless: 'checkbox',
  slots: ['root', 'label', 'input', 'indicator'],
  source: 'react-checkbox/useCheckboxStyles.styles.ts',

  localTokens: {
    '--fui-Checkbox__indicator--color': 'transparent',
    '--fui-Checkbox__indicator--borderColor': '$colorNeutralStrokeAccessible',
    '--fui-Checkbox__indicator--backgroundColor': 'transparent',
  },

  base: {
    root: {
      position: 'relative',
      display: 'inline-flex',
      cursor: 'pointer',
      maxWidth: 'fit-content',
      verticalAlign: 'middle',
      color: '$colorNeutralForeground3',
      _hover: {
        color: '$colorNeutralForeground2',
        '--fui-Checkbox__indicator--borderColor': '$colorNeutralStrokeAccessibleHover',
      },
      _active: {
        color: '$colorNeutralForeground1',
        '--fui-Checkbox__indicator--borderColor': '$colorNeutralStrokeAccessiblePressed',
      },
      _focusWithin: {
        outline: '$strokeWidthThick solid $colorStrokeFocus2',
        outlineOffset: '2px',
      },
    },
    input: {
      boxSizing: 'border-box',
      cursor: 'inherit',
      height: '100%',
      margin: 0,
      opacity: 0,
      position: 'absolute',
      top: 0,
      width: 'calc(16px + 2 * $spacingHorizontalS)',
    },
    indicator: {
      alignSelf: 'flex-start',
      boxSizing: 'border-box',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      color: 'var(--fui-Checkbox__indicator--color)',
      backgroundColor: 'var(--fui-Checkbox__indicator--backgroundColor)',
      borderColor: 'var(--fui-Checkbox__indicator--borderColor)',
      borderStyle: 'solid',
      borderWidth: '$strokeWidthThin',
      borderRadius: '$borderRadiusSmall',
      margin: '$spacingVerticalS $spacingHorizontalS',
      fill: 'currentColor',
      pointerEvents: 'none',
      fontSize: '12px',
      height: '16px',
      width: '16px',
    },
    label: {
      alignSelf: 'center',
      color: 'inherit',
      cursor: 'inherit',
      padding: '$spacingVerticalS $spacingHorizontalS',
      marginTop: 'calc((16px - $lineHeightBase300) / 2)',
      marginBottom: 'calc((16px - $lineHeightBase300) / 2)',
    },
  },

  defaultVariants: {
    shape: 'square',
    size: 'medium',
  },

  variants: {
    shape: {
      square: {},
      circular: {
        indicator: {
          borderRadius: '$borderRadiusCircular',
        },
      },
    },
    size: {
      medium: {},
      large: {
        input: {
          width: 'calc(20px + 2 * $spacingHorizontalS)',
        },
        indicator: {
          fontSize: '16px',
          height: '20px',
          width: '20px',
        },
        label: {
          marginTop: 'calc((20px - $lineHeightBase300) / 2)',
          marginBottom: 'calc((20px - $lineHeightBase300) / 2)',
        },
      },
    },
  },

  states: {
    checked: {
      true: {
        root: {
          color: '$colorNeutralForeground1',
          '--fui-Checkbox__indicator--backgroundColor': '$colorCompoundBrandBackground',
          '--fui-Checkbox__indicator--color': '$colorNeutralForegroundInverted',
          '--fui-Checkbox__indicator--borderColor': '$colorCompoundBrandBackground',
          _hover: {
            '--fui-Checkbox__indicator--backgroundColor': '$colorCompoundBrandBackgroundHover',
            '--fui-Checkbox__indicator--borderColor': '$colorCompoundBrandBackgroundHover',
          },
          _active: {
            '--fui-Checkbox__indicator--backgroundColor': '$colorCompoundBrandBackgroundPressed',
            '--fui-Checkbox__indicator--borderColor': '$colorCompoundBrandBackgroundPressed',
          },
        },
      },
      mixed: {
        root: {
          color: '$colorNeutralForeground1',
          '--fui-Checkbox__indicator--borderColor': '$colorCompoundBrandStroke',
          '--fui-Checkbox__indicator--color': '$colorCompoundBrandForeground1',
          _hover: {
            '--fui-Checkbox__indicator--borderColor': '$colorCompoundBrandStrokeHover',
            '--fui-Checkbox__indicator--color': '$colorCompoundBrandForeground1Hover',
          },
          _active: {
            '--fui-Checkbox__indicator--borderColor': '$colorCompoundBrandStrokePressed',
            '--fui-Checkbox__indicator--color': '$colorCompoundBrandForeground1Pressed',
          },
        },
      },
    },
    disabled: {
      root: {
        cursor: 'default',
        color: '$colorNeutralForegroundDisabled',
        '--fui-Checkbox__indicator--borderColor': '$colorNeutralStrokeDisabled',
        '--fui-Checkbox__indicator--color': '$colorNeutralForegroundDisabled',
        _forcedColors: {
          color: 'GrayText',
          '--fui-Checkbox__indicator--color': 'GrayText',
        },
      },
    },
    labelPosition: {
      before: {
        input: { right: 0 },
        label: { paddingRight: '$spacingHorizontalXS' },
      },
      after: {
        input: { left: 0 },
        label: { paddingLeft: '$spacingHorizontalXS' },
      },
    },
  },
});
