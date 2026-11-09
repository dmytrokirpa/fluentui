import type { FieldBaseProps, FieldBaseState } from '@fluentui/react-field';

export type { FieldSlots, FieldContextValue, FieldContextValues } from '@fluentui/react-field';

export type FieldProps = Omit<FieldBaseProps, 'validationState'> & {
  /**
   * The validation state. Messages are announced politely by default; set the validationMessage slot's
   * role to `alert` or its `aria-live` to `assertive` for an urgent message.
   *
   * @default error when validationMessage is set; none otherwise.
   */
  validationState?: FieldBaseProps['validationState'];
};

/**
 * Field component state
 */
export type FieldState = FieldBaseState & {
  root: {
    'data-validate-state'?: FieldBaseState['validationState'];
  };
};
