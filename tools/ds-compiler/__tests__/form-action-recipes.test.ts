import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  fluent2,
  labelRecipe,
  linkRecipe,
  toggleButtonRecipe,
  switchRecipe,
  inputRecipe,
} from '../design-systems/fluent2';
import { getManifest } from '../src/manifest';
import { validateRecipe } from '../src/validate';
import { compileRecipe } from '../src/compile';
import { emitCss } from '../src/emit-css';
import { emitTsx } from '../src/emit-tsx';
import { buildDesignSystem } from '../src/build';

describe('fluent2 form/action recipes', () => {
  it.each([
    ['Label', labelRecipe],
    ['Link', linkRecipe],
    ['ToggleButton', toggleButtonRecipe],
    ['Switch', switchRecipe],
    ['Input', inputRecipe],
  ] as const)('%s validates without errors', (component, recipe) => {
    const issues = validateRecipe(recipe, fluent2.preset, getManifest(component));
    expect(issues.filter(i => i.level === 'error')).toEqual([]);
  });

  it('Label emits size/weight variants and required slot', () => {
    const compiled = compileRecipe(labelRecipe, fluent2.preset, getManifest('Label'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Label');
    expect(css).toContain('.fui-Label__required');
    expect(css).toContain('[data-fui-size="small"]');
    expect(css).toContain('[data-fui-weight="semibold"]');
    expect(css).toContain('[data-disabled]');
    expect(css).not.toContain('@layer ds.raw');

    const tsx = emitTsx(compiled);
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/label'");
    expect(tsx).toContain('useLabel as useHeadless');
  });

  it('Link emits appearance + inline + focus-visible', () => {
    const compiled = compileRecipe(linkRecipe, fluent2.preset, getManifest('Link'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Link');
    expect(css).toContain('[data-fui-appearance="subtle"]');
    expect(css).toContain('[data-fui-inline="true"]');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('text-decoration-style: double');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('ToggleButton emits checked + appearance compounds', () => {
    const compiled = compileRecipe(toggleButtonRecipe, fluent2.preset, getManifest('ToggleButton'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-ToggleButton');
    expect(css).toContain('[data-checked]');
    expect(css).toContain('[data-fui-appearance="primary"]');
    expect(css).toContain('[data-icon-only]');
    expect(css).not.toContain('@layer ds.raw');

    const tsx = emitTsx(compiled);
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/toggle-button'");
  });

  it('Switch emits checked thumb translate via _child', () => {
    const compiled = compileRecipe(switchRecipe, fluent2.preset, getManifest('Switch'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Switch');
    expect(css).toContain('.fui-Switch__indicator > *');
    expect(css).toContain('translateX(20px)');
    expect(css).toContain('[data-checked]');
    expect(css).toContain('[data-fui-size="small"]');
    expect(css).toContain('[data-label-position="above"]');
    expect(css).toContain(':focus-within');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('Input emits appearance/size + invalid/disabled', () => {
    const compiled = compileRecipe(inputRecipe, fluent2.preset, getManifest('Input'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Input');
    expect(css).toContain('[data-fui-appearance="underline"]');
    expect(css).toContain('[data-fui-appearance="filled-darker"]');
    expect(css).toContain('[data-fui-size="large"]');
    expect(css).toContain('[data-invalid]');
    expect(css).toContain('[data-disabled]');
    expect(css).toContain(':focus-within');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('allows transform functions without raw', () => {
    const issues = validateRecipe(
      {
        ...switchRecipe,
        base: {
          ...switchRecipe.base,
          indicator: {
            ...switchRecipe.base.indicator,
            transform: 'translateX(20px)',
          },
        },
      },
      fluent2.preset,
      getManifest('Switch'),
    );
    expect(issues.filter(i => i.level === 'error')).toEqual([]);
  });

  it('buildDesignSystem writes all form/action files with 0 raw', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-compiler-'));
    const result = buildDesignSystem(fluent2, { outDir });
    for (const dir of ['label', 'link', 'toggle-button', 'switch', 'input']) {
      expect(fs.existsSync(path.join(outDir, dir))).toBe(true);
    }
    // Spinner contributes one raw keyframes block at the design-system level.
    expect(result.rawBlockCount).toBe(1);
  });
});
