'use client';

import * as React from 'react';
import type { ForwardRefComponent, JSXElement } from '@fluentui/react-utilities';

/**
 * Composes a component from its state hook and render function, with an optional hook that maps the state to
 * context values and an optional hook that applies styles to the state.
 *
 * Every component has the same shape: `state = useX(props, ref)`, `useXStyles(state)`,
 * `contextValues = useXContextValues(state)` and `renderX(state, contextValues)`. Sharing the `forwardRef` wrapper
 * keeps that boilerplate out of each component, which adds up across the whole library. Styled components compose the
 * headless pieces and add `useStyles`.
 *
 * The component function is picked once, when the component is composed, from which of the optional hooks are
 * provided. A component therefore always calls the same hooks in the same order, and never checks for an optional
 * hook while rendering.
 *
 * Arguments are positional on purpose: an options object would repeat its property names in every component, and
 * minifiers don't mangle property names.
 *
 * ```ts
 * export const Foo: ForwardRefComponent<FooProps> = composeComponent(
 *   'Foo',
 *   useFoo,
 *   renderFoo,
 *   useFooContextValues,
 *   useFooStyles,
 * );
 * ```
 *
 * Components annotate the call as pure (the `__PURE__` annotation comment), so that unused components can be
 * tree-shaken by bundlers that don't honor `sideEffects: false`.
 *
 * @param displayName - display name of the component, always set so it is available in production as well
 * @param useState - state hook of the component
 * @param render - render function of the component. It receives the context values as the second argument when
 * `useGetContextValues` is provided.
 * @param useGetContextValues - optional hook mapping the state to the context values passed to `render`. Pass
 * `undefined` to provide `useStyles` without it.
 * @param useStyles - optional hook applying styles to the state. Runs right after the state hook.
 *
 * @internal
 */
export function composeComponent<Props, State, RefType>(
  displayName: string,
  useState: (props: Props, ref: React.Ref<RefType>) => State,
  render: (state: State) => JSXElement | null,
): ForwardRefComponent<Props>;
export function composeComponent<Props, State, RefType, ContextValues>(
  displayName: string,
  useState: (props: Props, ref: React.Ref<RefType>) => State,
  render: (state: State, contextValues: ContextValues) => JSXElement | null,
  useGetContextValues: (state: State) => ContextValues,
  useStyles?: (state: State) => void,
): ForwardRefComponent<Props>;
export function composeComponent<Props, State, RefType>(
  displayName: string,
  useState: (props: Props, ref: React.Ref<RefType>) => State,
  render: (state: State) => JSXElement | null,
  useGetContextValues: undefined,
  useStyles: (state: State) => void,
): ForwardRefComponent<Props>;
export function composeComponent<Props, State, RefType, ContextValues>(
  displayName: string,
  useState: (props: Props, ref: React.Ref<RefType>) => State,
  render: (state: State, contextValues?: ContextValues) => JSXElement | null,
  useGetContextValues?: (state: State) => ContextValues,
  useStyles?: (state: State) => void,
): ForwardRefComponent<Props> {
  let Component: ReturnType<typeof React.forwardRef<RefType, Props>>;

  if (useGetContextValues && useStyles) {
    Component = React.forwardRef<RefType, Props>((props, ref) => {
      const state = useState(props as Props, ref);
      useStyles(state);

      return render(state, useGetContextValues(state));
    });
  } else if (useGetContextValues) {
    Component = React.forwardRef<RefType, Props>((props, ref) => {
      const state = useState(props as Props, ref);

      return render(state, useGetContextValues(state));
    });
  } else if (useStyles) {
    Component = React.forwardRef<RefType, Props>((props, ref) => {
      const state = useState(props as Props, ref);
      useStyles(state);

      return render(state);
    });
  } else {
    Component = React.forwardRef<RefType, Props>((props, ref) => render(useState(props as Props, ref)));
  }

  Component.displayName = displayName;

  return Component as unknown as ForwardRefComponent<Props>;
}
