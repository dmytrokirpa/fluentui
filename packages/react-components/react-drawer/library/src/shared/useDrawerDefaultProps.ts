import type { DrawerBaseProps } from './DrawerBase.types';
import type { DrawerSizeProps } from './DrawerSize.types';

export function useDrawerDefaultProps(props: DrawerBaseProps & DrawerSizeProps): {
  size: NonNullable<DrawerSizeProps['size']>;
  position: NonNullable<DrawerBaseProps['position']>;
  open: boolean;
  unmountOnClose: boolean;
} {
  const { open = false, size = 'small', position = 'start', unmountOnClose = true } = props;

  return {
    size,
    position,
    open,
    unmountOnClose,
  };
}
