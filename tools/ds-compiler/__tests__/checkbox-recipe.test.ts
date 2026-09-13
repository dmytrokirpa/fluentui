import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fluent2, checkboxRecipe } from '../design-systems/fluent2';
import { getManifest } from '../src/manifest';
import { validateRecipe } from '../src/validate';
import { compileRecipe } from '../src/compile';
import { emitCss } from '../src/emit-css';
import { emitTsx } from '../src/emit-tsx';
import { buildDesignSystem } from '../src/build';

describe('fluent2 Checkbox recipe', () => {
  const manifest = getManifest('Checkbox');

  it('validates without errors', () => {
    const issues = validateRecipe(checkboxRecipe, fluent2.preset, manifest);
    expect(issues.filter(i => i.level === 'error')).toEqual([]);
  });

  it('rejects unknown headless states', () => {
    const bad = {
      ...checkboxRecipe,
      states: {
        ...checkboxRecipe.states,
        pressed: { root: { color: 'red' } },
      },
    };
    const issues = validateRecipe(bad as typeof checkboxRecipe, fluent2.preset, manifest);
    expect(issues.some(i => i.level === 'error' && i.path.includes('states.pressed'))).toBe(true);
  });

  it('emits CSS with empty-string checked + mixed selectors', () => {
    const compiled = compileRecipe(checkboxRecipe, fluent2.preset, manifest);
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Checkbox');
    expect(css).toContain('[data-checked=""]');
    expect(css).toContain('[data-checked="mixed"]');
    expect(css).toContain('[data-disabled]');
    expect(css).toContain('[data-label-position="before"]');
    expect(css).toContain('[data-fui-size="large"]');
    expect(css).toContain('[data-fui-shape="circular"]');
    expect(css).toContain(':focus-within');
    expect(css).toContain('--fui-Checkbox__indicator--color');
    expect(css).toContain('var(--colorCompoundBrandBackground)');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('emits a TSX wrapper that imports headless hooks', () => {
    const compiled = compileRecipe(checkboxRecipe, fluent2.preset, manifest);
    const tsx = emitTsx(compiled);
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/checkbox'");
    expect(tsx).toContain('useCheckbox as useHeadless');
    expect(tsx).toContain('renderCheckbox as renderHeadless');
    expect(tsx).toContain('data-fui-size');
    expect(tsx).toContain('shape?:');
  });

  it('buildDesignSystem writes checkbox files', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-compiler-'));
    const result = buildDesignSystem(fluent2, { outDir });
    expect(fs.existsSync(path.join(outDir, 'checkbox', 'Checkbox.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'checkbox', 'Checkbox.css'))).toBe(true);
    // Spinner contributes one raw keyframes block at the design-system level.
    expect(result.rawBlockCount).toBe(1);
  });
});
