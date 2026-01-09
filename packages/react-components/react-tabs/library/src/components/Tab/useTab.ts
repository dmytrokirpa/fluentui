'use client';

import * as React from 'react';
import { omit, slot } from '@fluentui/react-utilities';
import type { TabProps, TabState } from './Tab.types';
import { useTabListContext_unstable } from '../TabList/TabListContext';
import { useTabBehavior_unstable } from './useTabBehavior';

/**
 * Create the state required to render Tab.
 *
 * The returned state can be modified with hooks such as useTabStyles_unstable,
 * before being passed to renderTab_unstable.
 *
 * @param props - props from this instance of Tab
 * @param ref - reference to root HTMLElement of Tab
 */
export const useTab_unstable = ({ content, icon, ...props }: TabProps, ref: React.Ref<HTMLElement>): TabState => {
  const { tabProps, disabled, selected, value, vertical } = useTabBehavior_unstable(props, ref);

  const appearance = useTabListContext_unstable(ctx => ctx.appearance);
  const reserveSelectedTabSpace = useTabListContext_unstable(ctx => ctx.reserveSelectedTabSpace);
  const size = useTabListContext_unstable(ctx => ctx.size);

  const iconSlot = slot.optional(icon, { elementType: 'span' });
  const contentSlot = slot.always(content, {
    defaultProps: { children: props.children },
    elementType: 'span',
  });
  const contentReservedSpace: typeof content =
    content && typeof content === 'object' ? omit(content, ['ref' as keyof typeof content]) : content;
  const iconOnly = Boolean(iconSlot?.children && !contentSlot.children);

  return {
    components: { root: 'button', icon: 'span', content: 'span', contentReservedSpace: 'span' },
    root: slot.always(tabProps, { elementType: 'button' }) as TabState['root'],
    icon: iconSlot,
    iconOnly,
    content: contentSlot,
    contentReservedSpace: slot.optional(contentReservedSpace, {
      renderByDefault: !selected && !iconOnly && reserveSelectedTabSpace,
      defaultProps: { children: props.children },
      elementType: 'span',
    }),
    appearance,
    disabled,
    selected,
    size,
    value,
    vertical,
  };
};
