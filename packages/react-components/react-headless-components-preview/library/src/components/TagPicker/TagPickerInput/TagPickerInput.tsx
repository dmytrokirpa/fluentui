'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import { useTagPickerInput } from './useTagPickerInput';
import { renderTagPickerInput } from './renderTagPickerInput';
import type { TagPickerInputProps } from './TagPickerInput.types';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * The text input trigger of a TagPicker, used to filter options and open the popover.
 */
export const TagPickerInput: ForwardRefComponent<TagPickerInputProps> = /*#__PURE__*/ composeComponent(
  useTagPickerInput,
  renderTagPickerInput,
);

if (process.env.NODE_ENV !== 'production') {
  TagPickerInput.displayName = 'TagPickerInput';
}
