import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fluent2, buttonRecipe } from '../design-systems/fluent2';
import { getManifest } from '../src/manifest';
import { validateRecipe } from '../src/validate';
import { compileRecipe } from '../src/compile';
import { emitCss } from '../src/emit-css';
import { emitTsx } from '../src/emit-tsx';
import { buildDesignSystem } from '../src/build';

describe('fluent2 Button recipe', () => {
  const manifest = getManifest('Button');

  it('validates without errors', () => {
    const issues = validateRecipe(buttonRecipe, fluent2.preset, manifest);
    const errors = issues.filter(i => i.level === 'error');
    expect(errors).toEqual([]);
  });

  it('rejects unknown headless states', () => {
    const bad = {
      ...buttonRecipe,
      states: {
        ...buttonRecipe.states,
        checked: { root: { color: 'red' } },
      },
    };
    const issues = validateRecipe(bad as typeof buttonRecipe, fluent2.preset, manifest);
    expect(issues.some(i => i.level === 'error' && i.path.includes('states.checked'))).toBe(true);
  });

  it('rejects raw color literals', () => {
    const bad = {
      ...buttonRecipe,
      base: {
        root: {
          ...buttonRecipe.base.root,
          backgroundColor: '#ff0000',
        },
      },
    };
    const issues = validateRecipe(bad as typeof buttonRecipe, fluent2.preset, manifest);
    expect(issues.some(i => i.level === 'error' && i.message.includes('#ff0000'))).toBe(true);
  });

  it('emits CSS with variant + state selectors', () => {
    const compiled = compileRecipe(buttonRecipe, fluent2.preset, manifest);
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Button');
    expect(css).toContain('[data-fui-appearance="primary"]');
    expect(css).toContain('[data-fui-size="small"]');
    expect(css).toContain('[data-disabled]');
    expect(css).toContain('[data-fui-appearance="primary"]:not([data-disabled]):not([data-disabled-focusable]):hover');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).not.toContain('@layer ds.raw');
    expect(css).toContain('[data-icon-only]');
    expect(css).toContain('[data-icon-position="before"]');
    expect(css).toContain('var(--colorBrandBackground)');
    expect(css).toContain('@layer ds.base');
    expect(css).toContain('@layer ds.variants');
    expect(css).toContain('@layer ds.states');
  });

  it('emits a TSX wrapper that imports headless hooks', () => {
    const compiled = compileRecipe(buttonRecipe, fluent2.preset, manifest);
    const tsx = emitTsx(compiled);
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/button'");
    expect(tsx).toContain('useButton as useHeadless');
    expect(tsx).toContain('renderButton as renderHeadless');
    expect(tsx).toContain('data-fui-appearance');
    expect(tsx).toContain('appearance?:');
  });

  it('buildDesignSystem writes files', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-compiler-'));
    const result = buildDesignSystem(fluent2, { outDir });
    expect(result.files.length).toBeGreaterThan(3);
    expect(fs.existsSync(path.join(outDir, 'theme.css'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'button', 'Button.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'button', 'Button.css'))).toBe(true);
    expect(result.rawBlockCount).toBe(0);
  });
});
