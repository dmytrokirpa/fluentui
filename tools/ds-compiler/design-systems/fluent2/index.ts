import type { DesignSystemBundle } from '../../src/schema';
import { fluent2Preset } from './preset';
import { buttonRecipe } from './recipes/button';
import { checkboxRecipe } from './recipes/checkbox';
import { menuPopoverRecipe } from './recipes/menu-popover';
import { menuItemRecipe } from './recipes/menu-item';
import { menuDividerRecipe } from './recipes/menu-divider';
import { menuGroupHeaderRecipe } from './recipes/menu-group-header';

export const fluent2: DesignSystemBundle = {
  preset: fluent2Preset,
  recipes: [buttonRecipe, checkboxRecipe, menuPopoverRecipe, menuItemRecipe, menuDividerRecipe, menuGroupHeaderRecipe],
};

export {
  fluent2Preset,
  buttonRecipe,
  checkboxRecipe,
  menuPopoverRecipe,
  menuItemRecipe,
  menuDividerRecipe,
  menuGroupHeaderRecipe,
};
