'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import type { CardPreviewProps } from './CardPreview.types';
import { useCardPreview } from './useCardPreview';
import { renderCardPreview } from './renderCardPreview';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * Component to render a media preview within a Card component.
 */
export const CardPreview: ForwardRefComponent<CardPreviewProps> = /*#__PURE__*/ composeComponent(
  useCardPreview,
  renderCardPreview,
);

if (process.env.NODE_ENV !== 'production') {
  CardPreview.displayName = 'CardPreview';
}
