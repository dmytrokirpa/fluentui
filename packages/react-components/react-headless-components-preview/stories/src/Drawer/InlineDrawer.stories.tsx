import * as React from 'react';
import {
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  InlineDrawer,
} from '@fluentui/react-headless-components-preview/drawer';

const buttonClassName = 'rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100';

export const Inline = (): React.ReactNode => {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="flex h-[420px] overflow-hidden rounded border border-zinc-200 bg-white text-zinc-900">
      <InlineDrawer
        open={open}
        separator
        className="w-72 shrink-0 overflow-hidden border-r border-zinc-200 bg-zinc-50 opacity-100 transition-[width,opacity,transform,border-color] duration-200 ease-linear data-[open=false]:w-0 data-[open=false]:-translate-x-2 data-[open=false]:border-r-transparent data-[open=false]:opacity-0"
      >
        <DrawerHeader className="border-b border-zinc-200 px-4 py-3">
          <DrawerHeaderTitle
            action={
              <button
                type="button"
                aria-label="Close drawer"
                className={buttonClassName}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            }
            className="flex items-start justify-between gap-3"
            heading={{ className: 'm-0 text-lg font-semibold' }}
          >
            Inline drawer
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-3 px-4 py-3 text-sm text-zinc-700">
          <p className="m-0">Inline drawers sit next to the main surface and do not create dialog semantics.</p>
          <button type="button" className={buttonClassName}>
            Drawer action
          </button>
        </DrawerBody>
      </InlineDrawer>

      <main className="flex flex-1 items-start flex-col gap-3 p-4">
        <button type="button" className={buttonClassName} onClick={() => setOpen(value => !value)}>
          {open ? 'Hide inline drawer' : 'Show inline drawer'}
        </button>
        <p className="m-0 text-sm text-zinc-700">
          The main content remains available while an inline drawer is visible.
        </p>
      </main>
    </div>
  );
};
