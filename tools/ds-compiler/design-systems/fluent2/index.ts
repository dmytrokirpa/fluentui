import type { DesignSystemBundle } from '../../src/schema';
import { fluent2Preset } from './preset';
import { buttonRecipe } from './recipes/button';
import { checkboxRecipe } from './recipes/checkbox';
import { menuPopoverRecipe } from './recipes/menu-popover';
import { menuItemRecipe } from './recipes/menu-item';
import { menuItemCheckboxRecipe } from './recipes/menu-item-checkbox';
import { menuItemRadioRecipe } from './recipes/menu-item-radio';
import { menuDividerRecipe } from './recipes/menu-divider';
import { menuGroupHeaderRecipe } from './recipes/menu-group-header';
import { labelRecipe } from './recipes/label';
import { linkRecipe } from './recipes/link';
import { toggleButtonRecipe } from './recipes/toggle-button';
import { switchRecipe } from './recipes/switch';
import { inputRecipe } from './recipes/input';

export const fluent2: DesignSystemBundle = {
  preset: fluent2Preset,
  recipes: [
    buttonRecipe,
    checkboxRecipe,
    menuPopoverRecipe,
    menuItemRecipe,
    menuItemCheckboxRecipe,
    menuItemRadioRecipe,
    menuDividerRecipe,
    menuGroupHeaderRecipe,
    labelRecipe,
    linkRecipe,
    toggleButtonRecipe,
    switchRecipe,
    inputRecipe,
  ],
};

export {
  fluent2Preset,
  buttonRecipe,
  checkboxRecipe,
  menuPopoverRecipe,
  menuItemRecipe,
  menuItemCheckboxRecipe,
  menuItemRadioRecipe,
  menuDividerRecipe,
  menuGroupHeaderRecipe,
  labelRecipe,
  linkRecipe,
  toggleButtonRecipe,
  switchRecipe,
  inputRecipe,
};
