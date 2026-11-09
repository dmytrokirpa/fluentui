'use client';

import * as React from 'react';
import {
  getIntrinsicElementProps,
  slot,
  useId,
  useIsomorphicLayoutEffect,
  useMergedRefs,
} from '@fluentui/react-utilities';
import { useHeadlessNavCategoryContext } from '../navCategoryContext';
import type { NavSubItemGroupProps, NavSubItemGroupState } from './NavSubItemGroup.types';

/**
 * Create the state required to render NavSubItemGroup.
 *
 * Headless version — keeps the group mounted without motion.
 *
 * @param props - props from this instance of NavSubItemGroup
 * @param ref - reference to root HTMLDivElement of NavSubItemGroup
 */
export const useNavSubItemGroup = (
  props: NavSubItemGroupProps,
  ref: React.Ref<HTMLDivElement>,
): NavSubItemGroupState => {
  const { open, defaultGroupId, registerGroup } = useHeadlessNavCategoryContext();
  const id = useId('fluent-nav-group', props.id ?? defaultGroupId);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(ref, groupRef);

  useIsomorphicLayoutEffect(() => registerGroup?.(id), [id, registerGroup]);
  useIsomorphicLayoutEffect(() => {
    // Older React versions do not serialize the inert boolean attribute.
    groupRef.current?.toggleAttribute('inert', !open);
  }, [open]);

  return {
    open,
    components: {
      root: 'div',
    },
    root: slot.always(
      getIntrinsicElementProps('div', {
        role: 'group',
        ...props,
        ref: mergedRef,
        id,
        hidden: !open || props.hidden,
      }),
      { elementType: 'div' },
    ),
  };
};
