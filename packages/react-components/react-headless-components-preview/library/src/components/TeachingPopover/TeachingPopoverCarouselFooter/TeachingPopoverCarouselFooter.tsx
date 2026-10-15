'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { TeachingPopoverCarouselFooterProps } from './TeachingPopoverCarouselFooter.types';
import { useTeachingPopoverCarouselFooter } from './useTeachingPopoverCarouselFooter';
import { renderTeachingPopoverCarouselFooter } from './renderTeachingPopoverCarouselFooter';
import { composeComponent } from '../../../utils/composeComponent';

export const TeachingPopoverCarouselFooter: ForwardRefComponent<TeachingPopoverCarouselFooterProps> =
  /*#__PURE__*/ composeComponent(useTeachingPopoverCarouselFooter, renderTeachingPopoverCarouselFooter);

if (process.env.NODE_ENV !== 'production') {
  TeachingPopoverCarouselFooter.displayName = 'TeachingPopoverCarouselFooter';
}
