'use client';

import { applyTriggerPropsToChildren, slot } from '@fluentui/react-utilities';
import type { TooltipProps, TooltipState } from './Tooltip.types';
import { useTooltipBehavior_unstable } from './useTooltipBehavior';

/**
 * Create the state required to render Tooltip.
 *
 * The returned state can be modified with hooks such as useTooltipStyles_unstable,
 * before being passed to renderTooltip_unstable.
 *
 * @param props - props from this instance of Tooltip
 */
export const useTooltip_unstable = (props: TooltipProps): TooltipState => {
  'use no memo';

  const { appearance = 'normal', children, content, withArrow = false } = props;

  const contentSlot = slot.always(content, { elementType: 'div' });

  const {
    arrowProps,
    triggerProps,
    contentProps,
    positioning,
    showDelay,
    hideDelay,
    relationship,
    mountNode,
    visible,
    shouldRenderTooltip,
  } = useTooltipBehavior_unstable({
    ...props,
    content: contentSlot,
  });

  Object.assign(contentSlot, contentProps);

  const state: TooltipState = {
    withArrow,
    positioning,
    showDelay,
    hideDelay,
    relationship,
    visible,
    shouldRenderTooltip,
    appearance,
    mountNode,
    // Slots
    components: {
      content: 'div',
    },
    content: contentSlot,
  };

  state.arrowRef = arrowProps.ref;

  // Apply the trigger props to the child, either by calling the render function, or cloning with the new props
  state.children = applyTriggerPropsToChildren(children, triggerProps);

  return state;
};
