import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Listbox as StyledListbox, Option as StyledOption } from '@fluentui/react-combobox';
import { Combobox } from '../Combobox/Combobox';
import { Dropdown } from './Dropdown';
import { Listbox } from './Listbox';
import { Option } from './Option';

describe.each([
  ['Dropdown', Dropdown],
  ['Combobox', Combobox],
] as const)('%s option semantics', (_name, Picker) => {
  it('exposes single-select options with explicit selection state', () => {
    const { getByRole } = render(
      <Picker defaultOpen defaultSelectedOptions={['Dog']}>
        <Option>Cat</Option>
        <Option>Dog</Option>
      </Picker>,
    );

    expect(getByRole('listbox')).not.toHaveAttribute('aria-multiselectable');
    expect(getByRole('option', { name: 'Cat' })).toHaveAttribute('aria-selected', 'false');
    expect(getByRole('option', { name: 'Dog' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps focus on the trigger while toggling multiple options without closing', () => {
    const onOptionSelect = jest.fn();
    const { getByRole } = render(
      <Picker defaultOpen multiselect defaultSelectedOptions={['Dog']} onOptionSelect={onOptionSelect}>
        <Option>Cat</Option>
        <Option>Dog</Option>
        <Option disabled>Ferret</Option>
      </Picker>,
    );
    const trigger = getByRole('combobox');
    const listbox = getByRole('listbox');
    const cat = getByRole('option', { name: 'Cat' });
    const dog = getByRole('option', { name: 'Dog' });
    const ferret = getByRole('option', { name: 'Ferret' });

    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    expect(trigger).toHaveAttribute('aria-controls', listbox.id);
    expect(cat).toHaveAttribute('aria-selected', 'false');
    expect(cat).not.toHaveAttribute('aria-checked');
    expect(dog).toHaveAttribute('aria-selected', 'true');
    expect(ferret).toHaveAttribute('aria-disabled', 'true');

    fireEvent.mouseDown(cat);
    fireEvent.click(cat);
    expect(cat).toHaveAttribute('aria-selected', 'true');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(cat).toHaveAttribute('aria-selected', 'false');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(ferret);
    expect(ferret).toHaveAttribute('aria-selected', 'false');
    expect(onOptionSelect).toHaveBeenCalledTimes(2);
  });

  it('honors an explicit menu role and the corresponding option semantics', () => {
    const { getByRole } = render(
      <Picker defaultOpen multiselect listbox={{ role: 'menu' }}>
        <Option>Cat</Option>
      </Picker>,
    );

    expect(getByRole('menu')).not.toHaveAttribute('aria-multiselectable');
    expect(getByRole('menuitemcheckbox', { name: 'Cat' })).toHaveAttribute('aria-checked', 'false');
  });

  it('honors an explicit aria-multiselectable override', () => {
    const { getByRole } = render(
      <Picker defaultOpen multiselect listbox={{ 'aria-multiselectable': false }}>
        <Option>Cat</Option>
      </Picker>,
    );

    expect(getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'false');
  });
});

describe('Listbox option interoperability', () => {
  it('uses listbox semantics for styled options in a headless Listbox', () => {
    const { getByRole } = render(
      <Listbox multiselect>
        <StyledOption>Cat</StyledOption>
      </Listbox>,
    );

    expect(getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    expect(getByRole('option', { name: 'Cat' })).toHaveAttribute('aria-selected', 'false');
  });

  it('preserves menu semantics for headless options in a styled Listbox', () => {
    const { getByRole } = render(
      <StyledListbox multiselect>
        <Option>Cat</Option>
      </StyledListbox>,
    );

    expect(getByRole('menu')).toBeInTheDocument();
    expect(getByRole('menuitemcheckbox', { name: 'Cat' })).toHaveAttribute('aria-checked', 'false');
  });
});
