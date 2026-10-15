'use client';

import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { SwitchProps } from './Switch.types';
import { useSwitch } from './useSwitch';
import { renderSwitch } from './renderSwitch';
import { composeComponent } from '../../utils/composeComponent';

/**
 * A switch component for toggling values.
 */
export const Switch: ForwardRefComponent<SwitchProps> = /*#__PURE__*/ composeComponent(useSwitch, renderSwitch);

if (process.env.NODE_ENV !== 'production') {
  Switch.displayName = 'Switch';
}
