import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { isConformant } from '../../testing/isConformant';
import { Combobox } from './Combobox';
import { Option } from '../Dropdown/Option';

describe('Combobox', () => {
  isConformant({
    Component: Combobox,
    displayName: 'Combobox',
    primarySlot: 'input',
    requiredProps: {
      'aria-label': 'Options',
      open: true,
      children: (
        <>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </>
      ),
    },
  });

  it('renders a default state', () => {
    const { getAllByRole, getByRole } = render(
      <Combobox open placeholder="Select an option">
        <Option>Option 1</Option>
        <Option>Option 2</Option>
        <Option>Option 3</Option>
      </Combobox>,
    );
    expect(getByRole('combobox')).toBeInTheDocument();

    const listbox = getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute('popover', 'auto');
    expect(listbox).not.toHaveAttribute('hidden');

    expect(getAllByRole('option')).toHaveLength(3);
  });

  it('sets data-selected="true" on the selected option', () => {
    const { getAllByRole } = render(
      <Combobox open defaultSelectedOptions={['Dog']} placeholder="Select">
        <Option>Cat</Option>
        <Option>Dog</Option>
        <Option>Fish</Option>
      </Combobox>,
    );
    const options = getAllByRole('option');
    expect(options[0]).not.toHaveAttribute('data-selected');
    expect(options[1]).toHaveAttribute('data-selected');
    expect(options[2]).not.toHaveAttribute('data-selected');
  });

  it('sets data-disabled="true" on disabled options', () => {
    const { getAllByRole } = render(
      <Combobox open placeholder="Select">
        <Option>Cat</Option>
        <Option disabled>Ferret</Option>
        <Option>Fish</Option>
      </Combobox>,
    );
    const options = getAllByRole('option');
    expect(options[0]).not.toHaveAttribute('data-disabled');
    expect(options[1]).toHaveAttribute('data-disabled');
    expect(options[2]).not.toHaveAttribute('data-disabled');
  });

  it('uses a named clear button instead of the expand icon for typed text', () => {
    const { container, getByRole } = render(
      <Combobox
        clearable
        freeform
        defaultValue="Unmatched"
        clearIcon={{ children: 'X' }}
        expandIcon={{ id: 'expand-icon' }}
      />,
    );
    const input = getByRole('combobox');
    const clear = getByRole('button', { name: 'Clear' });

    expect(clear).toHaveAttribute('type', 'button');
    expect(clear).toHaveTextContent('X');
    expect(container.querySelector('#expand-icon')).not.toBeInTheDocument();
    fireEvent.click(clear);
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(container.querySelector('#expand-icon')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('#expand-icon')).toHaveAttribute('tabindex', '-1');
  });

  it('clears multiple selections and a query without dismissing the popup', () => {
    const onOptionSelect = jest.fn();
    const { getByRole } = render(
      <Combobox clearable multiselect defaultOpen defaultSelectedOptions={['Cat']} onOptionSelect={onOptionSelect}>
        <Option>Cat</Option>
        <Option>Dog</Option>
      </Combobox>,
    );
    const input = getByRole('combobox');
    fireEvent.change(input, { target: { value: 'query' } });
    fireEvent.click(getByRole('button', { name: 'Clear' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(onOptionSelect).toHaveBeenLastCalledWith(expect.anything(), {
      optionValue: undefined,
      optionText: undefined,
      selectedOptions: [],
    });
  });

  it('lets a controlled value respond to the clear button', () => {
    const Controlled = () => {
      const [value, setValue] = React.useState('query');
      return <Combobox clearable value={value} clearButton={{ onClick: () => setValue('') }} />;
    };
    const { getByRole, queryByRole } = render(<Controlled />);

    fireEvent.click(getByRole('button', { name: 'Clear' }));
    expect(getByRole('combobox')).toHaveValue('');
    expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('accepts custom clear button content and an accessible name', () => {
    const { getByRole } = render(
      <Combobox
        clearable
        value="query"
        clearIcon={null}
        clearButton={{ 'aria-label': 'Reset choice', children: 'Reset' }}
      />,
    );
    expect(getByRole('button', { name: 'Reset choice' })).toHaveTextContent('Reset');
  });

  it.each([{ disabled: true }, { input: { disabled: true } }, { readOnly: true }])(
    'does not expose a clear action when %o',
    props => {
      const { queryByRole } = render(<Combobox clearable value="query" {...props} />);
      expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    },
  );

  it('honors an explicitly omitted clear icon', () => {
    const { queryByRole } = render(<Combobox clearable value="query" clearIcon={null} />);
    expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('lets a consumer cancel clearing', () => {
    const { getByRole } = render(
      <Combobox clearable value="query" clearButton={{ onClick: event => event.preventDefault() }} />,
    );
    fireEvent.click(getByRole('button', { name: 'Clear' }));
    expect(getByRole('combobox')).toHaveValue('query');
  });

  it.each(['Home', 'End'])('preserves native %s handling and notifies the input slot', key => {
    const onKeyDown = jest.fn();
    const { getByRole } = render(<Combobox defaultOpen input={{ onKeyDown }} />);

    expect(fireEvent.keyDown(getByRole('combobox'), { key })).toBe(true);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('notifies a top-level key handler for an intercepted key', () => {
    const onKeyDown = jest.fn();
    const { getByRole } = render(<Combobox onKeyDown={onKeyDown} />);

    fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown', altKey: true });
    fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp', altKey: true });
    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });
});
