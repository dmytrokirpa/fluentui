import * as React from 'react';
import { render } from '@testing-library/react';

import { composeComponent } from './composeComponent';

type TestProps = React.HTMLAttributes<HTMLDivElement> & { label?: string };
type TestState = { root: React.HTMLAttributes<HTMLDivElement> & { ref: React.Ref<HTMLDivElement> }; label?: string };

const useTest = (props: TestProps, ref: React.Ref<HTMLDivElement>): TestState => ({
  root: { ref, className: props.className },
  label: props.label,
});

describe('composeComponent', () => {
  it('renders the output of the render function for the state returned by the state hook', () => {
    const Test = composeComponent('Test', useTest, (state: TestState) => (
      <div {...state.root} data-testid="root">
        {state.label}
      </div>
    ));

    const { getByTestId } = render(<Test label="hello" className="foo" />);

    expect(getByTestId('root').textContent).toBe('hello');
    expect(getByTestId('root').className).toBe('foo');
  });

  it('forwards the ref to the state hook', () => {
    const Test = composeComponent('Test', useTest, (state: TestState) => <div {...state.root} />);
    const ref = React.createRef<HTMLDivElement>();

    const { container } = render(<Test ref={ref} />);

    expect(ref.current).toBe(container.firstElementChild);
  });

  it('passes the context values derived from the state to the render function', () => {
    const useContextValues = jest.fn((state: TestState) => ({ doubled: `${state.label}${state.label}` }));
    const Test = composeComponent(
      'Test',
      useTest,
      (state: TestState, contextValues: { doubled: string }) => <div {...state.root}>{contextValues.doubled}</div>,
      useContextValues,
    );

    const { container } = render(<Test label="ab" />);

    expect(container.textContent).toBe('abab');
    expect(useContextValues).toHaveBeenCalledWith(expect.objectContaining({ label: 'ab' }));
  });

  it('sets the display name', () => {
    const Test = composeComponent('Test', useTest, (state: TestState) => <div {...state.root} />);

    expect(Test.displayName).toBe('Test');
  });

  it('calls the render function with undefined context values when no hook is provided', () => {
    const renderFn = jest.fn((state: TestState, _contextValues: undefined) => <div {...state.root} />);
    const Test = composeComponent('Test', useTest, renderFn);

    render(<Test />);

    expect(renderFn).toHaveBeenCalledWith(expect.anything(), undefined);
  });
});
