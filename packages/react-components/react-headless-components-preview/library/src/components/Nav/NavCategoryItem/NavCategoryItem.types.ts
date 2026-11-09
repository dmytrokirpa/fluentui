import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';
/** Value stored inside the NavCategoryItem context. */
export type NavCategoryItemContextValue = {
  open: boolean;
  value: string;
};

export type NavCategoryItemContextValues = {
  navCategoryItem: NavCategoryItemContextValue;
};

export type NavCategoryItemSlots = {
  /**
   * The root element
   */
  root: NonNullable<Slot<'button'>>;

  /**
   * Icon that renders before the content.
   */
  icon?: Slot<'span'>;

  /**
   * Expand icon slot rendered after content.
   */
  expandIcon?: Slot<'span'>;
};

/**
 * NavCategoryItem Props
 */
export type NavCategoryItemProps = ComponentProps<NavCategoryItemSlots> & {
  /**
   * Localized description naming the current destination when this category is collapsed,
   * for example "Contains current page: Settings". Supply this to communicate that the
   * hidden destination is current; without it, only the destination's text is referenced.
   */
  currentPageDescription?: string;
};

/**
 * State used in rendering NavCategoryItem
 */
export type NavCategoryItemState = ComponentState<NavCategoryItemSlots> &
  NavCategoryItemContextValue & {
    /**
     * If this navCategoryItem is selected
     */
    selected: boolean;
    currentPageDescription?: {
      id: string;
      text: string;
    };
    root: {
      'data-disabled'?: string;
      'data-expanded'?: string;
      'data-selected'?: string;
    };
  };
