export type DrawerSize = 'small' | 'medium' | 'large' | 'full';

export type DrawerSizeProps = {
  /**
   * Size of the drawer.
   *
   * - 'small' - Drawer is 320px wide.
   * - 'medium' - Drawer is 592px wide.
   * - 'large' - Drawer is 940px wide.
   * - 'full' - Drawer is 100vw wide.
   *
   * @default 'small'
   */
  size?: DrawerSize;
};
