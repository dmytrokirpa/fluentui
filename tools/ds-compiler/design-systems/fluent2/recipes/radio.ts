import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 Radio recipe.
 * Source: react-radio/useRadioStyles.styles.ts
 *
 * Checked styling uses `_hasChecked` (`.root:has(:checked) .slot`) because
 * headless Radio has no `data-checked` attribute.
 */
export const radioRecipe = defineSlotRecipe({
  component: 'Radio',
  headless: 'radio-group',
  slots: ['root', 'label', 'input', 'indicator'],
  source: 'react-radio/useRadioStyles.styles.ts',

  base: {
    root: {
      display: 'inline-flex',
      position: 'relative',
      _focusWithin: {
        outline: '$strokeWidthThick solid $colorStrokeFocus2',
        outlineOffset: '2px',
      },
    },
    input: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 'calc(16px + 2 * $spacingHorizontalS)',
      height: '100%',
      boxSizing: 'border-box',
      margin: 0,
      opacity: 0,
      cursor: 'pointer',
    },
    indicator: {
      position: 'relative',
      width: '16px',
      height: '16px',
      fontSize: '12px',
      boxSizing: 'border-box',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: '$strokeWidthThin solid $colorNeutralStrokeAccessible',
      borderRadius: '$borderRadiusCircular',
      margin: '$spacingVerticalS $spacingHorizontalS',
      fill: 'currentColor',
      color: '$colorNeutralStrokeAccessible',
      pointerEvents: 'none',
      _groupHover: {
        borderColor: '$colorNeutralStrokeAccessibleHover',
      },
      _groupActive: {
        borderColor: '$colorNeutralStrokeAccessiblePressed',
      },
      _hasChecked: {
        borderColor: '$colorCompoundBrandStroke',
        color: '$colorCompoundBrandForeground1',
        _groupHover: {
          borderColor: '$colorCompoundBrandStrokeHover',
          color: '$colorCompoundBrandForeground1Hover',
        },
        _groupActive: {
          borderColor: '$colorCompoundBrandStrokePressed',
          color: '$colorCompoundBrandForeground1Pressed',
        },
        _after: {
          content: '""',
          position: 'absolute',
          width: '16px',
          height: '16px',
          borderRadius: '$borderRadiusCircular',
          transform: 'scale(0.625)',
          backgroundColor: 'currentColor',
        },
        _forcedColors: {
          borderColor: 'Highlight',
          color: 'Highlight',
        },
      },
      _forcedColors: {
        borderColor: 'ButtonText',
      },
    },
    label: {
      alignSelf: 'center',
      padding: '$spacingVerticalS $spacingHorizontalS',
      color: '$colorNeutralForeground3',
      cursor: 'pointer',
      _hasChecked: {
        color: '$colorNeutralForeground1',
      },
      _groupHover: {
        color: '$colorNeutralForeground2',
      },
      _groupActive: {
        color: '$colorNeutralForeground1',
      },
    },
  },

  states: {
    disabled: {
      input: { cursor: 'default' },
      indicator: {
        borderColor: '$colorNeutralStrokeDisabled',
        color: '$colorNeutralForegroundDisabled',
        _groupHover: {
          borderColor: '$colorNeutralStrokeDisabled',
        },
        _hasChecked: {
          borderColor: '$colorNeutralStrokeDisabled',
          color: '$colorNeutralForegroundDisabled',
        },
        _forcedColors: {
          borderColor: 'GrayText',
          color: 'GrayText',
        },
      },
      label: {
        color: '$colorNeutralForegroundDisabled',
        cursor: 'default',
        _groupHover: { color: '$colorNeutralForegroundDisabled' },
        _hasChecked: { color: '$colorNeutralForegroundDisabled' },
        _forcedColors: { color: 'GrayText' },
      },
    },
    labelPosition: {
      after: {
        label: {
          paddingLeft: '$spacingHorizontalXS',
          marginTop: 'calc((16px - $lineHeightBase300) / 2)',
          marginBottom: 'calc((16px - $lineHeightBase300) / 2)',
        },
      },
      below: {
        root: {
          flexDirection: 'column',
          alignItems: 'center',
        },
        input: {
          width: '100%',
          height: 'calc(16px + 2 * $spacingVerticalS)',
        },
        label: {
          paddingTop: '$spacingVerticalXS',
          textAlign: 'center',
        },
      },
    },
  },
});
