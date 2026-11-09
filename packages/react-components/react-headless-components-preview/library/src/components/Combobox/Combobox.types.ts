import type {
  BaseComboboxState,
  BaseComboboxProps,
  ComboboxSlots as BaseComboboxSlots,
} from '@fluentui/react-combobox';
import type { ComponentState, Slot } from '@fluentui/react-utilities';
import type { PositioningShorthand } from '../../positioning';

export type { ComboboxContextValues, ComboboxOpenChangeData, ComboboxOpenEvents } from '@fluentui/react-combobox';

export type ComboboxSlots = BaseComboboxSlots & {
  /** Clear button containing the clear icon. Supply a localized accessible label. */
  clearButton?: Slot<'button'>;
};

export type ComboboxProps = Omit<BaseComboboxProps, 'inlinePopup' | 'mountNode' | 'positioning'> & {
  positioning?: PositioningShorthand;
  /**
   * Clear button shown in place of the expand icon when there is a value to clear.
   * When controlling `value`, update it in this slot's `onClick` or in `onOptionSelect`.
   */
  clearButton?: ComboboxSlots['clearButton'];
};

export type ComboboxState = Omit<BaseComboboxState, 'components'> &
  ComponentState<ComboboxSlots> & {
    root: BaseComboboxState['root'] & {
      /**
       * Whether the dropdown is currently open.
       */
      'data-open'?: string;
      /**
       * Whether the trigger element is currently disabled.
       */
      'data-disabled'?: string;
      /**
       * Whether the trigger element is currently displaying a placeholder.
       */
      'data-placeholder'?: string;
      /**
       * Whether the trigger element is currently invalid.
       */
      'data-invalid'?: string;
      /**
       * Whether the clear button is visible.
       */
      'data-clearable'?: string;
    };
  };
