import type { DesignSystemBundle } from '../../src/schema';
import { fluent2Preset } from './preset';
import { buttonRecipe } from './recipes/button';

export const fluent2: DesignSystemBundle = {
  preset: fluent2Preset,
  recipes: [buttonRecipe],
};

export { fluent2Preset, buttonRecipe };
