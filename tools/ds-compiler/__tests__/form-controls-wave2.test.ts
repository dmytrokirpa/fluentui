import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  fluent2,
  fieldRecipe,
  textareaRecipe,
  sliderRecipe,
  spinnerRecipe,
  radioRecipe,
  radioGroupRecipe,
} from '../design-systems/fluent2';
import { getManifest } from '../src/manifest';
import { validateRecipe } from '../src/validate';
import { compileRecipe } from '../src/compile';
import { emitCss } from '../src/emit-css';
import { emitTsx } from '../src/emit-tsx';
import { buildDesignSystem } from '../src/build';

describe('fluent2 form control recipes (wave 2)', () => {
  it.each([
    ['Field', fieldRecipe],
    ['Textarea', textareaRecipe],
    ['Slider', sliderRecipe],
    ['Spinner', spinnerRecipe],
    ['Radio', radioRecipe],
    ['RadioGroup', radioGroupRecipe],
  ] as const)('%s validates without errors', (component, recipe) => {
    const issues = validateRecipe(recipe, fluent2.preset, getManifest(component));
    expect(issues.filter(i => i.level === 'error')).toEqual([]);
  });

  it('Field emits orientation/size variants and validationState', () => {
    const compiled = compileRecipe(fieldRecipe, fluent2.preset, getManifest('Field'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Field');
    expect(css).toContain('[data-fui-orientation="horizontal"]');
    expect(css).toContain('[data-fui-size="large"]');
    expect(css).toContain('[data-validate-state="error"]');
    expect(css).toContain('.fui-Field__validationMessage');
    expect(css).not.toContain('@layer ds.raw');

    const tsx = emitTsx(compiled);
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/field'");
  });

  it('Textarea emits appearance/size + resize/invalid', () => {
    const compiled = compileRecipe(textareaRecipe, fluent2.preset, getManifest('Textarea'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Textarea');
    expect(css).toContain('[data-fui-appearance="filled-darker"]');
    expect(css).toContain('[data-fui-size="small"]');
    expect(css).toContain('[data-resize="vertical"]');
    expect(css).toContain('[data-invalid]');
    expect(css).toContain(':focus-within');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('Slider emits size + vertical/disabled and CSS vars', () => {
    const compiled = compileRecipe(sliderRecipe, fluent2.preset, getManifest('Slider'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Slider');
    expect(css).toContain('[data-fui-size="small"]');
    expect(css).toContain('[data-vertical]');
    expect(css).toContain('[data-disabled]');
    expect(css).toContain('--fui-Slider__thumb--size');
    expect(css).toContain('linear-gradient');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('Spinner emits size/appearance + labelPosition; raw keyframes only', () => {
    const compiled = compileRecipe(spinnerRecipe, fluent2.preset, getManifest('Spinner'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Spinner');
    expect(css).toContain('[data-fui-size="huge"]');
    expect(css).toContain('[data-fui-appearance="inverted"]');
    expect(css).toContain('[data-label-position="above"]');
    expect(css).toContain('@keyframes fui-Spinner-rotate');
    expect(css).toContain('@layer ds.raw');
  });

  it('Radio emits _hasChecked selectors without data-checked', () => {
    const compiled = compileRecipe(radioRecipe, fluent2.preset, getManifest('Radio'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-Radio');
    expect(css).toContain(':has(:checked)');
    expect(css).toContain('[data-label-position="below"]');
    expect(css).toContain('[data-disabled]');
    expect(css).not.toContain('[data-checked]');
    expect(css).not.toContain('@layer ds.raw');

    const tsx = emitTsx(compiled);
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/radio-group'");
    expect(tsx).toContain('useRadio as useHeadless');
  });

  it('RadioGroup emits layout variants', () => {
    const compiled = compileRecipe(radioGroupRecipe, fluent2.preset, getManifest('RadioGroup'));
    const css = emitCss(compiled);
    expect(css).toContain('.fui-RadioGroup');
    expect(css).toContain('[data-fui-layout="horizontal"]');
    expect(css).toContain('[data-fui-layout="horizontal-stacked"]');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('buildDesignSystem writes wave-2 files', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-compiler-'));
    const result = buildDesignSystem(fluent2, { outDir });
    for (const dir of ['field', 'textarea', 'slider', 'spinner', 'radio-group']) {
      expect(fs.existsSync(path.join(outDir, dir))).toBe(true);
    }
    expect(fs.existsSync(path.join(outDir, 'radio-group', 'Radio.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'radio-group', 'RadioGroup.tsx'))).toBe(true);
    // Spinner is the only recipe with a raw keyframes block in this wave.
    expect(result.rawBlockCount).toBe(1);
  });
});
