'use client';

import type * as React from 'react';
import { useId, useIsomorphicLayoutEffect } from '@fluentui/react-utilities';
import { useNavSubItemBase_unstable } from '@fluentui/react-nav';
import { toDataAttributeValue } from '../../../utils';
import { useHeadlessNavCategoryContext } from '../navCategoryContext';
import type { NavSubItemProps, NavSubItemState } from './NavSubItem.types';

export const useNavSubItem = (
  props: NavSubItemProps,
  ref: React.Ref<HTMLButtonElement | HTMLAnchorElement>,
): NavSubItemState => {
  const state: NavSubItemState = useNavSubItemBase_unstable(props, ref);
  const { registerItem } = useHeadlessNavCategoryContext();
  const id = useId('fluent-nav-subitem', state.root.id);

  useIsomorphicLayoutEffect(() => registerItem?.(state.value, id), [id, registerItem, state.value]);

  // eslint-disable-next-line react-hooks/immutability
  state.root.id = id;
  // eslint-disable-next-line react-hooks/immutability
  state.root['data-disabled'] = toDataAttributeValue(state.root.disabled || state.root['aria-disabled']);
  // eslint-disable-next-line react-hooks/immutability
  state.root['data-selected'] = toDataAttributeValue(state.selected);

  return state;
};
