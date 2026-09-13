/**
 * Recipe schema for the DS compiler spike.
 *
 * - Style values are token refs (`$colorBrandBackground`) or allow-listed literals.
 * - Variants are DS-owned → emitted as `data-<prefix>-*` attributes.
 * - States are headless-owned → must match the component manifest's `data-*` attrs.
 */

export type StyleValue = string | number;
export type Style = Record<string, StyleValue>;
export type SlotStyles = Record<string, Style>;

export type PresenceStateStyles = SlotStyles;
export type EnumStateStyles = Record<string, SlotStyles>;
export type RecipeStateMap = Record<string, PresenceStateStyles | EnumStateStyles>;
export type VariantMap = Record<string, Record<string, SlotStyles>>;

export type CompoundVariant = {
  variants?: Record<string, string>;
  /** Presence states use `true`; enum states use the value string. */
  states?: Record<string, true | string>;
  css: SlotStyles;
};

export type InteractionMap = Record<string, Partial<Record<'hover' | 'active' | 'focusVisible' | 'focus', Style>>>;

export type ConditionMap = Partial<{
  forcedColors: SlotStyles;
  reducedMotion: SlotStyles;
  rtl: SlotStyles;
}>;

export type SlotRecipeDefinition = {
  component: string;
  headless: string;
  slots: string[];
  base: SlotStyles;
  variants?: VariantMap;
  defaultVariants?: Record<string, string>;
  states?: RecipeStateMap;
  compoundVariants?: CompoundVariant[];
  interactions?: InteractionMap;
  conditions?: ConditionMap;
  localTokens?: Record<string, string>;
  raw?: Array<{ reason: string; css: string }>;
  source?: string;
};

export type TokenMap = Record<string, string>;

export type PresetDefinition = {
  name: string;
  attrPrefix?: string;
  classPrefix?: string;
  tokens: TokenMap;
  darkTokens?: TokenMap;
};

export type DesignSystemBundle = {
  preset: PresetDefinition;
  recipes: SlotRecipeDefinition[];
};

export function defineTokens(tokens: TokenMap): TokenMap {
  return tokens;
}

export function definePreset(preset: PresetDefinition): PresetDefinition {
  return {
    attrPrefix: `data-${preset.name}-`,
    classPrefix: `${preset.name}-`,
    ...preset,
  };
}

export function defineSlotRecipe(recipe: SlotRecipeDefinition): SlotRecipeDefinition {
  return recipe;
}
