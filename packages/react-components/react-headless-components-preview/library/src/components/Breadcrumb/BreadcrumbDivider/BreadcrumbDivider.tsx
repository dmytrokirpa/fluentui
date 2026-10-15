'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import type { BreadcrumbDividerProps } from './BreadcrumbDivider.types';
import { useBreadcrumbDivider } from './useBreadcrumbDivider';
import { renderBreadcrumbDivider } from './renderBreadcrumbDivider';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * A visual separator between breadcrumb items.
 */
export const BreadcrumbDivider: ForwardRefComponent<BreadcrumbDividerProps> = /*#__PURE__*/ composeComponent(
  useBreadcrumbDivider,
  renderBreadcrumbDivider,
);

if (process.env.NODE_ENV !== 'production') {
  BreadcrumbDivider.displayName = 'BreadcrumbDivider';
}
