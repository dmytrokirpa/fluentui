import type { NavCategoryProps as BaseNavCategoryProps } from '@fluentui/react-nav';

export type { NavCategoryState } from '@fluentui/react-nav';

export type NavCategoryProps = BaseNavCategoryProps & {
  /**
   * ID for the sub-item group. If NavSubItemGroup has an explicit ID, supply the same
   * value here to coordinate aria-controls during server rendering.
   */
  groupId?: string;
};
