'use client';

import type * as React from 'react';
import { useFieldBase_unstable } from '@fluentui/react-field';

import type { FieldProps, FieldState } from './Field.types';

/**
 * Returns the state for a Field component, given its props and ref.
 * The returned state can be modified with hooks before being passed to `renderField`.
 */
export const useField = (props: FieldProps, ref: React.Ref<HTMLDivElement>): FieldState => {
  const state: FieldState = useFieldBase_unstable(props, ref);

  // eslint-disable-next-line react-hooks/immutability
  state.hintBeforeValidationMessage = true;

  const hasExplicitRole =
    typeof props.validationMessage === 'object' &&
    props.validationMessage !== null &&
    'role' in props.validationMessage;
  if (state.validationMessage && !hasExplicitRole) {
    // eslint-disable-next-line react-hooks/immutability
    state.validationMessage.role = undefined;
    state.validationMessage['aria-live'] ??= 'polite';
  }

  // eslint-disable-next-line react-hooks/immutability
  state.root['data-validate-state'] = state.validationState;

  return state;
};
