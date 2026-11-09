import * as React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { resetIdsForTests } from '@fluentui/react-utilities';
import { AnnounceProvider } from '@fluentui/react-shared-contexts';
import { isConformant } from '../../testing/isConformant';
import { MessageBar } from './MessageBar';
import { MessageBarBody } from './MessageBarBody/MessageBarBody';
import { MessageBarTitle } from './MessageBarTitle/MessageBarTitle';
import { MessageBarActions } from './MessageBarActions/MessageBarActions';

describe('MessageBar', () => {
  beforeEach(() => {
    resetIdsForTests();
  });

  isConformant({
    Component: MessageBar,
    displayName: 'MessageBar',
  });

  it('renders composed subcomponents with linked title semantics', () => {
    const { getByRole, getByText } = render(
      <MessageBar intent="warning">
        <MessageBarBody>
          <MessageBarTitle>Storage running low</MessageBarTitle>
          Review the backup configuration.
        </MessageBarBody>
        <MessageBarActions containerAction={<button aria-label="Dismiss">Dismiss</button>}>
          <button>Review</button>
        </MessageBarActions>
      </MessageBar>,
    );

    const group = getByRole('group');
    const title = getByText('Storage running low');

    expect(group).toHaveAttribute('aria-labelledby', title.id);
    expect(group).toHaveAttribute('data-layout', 'singleline');
    expect(group).toHaveAttribute('data-intent', 'warning');
    expect(getByText('Review the backup configuration.')).toBeInTheDocument();
    expect(getByText('Review')).toBeInTheDocument();
  });

  it.each([
    ['info', 'status'],
    ['success', 'status'],
    ['warning', 'alert'],
    ['error', 'alert'],
  ] as const)('announces a %s message through a primed %s without an announcer', async (intent, role) => {
    const { getByRole, unmount, queryByRole } = render(
      <MessageBar intent={intent}>
        <MessageBarBody>Message</MessageBarBody>
      </MessageBar>,
    );

    expect(getByRole(role)).toBeEmptyDOMElement();
    await waitFor(() => expect(getByRole(role)).toHaveTextContent('Message'));
    unmount();
    expect(queryByRole(role)).toBeNull();
  });

  it.each([
    ['info', 'assertive', 'alert'],
    ['error', 'polite', 'status'],
  ] as const)('honors the %s priority override for %s', async (intent, politeness, role) => {
    const { getByRole } = render(
      <MessageBar intent={intent} politeness={politeness}>
        <MessageBarBody>Message</MessageBarBody>
      </MessageBar>,
    );

    await waitFor(() => expect(getByRole(role)).toHaveTextContent('Message'));
  });

  it('preserves an explicitly supplied role', () => {
    const { getByRole } = render(<MessageBar role="region" aria-label="Custom message" />);

    expect(getByRole('region')).toHaveAttribute('aria-label', 'Custom message');
  });

  it.each([
    ['info', undefined, 'polite'],
    ['success', undefined, 'polite'],
    ['warning', undefined, 'assertive'],
    ['error', undefined, 'assertive'],
    ['info', 'polite', 'polite'],
    ['info', 'assertive', 'assertive'],
    ['success', 'polite', 'polite'],
    ['success', 'assertive', 'assertive'],
    ['warning', 'polite', 'polite'],
    ['warning', 'assertive', 'assertive'],
    ['error', 'polite', 'polite'],
    ['error', 'assertive', 'assertive'],
  ] as const)('uses the host announcer once for %s with override %s', (intent, politeness, expected) => {
    const announce = jest.fn();
    const { getByRole, queryByRole } = render(
      <AnnounceProvider value={{ announce }}>
        <MessageBar intent={intent} politeness={politeness}>
          <MessageBarBody>Message</MessageBarBody>
        </MessageBar>
      </AnnounceProvider>,
    );

    expect(getByRole('group')).toHaveTextContent('Message');
    expect(queryByRole('alert')).toBeNull();
    expect(queryByRole('status')).toBeNull();
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith('Message', {
      polite: expected === 'polite',
      alert: expected === 'assertive',
    });
  });

  it('announces changed body and action text once through the host announcer', async () => {
    const announce = jest.fn();
    const message = (body: string, action: string) => (
      <AnnounceProvider value={{ announce }}>
        <MessageBar>
          <MessageBarBody>{body}</MessageBarBody>
          <MessageBarActions>
            <button>{action}</button>
          </MessageBarActions>
        </MessageBar>
      </AnnounceProvider>
    );
    const { rerender } = render(message('Original', 'Review'));
    expect(announce).toHaveBeenCalledTimes(1);

    rerender(message('Updated', 'Retry'));
    await waitFor(() => expect(announce).toHaveBeenCalledTimes(2));
    expect(announce).toHaveBeenLastCalledWith('Updated,Retry', { polite: true, alert: false });

    rerender(message('Updated', 'Retry'));
    await waitFor(() => expect(announce).toHaveBeenCalledTimes(2));
  });

  it('updates the live message and priority without an announcer', async () => {
    const { getByRole, rerender } = render(
      <MessageBar intent="info">
        <MessageBarBody>Saving</MessageBarBody>
      </MessageBar>,
    );
    await waitFor(() => expect(getByRole('status')).toHaveTextContent('Saving'));

    rerender(
      <MessageBar intent="error">
        <MessageBarBody>Save failed</MessageBarBody>
      </MessageBar>,
    );
    await waitFor(() => expect(getByRole('alert')).toHaveTextContent('Save failed'));
  });

  it('updates the existing standalone live region when message text changes', async () => {
    const message = (text: string) => (
      <MessageBar>
        <MessageBarBody>{text}</MessageBarBody>
      </MessageBar>
    );
    const { getByRole, rerender } = render(message('Saving'));
    const region = getByRole('status');
    await waitFor(() => expect(region).toHaveTextContent('Saving'));

    rerender(message('Saved'));
    await waitFor(() => expect(region).toHaveTextContent('Saved'));
    expect(getByRole('status')).toBe(region);
  });

  it('announces plain message content without a MessageBarBody', async () => {
    const { getByRole } = render(<MessageBar>Message</MessageBar>);

    await waitFor(() => expect(getByRole('status')).toHaveTextContent('Message'));
  });

  it('clears the standalone live region after announcing', () => {
    jest.useFakeTimers();
    try {
      const { getByRole } = render(<MessageBar>Message</MessageBar>);
      const region = getByRole('status');
      act(() => jest.advanceTimersByTime(0));
      expect(region).toHaveTextContent('Message');
      act(() => jest.advanceTimersByTime(500));
      expect(region).toBeEmptyDOMElement();
    } finally {
      jest.useRealTimers();
    }
  });

  it('does not announce stale text cleared before delivery', async () => {
    jest.useFakeTimers();
    try {
      const { getByRole, rerender } = render(<MessageBar>Message</MessageBar>);
      const region = getByRole('status');
      rerender(<MessageBar />);
      await act(async () => Promise.resolve());
      act(() => jest.advanceTimersByTime(0));
      expect(region).toBeEmptyDOMElement();
    } finally {
      jest.useRealTimers();
    }
  });

  it('keeps the standalone live region inside a native dialog', async () => {
    const { getByRole } = render(
      <dialog open>
        <MessageBar>Message</MessageBar>
      </dialog>,
    );

    const region = getByRole('status');
    expect(region.closest('dialog')).toBe(getByRole('dialog'));
    await waitFor(() => expect(region).toHaveTextContent('Message'));
  });

  it('does not add a second live region when the root explicitly has one', () => {
    const { getAllByRole } = render(<MessageBar role="status">Message</MessageBar>);

    expect(getAllByRole('status')).toHaveLength(1);
  });

  it('sets headless data attributes on actions and group roots', () => {
    const { getByText } = render(
      <MessageBar>
        <MessageBarBody>
          <MessageBarTitle>Saved</MessageBarTitle>
          Changes are synced.
        </MessageBarBody>
        <MessageBarActions>
          <button>Undo</button>
        </MessageBarActions>
      </MessageBar>,
    );

    const actions = getByText('Undo').parentElement;

    expect(actions).toHaveAttribute('data-layout', 'singleline');
    expect(actions).toHaveAttribute('data-has-actions', '');
  });
});
