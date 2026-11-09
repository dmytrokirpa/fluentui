'use client';

import { useListboxContextValues as useBaseListboxContextValues } from '@fluentui/react-combobox';
import type { ListboxContextValues, ListboxState } from './Listbox.types';

export const useListboxContextValues = (state: ListboxState): ListboxContextValues => {
  const values = useBaseListboxContextValues(state);
  return {
    ...values,
    listbox: { ...values.listbox, useListboxOptionSemantics: state.root.role === 'listbox' },
  };
};
