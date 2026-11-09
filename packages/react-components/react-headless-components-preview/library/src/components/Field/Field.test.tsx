import * as React from 'react';
import { render } from '@testing-library/react';
import { isConformant } from '../../testing/isConformant';
import { Input } from '../Input/Input';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Field } from './Field';

describe('Field', () => {
  isConformant({
    Component: Field,
    displayName: 'Field',
  });

  it('renders a default state', () => {
    const { getByText, container } = render(<Field>Default Field</Field>);
    const root = container.firstElementChild!;

    expect(getByText('Default Field')).toBeInTheDocument();
    expect(root).toHaveAttribute('data-validate-state', 'none');
  });

  it('renders with error validation state', () => {
    const { container } = render(<Field validationState="error">Error Field</Field>);
    const root = container.firstElementChild!;

    expect(root).toHaveAttribute('data-validate-state', 'error');
  });

  it('renders with success validation state', () => {
    const { container } = render(<Field validationState="success">Success Field</Field>);
    const root = container.firstElementChild!;

    expect(root).toHaveAttribute('data-validate-state', 'success');
  });

  it('renders and describes the hint before validation, preserving custom IDs and external descriptions', () => {
    const { getByRole, getByText } = render(
      <>
        <Field
          label="Name"
          hint={{ id: 'name-hint', children: 'Enter your name' }}
          validationMessage={{ id: 'name-error', children: 'Name is required' }}
        >
          <Input aria-describedby="extra-description" />
        </Field>
        <div id="extra-description">Additional information</div>
      </>,
    );

    const input = getByRole('textbox', { name: 'Name' });
    const hint = getByText('Enter your name');
    const message = getByText('Name is required');

    expect(hint.nextElementSibling).toBe(message);
    expect(input).toHaveAttribute('aria-describedby', 'name-hint name-error extra-description');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('passes generated hint and validation IDs in order to render-function children', () => {
    const { getByRole, getByText } = render(
      <Field label="Name" hint="Hint" validationMessage="Error">
        {controlProps => <input {...controlProps} />}
      </Field>,
    );
    const hint = getByText('Hint');
    const message = getByText('Error');

    expect(hint.id).toBeTruthy();
    expect(message.id).toBeTruthy();
    expect(getByRole('textbox')).toHaveAttribute('aria-describedby', `${hint.id} ${message.id}`);
  });

  it('uses the same description order for ProgressBar', () => {
    const { getByRole, getByText } = render(
      <Field label="Upload" hint="Hint" validationMessage="Error">
        <ProgressBar aria-describedby="external" />
      </Field>,
    );
    const hint = getByText('Hint');
    const message = getByText('Error');

    expect(getByRole('progressbar')).toHaveAttribute('aria-describedby', `${hint.id} ${message.id} external`);
  });

  it('updates descriptions when validation appears or clears', () => {
    const { getByRole, getByText, rerender } = render(
      <Field label="Name" hint="Hint">
        <Input />
      </Field>,
    );
    const input = getByRole('textbox');
    const hint = getByText('Hint');
    expect(input).toHaveAttribute('aria-describedby', hint.id);

    rerender(
      <Field label="Name" hint="Hint" validationMessage="Error">
        <Input />
      </Field>,
    );
    const message = getByText('Error');
    expect(input).toHaveAttribute('aria-describedby', `${hint.id} ${message.id}`);
    expect(message).toHaveAttribute('aria-live', 'polite');

    rerender(
      <Field label="Name" hint="Hint">
        <Input />
      </Field>,
    );
    expect(input).toHaveAttribute('aria-describedby', hint.id);
  });

  it.each([undefined, 'error', 'warning', 'success', 'none'] as const)(
    'announces %s validation politely by default',
    validationState => {
      const { getByText } = render(<Field validationState={validationState} validationMessage="Message" />);
      const message = getByText('Message');

      expect(message).toHaveAttribute('aria-live', 'polite');
      expect(message).not.toHaveAttribute('role', 'alert');
    },
  );

  it.each([
    [{ role: 'alert' as const }, 'role', 'alert'],
    [{ 'aria-live': 'assertive' as const }, 'aria-live', 'assertive'],
    [{ 'aria-live': 'off' as const }, 'aria-live', 'off'],
  ])('preserves an explicit announcement override', (override, attribute, value) => {
    const { getByText } = render(<Field validationMessage={{ children: 'Message', ...override }} />);
    const message = getByText('Message');

    expect(message).toHaveAttribute(attribute, value);
    if (attribute === 'role') {
      expect(message).not.toHaveAttribute('aria-live');
    } else {
      expect(message).not.toHaveAttribute('role', 'alert');
    }
  });
});
