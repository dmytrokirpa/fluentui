import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 RadioGroup recipe.
 * Source: react-radio/useRadioGroupStyles.styles.ts
 *
 * layout is a DS variant (omitted from headless RadioGroupBaseProps).
 * horizontal-stacked matches horizontal flex; Radio labelPosition=below stacks labels.
 */
export const radioGroupRecipe = defineSlotRecipe({
  component: 'RadioGroup',
  headless: 'radio-group',
  slots: ['root'],
  source: 'react-radio/useRadioGroupStyles.styles.ts',

  base: {
    root: {
      display: 'flex',
      alignItems: 'flex-start',
    },
  },

  defaultVariants: {
    layout: 'vertical',
  },

  variants: {
    layout: {
      vertical: {
        root: { flexDirection: 'column' },
      },
      horizontal: {
        root: { flexDirection: 'row' },
      },
      'horizontal-stacked': {
        root: { flexDirection: 'row' },
      },
    },
  },
});
