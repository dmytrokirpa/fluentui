import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Slider recipe.
 * Source: react-slider/useSliderStyles.styles.ts
 *
 * Progress/thumb position use headless CSS vars (--fui-Slider--*).
 * Focus outline approximated with `_focusWithin` (tabster outline omitted).
 */
export const sliderRecipe = defineSlotRecipe({
  component: 'Slider',
  headless: 'slider',
  slots: ['root', 'rail', 'thumb', 'input'],
  source: 'react-slider/useSliderStyles.styles.ts',

  localTokens: {
    '--fui-Slider__thumb--size': '20px',
    '--fui-Slider__inner-thumb--radius': '6px',
    '--fui-Slider__rail--size': '4px',
    '--fui-Slider__rail--color': '$colorNeutralStrokeAccessible',
    '--fui-Slider__progress--color': '$colorCompoundBrandBackground',
    '--fui-Slider__thumb--color': '$colorCompoundBrandBackground',
  },

  base: {
    root: {
      position: 'relative',
      display: 'inline-grid',
      alignItems: 'center',
      justifyItems: 'center',
      minWidth: '120px',
      minHeight: '32px',
      gridTemplateRows: '1fr var(--fui-Slider__thumb--size) 1fr',
      gridTemplateColumns: '1fr calc(100% - var(--fui-Slider__thumb--size)) 1fr',
      _hover: {
        '--fui-Slider__thumb--color': '$colorCompoundBrandBackgroundHover',
        '--fui-Slider__progress--color': '$colorCompoundBrandBackgroundHover',
      },
      _active: {
        '--fui-Slider__thumb--color': '$colorCompoundBrandBackgroundPressed',
        '--fui-Slider__progress--color': '$colorCompoundBrandBackgroundPressed',
      },
      _focusWithin: {
        outline: '$strokeWidthThick solid $colorStrokeFocus2',
        outlineOffset: '2px',
      },
      _forcedColors: {
        '--fui-Slider__rail--color': 'CanvasText',
        '--fui-Slider__thumb--color': 'Highlight',
        '--fui-Slider__progress--color': 'Highlight',
      },
    },
    rail: {
      borderRadius: '$borderRadiusLarge',
      pointerEvents: 'none',
      gridRowStart: '2',
      gridRowEnd: '2',
      gridColumnStart: '2',
      gridColumnEnd: '2',
      position: 'relative',
      width: '100%',
      height: 'var(--fui-Slider__rail--size)',
      backgroundImage:
        'linear-gradient(var(--fui-Slider--direction, 90deg), var(--fui-Slider__progress--color) 0%, var(--fui-Slider__progress--color) var(--fui-Slider--progress, 0%), var(--fui-Slider__rail--color) var(--fui-Slider--progress, 0%))',
    },
    thumb: {
      gridRowStart: '2',
      gridRowEnd: '2',
      gridColumnStart: '2',
      gridColumnEnd: '2',
      position: 'absolute',
      width: 'var(--fui-Slider__thumb--size)',
      height: 'var(--fui-Slider__thumb--size)',
      pointerEvents: 'none',
      outlineStyle: 'none',
      borderRadius: '$borderRadiusCircular',
      backgroundColor: 'var(--fui-Slider__thumb--color)',
      boxShadow: 'inset 0 0 0 calc(var(--fui-Slider__thumb--size) * 0.2) $colorNeutralBackground1',
      transform: 'translateX(-50%)',
      left: 'clamp(var(--fui-Slider__inner-thumb--radius), var(--fui-Slider--progress, 0%), calc(100% - var(--fui-Slider__inner-thumb--radius)))',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0px',
        borderRadius: '$borderRadiusCircular',
        boxSizing: 'border-box',
        border: 'calc(var(--fui-Slider__thumb--size) * 0.05) solid $colorNeutralStroke1',
      },
    },
    input: {
      cursor: 'pointer',
      opacity: 0,
      gridRowStart: '1',
      gridRowEnd: '-1',
      gridColumnStart: '1',
      gridColumnEnd: '-1',
      padding: 0,
      margin: 0,
      height: 'var(--fui-Slider__thumb--size)',
      width: '100%',
    },
  },

  defaultVariants: {
    size: 'medium',
  },

  variants: {
    size: {
      small: {
        root: {
          '--fui-Slider__thumb--size': '16px',
          '--fui-Slider__inner-thumb--radius': '5px',
          '--fui-Slider__rail--size': '2px',
          minHeight: '24px',
        },
      },
      medium: {},
    },
  },

  states: {
    disabled: {
      root: {
        '--fui-Slider__thumb--color': '$colorNeutralForegroundDisabled',
        '--fui-Slider__rail--color': '$colorNeutralBackgroundDisabled',
        '--fui-Slider__progress--color': '$colorNeutralForegroundDisabled',
        _hover: {
          '--fui-Slider__thumb--color': '$colorNeutralForegroundDisabled',
          '--fui-Slider__progress--color': '$colorNeutralForegroundDisabled',
        },
        _forcedColors: {
          '--fui-Slider__rail--color': 'GrayText',
          '--fui-Slider__thumb--color': 'GrayText',
          '--fui-Slider__progress--color': 'GrayText',
        },
      },
      thumb: {
        _before: {
          border: 'calc(var(--fui-Slider__thumb--size) * 0.05) solid $colorNeutralForegroundDisabled',
        },
      },
      input: { cursor: 'default' },
    },
    vertical: {
      root: {
        minWidth: '32px',
        minHeight: '120px',
        gridTemplateRows: '1fr calc(100% - var(--fui-Slider__thumb--size)) 1fr',
        gridTemplateColumns: '1fr var(--fui-Slider__thumb--size) 1fr',
      },
      rail: {
        width: 'var(--fui-Slider__rail--size)',
        height: '100%',
      },
      thumb: {
        transform: 'translateY(50%)',
        left: 'auto',
        bottom:
          'clamp(var(--fui-Slider__inner-thumb--radius), var(--fui-Slider--progress, 0%), calc(100% - var(--fui-Slider__inner-thumb--radius)))',
      },
      input: {
        height: '100%',
        width: 'var(--fui-Slider__thumb--size)',
      },
    },
  },
});
