'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { ButtonProps } from './Button.types';
import { useButton } from './useButton';
import { renderButton } from './renderButton';
import { composeComponent } from '../../utils/composeComponent';

/**
 * A button component that can be rendered as another tag or focusable when disabled.
 */
export const Button: ForwardRefComponent<ButtonProps> = /*#__PURE__*/ composeComponent(useButton, renderButton);

if (process.env.NODE_ENV !== 'production') {
  Button.displayName = 'Button';
}
