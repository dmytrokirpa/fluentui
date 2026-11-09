'use client';

import * as React from 'react';
import { useId } from '@fluentui/react-utilities';
import { useNavCategory_unstable } from '@fluentui/react-nav';
import type { NavCategoryProps, NavCategoryState } from './NavCategory.types';

export const useNavCategory = (props: NavCategoryProps, ref: React.Ref<HTMLDivElement>): NavCategoryState => {
  const state = useNavCategory_unstable(props, ref);
  const defaultGroupId = useId('fluent-nav-group', props.groupId);
  const [registeredGroupId, setRegisteredGroupId] = React.useState<string>();
  const [items, setItems] = React.useState<ReadonlyMap<string, string>>(() => new Map());

  const registerGroup = React.useCallback((id: string) => {
    setRegisteredGroupId(id);
    return () => setRegisteredGroupId(current => (current === id ? undefined : current));
  }, []);

  const registerItem = React.useCallback((value: string, id: string) => {
    setItems(current => new Map(current).set(value, id));
    return () =>
      setItems(current => {
        if (current.get(value) !== id) {
          return current;
        }
        const next = new Map(current);
        next.delete(value);
        return next;
      });
  }, []);

  const stateWithContext = {
    ...state,
    defaultGroupId,
    groupId: registeredGroupId ?? defaultGroupId,
    items,
    registerGroup,
    registerItem,
  };

  return stateWithContext;
};
