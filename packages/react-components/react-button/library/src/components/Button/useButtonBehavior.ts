'use client';

import * as React from 'react';
import { useARIAButtonProps } from '@fluentui/react-aria';
import { getIntrinsicElementProps } from '@fluentui/react-utilities';

type ButtonBehaviorPropsBase = {
  disabled?: boolean;
  disabledFocusable?: boolean;
};

export type ButtonBehaviorProps =
  | ({ as?: 'button' } & React.ComponentPropsWithRef<'button'> & ButtonBehaviorPropsBase)
  | ({ as: 'a' } & React.ComponentPropsWithRef<'a'> & ButtonBehaviorPropsBase);

export type ButtonBehaviorState =
  | ({ as: 'button'; rootProps: React.ComponentPropsWithRef<'button'> } & Required<ButtonBehaviorPropsBase>)
  | ({ as: 'a'; rootProps: React.ComponentPropsWithRef<'a'> } & Required<ButtonBehaviorPropsBase>);

/**
 * Given user props, defines default props for the Button, calls useButtonState, and returns processed state.
 * @param props - User provided props to the Button component.
 * @param ref - User provided ref to be passed to the Button component.
 */
export const useButtonBehavior_unstable = (
  props: ButtonBehaviorProps,
  ref: React.Ref<HTMLButtonElement | HTMLAnchorElement>,
): ButtonBehaviorState => {
  const { as, disabled = false, disabledFocusable = false } = props;

  if (as === 'a') {
    return {
      // behavior state
      as: 'a',
      disabled,
      disabledFocusable,
      // behavior props
      rootProps: {
        ref: ref as React.Ref<HTMLAnchorElement>,
        ...getIntrinsicElementProps('a', useARIAButtonProps('a', props as React.ComponentProps<'a'>)),
      },
    };
  }

  return {
    // behavior state
    as: 'button',
    disabled,
    disabledFocusable,
    // behavior props
    rootProps: {
      ref: ref as React.Ref<HTMLButtonElement>,
      type: 'button',
      ...getIntrinsicElementProps('button', useARIAButtonProps('button', props)),
    },
  };
};
