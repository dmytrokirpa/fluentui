'use client';

export { NavCategoryProvider, useNavCategoryContext_unstable as useNavCategoryContext } from '@fluentui/react-nav';

export type { NavCategoryContextValues } from '@fluentui/react-nav';

import { useNavCategoryContext_unstable } from '@fluentui/react-nav';

/** Value stored inside the NavCategory context. */
export type NavCategoryContextValue = {
  open: boolean;
  value: string;
};

export type HeadlessNavCategoryContextValue = NavCategoryContextValue & {
  defaultGroupId?: string;
  groupId?: string;
  items?: ReadonlyMap<string, string>;
  registerGroup?: (id: string) => () => void;
  registerItem?: (value: string, id: string) => () => void;
};

export const useHeadlessNavCategoryContext = (): HeadlessNavCategoryContextValue =>
  useNavCategoryContext_unstable() as HeadlessNavCategoryContextValue;
