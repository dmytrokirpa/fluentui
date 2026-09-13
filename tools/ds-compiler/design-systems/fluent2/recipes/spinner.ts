import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Spinner recipe.
 * Source: react-spinner/useSpinnerStyles.styles.ts
 *
 * Intentional deltas:
 * - Spin/tail keyframes live in a small `raw` block (no @keyframes in schema yet).
 * - Full conic-gradient ring mask approximated with solid brand stroke colors.
 */
export const spinnerRecipe = defineSlotRecipe({
  component: 'Spinner',
  headless: 'spinner',
  slots: ['root', 'spinner', 'spinnerTail', 'label'],
  source: 'react-spinner/useSpinnerStyles.styles.ts',

  localTokens: {
    '--fui-Spinner--strokeWidth': '$strokeWidthThicker',
  },

  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 0,
      gap: '8px',
      overflow: 'hidden',
      minWidth: 'min-content',
    },
    spinner: {
      position: 'relative',
      flexShrink: 0,
      height: '32px',
      width: '32px',
      borderRadius: '$borderRadiusCircular',
      borderWidth: 'var(--fui-Spinner--strokeWidth)',
      borderStyle: 'solid',
      borderColor: '$colorBrandStroke2Contrast',
      borderTopColor: '$colorBrandStroke1',
      boxSizing: 'border-box',
      animationName: 'fui-Spinner-rotate',
      animationDuration: '1.5s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
      _forcedColors: {
        borderColor: 'HighlightText',
        borderTopColor: 'Highlight',
      },
      _reducedMotion: {
        animationDuration: '1.8s',
      },
    },
    spinnerTail: {
      // Structural slot retained for headless parity; ring motion is on spinner.
      display: 'none',
    },
    label: {
      fontSize: '$fontSizeBase300',
      lineHeight: '$lineHeightBase300',
      fontWeight: '$fontWeightSemibold',
      color: '$colorNeutralForeground1',
    },
  },

  defaultVariants: {
    appearance: 'primary',
    size: 'medium',
  },

  variants: {
    appearance: {
      primary: {},
      inverted: {
        spinner: {
          borderColor: '$colorNeutralStrokeAlpha2',
          borderTopColor: '$colorNeutralStrokeOnBrand2',
        },
        label: {
          color: '$colorNeutralForegroundStaticInverted',
        },
      },
    },
    size: {
      'extra-tiny': {
        spinner: {
          height: '16px',
          width: '16px',
          '--fui-Spinner--strokeWidth': '$strokeWidthThick',
        },
        label: { fontWeight: '$fontWeightRegular' },
      },
      tiny: {
        spinner: {
          height: '20px',
          width: '20px',
          '--fui-Spinner--strokeWidth': '$strokeWidthThick',
        },
        label: { fontWeight: '$fontWeightRegular' },
      },
      'extra-small': {
        spinner: {
          height: '24px',
          width: '24px',
          '--fui-Spinner--strokeWidth': '$strokeWidthThick',
        },
        label: { fontWeight: '$fontWeightRegular' },
      },
      small: {
        spinner: {
          height: '28px',
          width: '28px',
          '--fui-Spinner--strokeWidth': '$strokeWidthThick',
        },
        label: { fontWeight: '$fontWeightRegular' },
      },
      medium: {},
      large: {
        spinner: {
          height: '36px',
          width: '36px',
        },
      },
      'extra-large': {
        spinner: {
          height: '40px',
          width: '40px',
        },
      },
      huge: {
        spinner: {
          height: '44px',
          width: '44px',
          '--fui-Spinner--strokeWidth': '$strokeWidthThickest',
        },
        label: {
          fontSize: '$fontSizeBase400',
          lineHeight: '$lineHeightBase400',
        },
      },
    },
  },

  states: {
    labelPosition: {
      before: {},
      after: {},
      above: { root: { flexDirection: 'column' } },
      below: { root: { flexDirection: 'column' } },
    },
  },

  raw: [
    {
      reason: 'Spinner rotate keyframes (no @keyframes in recipe schema yet)',
      css: `@keyframes fui-Spinner-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
    },
  ],
});
