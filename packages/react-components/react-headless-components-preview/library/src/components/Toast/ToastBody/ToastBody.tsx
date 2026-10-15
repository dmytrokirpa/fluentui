'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { ToastBodyProps } from './ToastBody.types';
import { useToastBody } from './useToastBody';
import { renderToastBody } from './renderToastBody';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * Represents the body of a toast, which typically contains the main content of the toast message.
 */
export const ToastBody: ForwardRefComponent<ToastBodyProps> = /*#__PURE__*/ composeComponent(
  useToastBody,
  renderToastBody,
);

if (process.env.NODE_ENV !== 'production') {
  ToastBody.displayName = 'ToastBody';
}
