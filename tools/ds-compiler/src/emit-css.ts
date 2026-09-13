import type { CompiledRecipe } from './compile';
import { camelToKebab } from './compile';
import { isConditionKey, type ConditionKey, type SlotStyles, type Style, type StyleValue } from './schema';

function resolveValue(value: StyleValue): string {
  if (typeof value === 'number') return String(value);
  // Replace every $tokenName reference inside the value (supports shorthands).
  return value.replace(/\$([A-Za-z][A-Za-z0-9]*)/g, 'var(--$1)');
}

function cssProp(prop: string): string {
  // Custom properties must keep their exact spelling (e.g. --fui-Checkbox__indicator--color).
  return prop.startsWith('--') ? prop : camelToKebab(prop);
}

function decls(style: Record<string, StyleValue>, indent: string): string {
  return Object.entries(style)
    .map(([prop, value]) => `${indent}${cssProp(prop)}: ${resolveValue(value)};`)
    .join('\n');
}

/**
 * Maps Panda-style `_condition` keys to selector / media transforms.
 *
 * Hover/active automatically exclude disabled headless states so recipes don't
 * need to repeat `:not([data-disabled])` everywhere.
 */
type ConditionTransform =
  | { kind: 'pseudo'; pseudo: string; guard?: string }
  | { kind: 'groupPseudo'; pseudo: string; guard?: string }
  | { kind: 'media'; query: string }
  | { kind: 'wrap'; wrap: (selector: string) => string };

const CONDITIONS: Record<ConditionKey, ConditionTransform> = {
  _hover: {
    kind: 'pseudo',
    pseudo: ':hover',
    guard: ':not([data-disabled]):not([data-disabled-focusable])',
  },
  _active: {
    kind: 'pseudo',
    pseudo: ':active',
    guard: ':not([data-disabled]):not([data-disabled-focusable])',
  },
  _focus: { kind: 'pseudo', pseudo: ':focus' },
  _focusVisible: { kind: 'pseudo', pseudo: ':focus-visible' },
  _focusWithin: { kind: 'pseudo', pseudo: ':focus-within' },
  _groupHover: {
    kind: 'groupPseudo',
    pseudo: ':hover',
    guard: ':not([data-disabled]):not([data-disabled-focusable])',
  },
  _groupActive: {
    kind: 'groupPseudo',
    pseudo: ':active',
    guard: ':not([data-disabled]):not([data-disabled-focusable])',
  },
  _groupFocusVisible: { kind: 'groupPseudo', pseudo: ':focus-visible' },
  _after: { kind: 'pseudo', pseudo: '::after' },
  _before: { kind: 'pseudo', pseudo: '::before' },
  _child: { kind: 'wrap', wrap: selector => `${selector} > *` },
  _forcedColors: { kind: 'media', query: '(forced-colors: active)' },
  _reducedMotion: { kind: 'media', query: '(prefers-reduced-motion: reduce)' },
  _rtl: {
    kind: 'wrap',
    wrap: selector => `[dir="rtl"] ${selector}, ${selector}[dir="rtl"]`,
  },
};

/**
 * Apply a pseudo to the root segment of a selector.
 * `.fui-MenuItem .fui-MenuItem__icon` + `:hover` → `.fui-MenuItem:hover .fui-MenuItem__icon`
 * On the root itself, behaves like a normal pseudo.
 */

/** Skip disabled guards when the selector already targets a disabled state. */
function effectiveDisabledGuard(selector: string, guard?: string): string {
  if (!guard) return '';
  if (selector.includes('[data-disabled]') || selector.includes('[data-disabled-focusable]')) {
    return '';
  }
  return guard;
}

function applyGroupPseudo(selector: string, pseudo: string, guard?: string): string {
  const g = effectiveDisabledGuard(selector, guard);
  const space = selector.indexOf(' ');
  if (space === -1) {
    return `${selector}${g}${pseudo}`;
  }
  const root = selector.slice(0, space);
  const rest = selector.slice(space + 1);
  return `${root}${g}${pseudo} ${rest}`;
}

type FlatRule = {
  selector: string;
  /** Media query expression without `@media`, if any. */
  media?: string;
  declarations: Record<string, StyleValue>;
};

/**
 * Flatten a Style that may contain nested `_condition` keys into a list of
 * concrete CSS rules. Conditions may nest arbitrarily
 * (e.g. `_forcedColors: { _hover: { … } }`).
 */
function flattenStyle(style: Style, selector: string, media: string | undefined, out: FlatRule[]): void {
  const declarations: Record<string, StyleValue> = {};
  const nested: Array<[ConditionKey, Style]> = [];

  for (const [key, value] of Object.entries(style)) {
    if (value === undefined) continue;

    if (isConditionKey(key)) {
      nested.push([key, value as Style]);
      continue;
    }

    if (typeof value === 'object') {
      // Should have been rejected by validate; skip defensively.
      continue;
    }

    declarations[key] = value;
  }

  // Emit the base declarations first so nested conditions cascade after.
  if (Object.keys(declarations).length > 0) {
    out.push({ selector, media, declarations });
  }

  for (const [key, nestedStyle] of nested) {
    const transform = CONDITIONS[key];
    if (transform.kind === 'pseudo') {
      const nextSelector = `${selector}${effectiveDisabledGuard(selector, transform.guard)}${transform.pseudo}`;
      flattenStyle(nestedStyle, nextSelector, media, out);
    } else if (transform.kind === 'groupPseudo') {
      const nextSelector = applyGroupPseudo(selector, transform.pseudo, transform.guard);
      flattenStyle(nestedStyle, nextSelector, media, out);
    } else if (transform.kind === 'media') {
      const nextMedia = media ? `${media} and ${transform.query}` : transform.query;
      flattenStyle(nestedStyle, selector, nextMedia, out);
    } else {
      flattenStyle(nestedStyle, transform.wrap(selector), media, out);
    }
  }
}

function emitFlatRules(rules: FlatRule[], indent: string): string {
  // Group by media so we emit one @media block per query.
  const noMedia: FlatRule[] = [];
  const byMedia = new Map<string, FlatRule[]>();
  for (const rule of rules) {
    if (!rule.media) {
      noMedia.push(rule);
    } else {
      const list = byMedia.get(rule.media) ?? [];
      list.push(rule);
      byMedia.set(rule.media, list);
    }
  }

  const blocks: string[] = [];
  for (const rule of noMedia) {
    blocks.push(`${indent}${rule.selector} {\n${decls(rule.declarations, indent + '  ')}\n${indent}}`);
  }
  for (const [query, mediaRules] of byMedia) {
    const inner = mediaRules
      .map(rule => `${indent}  ${rule.selector} {\n${decls(rule.declarations, indent + '    ')}\n${indent}  }`)
      .join('\n\n');
    blocks.push(`${indent}@media ${query} {\n${inner}\n${indent}}`);
  }
  return blocks.join('\n\n');
}

function emitSlots(compiled: CompiledRecipe, slotStyles: SlotStyles, rootSelector: string, indent = ''): string {
  const rules: FlatRule[] = [];
  for (const [slot, style] of Object.entries(slotStyles)) {
    const selector = slot === 'root' ? rootSelector : `${rootSelector} .${compiled.classNames[slot]}`;
    flattenStyle(style, selector, undefined, rules);
  }
  return emitFlatRules(rules, indent);
}

/** @deprecated flat interaction map — prefer nested `_hover` etc. */
const PSEUDO: Record<string, string> = {
  hover: 'hover',
  active: 'active',
  focusVisible: 'focus-visible',
  focus: 'focus',
};

function enumAttrSelector(desc: { attr: string; attrValues?: Record<string, string> }, enumValue: string): string {
  const attrValue = desc.attrValues?.[enumValue] ?? enumValue;
  return `[${desc.attr}="${attrValue}"]`;
}

export function emitCss(compiled: CompiledRecipe): string {
  const { recipe, manifest, variantAttrs, rootClass } = compiled;
  const root = `.${rootClass}`;
  const out: string[] = [];

  out.push('/* Generated by @fluentui/ds-compiler — do not edit by hand */');
  out.push('@layer ds.base, ds.variants, ds.states, ds.compound, ds.interactions, ds.conditions, ds.raw;');
  out.push('');

  // base
  out.push('@layer ds.base {');
  if (recipe.localTokens && Object.keys(recipe.localTokens).length) {
    out.push(`  ${root} {`);
    for (const [name, value] of Object.entries(recipe.localTokens)) {
      out.push(`    ${name}: ${resolveValue(value)};`);
    }
    out.push('  }');
    out.push('');
  }
  out.push(emitSlots(compiled, recipe.base, root, '  '));
  out.push('}');
  out.push('');

  // variants (nested _hover / _active etc. expand here)
  if (recipe.variants) {
    out.push('@layer ds.variants {');
    const blocks: string[] = [];
    for (const [axis, values] of Object.entries(recipe.variants)) {
      for (const [valueName, slotStyles] of Object.entries(values)) {
        blocks.push(emitSlots(compiled, slotStyles, `${root}[${variantAttrs[axis]}="${valueName}"]`));
      }
    }
    out.push(
      blocks
        .filter(Boolean)
        .join('\n\n')
        .split('\n')
        .map(l => (l ? `  ${l}` : l))
        .join('\n'),
    );
    out.push('}');
    out.push('');
  }

  // states
  if (recipe.states) {
    out.push('@layer ds.states {');
    const blocks: string[] = [];
    for (const [stateName, stateStyles] of Object.entries(recipe.states)) {
      const desc = manifest.states[stateName];
      if (!desc) continue;
      if (desc.kind === 'presence') {
        blocks.push(emitSlots(compiled, stateStyles as SlotStyles, `${root}[${desc.attr}]`));
      } else {
        for (const [enumValue, slotStyles] of Object.entries(stateStyles as Record<string, SlotStyles>)) {
          blocks.push(emitSlots(compiled, slotStyles, `${root}${enumAttrSelector(desc, enumValue)}`));
        }
      }
    }
    out.push(
      blocks
        .filter(Boolean)
        .join('\n\n')
        .split('\n')
        .map(l => (l ? `  ${l}` : l))
        .join('\n'),
    );
    out.push('}');
    out.push('');
  }

  // compound
  if (recipe.compoundVariants?.length) {
    out.push('@layer ds.compound {');
    const blocks: string[] = [];
    for (const cv of recipe.compoundVariants) {
      let selector = root;
      if (cv.variants) {
        for (const [axis, value] of Object.entries(cv.variants)) {
          selector += `[${variantAttrs[axis]}="${value}"]`;
        }
      }
      if (cv.states) {
        for (const [stateName, value] of Object.entries(cv.states)) {
          const desc = manifest.states[stateName];
          if (!desc) continue;
          selector += desc.kind === 'presence' ? `[${desc.attr}]` : enumAttrSelector(desc, String(value));
        }
      }
      blocks.push(emitSlots(compiled, cv.css, selector));
    }
    out.push(
      blocks
        .filter(Boolean)
        .join('\n\n')
        .split('\n')
        .map(l => (l ? `  ${l}` : l))
        .join('\n'),
    );
    out.push('}');
    out.push('');
  }

  // legacy flat interactions (prefer nested _hover on Style)
  if (recipe.interactions) {
    out.push('@layer ds.interactions {');
    const blocks: string[] = [];
    for (const [slot, map] of Object.entries(recipe.interactions)) {
      for (const [pseudo, style] of Object.entries(map)) {
        if (!style) continue;
        const base = slot === 'root' ? root : `${root} .${compiled.classNames[slot]}`;
        const guard =
          pseudo === 'hover' || pseudo === 'active' ? ':not([data-disabled]):not([data-disabled-focusable])' : '';
        const selector = `${base}${guard}:${PSEUDO[pseudo] ?? pseudo}`;
        // Flatten in case someone nests conditions inside a legacy interaction style.
        const rules: FlatRule[] = [];
        flattenStyle(style, selector, undefined, rules);
        blocks.push(emitFlatRules(rules, ''));
      }
    }
    out.push(
      blocks
        .filter(Boolean)
        .join('\n\n')
        .split('\n')
        .map(l => (l ? `  ${l}` : l))
        .join('\n'),
    );
    out.push('}');
    out.push('');
  }

  // legacy flat conditions (prefer nested _forcedColors on Style)
  if (recipe.conditions) {
    out.push('@layer ds.conditions {');
    if (recipe.conditions.forcedColors) {
      out.push('  @media (forced-colors: active) {');
      out.push(emitSlots(compiled, recipe.conditions.forcedColors, root, '    '));
      out.push('  }');
    }
    if (recipe.conditions.reducedMotion) {
      out.push('  @media (prefers-reduced-motion: reduce) {');
      out.push(emitSlots(compiled, recipe.conditions.reducedMotion, root, '    '));
      out.push('  }');
    }
    if (recipe.conditions.rtl) {
      for (const [slot, style] of Object.entries(recipe.conditions.rtl)) {
        const sel =
          slot === 'root'
            ? `[dir="rtl"] ${root}, ${root}[dir="rtl"]`
            : `[dir="rtl"] ${root} .${compiled.classNames[slot]}`;
        const rules: FlatRule[] = [];
        flattenStyle(style, sel, undefined, rules);
        out.push(emitFlatRules(rules, '  '));
      }
    }
    out.push('}');
    out.push('');
  }

  // raw escape hatch
  if (recipe.raw?.length) {
    out.push('@layer ds.raw {');
    for (const block of recipe.raw) {
      out.push(`  /* raw: ${block.reason} */`);
      out.push(
        block.css
          .split('\n')
          .map(l => (l ? `  ${l}` : l))
          .join('\n'),
      );
    }
    out.push('}');
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

export function emitThemeCss(preset: CompiledRecipe['preset']): string {
  const out: string[] = [];
  out.push('/* Generated by @fluentui/ds-compiler — design tokens as CSS variables */');
  out.push(':root {');
  for (const [name, value] of Object.entries(preset.tokens)) {
    out.push(`  --${name}: ${value};`);
  }
  out.push('}');
  out.push('');
  if (preset.darkTokens && Object.keys(preset.darkTokens).length) {
    out.push(':root[data-theme="dark"], [data-theme="dark"] {');
    for (const [name, value] of Object.entries(preset.darkTokens)) {
      out.push(`  --${name}: ${value};`);
    }
    out.push('}');
    out.push('');
  }
  return out.join('\n');
}
