import type { HeadlessManifest } from './manifest';
import type { PresetDefinition, SlotRecipeDefinition } from './schema';

export type CompiledRecipe = {
  preset: PresetDefinition;
  recipe: SlotRecipeDefinition;
  manifest: HeadlessManifest;
  classNames: Record<string, string>;
  variantAttrs: Record<string, string>;
  rootClass: string;
};

export function camelToKebab(value: string): string {
  return value.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
}

export function compileRecipe(
  recipe: SlotRecipeDefinition,
  preset: PresetDefinition,
  manifest: HeadlessManifest,
): CompiledRecipe {
  const classPrefix = preset.classPrefix ?? `${preset.name}-`;
  const attrPrefix = preset.attrPrefix ?? `data-${preset.name}-`;

  const classNames: Record<string, string> = {};
  for (const slot of recipe.slots) {
    classNames[slot] =
      slot === 'root' ? `${classPrefix}${recipe.component}` : `${classPrefix}${recipe.component}__${slot}`;
  }

  const variantAttrs: Record<string, string> = {};
  for (const axis of Object.keys(recipe.variants ?? {})) {
    variantAttrs[axis] = `${attrPrefix}${camelToKebab(axis)}`;
  }

  return { preset, recipe, manifest, classNames, variantAttrs, rootClass: classNames.root };
}
