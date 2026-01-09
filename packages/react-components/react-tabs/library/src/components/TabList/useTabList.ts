'use client';

import * as React from 'react';
import { slot } from '@fluentui/react-utilities';
import type { TabListProps, TabListState } from './TabList.types';
import { useTabListBehavior_unstable } from './useTabListBehavior';

/**
 * Create the state required to render TabList.
 *
 * The returned state can be modified with hooks such as useTabListStyles_unstable,
 * before being passed to renderTabList_unstable.
 *
 * @param props - props from this instance of TabList
 * @param ref - reference to root HTMLElement of TabList
 */
export const useTabList_unstable = (props: TabListProps, ref: React.Ref<HTMLElement>): TabListState => {
  const {
    tabListProps,
    disabled,
    selectTabOnFocus,
    selectedValue,
    onRegister,
    onUnregister,
    onSelect,
    getRegisteredTabs,
    vertical,
  } = useTabListBehavior_unstable(props, ref);

  const { appearance = 'transparent', reserveSelectedTabSpace = true, size = 'medium' } = props;

  return {
    components: {
      root: 'div',
    },
    root: slot.always(tabListProps, { elementType: 'div' }),
    appearance,
    reserveSelectedTabSpace,
    disabled,
    selectTabOnFocus,
    selectedValue,
    size,
    vertical,
    onRegister,
    onUnregister,
    onSelect,
    getRegisteredTabs,
  };
};
