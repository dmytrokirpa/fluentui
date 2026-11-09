'use client';

import * as React from 'react';
import type { NavCategoryContextValues } from '@fluentui/react-nav';
import type { HeadlessNavCategoryContextValue } from '../navCategoryContext';
import type { NavCategoryState } from './NavCategory.types';

export function useNavCategoryContextValues(state: NavCategoryState): NavCategoryContextValues {
  const { open, value, defaultGroupId, groupId, items, registerGroup, registerItem } = state as NavCategoryState &
    Partial<HeadlessNavCategoryContextValue>;
  const categoryValue = React.useMemo(
    () => ({ open, value, defaultGroupId, groupId, items, registerGroup, registerItem }),
    [open, value, defaultGroupId, groupId, items, registerGroup, registerItem],
  );
  return { categoryValue };
}
