'use client';

import type * as React from 'react';
import { useToastBase_unstable } from '@fluentui/react-toast';

import type { ToastProps, ToastState } from './Toast.types';

export const useToast = (props: ToastProps, ref: React.Ref<HTMLElement>): ToastState => {
  const state = useToastBase_unstable(props, ref);

  Object.assign(state.root, { 'data-intent': state.intent });

  return state;
};
