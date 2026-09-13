import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  fluent2,
  menuPopoverRecipe,
  menuItemRecipe,
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
  const recipes = [menuPopoverRecipe, menuItemRecipe, menuDividerRecipe, menuGroupHeaderRecipe] as const;

  it.each(recipes.map(r => [r.component, r] as const))('%s validates without errors', (_name, recipe) => {
    const manifest = getManifest(recipe.component);
    const issues = validateRecipe(recipe, fluent2.preset, manifest);
    expect(issues.filter(i => i.level === 'error')).toEqual([]);
  });

  it('MenuItem emits state selectors for disabled + submenu', () => {
    const manifest = getManifest('MenuItem');
    const css = emitCss(compileRecipe(menuItemRecipe, fluent2.preset, manifest));
    expect(css).toContain('.fui-MenuItem');
    expect(css).toContain('[data-disabled]');
    expect(css).toContain('[data-submenu-open]');
    expect(css).toContain(':not([data-disabled]):not([data-disabled-focusable]):hover');
    expect(css).toContain('var(--colorNeutralBackground1Hover)');
    expect(css).not.toContain('@layer ds.raw');
  });

  it('MenuPopover emits surface styles', () => {
    const manifest = getManifest('MenuPopover');
    const css = emitCss(compileRecipe(menuPopoverRecipe, fluent2.preset, manifest));
    expect(css).toContain('.fui-MenuPopover');
    expect(css).toContain('var(--shadow16)');
    expect(css).toContain('max-content');
  });

  it('MenuItem TSX imports from menu subpath', () => {
    const tsx = emitTsx(compileRecipe(menuItemRecipe, fluent2.preset, getManifest('MenuItem')));
    expect(tsx).toContain("from '@fluentui/react-headless-components-preview/menu'");
    expect(tsx).toContain('useMenuItem as useHeadless');
    expect(tsx).toContain('renderMenuItem as renderHeadless');
  });

  it('build merges menu family into one barrel', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-compiler-'));
    const result = buildDesignSystem(fluent2, { outDir });
    expect(result.rawBlockCount).toBe(0);
    expect(fs.existsSync(path.join(outDir, 'menu', 'MenuItem.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'menu', 'MenuPopover.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'menu', 'MenuDivider.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'menu', 'MenuGroupHeader.tsx'))).toBe(true);
    const barrel = fs.readFileSync(path.join(outDir, 'menu', 'index.ts'), 'utf8');
    expect(barrel).toContain("export { MenuItem } from './MenuItem'");
    expect(barrel).toContain("export { MenuPopover } from './MenuPopover'");
    expect(barrel).toContain("export { MenuDivider } from './MenuDivider'");
    expect(barrel).toContain("export { MenuGroupHeader } from './MenuGroupHeader'");
    // root index lists menu once
    const root = fs.readFileSync(path.join(outDir, 'index.ts'), 'utf8');
    expect(root.match(/export \* from '\.\/menu'/g)?.length ?? root.match(/export \* from '\.\/menu'/g)?.length).toBe(
      1,
    );
  });
});
