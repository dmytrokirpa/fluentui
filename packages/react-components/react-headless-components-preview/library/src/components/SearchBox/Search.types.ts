import type * as React from 'react';
import type { InputOnChangeData } from '@fluentui/react-input';
import type {
  SearchBoxBaseProps,
  SearchBoxBaseState,
  SearchBoxSlots as BaseSearchBoxSlots,
} from '@fluentui/react-search';
import type { ComponentState, Slot } from '@fluentui/react-utilities';

export type SearchBoxSlots = Omit<BaseSearchBoxSlots, 'dismiss'> & {
  /** Clear button displayed when the input has a value. Supply its content and a localized accessible label. */
  dismiss?: Slot<'button'>;
};

export type SearchBoxProps = Omit<SearchBoxBaseProps, 'dismiss' | 'onChange'> & {
  dismiss?: SearchBoxSlots['dismiss'];
  /**
   * Called when the input changes or is cleared with the dismiss button or Escape.
   */
  // eslint-disable-next-line @nx/workspace-consistent-callback-type -- matches the existing SearchBox callback
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => void;
};

/**
 * Search component state
 */
export type SearchBoxState = Omit<SearchBoxBaseState, 'components' | 'dismiss'> &
  ComponentState<SearchBoxSlots> & {
    root: {
      /**
       * Data attribute set when the search box is disabled.
       */
      'data-disabled'?: string;

      /**
       * Data attribute set when the search box has focus within.
       */
      'data-focused'?: string;
    };
  };
