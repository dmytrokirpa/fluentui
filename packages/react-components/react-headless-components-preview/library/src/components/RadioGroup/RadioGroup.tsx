'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { RadioGroupProps } from './RadioGroup.types';

import { useRadioGroup } from './useRadioGroup';
import { renderRadioGroup } from './renderRadioGroup';
import { useRadioGroupContextValues } from './useRadioGroupContextValues';
import { composeComponent } from '../../utils/composeComponent';

/**
 * A radio group component for selecting one option.
 */
export const RadioGroup: ForwardRefComponent<RadioGroupProps> = /*#__PURE__*/ composeComponent(
  useRadioGroup,
  renderRadioGroup,
  useRadioGroupContextValues,
);

if (process.env.NODE_ENV !== 'production') {
  RadioGroup.displayName = 'RadioGroup';
}
