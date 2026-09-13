import type { HeadlessManifest } from './manifest';
import type { PresetDefinition, SlotRecipeDefinition, SlotStyles, Style, StyleValue } from './schema';
import { isConditionKey } from './schema';

export type ValidationIssue = { level: 'error' | 'warning'; path: string; message: string };

const LITERALS = new Set([
  'auto',
  'none',
  'inherit',
  'initial',
  'unset',
  'revert',
  'transparent',
  'currentColor',
  'solid',
  'relative',
  'absolute',
  'fixed',
  'sticky',
  'flex',
  'inline-flex',
  'block',
  'inline-block',
  'grid',
  'inline-grid',
  'row',
  'column',
  'wrap',
  'nowrap',
  'center',
  'stretch',
  'baseline',
  'pointer',
  'default',
  'not-allowed',
  'hidden',
  'visible',
  'ellipsis',
  'border-box',
  'content-box',
  'middle',
  'underline',
  'italic',
  'normal',
  'bold',
  'bolder',
  'lighter',
  'collapse',
  'separate',
  'start',
  'end',
  'flex-start',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
  'ButtonText',
  'ButtonFace',
  'Highlight',
  'HighlightText',
  'GrayText',
  'Canvas',
  'CanvasText',
  'LinkText',
  'FieldText',
  'Field',
  'fit-content',
  'max-content',
  'min-content',
]);

const TOKEN_REF = /^\$[A-Za-z][A-Za-z0-9]*$/;
const LOCAL_VAR = /^var\(--[A-Za-z][A-Za-z0-9_-]*\)$/;
const LENGTH = /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|svh|svw|ms|s|deg|fr)?$/;
/** Comma/space-separated CSS ident lists (e.g. transition-property). */
const IDENT_LIST = /^[A-Za-z][A-Za-z0-9-]*(\s*,\s*[A-Za-z][A-Za-z0-9-]*)*$/;

function isAllowed(value: StyleValue): boolean {
  if (typeof value === 'number') return true;
  if (TOKEN_REF.test(value) || LOCAL_VAR.test(value) || LITERALS.has(value) || LENGTH.test(value)) return true;
  if (IDENT_LIST.test(value)) return true;
  // Multipart values: "$strokeWidthThin solid $colorNeutralStroke1", calc(...), etc.
  if (value.startsWith('calc(') || value.includes(' ') || value.includes(',')) {
    let stripped = value.replace(/\$[A-Za-z][A-Za-z0-9]*/g, '0').replace(/var\(--[A-Za-z][A-Za-z0-9_-]*\)/g, '0');
    // Remove allow-listed keywords used inside shorthand values (e.g. "solid")
    for (const lit of LITERALS) {
      stripped = stripped.replace(new RegExp(`\\b${lit}\\b`, 'g'), '0');
    }
    stripped = stripped
      .replace(/calc|min|max|clamp/g, '')
      .replace(/[0-9.+*/(),%\s-]/g, '')
      .replace(/px|rem|em|vh|vw|ms|s|deg|fr|inset/g, '');
    return stripped.length === 0;
  }
  return false;
}

function walkStyle(styles: Style, path: string, issues: ValidationIssue[]) {
  for (const [prop, value] of Object.entries(styles)) {
    if (value === undefined) continue;
    if (isConditionKey(prop)) {
      if (!value || typeof value !== 'object') {
        issues.push({
          level: 'error',
          path: `${path}.${prop}`,
          message: `Condition "${prop}" must be a nested Style object`,
        });
        continue;
      }
      walkStyle(value as Style, `${path}.${prop}`, issues);
      continue;
    }
    if (prop.startsWith('_')) {
      issues.push({
        level: 'error',
        path: `${path}.${prop}`,
        message: `Unknown condition key "${prop}". Known: ${[
          '_hover',
          '_active',
          '_focus',
          '_focusVisible',
          '_forcedColors',
          '_reducedMotion',
          '_rtl',
        ].join(', ')}`,
      });
      continue;
    }
    if (typeof value === 'object') {
      issues.push({
        level: 'error',
        path: `${path}.${prop}`,
        message: `Nested object under CSS property "${prop}" is not allowed — use a condition key (_hover, …)`,
      });
      continue;
    }
    if (!isAllowed(value)) {
      issues.push({
        level: 'error',
        path: `${path}.${prop}`,
        message: `Raw value "${value}" is not a $token, var(), allow-listed keyword, or length.`,
      });
    }
  }
}

function walkSlots(slotStyles: SlotStyles | undefined, path: string, issues: ValidationIssue[]) {
  if (!slotStyles) return;
  for (const [slot, styles] of Object.entries(slotStyles)) walkStyle(styles, `${path}.${slot}`, issues);
}

export function validateRecipe(
  recipe: SlotRecipeDefinition,
  preset: PresetDefinition,
  manifest: HeadlessManifest,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (recipe.component !== manifest.component) {
    issues.push({
      level: 'error',
      path: 'component',
      message: `Expected "${manifest.component}", got "${recipe.component}"`,
    });
  }
  if (recipe.headless !== manifest.subpath) {
    issues.push({
      level: 'error',
      path: 'headless',
      message: `Expected "${manifest.subpath}", got "${recipe.headless}"`,
    });
  }

  for (const slot of recipe.slots) {
    if (!manifest.slots.includes(slot)) {
      issues.push({
        level: 'error',
        path: 'slots',
        message: `Unknown slot "${slot}". Known: ${manifest.slots.join(', ')}`,
      });
    }
  }
  for (const slot of Object.keys(recipe.base)) {
    if (!recipe.slots.includes(slot)) {
      issues.push({ level: 'error', path: `base.${slot}`, message: `Slot "${slot}" not listed in recipe.slots` });
    }
  }

  walkSlots(recipe.base, 'base', issues);

  if (recipe.variants) {
    for (const [axis, values] of Object.entries(recipe.variants)) {
      for (const [name, styles] of Object.entries(values)) walkSlots(styles, `variants.${axis}.${name}`, issues);
    }
  }

  if (recipe.defaultVariants) {
    for (const [axis, value] of Object.entries(recipe.defaultVariants)) {
      if (!recipe.variants?.[axis]?.[value]) {
        issues.push({ level: 'error', path: `defaultVariants.${axis}`, message: `Unknown default ${axis}="${value}"` });
      }
    }
  }

  if (recipe.states) {
    for (const [name, styles] of Object.entries(recipe.states)) {
      const desc = manifest.states[name];
      if (!desc) {
        issues.push({
          level: 'error',
          path: `states.${name}`,
          message: `Unknown headless state. Known: ${Object.keys(manifest.states).join(', ')}`,
        });
        continue;
      }
      if (desc.kind === 'presence') {
        // Presence states are SlotStyles (slot → Style). Nested _hover etc. are allowed on Style.
        walkSlots(styles as SlotStyles, `states.${name}`, issues);
      } else {
        // Enum states are value → SlotStyles. Nested conditions are allowed inside each SlotStyles.
        for (const [enumValue, slotStyles] of Object.entries(styles as Record<string, SlotStyles>)) {
          if (!desc.values.includes(enumValue)) {
            issues.push({
              level: 'error',
              path: `states.${name}.${enumValue}`,
              message: `Invalid value for ${desc.attr}. Known: ${desc.values.join(', ')}`,
            });
          }
          walkSlots(slotStyles, `states.${name}.${enumValue}`, issues);
        }
      }
    }
  }

  recipe.compoundVariants?.forEach((cv, i) => {
    if (cv.variants) {
      for (const [axis, value] of Object.entries(cv.variants)) {
        if (!recipe.variants?.[axis]?.[value]) {
          issues.push({
            level: 'error',
            path: `compoundVariants[${i}].variants.${axis}`,
            message: `Unknown ${axis}="${value}"`,
          });
        }
      }
    }
    if (cv.states) {
      for (const [name, value] of Object.entries(cv.states)) {
        const desc = manifest.states[name];
        if (!desc) {
          issues.push({ level: 'error', path: `compoundVariants[${i}].states.${name}`, message: `Unknown state` });
          continue;
        }
        if (desc.kind === 'presence' && value !== true) {
          issues.push({
            level: 'error',
            path: `compoundVariants[${i}].states.${name}`,
            message: `Presence state must be true`,
          });
        }
        if (desc.kind === 'enum' && (typeof value !== 'string' || !desc.values.includes(value))) {
          issues.push({
            level: 'error',
            path: `compoundVariants[${i}].states.${name}`,
            message: `Must be one of: ${desc.values.join(', ')}`,
          });
        }
      }
    }
    walkSlots(cv.css, `compoundVariants[${i}].css`, issues);
  });

  if (recipe.interactions) {
    for (const [slot, map] of Object.entries(recipe.interactions)) {
      if (!recipe.slots.includes(slot)) {
        issues.push({ level: 'error', path: `interactions.${slot}`, message: `Unknown slot` });
      }
      for (const [pseudo, style] of Object.entries(map)) {
        if (style) walkStyle(style, `interactions.${slot}.${pseudo}`, issues);
      }
    }
  }

  if (recipe.conditions) {
    for (const [cond, styles] of Object.entries(recipe.conditions)) walkSlots(styles, `conditions.${cond}`, issues);
  }

  if (recipe.localTokens) {
    for (const [name, value] of Object.entries(recipe.localTokens)) {
      if (!name.startsWith('--')) {
        issues.push({ level: 'error', path: `localTokens.${name}`, message: `Must start with --` });
      }
      if (!TOKEN_REF.test(value) && !LOCAL_VAR.test(value) && !isAllowed(value)) {
        issues.push({ level: 'error', path: `localTokens.${name}`, message: `Must be a token reference` });
      }
    }
  }

  for (const match of JSON.stringify(recipe).matchAll(/\$([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!(match[1] in preset.tokens)) {
      issues.push({
        level: 'warning',
        path: 'tokens',
        message: `Token "$${match[1]}" not in preset.tokens (OK if FluentProvider supplies it)`,
      });
    }
  }

  recipe.raw?.forEach((block, i) => {
    if (!block.reason?.trim()) {
      issues.push({ level: 'error', path: `raw[${i}]`, message: `raw blocks require a reason` });
    } else {
      issues.push({ level: 'warning', path: `raw[${i}]`, message: `raw escape hatch: ${block.reason}` });
    }
  });

  return issues;
}

export function assertNoErrors(issues: ValidationIssue[], label: string): void {
  const errors = issues.filter(i => i.level === 'error');
  if (errors.length) {
    throw new Error(`${label}: ${errors.length} error(s)\n` + errors.map(e => `  [${e.path}] ${e.message}`).join('\n'));
  }
}
