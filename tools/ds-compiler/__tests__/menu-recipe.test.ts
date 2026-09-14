import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  fluent2,
  menuPopoverRecipe,
  menuItemRecipe,
  menuItemCheckboxRecipe,
  menuItemRadioRecipe,
  menuDividerRecipe,
  menuGroupHeaderRecipe,
} from '../design-systems/fluent2';
import { getManifest } from '../src/manifest';
import { validateRecipe } from '../src/validate';
import { compileRecipe } from '../src/compile';
import { emitCss } from '../src/emit-css';
import { emitTsx } from '../src/emit-tsx';
import { buildDesignSystem } from '../src/build';

describe('fluent2 Menu family recipes', () => {
  const recipes = [
    menuPopoverRecipe,
    menuItemRecipe,
    menuItemCheckboxRecipe,
    menuItemRadioRecipe,
    menuDividerRecipe,
    menuGroupHeaderRecipe,
  ] as const;

  it.each(recipes.map(r => [r.component, r] as const))('%s validates without errors', (_name, recipe) => {
    const manifest = getManifest(recipe.component);
    const issues = validateRecipe(recipe, fluent2.preset, manifest);
    expect(issues.filter(i => i.level === 'error')).toEqual([]);
  });

  it('MenuItem emits group-hover child selectors for icon + subText', () => {
    const css = emitCss(compileRecipe(menuItemRecipe, fluent2.preset, getManifest('MenuItem')));
    expect(css).toContain(
      '.fui-MenuItem:not([data-disabled]):not([data-disabled-focusable]):hover .fui-MenuItem__icon',
    );
    expect(css).toContain(
      '.fui-MenuItem:not([data-disabled]):not([data-disabled-focusable]):hover .fui-MenuItem__subText',
    );
    expect(css).toContain(
      '.fui-MenuItem:not([data-disabled]):not([data-disabled-focusable]):active .fui-MenuItem__subText',
    );
    expect(css).toContain('var(--colorNeutralForeground2BrandSelected)');
    expect(css).toContain('[data-submenu-open]');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('MenuItemCheckbox/Radio hide checkmark until data-checked', () => {
    for (const recipe of [menuItemCheckboxRecipe, menuItemRadioRecipe]) {
      const css = emitCss(compileRecipe(recipe, fluent2.preset, getManifest(recipe.component)));
      expect(css).toContain('visibility: hidden');
      expect(css).toContain(`[data-checked] .fui-${recipe.component}__checkmark`);
      expect(css).toContain('visibility: visible');
      expect(css).not.toContain('@layer ds.raw');
    }
  });

  it('MenuItemCheckbox TSX imports selectable headless hooks', () => {
    const tsx = emitTsx(compileRecipe(menuItemCheckboxRecipe, fluent2.preset, getManifest('MenuItemCheckbox')));
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/menu'");
    expect(tsx).toContain('useMenuItemCheckbox as useHeadless');
    expect(tsx).toContain('renderMenuItemCheckbox as renderHeadless');
  });

  it('build merges full menu family into one barrel', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-compiler-'));
    const result = buildDesignSystem(fluent2, { outDir });
    // Spinner contributes one raw keyframes block at the design-system level.
    expect(result.rawBlockCount).toBe(1);
    const barrel = fs.readFileSync(path.join(outDir, 'menu', 'index.ts'), 'utf8');
    for (const name of [
      'MenuPopover',
      'MenuItem',
      'MenuItemCheckbox',
      'MenuItemRadio',
      'MenuDivider',
      'MenuGroupHeader',
    ]) {
      expect(barrel).toMatch(new RegExp(`export \\{ ${name} \\} from ['"]\\./${name}['"]`));
      expect(fs.existsSync(path.join(outDir, 'menu', `${name}.tsx`))).toBe(true);
    }
    const root = fs.readFileSync(path.join(outDir, 'index.ts'), 'utf8');
    expect(root.match(/export \* from ['"]\.\/menu['"]/g)?.length).toBe(1);
  });
});
