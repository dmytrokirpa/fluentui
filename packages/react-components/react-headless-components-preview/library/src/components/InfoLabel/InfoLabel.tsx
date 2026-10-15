'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { InfoLabelProps } from './InfoLabel.types';
import { renderInfoLabel } from './renderInfoLabel';
import { useInfoLabel } from './useInfoLabel';
import { composeComponent } from '../../utils/composeComponent';

/**
 * InfoLabel component
 */
export const InfoLabel: ForwardRefComponent<InfoLabelProps> = /*#__PURE__*/ composeComponent(
  useInfoLabel,
  renderInfoLabel,
);

if (process.env.NODE_ENV !== 'production') {
  InfoLabel.displayName = 'InfoLabel';
}
