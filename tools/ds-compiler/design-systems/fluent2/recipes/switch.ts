import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Switch recipe.
 * Source: react-switch/useSwitchStyles.styles.ts
 *
 * Thumb slide uses `_child` under checked (indicator > *).
 * Focus uses native :focus-within (headless excludes tabster indicators).
 */
export const switchRecipe = defineSlotRecipe({
  component: 'Switch',
  headless: 'switch',
  slots: ['root', 'indicator', 'input', 'label'],
  source: 'react-switch/useSwitchStyles.styles.ts',

  base: {
    root: {
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      display: 'inline-flex',
      position: 'relative',
      _focusWithin: {
        outline: '$strokeWidthThick solid $colorStrokeFocus2',
        outlineOffset: '2px',
      },
    },
    indicator: {
      borderRadius: '$borderRadiusCircular',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '$colorNeutralStrokeAccessible',
      lineHeight: 0,
      boxSizing: 'border-box',
      fill: 'currentColor',
      color: '$colorNeutralStrokeAccessible',
      flexShrink: 0,
      fontSize: '18px',
      height: '20px',
      width: '40px',
      margin: '$spacingVerticalS $spacingHorizontalS',
      pointerEvents: 'none',
      transitionDuration: '$durationNormal',
      transitionTimingFunction: '$curveEasyEase',
      transitionProperty: 'background, border, color',
      backgroundColor: 'transparent',
      _reducedMotion: { transitionDuration: '0.01ms' },
      _groupHover: {
        color: '$colorNeutralStrokeAccessibleHover',
        borderColor: '$colorNeutralStrokeAccessibleHover',
      },
      _groupActive: {
        color: '$colorNeutralStrokeAccessiblePressed',
        borderColor: '$colorNeutralStrokeAccessiblePressed',
      },
      _child: {
        transitionDuration: '$durationNormal',
        transitionTimingFunction: '$curveEasyEase',
        transitionProperty: 'transform',
        _reducedMotion: { transitionDuration: '0.01ms' },
      },
      _forcedColors: { color: 'CanvasText' },
    },
    input: {
      boxSizing: 'border-box',
      cursor: 'pointer',
      height: '100%',
      margin: 0,
      opacity: 0,
      position: 'absolute',
      width: 'calc(40px + 2 * $spacingHorizontalS)',
    },
    label: {
      cursor: 'pointer',
      color: '$colorNeutralForeground1',
      padding: '$spacingVerticalS $spacingHorizontalXS',
      alignSelf: 'center',
    },
  },

  defaultVariants: {
    size: 'medium',
  },

  variants: {
    size: {
      medium: {},
      small: {
        indicator: { fontSize: '14px', height: '16px', width: '32px' },
        input: { width: 'calc(32px + 2 * $spacingHorizontalS)' },
      },
    },
  },

  states: {
    checked: {
      indicator: {
        backgroundColor: '$colorCompoundBrandBackground',
        color: '$colorNeutralForegroundInverted',
        borderColor: '$colorTransparentStroke',
        _groupHover: {
          backgroundColor: '$colorCompoundBrandBackgroundHover',
          borderColor: '$colorTransparentStrokeInteractive',
        },
        _groupActive: {
          backgroundColor: '$colorCompoundBrandBackgroundPressed',
          borderColor: '$colorTransparentStrokeInteractive',
        },
        _child: {
          transform: 'translateX(20px)',
        },
      },
    },
    disabled: {
      root: {},
      input: { cursor: 'default' },
      indicator: {
        color: '$colorNeutralForegroundDisabled',
        borderColor: '$colorNeutralStrokeDisabled',
        backgroundColor: '$colorNeutralBackgroundDisabled',
        _groupHover: {
          color: '$colorNeutralForegroundDisabled',
          borderColor: '$colorNeutralStrokeDisabled',
          backgroundColor: '$colorNeutralBackgroundDisabled',
        },
      },
      label: {
        cursor: 'default',
        color: '$colorNeutralForegroundDisabled',
      },
    },
    disabledFocusable: {
      input: { cursor: 'default' },
      indicator: {
        color: '$colorNeutralForegroundDisabled',
        borderColor: '$colorNeutralStrokeDisabled',
      },
      label: {
        cursor: 'default',
        color: '$colorNeutralForegroundDisabled',
      },
    },
    labelPosition: {
      before: {},
      after: {},
      above: {
        root: { flexDirection: 'column' },
        indicator: { marginTop: 0 },
      },
    },
  },

  compoundVariants: [
    {
      variants: { size: 'small' },
      states: { checked: true },
      css: {
        indicator: {
          _child: { transform: 'translateX(16px)' },
        },
      },
    },
  ],
});
