'use client';

import * as React from 'react';

import type { FieldContextValue, FieldContextValues, FieldState } from '../Field';

/**
 * Get the context values used when rendering Field.
 */
export const useFieldContextValues_unstable = (state: FieldState): FieldContextValues => {
  const { generatedControlId, hintBeforeValidationMessage, orientation, required, size, validationState } = state;
  const labelFor = state.label?.htmlFor;
  const labelId = state.label?.id;
  const validationMessageId = state.validationMessage?.id;
  const hintId = state.hint?.id;

  const field: FieldContextValue = React.useMemo(
    () => ({
      generatedControlId,
      hintBeforeValidationMessage,
      hintId,
      labelFor,
      labelId,
      orientation,
      required,
      size,
      validationMessageId,
      validationState,
    }),
    [
      generatedControlId,
      hintBeforeValidationMessage,
      hintId,
      labelFor,
      labelId,
      orientation,
      required,
      size,
      validationMessageId,
      validationState,
    ],
  );

  return { field };
};
