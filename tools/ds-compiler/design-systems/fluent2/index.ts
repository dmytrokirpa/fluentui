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
import { fieldRecipe } from './recipes/field';
import { textareaRecipe } from './recipes/textarea';
import { sliderRecipe } from './recipes/slider';
import { spinnerRecipe } from './recipes/spinner';
import { radioRecipe } from './recipes/radio';
import { radioGroupRecipe } from './recipes/radio-group';

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
    fieldRecipe,
    textareaRecipe,
    sliderRecipe,
    spinnerRecipe,
    radioRecipe,
    radioGroupRecipe,
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
  fieldRecipe,
  textareaRecipe,
  sliderRecipe,
  spinnerRecipe,
  radioRecipe,
  radioGroupRecipe,
};
