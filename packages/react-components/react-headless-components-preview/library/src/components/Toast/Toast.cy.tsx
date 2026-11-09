import * as React from 'react';
import { mount as mountBase } from '@fluentui/scripts-cypress';
import { polyfillBodyAndObserve } from '@microsoft/focusgroup-polyfill';
import type { JSXElement } from '@fluentui/react-utilities';

import { Toaster, Toast, ToastTitle, useToastController } from '.';
import { Provider } from '../Provider';

/**
 * Selectors used by the headless tests. Unlike the styled v9 layer, the headless
 * Toast does not emit Griffel class names — we target structural roles and the
 * structural roles on the headless `ToastContainer` root.
 */
const TOAST_CONTAINER = '[role="listitem"]';

polyfillBodyAndObserve();

const mount = (element: JSXElement) =>
  mountBase(
    <Provider>
      <div style={{ marginTop: 160 }}>{element}</div>
    </Provider>,
    {
      strict: false,
    },
  );

describe('Toast (headless)', () => {
  it('should dispatch toast', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const onClick = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
        );

      return (
        <>
          <button onClick={onClick}>Make toast</button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('button').click().get(TOAST_CONTAINER).should('exist');
  });

  it('should dismiss toast', () => {
    const Example = () => {
      const toastId = 'foo';
      const { dispatchToast, dismissToast } = useToastController();
      const makeToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { toastId, timeout: -1 },
        );
      const removeToast = () => dismissToast(toastId);

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="dismiss" onClick={removeToast}>
            Dismiss toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().get(TOAST_CONTAINER).should('exist');
    cy.get('#dismiss').click().get(TOAST_CONTAINER).should('not.exist');
  });

  it('should dismiss all toasts', () => {
    const Example = () => {
      const { dispatchToast, dismissAllToasts } = useToastController();
      const makeToast = () => {
        for (let i = 0; i < 5; i++) {
          dispatchToast(
            <Toast>
              <ToastTitle>This is a toast</ToastTitle>
            </Toast>,
            { timeout: -1 },
          );
        }
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="dismiss" onClick={dismissAllToasts}>
            Dismiss toasts
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().get(TOAST_CONTAINER).should('have.length', 5);
    cy.get('#dismiss').click().get(TOAST_CONTAINER).should('not.exist');
  });

  it('should play and pause toast', () => {
    const Example = () => {
      const toastId = 'foo';
      const { dispatchToast, playToast, pauseToast } = useToastController();
      const makeToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { toastId, timeout: 3000 },
        );

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="pause" onClick={() => pauseToast(toastId)}>
            Pause
          </button>
          <button id="play" onClick={() => playToast(toastId)}>
            Play
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().get(TOAST_CONTAINER).should('exist');
    cy.get('#pause').click().wait(1000).get(TOAST_CONTAINER).should('exist');
    cy.get('#play').click().get(TOAST_CONTAINER).should('not.exist');
  });

  it('should update toast content', () => {
    const Example = () => {
      const toastId = 'foo';
      const { dispatchToast, updateToast } = useToastController();
      const makeToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: -1, toastId },
        );
      const update = () =>
        updateToast({
          content: (
            <Toast>
              <ToastTitle>Foo</ToastTitle>
            </Toast>
          ),
          toastId,
        });

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="update" onClick={update}>
            Update toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().get(TOAST_CONTAINER).should('exist');
    cy.get('#update').click().get('body').contains('Foo');
  });

  it('should pause auto-dismiss on hover', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 3000 },
        );

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click();
    cy.wait(1000);
    cy.get(TOAST_CONTAINER).realHover().wait(3200).should('exist');
    cy.get('#make').realHover().wait(500);
    cy.get(TOAST_CONTAINER).should('exist');
    cy.get(TOAST_CONTAINER, { timeout: 2100 }).should('not.exist');
  });

  it('should respect toaster and per-toast hover pause overrides', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeDefault = () => dispatchToast(<Toast>Default</Toast>, { timeout: 1200, root: { id: 'default' } });
      const makeOverride = () =>
        dispatchToast(<Toast>Override</Toast>, {
          timeout: 1200,
          pauseOnHover: true,
          root: { id: 'override' },
        });

      return (
        <>
          <button id="make-default" onClick={makeDefault}>
            Make default
          </button>
          <button id="make-override" onClick={makeOverride}>
            Make override
          </button>
          <Toaster pauseOnHover={false} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make-default').click();
    cy.get('#default').realHover().wait(1500);
    cy.get('#default').should('not.exist');
    cy.get('#make-override').click();
    cy.get('#override').realHover().wait(1500).should('exist');
    cy.get('#make-default').realHover();
    cy.get('#override').should('not.exist');
  });

  it('should preserve remaining auto-dismiss time while the toaster is focused', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => dispatchToast(<Toast>Toast</Toast>, { timeout: 3000 });

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().wait(1000);
    cy.get(TOAST_CONTAINER).focus();
    cy.get('#make').realHover().wait(3200);
    cy.get(TOAST_CONTAINER).should('exist');
    cy.get('#make').focus().wait(500);
    cy.get(TOAST_CONTAINER).should('exist');
    cy.get(TOAST_CONTAINER, { timeout: 2100 }).should('not.exist');
  });

  it('should pause all toasts while focus is in the toaster', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 500 },
        );
        dispatchToast(
          <Toast>
            <ToastTitle>This is another toast</ToastTitle>
          </Toast>,
          { timeout: 500 },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().get(TOAST_CONTAINER).first().focus().wait(700);
    cy.get(TOAST_CONTAINER).should('have.length', 2);
    cy.get('#make').focus().realHover().wait(700);
    cy.get(TOAST_CONTAINER).should('not.exist');
  });

  it('should keep toasts dispatched while focus is in the toaster paused', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const dispatchSecondToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is another toast</ToastTitle>
          </Toast>,
          { timeout: 500 },
        );
      const dispatchFirstToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
            <button id="dispatch-second" onClick={dispatchSecondToast}>
              Dispatch another toast
            </button>
          </Toast>,
          { timeout: 500 },
        );

      return (
        <>
          <button id="make" onClick={dispatchFirstToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click();
    cy.get(TOAST_CONTAINER).focus();
    cy.get('#dispatch-second').realClick().wait(700);
    cy.get(TOAST_CONTAINER).should('have.length', 2);
    cy.get('#make').focus().realHover().wait(700);
    cy.get(TOAST_CONTAINER).should('not.exist');
  });

  it('should keep a toast paused on hover after focus leaves the toaster', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 1000, pauseOnHover: true },
        );

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click();
    cy.get(TOAST_CONTAINER)
      .realHover()
      .then(toast => toast[0].focus());
    cy.get('#make')
      .then(button => button[0].focus())
      .wait(1200);
    cy.get(TOAST_CONTAINER).should('exist');
    cy.get('#make').realHover().wait(1200);
    cy.get(TOAST_CONTAINER).should('not.exist');
  });

  it('should move focus between toasts with ArrowDown', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>First toast</ToastTitle>
          </Toast>,
          { timeout: -1 },
        );
        dispatchToast(
          <Toast>
            <ToastTitle>Second toast</ToastTitle>
          </Toast>,
          { timeout: -1 },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click();
    cy.get(TOAST_CONTAINER).first().focus().realPress('ArrowDown');
    cy.get(TOAST_CONTAINER).eq(1).should('be.focused');
  });

  it('should follow lifecycle', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const [log, setLog] = React.useState<string[]>([]);
      const makeToast = () =>
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 500, onStatusChange: (_, data) => setLog(s => [...s, data.status]) },
        );

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <ul>
            {log.map((msg, i) => (
              <li key={`${msg}-${i}`}>{msg}</li>
            ))}
          </ul>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').realClick();
    cy.get('li').should('have.length.at.least', 3);
    cy.get('li').eq(0).should('have.text', 'queued');
    cy.get('li').eq(1).should('have.text', 'visible');
    cy.get('li').last().should('have.text', 'unmounted');
  });

  it('should focus most recent toast with shortcut', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: -1 },
        );
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: -1, root: { id: 'most-recent' } },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster shortcuts={{ focus: e => e.ctrlKey && e.key === 'm' }} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().get('#most-recent').should('exist');
    cy.get('body').type('{ctrl+m}');
    cy.get('#most-recent').should('be.focused');
  });

  it('should dismiss toast with Delete and restore focus to the next visible toast', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: -1 },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster shortcuts={{ focus: e => e.ctrlKey && e.key === 'm' }} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().click().click();
    cy.get(TOAST_CONTAINER).should('have.length', 3);
    cy.get('body').type('{ctrl+m}');
    cy.focused().should('have.attr', 'role', 'listitem').realPress('Delete');
    cy.get(TOAST_CONTAINER).should('have.length', 2);
    cy.focused().should('have.attr', 'role', 'listitem').realPress('Delete');
    cy.get(TOAST_CONTAINER).should('have.length', 1);
    cy.focused().should('have.attr', 'role', 'listitem').realPress('Delete');
    cy.get(TOAST_CONTAINER).should('not.exist');
    cy.get('#make').should('be.focused');
  });

  it('should dismiss only the focused toast with Escape and restore direct focus', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: -1 },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().click().click();
    cy.get(TOAST_CONTAINER).should('have.length', 3);
    cy.get(TOAST_CONTAINER).last().focus();
    cy.focused().should('have.attr', 'role', 'listitem').realPress('Escape');
    cy.get(TOAST_CONTAINER).should('have.length', 2);
    cy.focused().should('have.attr', 'role', 'listitem').realPress('Escape');
    cy.get(TOAST_CONTAINER).should('have.length', 1);
    cy.focused().should('have.attr', 'role', 'listitem').realPress('Escape');
    cy.get(TOAST_CONTAINER).should('not.exist');
    cy.get('#make').should('be.focused');
  });

  it('should respect prevented Escape and not propagate a handled Escape to an ancestor', () => {
    const outerKeyDown = cy.stub().as('outerKeyDown');
    const toasterKeyDown = cy.stub().as('toasterKeyDown');
    const toastKeyDown = cy.stub().as('toastKeyDown');
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(<Toast>Protected</Toast>, {
          timeout: -1,
          root: {
            id: 'protected',
            onKeyDown: event => {
              toastKeyDown();
              event.preventDefault();
            },
          },
        });
        dispatchToast(<Toast>Dismissible</Toast>, { timeout: -1, root: { id: 'dismissible' } });
      };

      return (
        <div onKeyDown={outerKeyDown}>
          <button id="make" onClick={makeToast}>
            Make toasts
          </button>
          <Toaster onKeyDown={toasterKeyDown} />
        </div>
      );
    };

    mount(<Example />);
    cy.get('#make').click();
    cy.get('#protected').focus().realPress('Escape');
    cy.get('@toastKeyDown').should('have.been.calledOnce');
    cy.get('@toasterKeyDown').should('have.been.calledOnce');
    cy.get('#protected').should('exist');
    cy.get('@outerKeyDown').should('not.have.been.called');
    cy.get('#dismissible').focus().realPress('Escape');
    cy.get('#dismissible').should('not.exist');
    cy.get('#protected').should('exist');
    cy.get('@toasterKeyDown').should('have.been.calledTwice');
    cy.get('@outerKeyDown').should('not.have.been.called');
  });

  it('should start a queued toast timer only when it becomes visible', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(<Toast>First</Toast>, { timeout: -1, root: { id: 'first' } });
        dispatchToast(<Toast>Queued</Toast>, { timeout: 1200, root: { id: 'queued' } });
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toasts
          </button>
          <Toaster limit={1} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().wait(1500);
    cy.get('#queued').should('not.exist');
    cy.get('#first').focus().realPress('Escape');
    cy.get('#queued').should('be.focused');
    cy.get('#make').focus();
    cy.wait(300);
    cy.get('#queued').should('exist');
    cy.get('#queued').should('not.exist');
  });
});
