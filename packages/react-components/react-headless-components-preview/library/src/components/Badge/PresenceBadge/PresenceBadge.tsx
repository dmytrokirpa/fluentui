'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import type { PresenceBadgeProps } from './PresenceBadge.types';
import { renderPresenceBadge } from './renderPresenceBadge';
import { usePresenceBadge } from './usePresenceBadge';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * A headless badge that exposes presence status to assistive technology.
 */
export const PresenceBadge: ForwardRefComponent<PresenceBadgeProps> = /*#__PURE__*/ composeComponent(
  usePresenceBadge,
  renderPresenceBadge,
);

if (process.env.NODE_ENV !== 'production') {
  PresenceBadge.displayName = 'PresenceBadge';
}
