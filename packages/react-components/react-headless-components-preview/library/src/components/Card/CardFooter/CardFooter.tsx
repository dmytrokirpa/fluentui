'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';

import type { CardFooterProps } from './CardFooter.types';
import { useCardFooter } from './useCardFooter';
import { renderCardFooter } from './renderCardFooter';
import { composeComponent } from '../../../utils/composeComponent';

/**
 * Component to render the footer of a Card.
 */
export const CardFooter: ForwardRefComponent<CardFooterProps> = /*#__PURE__*/ composeComponent(
  useCardFooter,
  renderCardFooter,
);

if (process.env.NODE_ENV !== 'production') {
  CardFooter.displayName = 'CardFooter';
}
