import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { resetIdsForTests } from '@fluentui/react-utilities';
import { isConformant } from '../../testing/isConformant';
import type { IsConformantOptions } from '@fluentui/react-conformance';
import { Tooltip } from './Tooltip';
import { useTooltip } from './useTooltip';
import { renderTooltip } from './renderTooltip';
import type { TooltipProps } from './Tooltip.types';

export const getTooltipElement: IsConformantOptions['getTargetElement'] = () => {
  return screen.queryByRole('tooltip') as HTMLElement;
};

describe('Tooltip', () => {
  isConformant({
    Component: Tooltip,
    displayName: 'Tooltip',
    requiredProps: {
      content: 'Example tooltip',
      relationship: 'label',
      children: <button aria-label="trigger" />,
      visible: true,
    },
    getTargetElement: getTooltipElement,
    disabledTests: [
      // Tooltip is a wrapper with no root DOM element — ref/className tests don't apply
      'component-handles-ref',
      'component-has-root-ref',
      'component-handles-classname',
    ],
    testOptions: {
      'consistent-callback-args': {
        legacyCallbacks: ['onVisibleChange'],
      },
    },
  });

  afterEach(() => {
    resetIdsForTests();
  });

  it('renders trigger and tooltip content with correct positioning attributes', async () => {
    render(
      <Tooltip
        content="Default Tooltip"
        relationship="label"
        visible
        positioning={{ position: 'above', align: 'center' }}
      >
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByLabelText('Default Tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveAttribute('popover', 'hint');
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open');
  });

  it('renders only aria-label for a simple label tooltip', () => {
    const tooltipText = 'The tooltip text';
    render(
      <Tooltip content={tooltipText} relationship="label">
        <button data-testid="the-target">Trigger</button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', tooltipText);
  });

  it('renders the content of a nontrivial label tooltip', () => {
    render(
      <Tooltip
        relationship="label"
        content={{
          children: (
            <span>
              This is a <strong>formatted</strong> tooltip
            </span>
          ),
          id: 'the-tooltip-id',
        }}
      >
        <button>Trigger</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip');
    const target = screen.getByRole('button');
    expect(tooltip.id).toBe('the-tooltip-id');
    expect(target).toHaveAttribute('aria-labelledby', 'the-tooltip-id');
  });

  it('renders a description tooltip content always', () => {
    render(
      <Tooltip content="Description tooltip" relationship="description">
        <button>Trigger</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip');
    const target = screen.getByRole('button');
    expect(target).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('renders arrow element when withArrow is true', () => {
    render(
      <Tooltip content="Arrow tooltip" relationship="label" visible withArrow>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip').querySelector('[data-arrow]')).not.toBeNull();
  });

  // Regression test for https://github.com/microsoft/fluentui/issues/36650 — renderTooltip dropped
  // state.arrowClassName, so a styled layer setting it between useTooltip and renderTooltip never
  // reached the arrow element.
  it('applies state.arrowClassName to the arrow element', () => {
    const StyledTooltip = (props: TooltipProps) => {
      const state = useTooltip(props);
      state.arrowClassName = 'custom-arrow-class';
      return renderTooltip(state);
    };

    render(
      <StyledTooltip content="Styled arrow tooltip" relationship="label" visible withArrow>
        <button>Trigger</button>
      </StyledTooltip>,
    );

    const arrow = screen.getByRole('tooltip').querySelector('[data-arrow]');
    expect(arrow).toHaveClass('custom-arrow-class');
  });

  it('does not render arrow element when withArrow is false', () => {
    render(
      <Tooltip content="No arrow tooltip" relationship="label" visible>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip').querySelector('[data-arrow]')).toBeNull();
  });

  it("doesn't set any aria attributes for relationship='inaccessible'", () => {
    render(
      <Tooltip content="Inaccessible tooltip" relationship="inaccessible">
        <button>Trigger</button>
      </Tooltip>,
    );

    const target = screen.getByRole('button');
    expect(target).not.toHaveAttribute('aria-label');
    expect(target).not.toHaveAttribute('aria-labelledby');
    expect(target).not.toHaveAttribute('aria-description');
    expect(target).not.toHaveAttribute('aria-describedby');
  });

  it("doesn't override trigger's aria-label", () => {
    render(
      <Tooltip content="Label tooltip" relationship="label">
        <button aria-label="test-label" />
      </Tooltip>,
    );

    const target = screen.getByRole('button');
    expect(target).toHaveAttribute('aria-label', 'test-label');
    expect(target).not.toHaveAttribute('aria-labelledby');
  });

  it("doesn't override trigger's aria-labelledby", () => {
    render(
      <Tooltip content="Label tooltip" relationship="label">
        <button aria-labelledby="test-labelledby">Trigger</button>
      </Tooltip>,
    );

    const target = screen.getByRole('button');
    expect(target).toHaveAttribute('aria-labelledby', 'test-labelledby');
  });

  it("doesn't override trigger's aria-describedby", () => {
    render(
      <Tooltip content="Description tooltip" relationship="description">
        <button aria-describedby="test-describedby">Trigger</button>
      </Tooltip>,
    );

    const target = screen.getByRole('button');
    expect(target).not.toHaveAttribute('aria-description');
    expect(target).toHaveAttribute('aria-describedby', 'test-describedby');
  });

  describe('show on focus', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const renderWithInputTrigger = () => {
      const onVisibleChange = jest.fn();
      render(
        <>
          <button>Close dialog</button>
          <Tooltip content="Tooltip" relationship="description" showDelay={0} onVisibleChange={onVisibleChange}>
            <input aria-label="trigger" />
          </Tooltip>
        </>,
      );

      const focusTrigger = () => {
        act(() => {
          screen.getByRole('textbox').focus();
          jest.runAllTimers();
        });
      };

      return { onVisibleChange, focusTrigger };
    };

    const mouseDown = (element: Element) => fireEvent.mouseDown(element, { buttons: 1, clientX: 10, clientY: 10 });

    it('does not show when focus is restored to a text input after a pointer interaction elsewhere', () => {
      const { onVisibleChange, focusTrigger } = renderWithInputTrigger();

      // e.g. a dialog closed with the mouse restores focus to its trigger
      mouseDown(screen.getByRole('button'));
      focusTrigger();

      expect(onVisibleChange).not.toHaveBeenCalled();
    });

    it('shows when a text input is focused with the keyboard after a pointer interaction elsewhere', () => {
      const { onVisibleChange, focusTrigger } = renderWithInputTrigger();

      mouseDown(screen.getByRole('button'));
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
      focusTrigger();

      expect(onVisibleChange).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ visible: true }));
    });

    it('shows when a text input is focused by pressing on it', () => {
      const { onVisibleChange, focusTrigger } = renderWithInputTrigger();

      mouseDown(screen.getByRole('textbox'));
      focusTrigger();

      expect(onVisibleChange).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ visible: true }));
    });

    it('ignores synthetic screen reader mouse events', () => {
      const { onVisibleChange, focusTrigger } = renderWithInputTrigger();

      fireEvent.mouseDown(screen.getByRole('button'), { buttons: 0 });
      focusTrigger();

      expect(onVisibleChange).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ visible: true }));
    });
  });
});
