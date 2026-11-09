import * as React from 'react';
import { Combobox, Option } from '@fluentui/react-headless-components-preview/combobox';
import { CheckmarkRegular, ChevronDownRegular } from '@fluentui/react-icons';
import styles from './combobox.module.css';

export const Multiselect = (): React.ReactNode => {
  const options = ['Cat', 'Dog', 'Ferret', 'Fish', 'Hamster', 'Snake'];
  const [query, setQuery] = React.useState('');
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  return (
    <div className={styles.demo}>
      <label className={styles.label} htmlFor="combobox-multiselect">
        Best pets
      </label>
      <Combobox
        root={{ className: styles.root }}
        input={{ className: styles.input }}
        listbox={{ className: styles.listbox }}
        id="combobox-multiselect"
        multiselect
        value={query}
        selectedOptions={selectedOptions}
        onChange={event => setQuery(event.target.value)}
        onOptionSelect={(_event, data) => {
          setSelectedOptions(data.selectedOptions);
          setQuery('');
        }}
        getSelectedOptionText={value => options.find(option => option.toLowerCase() === value)}
        selectionDisplay={{ className: styles.selectionDisplay }}
        placeholder="Select animals"
        expandIcon={{ className: styles.expandIcon, children: <ChevronDownRegular /> }}
      >
        {options
          .filter(option => option.toLowerCase().includes(query.toLowerCase()))
          .map(option => (
            <Option
              className={styles.option}
              key={option}
              value={option.toLowerCase()}
              checkIcon={{ className: styles.checkIcon, children: <CheckmarkRegular /> }}
              disabled={option === 'Ferret'}
            >
              {option}
            </Option>
          ))}
      </Combobox>
    </div>
  );
};

Multiselect.parameters = {
  docs: {
    description: {
      story:
        'The selection summary is separate from the editable filter. Resolve selected labels from the full ' +
        'option collection so they remain available when filtering hides an option.',
    },
  },
};
