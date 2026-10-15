'use client';

import * as React from 'react';
import type { ForwardRefComponent, JSXElement } from '@fluentui/react-utilities';

/**
 * Composes a headless component from its state hook and render function, with an optional hook that maps the
 * state to context values.
 *
 * Every headless component has the same shape (`state = useX(props, ref)`, `contextValues = useXContextValues(state)`,
 * `renderX(state, contextValues)`). Sharing one `forwardRef` wrapper keeps that boilerplate out of each component,
 * which adds up across the whole library.
 *
 * Arguments are positional on purpose: an options object would repeat its property names in every component, and
 * minifiers don't mangle property names.
 *
 * The caller is responsible for the `displayName`, which should be set only in development:
 *
 * ```ts
 * export const Foo: ForwardRefComponent<FooProps> = composeComponent(useFoo, renderFoo, useFooContextValues);
 *
 * if (process.env.NODE_ENV !== 'production') {
 *   Foo.displayName = 'Foo';
 * }
 * ```
 *
 * @param useState - state hook of the component
 * @param render - render function of the component
 * @param getContextValues - optional hook mapping the state to the context values passed to `render`. It is
 * either always or never provided for a given component, so it is safe to call as a hook.
 *
 * @internal
 */
export const composeComponent = <Props, State, RefType, ContextValues = undefined>(
  useState: (props: Props, ref: React.Ref<RefType>) => State,
  render: (state: State, contextValues: ContextValues) => JSXElement | null,
  getContextValues?: (state: State) => ContextValues,
): ForwardRefComponent<Props> =>
  React.forwardRef<RefType, Props>((props, ref) => {
    const state = useState(props as Props, ref);
    // `getContextValues` is fixed for the lifetime of a component, so hooks are called in a stable order
    const contextValues = getContextValues?.(state) as ContextValues;

    return render(state, contextValues);
  }) as unknown as ForwardRefComponent<Props>;
