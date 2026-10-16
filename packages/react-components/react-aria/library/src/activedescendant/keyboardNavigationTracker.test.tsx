import * as React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { useActiveDescendant } from './useActiveDescendant';
import type { ActiveDescendantImperativeRef } from './types';
import { ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE } from './constants';

const Test = ({
  imperativeRef,
  idPrefix = 'option',
}: {
  imperativeRef: React.RefObject<ActiveDescendantImperativeRef | null>;
  idPrefix?: string;
}) => {
  const { listboxRef, activeParentRef } = useActiveDescendant<HTMLInputElement, HTMLDivElement>({
    matchOption: el => el.getAttribute('role') === 'option',
    imperativeRef,
  });

  return (
    <>
      <input aria-label={`${idPrefix} parent`} ref={activeParentRef} />
      <div ref={listboxRef}>
        <div role="option" id={`${idPrefix}-1`} />
        <div role="option" id={`${idPrefix}-2`} />
      </div>
    </>
  );
};

const mouseDown = (element: Element) => fireEvent.mouseDown(element, { buttons: 1, clientX: 10, clientY: 10 });

describe('useActiveDescendant keyboard navigation tracking', () => {
  it('shows focus-visible attribute when keys are pressed on the active parent', () => {
    const imperativeRef = React.createRef<ActiveDescendantImperativeRef>();
    const { getByLabelText, container } = render(<Test imperativeRef={imperativeRef} />);

    act(() => {
      imperativeRef.current?.first();
    });
    const option = container.querySelector('#option-1')!;
    expect(option.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(false);

    fireEvent.keyDown(getByLabelText('option parent'), { key: 'ArrowDown' });
    expect(option.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(true);

    mouseDown(option);
    expect(option.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(false);
  });

  it('ignores synthetic screen reader mouse events', () => {
    const imperativeRef = React.createRef<ActiveDescendantImperativeRef>();
    const { getByLabelText, container } = render(<Test imperativeRef={imperativeRef} />);

    act(() => {
      imperativeRef.current?.first();
    });
    fireEvent.keyDown(getByLabelText('option parent'), { key: 'ArrowDown' });
    fireEvent.mouseDown(container.querySelector('#option-1')!, { buttons: 0 });

    expect(container.querySelector('#option-1')!.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(true);
  });

  it('treats keys pressed on non-text elements as keyboard navigation, but not typing in other text fields', () => {
    const imperativeRef = React.createRef<ActiveDescendantImperativeRef>();
    const { container, getByRole, getByLabelText } = render(
      <>
        <button>trigger</button>
        <input aria-label="other" />
        <Test imperativeRef={imperativeRef} />
      </>,
    );

    act(() => {
      imperativeRef.current?.first();
    });
    const option = container.querySelector('#option-1')!;

    fireEvent.keyDown(getByLabelText('other'), { key: 'a' });
    expect(option.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(false);

    // e.g. Enter on a button that opens a popup and moves focus to the active parent
    fireEvent.keyDown(getByRole('button'), { key: 'Enter' });
    expect(option.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(true);
  });

  it('initializes controllers mounted later with the current keyboard modality', () => {
    const firstRef = React.createRef<ActiveDescendantImperativeRef>();
    const secondRef = React.createRef<ActiveDescendantImperativeRef>();
    const { getByLabelText, container, rerender } = render(<Test imperativeRef={firstRef} idPrefix="first" />);

    fireEvent.keyDown(getByLabelText('first parent'), { key: 'ArrowDown' });

    rerender(
      <>
        <Test imperativeRef={firstRef} idPrefix="first" />
        <Test imperativeRef={secondRef} idPrefix="second" />
      </>,
    );
    act(() => {
      secondRef.current?.first();
    });

    expect(container.querySelector('#second-1')!.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(true);
  });

  it('detects keys pressed on an active parent inside a shadow root', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const otherInput = document.createElement('input');
    const mountNode = document.createElement('div');
    shadowRoot.append(otherInput, mountNode);

    const imperativeRef = React.createRef<ActiveDescendantImperativeRef>();
    const { unmount } = render(<Test imperativeRef={imperativeRef} idPrefix="shadow" />, { container: mountNode });

    act(() => {
      imperativeRef.current?.first();
    });
    const option = shadowRoot.querySelector('#shadow-1')!;

    // Typing into another text field in the shadow root is not navigation, even though the event is retargeted to
    // the (non-editable) shadow host outside of it
    otherInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, composed: true }));
    expect(option.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(false);

    const input = mountNode.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));

    expect(option.hasAttribute(ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE)).toBe(true);

    unmount();
    host.remove();
  });
});
