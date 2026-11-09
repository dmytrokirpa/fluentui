import * as React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { useToastController } from '@fluentui/react-toast';
import { isConformant } from '../../../testing/isConformant';
import { Toaster } from './Toaster';

describe('Toaster', () => {
  isConformant({
    Component: Toaster,
    displayName: 'Toaster',
    disabledTests: [
      // Toaster is a wrapper that does not expose a single root element.
      'component-has-root-ref',
      'component-handles-ref',
      'component-handles-classname',
      'component-has-static-classnames-object',
      'make-styles-overrides-win',
      // Toaster is exported from `toast.ts` rather than top-level `toaster.ts`.
      'has-top-level-file-extra',
      'export-map-entry-exists',
    ],
  });

  it('mounts an aria-live region on document.body by default', () => {
    // AriaLiveAnnouncer attaches its live region directly to document.body
    // (not inside the Toaster's React tree) so a single shared region serves
    // the whole app. The DOM fallback path only renders an assertive region;
    // polite messages on browsers without `ariaNotify` are announced assertively.
    const { baseElement } = render(<Toaster />);

    expect(baseElement.querySelector('[aria-live="assertive"]')).not.toBeNull();
  });

  it('does not render position containers when there are no toasts', () => {
    const { container } = render(<Toaster />);

    expect(container.querySelector('[data-toaster-position]')).toBeNull();
  });

  it('does not mount its own live region when a custom `announce` prop is supplied', () => {
    const before = document.body.querySelectorAll('[aria-live]').length;

    render(<Toaster announce={jest.fn()} />);

    expect(document.body.querySelectorAll('[aria-live]').length).toBe(before);
  });

  it('uses list semantics with native block-axis focusgroup navigation', () => {
    let dispatchToast: ReturnType<typeof useToastController>['dispatchToast'];
    const Test = () => {
      dispatchToast = useToastController().dispatchToast;
      return <Toaster />;
    };
    const { getByRole } = render(<Test />);

    act(() => {
      dispatchToast('toast', { timeout: -1 });
    });

    expect(getByRole('list')).toHaveAttribute('focusgroup', 'toolbar block itemcontrols');
  });

  it('limits the number of rendered toasts', () => {
    let dispatchToast: ReturnType<typeof useToastController>['dispatchToast'];
    const toasterId = 'limited-toaster';
    const Test = () => {
      dispatchToast = useToastController(toasterId).dispatchToast;
      return <Toaster toasterId={toasterId} limit={1} />;
    };
    const { queryByText } = render(<Test />);

    act(() => {
      dispatchToast('first toast', { toastId: 'first', timeout: -1 });
      dispatchToast('second toast', { toastId: 'second', timeout: -1 });
    });

    expect(queryByText('first toast')).not.toBeNull();
    expect(queryByText('second toast')).toBeNull();
  });

  it('keeps queued toasts until earlier toasts are dismissed', () => {
    let dispatchToast: ReturnType<typeof useToastController>['dispatchToast'];
    const toasterId = 'queued-toaster';
    const Test = () => {
      dispatchToast = useToastController(toasterId).dispatchToast;
      return <Toaster toasterId={toasterId} limit={1} />;
    };
    const { getByText, queryByText } = render(<Test />);

    act(() => {
      dispatchToast('first toast', { toastId: 'first', timeout: -1 });
      dispatchToast('second toast', { toastId: 'second', timeout: -1 });
      dispatchToast('third toast', { toastId: 'third', timeout: -1 });
    });

    expect(getByText('first toast')).toBeInTheDocument();
    expect(queryByText('second toast')).not.toBeInTheDocument();

    fireEvent.keyDown(getByText('first toast'), { key: 'Escape' });
    expect(getByText('second toast')).toBeInTheDocument();
    expect(queryByText('third toast')).not.toBeInTheDocument();

    fireEvent.keyDown(getByText('second toast'), { key: 'Escape' });
    expect(getByText('third toast')).toBeInTheDocument();
  });

  it('removes cancelled queued toasts and clears the position when all are dismissed', () => {
    let controller: ReturnType<typeof useToastController>;
    const toasterId = 'cancel-queued-toaster';
    const Test = () => {
      controller = useToastController(toasterId);
      return <Toaster toasterId={toasterId} limit={1} />;
    };
    const { getByText, queryByText, queryByRole } = render(<Test />);

    act(() => {
      controller.dispatchToast('visible', { toastId: 'visible', timeout: -1 });
      controller.dispatchToast('cancelled', { toastId: 'cancelled', timeout: -1 });
      controller.dispatchToast('remaining', { toastId: 'remaining', timeout: -1 });
      controller.dismissToast('cancelled');
    });

    fireEvent.keyDown(getByText('visible'), { key: 'Escape' });
    expect(queryByText('cancelled')).not.toBeInTheDocument();
    expect(getByText('remaining')).toBeInTheDocument();

    act(() => {
      controller.dispatchToast('queued', { toastId: 'queued', timeout: -1 });
      controller.dismissAllToasts();
    });
    expect(queryByRole('list')).not.toBeInTheDocument();

    act(() => {
      controller.dispatchToast('reused', { toastId: 'queued', timeout: -1 });
    });
    expect(getByText('reused')).toBeInTheDocument();
  });

  it('restores focus after directly focusing and dismissing the last toast', () => {
    let dispatchToast: ReturnType<typeof useToastController>['dispatchToast'];
    const toasterId = 'direct-focus-toaster';
    const Test = () => {
      dispatchToast = useToastController(toasterId).dispatchToast;
      return (
        <>
          <button>Previous focus</button>
          <Toaster toasterId={toasterId} />
        </>
      );
    };
    const { getByRole, getByText } = render(<Test />);
    const button = getByRole('button');
    button.focus();

    act(() => {
      dispatchToast('toast', { timeout: -1 });
    });
    const toast = getByText('toast');
    toast.focus();
    fireEvent.keyDown(toast, { key: 'Escape' });

    expect(button).toHaveFocus();
  });

  it('does not steal focus if dismissal moves focus elsewhere', () => {
    let dispatchToast: ReturnType<typeof useToastController>['dispatchToast'];
    const toasterId = 'moved-focus-toaster';
    const Test = () => {
      dispatchToast = useToastController(toasterId).dispatchToast;
      return (
        <>
          <button>Previous focus</button>
          <button>Next focus</button>
          <Toaster toasterId={toasterId} />
        </>
      );
    };
    const { getByRole, getByText } = render(<Test />);
    const previous = getByRole('button', { name: 'Previous focus' });
    const next = getByRole('button', { name: 'Next focus' });
    previous.focus();

    act(() => {
      dispatchToast('toast', {
        timeout: -1,
        onStatusChange: (_, data) => {
          if (data.status === 'dismissed') {
            next.focus();
          }
        },
      });
    });
    const toast = getByText('toast');
    toast.focus();
    fireEvent.keyDown(toast, { key: 'Escape' });

    expect(next).toHaveFocus();
  });

  it('pauses on hover by default while respecting per-toast overrides', () => {
    let dispatchToast: ReturnType<typeof useToastController>['dispatchToast'];
    const onDefaultStatus = jest.fn();
    const onOverrideStatus = jest.fn();
    const toasterId = 'hover-defaults-toaster';
    const Test = () => {
      dispatchToast = useToastController(toasterId).dispatchToast;
      return <Toaster toasterId={toasterId} />;
    };
    render(<Test />);

    act(() => {
      dispatchToast('default', { timeout: -1, onStatusChange: onDefaultStatus });
      dispatchToast('override', { timeout: -1, pauseOnHover: false, onStatusChange: onOverrideStatus });
    });

    expect(onDefaultStatus).toHaveBeenCalledWith(null, expect.objectContaining({ pauseOnHover: true }));
    expect(onOverrideStatus).toHaveBeenCalledWith(null, expect.objectContaining({ pauseOnHover: false }));
  });

  it('forwards default toast options to toast state', () => {
    let dispatchToast: ReturnType<typeof useToastController>['dispatchToast'];
    const onStatusChange = jest.fn();
    const toasterId = 'default-options-toaster';
    const Test = () => {
      dispatchToast = useToastController(toasterId).dispatchToast;
      return (
        <Toaster
          toasterId={toasterId}
          position="top"
          timeout={1000}
          pauseOnWindowBlur
          pauseOnHover={false}
          priority={1}
          offset={{ horizontal: 10 }}
        />
      );
    };
    render(<Test />);

    act(() => {
      dispatchToast('toast with defaults', { toastId: 'defaults', onStatusChange });
    });

    expect(onStatusChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        position: 'top',
        timeout: 1000,
        pauseOnWindowBlur: true,
        pauseOnHover: false,
        priority: 1,
      }),
    );
    expect(onStatusChange.mock.calls[0][1]).not.toHaveProperty('offset');
  });
});
