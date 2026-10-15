'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useProgressBar } from './useProgressBar';
import { renderProgressBar } from './renderProgressBar';
import type { ProgressBarProps } from './ProgressBar.types';
import { composeComponent } from '../../utils/composeComponent';

/**
 * ProgressBar component - TODO: add more docs
 */
export const ProgressBar: ForwardRefComponent<ProgressBarProps> = /*#__PURE__*/ composeComponent(
  useProgressBar,
  renderProgressBar,
);

if (process.env.NODE_ENV !== 'production') {
  ProgressBar.displayName = 'ProgressBar';
}
