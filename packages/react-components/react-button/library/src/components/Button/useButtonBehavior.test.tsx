import * as React from 'react';
import { ButtonBehaviorProps, useButtonBehavior_unstable } from './useButtonBehavior';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('useButtonBehavior', () => {
  type CustomButtonProps = ButtonBehaviorProps & {
    appearance?: 'primary' | 'secondary';
  };

  const CustomButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, CustomButtonProps>(
    ({ appearance = 'primary', ...props }, ref) => {
      const { rootProps, as, disabled, disabledFocusable } = useButtonBehavior_unstable(props, ref);

      const className = [
        'btn',
        `btn-${appearance}`,
        disabled && 'btn-disabled',
        disabledFocusable && 'btn-disabled-focusable',
        props.className,
      ]
        .filter(Boolean)
        .join(' ');

      if (as === 'a') {
        return <a {...rootProps} className={className} />;
      }

      return <button {...rootProps} className={className} />;
    },
  );

  it('should apply default props and behavior correctly', () => {
    const ref = React.createRef<HTMLButtonElement & HTMLAnchorElement>();
    const { getByRole } = render(<CustomButton ref={ref}>Click me</CustomButton>);

    const button = getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary');
    expect(button).not.toBeDisabled();
    expect(ref.current).toBe(button);
  });

  it('should handle anchor element with disabled state', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const { getByRole } = render(
      <CustomButton as="a" href="#" disabled ref={ref}>
        Link
      </CustomButton>,
    );

    const link = getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('btn', 'btn-primary', 'btn-disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(ref.current).toBe(link);
  });

  it('should apply custom appearance and handle disabledFocusable', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const { getByRole } = render(
      <CustomButton appearance="secondary" disabledFocusable ref={ref}>
        Click me
      </CustomButton>,
    );

    const button = getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-secondary', 'btn-disabled-focusable');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(ref.current).toBe(button);
  });
});
