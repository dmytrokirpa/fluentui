import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isConformant } from '../../testing/isConformant';
import { SearchBox } from './SearchBox';

describe('SearchBox', () => {
  isConformant({
    Component: SearchBox,
    displayName: 'SearchBox',
    primarySlot: 'input',
    requiredProps: { 'aria-label': 'Search' },
  });

  it('renders a default state', () => {
    const { getByRole } = render(<SearchBox placeholder="Search..." />);
    const input = getByRole('searchbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search...');
    expect(input).toHaveAttribute('type', 'search');
  });

  it('only renders a native clear button when there is a value', async () => {
    const { getByRole, queryByRole } = render(<SearchBox aria-label="Search" />);
    const input = getByRole('searchbox');
    expect(queryByRole('button', { name: 'clear' })).toBeNull();

    await userEvent.type(input, 'query');
    const clearButton = getByRole('button', { name: 'clear' });
    expect(clearButton.tagName).toBe('BUTTON');
    expect(clearButton).toHaveAttribute('type', 'button');
    expect(clearButton).toHaveAttribute('tabindex', '0');

    await userEvent.clear(input);
    expect(queryByRole('button', { name: 'clear' })).toBeNull();
  });

  it.each(['{Enter}', ' '])('clears with %s and returns focus to the input', async key => {
    const onChange = jest.fn();
    const onClick = jest.fn();
    const { getByRole, queryByRole } = render(
      <SearchBox aria-label="Search" defaultValue="query" onChange={onChange} dismiss={{ onClick }} />,
    );
    const input = getByRole('searchbox');

    await userEvent.tab();
    expect(input).toHaveFocus();
    await userEvent.tab();
    expect(getByRole('button', { name: 'clear' })).toHaveFocus();
    await userEvent.keyboard(key);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(queryByRole('button', { name: 'clear' })).toBeNull();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }), { value: '' });
  });

  it('clears with Escape without closing a parent and leaves empty Escape unhandled', async () => {
    const onChange = jest.fn();
    const onParentKeyDown = jest.fn();
    const onInputKeyDown = jest.fn();
    const { getByRole } = render(
      <div onKeyDown={onParentKeyDown}>
        <SearchBox aria-label="Search" defaultValue="query" onChange={onChange} onKeyDown={onInputKeyDown} />
      </div>,
    );
    const input = getByRole('searchbox');
    await userEvent.click(input);
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onInputKeyDown).toHaveBeenCalledTimes(1);
    expect(onParentKeyDown).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ type: 'keydown' }), { value: '' });

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onParentKeyDown).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('respects prevented input and dismiss handlers', async () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <SearchBox
        aria-label="Search"
        defaultValue="query"
        onChange={onChange}
        onKeyDown={event => event.preventDefault()}
        dismiss={{ onClick: event => event.preventDefault() }}
      />,
    );
    const input = getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'Escape' });
    await userEvent.click(getByRole('button', { name: 'clear' }));

    expect(input).toHaveValue('query');
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each([{ disabled: true }, { readOnly: true }, { input: { disabled: true } }, { input: { readOnly: true } }])(
    'does not clear a disabled or read-only input: %o',
    async props => {
      const onChange = jest.fn();
      const { getByRole } = render(
        <SearchBox aria-label="Search" defaultValue="query" onChange={onChange} {...props} />,
      );
      const input = getByRole('searchbox');
      const clearButton = getByRole('button', { name: 'clear' });
      expect(clearButton).toBeDisabled();

      await userEvent.click(clearButton);
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(input).toHaveValue('query');
      expect(onChange).not.toHaveBeenCalled();
    },
  );

  it('notifies controlled consumers without changing the displayed value until updated', async () => {
    const onChange = jest.fn();
    const { getByRole, rerender, queryByRole } = render(
      <SearchBox aria-label="Search" value="query" onChange={onChange} />,
    );
    const input = getByRole('searchbox');
    await userEvent.click(getByRole('button', { name: 'clear' }));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }), { value: '' });
    expect(input).toHaveValue('query');
    rerender(<SearchBox aria-label="Search" value="" onChange={onChange} />);
    expect(input).toHaveValue('');
    expect(queryByRole('button', { name: 'clear' })).toBeNull();
  });

  it('forwards both input refs and supports a localized dismiss label', async () => {
    const ref = React.createRef<HTMLInputElement>();
    const slotRef = React.createRef<HTMLInputElement>();
    const { getByRole } = render(
      <SearchBox
        ref={ref}
        aria-label="Search"
        defaultValue="query"
        input={{ ref: slotRef }}
        dismiss={{ 'aria-label': 'Clear search' }}
      />,
    );
    const input = getByRole('searchbox');
    expect(ref.current).toBe(input);
    expect(slotRef.current).toBe(input);
    await userEvent.click(getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveFocus();
  });

  it('supports removing the dismiss slot', () => {
    const { queryByRole } = render(<SearchBox aria-label="Search" defaultValue="query" dismiss={null} />);
    expect(queryByRole('button')).toBeNull();
  });

  it('renders with data-disabled when disabled', () => {
    const { container } = render(<SearchBox disabled placeholder="Search..." />);
    const root = container.firstElementChild!;

    expect(root).toHaveAttribute('data-disabled');
  });
});
