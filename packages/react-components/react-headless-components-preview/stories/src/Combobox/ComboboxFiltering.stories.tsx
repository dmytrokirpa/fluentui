import * as React from 'react';
import { Combobox, Option, useComboboxFilter } from '@fluentui/react-headless-components-preview/combobox';
import type { ComboboxProps } from '@fluentui/react-headless-components-preview/combobox';
import { CheckmarkRegular, ChevronDownRegular } from '@fluentui/react-icons';
import styles from './combobox.module.css';

const options = ['Cat', 'Caterpillar', 'Corgi', 'Chupacabra', 'Dog', 'Ferret', 'Fish', 'Fox', 'Hamster', 'Snake'];

export const Filtering = (): React.ReactNode => {
  const [query, setQuery] = React.useState('');
  const [committedValue, setCommittedValue] = React.useState('');

  const children = useComboboxFilter({
    query,
    options,
    noOptionsElement: (
      <Option value="no-matches" disabled className={styles.option}>
        No animals match your search
      </Option>
    ),
    renderOption: option => (
      <Option
        key={option}
        value={option}
        className={styles.option}
        checkIcon={{ className: styles.checkIcon, children: <CheckmarkRegular /> }}
      >
        {option}
      </Option>
    ),
  });

  const onOptionSelect: ComboboxProps['onOptionSelect'] = (_event, data) => {
    const nextValue = data.optionText ?? '';
    setCommittedValue(nextValue);
    setQuery(nextValue);
  };

  return (
    <div className={styles.demo}>
      <label className={styles.label} htmlFor="combobox-filtering">
        Best pet
      </label>
      <Combobox
        root={{ className: styles.root }}
        input={{ className: styles.input }}
        listbox={{ className: styles.listbox }}
        id="combobox-filtering"
        placeholder="Select an animal"
        value={query}
        onChange={event => setQuery(event.target.value)}
        onBlur={() => setQuery(committedValue)}
        onKeyDown={event => {
          if (event.key === 'Escape' && event.currentTarget.getAttribute('aria-expanded') === 'false') {
            setQuery(committedValue);
          }
        }}
        onOptionSelect={onOptionSelect}
        expandIcon={{ className: styles.expandIcon, children: <ChevronDownRegular /> }}
      >
        {children}
      </Combobox>
    </div>
  );
};

Filtering.parameters = {
  docs: {
    description: {
      story:
        'The `useComboboxFilter` hook filters options by the typed query. The controlled value is restored ' +
        'to the last selection on blur or a second Escape.',
    },
  },
};
