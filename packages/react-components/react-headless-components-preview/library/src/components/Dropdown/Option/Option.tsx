'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import { useOption } from './useOption';
import { renderOption } from './renderOption';
import type { OptionProps } from './Option.types';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * Option component used inside Listbox.
 */
export const Option: ForwardRefComponent<OptionProps> = /*#__PURE__*/ composeComponent(useOption, renderOption);

if (process.env.NODE_ENV !== 'production') {
  Option.displayName = 'Option';
}
