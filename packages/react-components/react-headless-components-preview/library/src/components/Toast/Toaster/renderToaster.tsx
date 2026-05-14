/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type { JSXElement } from '@fluentui/react-utilities';
import { Portal } from '@fluentui/react-portal';
import type { ToasterSlotsInternal, ToasterState } from './Toaster.types';
import { AriaLive } from '../AriaLive';

/**
 * Render the position-based containers for the headless Toaster.
 *
 * Each container is a `<div role="list" data-toaster-position="...">` that
 * consumers can target with CSS to apply positioning/styling. When `inline` is
 * true the slots render in-place; otherwise they render inside a Portal.
 */
export const renderToaster = (state: ToasterState): JSXElement => {
  const { announceRef, renderAriaLive, inline, mountNode } = state;
  assertSlots<ToasterSlotsInternal>(state);

  const hasToasts =
    !!state.bottomStart || !!state.bottomEnd || !!state.topStart || !!state.topEnd || !!state.top || !!state.bottom;

  const ariaLive = renderAriaLive ? <AriaLive announceRef={announceRef} /> : null;
  const positionSlots = (
    <>
      {state.bottom ? <state.bottom /> : null}
      {state.bottomStart ? <state.bottomStart /> : null}
      {state.bottomEnd ? <state.bottomEnd /> : null}
      {state.topStart ? <state.topStart /> : null}
      {state.topEnd ? <state.topEnd /> : null}
      {state.top ? <state.top /> : null}
    </>
  );

  if (inline) {
    return (
      <>
        {ariaLive}
        {hasToasts ? positionSlots : null}
      </>
    );
  }

  return (
    <>
      {ariaLive}
      {hasToasts ? <Portal mountNode={mountNode}>{positionSlots}</Portal> : null}
    </>
  );
};
