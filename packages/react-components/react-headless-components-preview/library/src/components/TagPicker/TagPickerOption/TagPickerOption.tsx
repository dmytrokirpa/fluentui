'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import { useTagPickerOption } from './useTagPickerOption';
import { renderTagPickerOption } from './renderTagPickerOption';
import type { TagPickerOptionProps } from './TagPickerOption.types';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * An option within a TagPickerList.
 */
export const TagPickerOption: ForwardRefComponent<TagPickerOptionProps> = /*#__PURE__*/ composeComponent(
  useTagPickerOption,
  renderTagPickerOption,
);

if (process.env.NODE_ENV !== 'production') {
  TagPickerOption.displayName = 'TagPickerOption';
}
