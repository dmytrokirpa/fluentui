'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { TeachingPopoverCarouselCardProps } from './TeachingPopoverCarouselCard.types';
import { useTeachingPopoverCarouselCard } from './useTeachingPopoverCarouselCard';
import { renderTeachingPopoverCarouselCard } from './renderTeachingPopoverCarouselCard';
import { composeComponent } from '../../../utils/composeComponent';

export const TeachingPopoverCarouselCard: ForwardRefComponent<TeachingPopoverCarouselCardProps> =
  /*#__PURE__*/ composeComponent(useTeachingPopoverCarouselCard, renderTeachingPopoverCarouselCard);

if (process.env.NODE_ENV !== 'production') {
  TeachingPopoverCarouselCard.displayName = 'TeachingPopoverCarouselCard';
}
