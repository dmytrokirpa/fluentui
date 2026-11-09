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

  it('keeps selected option text in a separate description when the option is filtered out', () => {
    const renderCombobox = (showCat: boolean) => (
      <>
        <span id="hint">Choose pets</span>
        <Combobox
          aria-describedby="hint"
          defaultOpen
          multiselect
          defaultSelectedOptions={['cat-id']}
          selectionDisplay={{ id: 'selection' }}
        >
          {showCat && <Option value="cat-id">Cat</Option>}
          <Option value="dog-id">Dog</Option>
        </Combobox>
      </>
    );
    const { container, getByRole, rerender } = render(renderCombobox(true));
    const input = getByRole('combobox');

    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('aria-describedby', 'hint selection');
    expect(container.querySelector('#selection')).toHaveTextContent('Cat');
    fireEvent.change(input, { target: { value: 'Dog' } });
    rerender(renderCombobox(false));
    expect(input).toHaveValue('Dog');
    expect(container.querySelector('#selection')).toHaveTextContent('Cat');
  });

  it('resolves controlled selected labels even when their options are not mounted', () => {
    const labels: Record<string, string> = { 'cat-id': 'Cat', 'dog-id': 'Dog' };
    const { container, getByRole, rerender } = render(
      <Combobox
        multiselect
        selectedOptions={['cat-id']}
        value="query"
        getSelectedOptionText={value => labels[value]}
      />,
    );
    const input = getByRole('combobox');

    expect(input).toHaveValue('query');
    const selection = container.querySelector(`[id="${input.getAttribute('aria-describedby')}"]`);
    expect(selection).toHaveTextContent('Cat');
    rerender(
      <Combobox
        multiselect
        selectedOptions={['cat-id', 'dog-id']}
        value="query"
        getSelectedOptionText={value => labels[value]}
      />,
    );
    expect(input).toHaveValue('query');
    expect(selection).toHaveTextContent('Cat, Dog');
  });

  it('updates the selection display when options are deselected or cleared', () => {
    const { getByRole, container } = render(
      <Combobox clearable defaultOpen multiselect selectionDisplay={{ id: 'selection' }}>
        <Option value="cat-id">Cat</Option>
        <Option value="dog-id">Dog</Option>
      </Combobox>,
    );
    const selection = container.querySelector('#selection');

    fireEvent.click(getByRole('option', { name: 'Cat' }));
    fireEvent.click(getByRole('option', { name: 'Dog' }));
    expect(selection).toHaveTextContent('Cat, Dog');
    fireEvent.click(getByRole('option', { name: 'Cat' }));
    expect(selection).toHaveTextContent('Dog');
    fireEvent.click(getByRole('button', { name: 'Clear' }));
    expect(selection).toBeEmptyDOMElement();
  });

  it('allows a localized custom selection summary', () => {
    const { getByRole, getByText } = render(
      <Combobox
        multiselect
        selectedOptions={['cat-id', 'dog-id']}
        selectionDisplay={{ id: 'summary', children: '2 animals selected' }}
      />,
    );

    expect(getByText('2 animals selected')).toHaveAttribute('id', 'summary');
    expect(getByRole('combobox')).toHaveAttribute('aria-describedby', 'summary');
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

  it('does not restore an edit after the clear button is activated', () => {
    const onOptionSelect = jest.fn();
    const { getByRole } = render(
      <Combobox clearable defaultValue="Cat" defaultSelectedOptions={['Cat']} onOptionSelect={onOptionSelect}>
        <Option>Cat</Option>
      </Combobox>,
    );
    const input = getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Unmatched' } });
    fireEvent.click(getByRole('button', { name: 'Clear' }));
    fireEvent.blur(input);

    expect(input).toHaveValue('');
    expect(onOptionSelect).toHaveBeenCalledTimes(1);
    expect(onOptionSelect).toHaveBeenLastCalledWith(expect.anything(), {
      optionValue: undefined,
      optionText: undefined,
      selectedOptions: [],
    });
  });

  it('commits a freeform edit on blur, not with a stale event when closed programmatically', () => {
    const onOptionSelect = jest.fn();
    const props = {
      freeform: true,
      defaultValue: 'Cat',
      defaultSelectedOptions: ['Cat'],
      onOptionSelect,
      children: <Option>Cat</Option>,
    };
    const { getByRole, rerender } = render(<Combobox {...props} open />);
    const input = getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Unmatched' } });
    rerender(<Combobox {...props} open={false} />);
    expect(onOptionSelect).not.toHaveBeenCalled();

    fireEvent.blur(input);
    expect(onOptionSelect).toHaveBeenCalledTimes(1);
    expect(onOptionSelect.mock.calls[0][0].type).toBe('blur');
    expect(onOptionSelect.mock.calls[0][1].selectedOptions).toEqual([]);
    expect(input).toHaveValue('Unmatched');
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
