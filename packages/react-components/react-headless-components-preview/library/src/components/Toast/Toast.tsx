'use client';

import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { ToastProps } from './Toast.types';
import { useToast } from './useToast';
import { renderToast } from './renderToast';

export const Toast: ForwardRefComponent<ToastProps> = React.forwardRef((props, ref) => {
  const state = useToast(props, ref);
  return renderToast(state);
});
Toast.displayName = 'Toast';
