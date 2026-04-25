import type { DrawerBaseDefaultedProps, DrawerBaseProps } from './DrawerBase.types';

export const useDrawerBase_unstable = (props: DrawerBaseProps): DrawerBaseDefaultedProps => {
  const { open = false, position = 'start', unmountOnClose = true } = props;

  return {
    open,
    position,
    unmountOnClose,
  };
};
