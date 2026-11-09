'use client';

import type * as React from 'react';
import { getIntrinsicElementProps, mergeCallbacks, slot, useEventCallback, useId } from '@fluentui/react-utilities';
import { useNavContext_unstable, type OnNavItemSelectData } from '@fluentui/react-nav';

import { useHeadlessNavCategoryContext } from '../navCategoryContext';
import type { NavCategoryItemProps, NavCategoryItemState } from './NavCategoryItem.types';
import { toDataAttributeValue } from '../../../utils';

/**
 * Create the state required to render NavCategoryItem.
 *
 * Headless version — no motion, no default expand icon.
 *
 * @param props - props from this instance of NavCategoryItem
 * @param ref - reference to root HTMLButtonElement of NavCategoryItem
 */
export const useNavCategoryItem = (
  props: NavCategoryItemProps,
  ref: React.Ref<HTMLButtonElement>,
): NavCategoryItemState => {
  const { onClick, expandIcon, icon, currentPageDescription, ...buttonProps } = props;

  const { open, value, groupId, items } = useHeadlessNavCategoryContext();

  const { onRequestNavCategoryItemToggle, selectedCategoryValue, selectedValue } = useNavContext_unstable();

  const onNavCategoryItemClick = useEventCallback(
    mergeCallbacks(onClick, event =>
      // Category toggles emit no `value` so consumers can distinguish them from item selection.
      onRequestNavCategoryItemToggle(event, { type: 'click', event, categoryValue: value } as OnNavItemSelectData),
    ),
  );

  const currentItemId = selectedValue === undefined ? undefined : items?.get(selectedValue);
  const selected =
    !open &&
    (!!currentItemId ||
      (selectedCategoryValue === value && (selectedValue === undefined || !items || items.size === 0)));
  const descriptionId = useId('fluent-nav-current-page');
  const description =
    selected && currentPageDescription ? { id: descriptionId, text: currentPageDescription } : undefined;
  const describedBy =
    [buttonProps['aria-describedby'], description?.id ?? (selected ? currentItemId : undefined)]
      .filter(Boolean)
      .join(' ') || undefined;

  const state: NavCategoryItemState = {
    open,
    value,
    selected,
    currentPageDescription: description,
    root: slot.always(
      getIntrinsicElementProps('button', {
        type: 'button',
        ref,
        ...buttonProps,
        'aria-current': undefined,
        'aria-controls': buttonProps['aria-controls'] ?? groupId,
        'aria-describedby': describedBy,
        'aria-expanded': open,
        onClick: onNavCategoryItemClick,
      }),
      { elementType: 'button' },
    ),
    icon: slot.optional(icon, {
      elementType: 'span',
    }),
    expandIcon: slot.optional(expandIcon, {
      defaultProps: { 'aria-hidden': true },
      elementType: 'span',
    }),
    components: {
      root: 'button',
      icon: 'span',
      expandIcon: 'span',
    },
  };

  state.root['data-disabled'] = toDataAttributeValue(state.root.disabled || state.root['aria-disabled']);
  state.root['data-expanded'] = toDataAttributeValue(state.open);
  state.root['data-selected'] = toDataAttributeValue(state.selected);

  return state;
};
