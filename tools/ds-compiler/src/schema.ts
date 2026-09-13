/**
 * Recipe schema for the DS compiler spike.
 *
 * - Style values are token refs (`$colorBrandBackground`) or allow-listed literals.
 * - Variants are DS-owned → emitted as `data-<prefix>-*` attributes.
 * - States are headless-owned → must match the component manifest's `data-*` attrs.
 * - Nested condition keys (`_hover`, `_forcedColors`, …) use Panda CSS syntax and
 *   may appear anywhere a Style object is accepted.
 */

export type StyleValue = string | number;

/**
 * CSS property bag that may nest condition selectors.
 *
 * @example
 * ```ts
 * {
 *   backgroundColor: '$colorBrandBackground',
 *   _hover: { backgroundColor: '$colorBrandBackgroundHover' },
 *   _forcedColors: { backgroundColor: 'Highlight' },
 * }
 * ```
 */
export type Style = {
  [property: string]: StyleValue | Style | undefined;
};

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

/**
 * Built-in nested condition keys (Panda CSS `_` prefix convention).
 * May nest arbitrarily, e.g. `_forcedColors: { _hover: { … } }`.
 */
export const CONDITION_KEYS = [
  '_hover',
  '_active',
  '_focus',
  '_focusVisible',
  '_focusWithin',
  '_forcedColors',
  '_reducedMotion',
  '_rtl',
] as const;

export type ConditionKey = (typeof CONDITION_KEYS)[number];

export function isConditionKey(key: string): key is ConditionKey {
  return (CONDITION_KEYS as readonly string[]).includes(key);
}

/**
 * @deprecated Prefer nesting `_hover` / `_active` / `_focusVisible` inside Style
 * objects (Panda syntax). Kept for recipes that still use the flat form.
 */
export type InteractionMap = Record<string, Partial<Record<'hover' | 'active' | 'focusVisible' | 'focus', Style>>>;

/**
 * @deprecated Prefer nesting `_forcedColors` / `_reducedMotion` / `_rtl` inside
 * Style objects. Kept for recipes that still use the flat form.
 */
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
  /** @deprecated Prefer nested `_hover` etc. inside Style objects. */
  interactions?: InteractionMap;
  /** @deprecated Prefer nested `_forcedColors` etc. inside Style objects. */
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
