import * as fs from 'node:fs';
import * as path from 'node:path';
import type { DesignSystemBundle } from './schema';
import { getManifest } from './manifest';
import { validateRecipe, assertNoErrors, type ValidationIssue } from './validate';
import { compileRecipe } from './compile';
import { emitCss, emitThemeCss } from './emit-css';
import { emitTsx, emitIndex } from './emit-tsx';
import { emitStories } from './emit-stories';

export type BuildOptions = {
  outDir: string;
  /** When true, throw on validation errors. */
  strict?: boolean;
};

export type BuildResult = {
  issues: ValidationIssue[];
  files: string[];
  rawBlockCount: number;
};

export function buildDesignSystem(bundle: DesignSystemBundle, options: BuildOptions): BuildResult {
  const { outDir, strict = true } = options;
  const allIssues: ValidationIssue[] = [];
  const files: string[] = [];
  let rawBlockCount = 0;

  fs.mkdirSync(outDir, { recursive: true });

  // theme.css
  const themePath = path.join(outDir, 'theme.css');
  fs.writeFileSync(themePath, emitThemeCss(bundle.preset), 'utf8');
  files.push(themePath);

  /** Recipes sharing a headless subpath write into one folder; barrel is merged. */
  const byHeadless = new Map<string, string[]>();

  for (const recipe of bundle.recipes) {
    const manifest = getManifest(recipe.component);
    const issues = validateRecipe(recipe, bundle.preset, manifest);
    allIssues.push(...issues);
    if (strict) {
      assertNoErrors(issues, `${bundle.preset.name}/${recipe.component}`);
    }

    rawBlockCount += recipe.raw?.length ?? 0;

    const compiled = compileRecipe(recipe, bundle.preset, manifest);
    const componentDir = path.join(outDir, recipe.headless);
    fs.mkdirSync(componentDir, { recursive: true });

    const cssPath = path.join(componentDir, `${recipe.component}.css`);
    const tsxPath = path.join(componentDir, `${recipe.component}.tsx`);
    const storiesPath = path.join(componentDir, `${recipe.component}.stories.tsx`);

    fs.writeFileSync(cssPath, emitCss(compiled), 'utf8');
    fs.writeFileSync(tsxPath, emitTsx(compiled), 'utf8');
    fs.writeFileSync(storiesPath, emitStories(compiled), 'utf8');

    files.push(cssPath, tsxPath, storiesPath);

    const list = byHeadless.get(recipe.headless) ?? [];
    list.push(recipe.component);
    byHeadless.set(recipe.headless, list);
  }

  for (const [headless, components] of byHeadless) {
    const indexPath = path.join(outDir, headless, 'index.ts');
    const barrel =
      components.length === 1
        ? emitIndex(
            compileRecipe(
              bundle.recipes.find(r => r.component === components[0])!,
              bundle.preset,
              getManifest(components[0]),
            ),
          )
        : components
            .map(
              name =>
                `export { ${name} } from './${name}';\nexport type { ${name}Props, ${name}State, ${name}Variants } from './${name}';`,
            )
            .join('\n');
    fs.writeFileSync(indexPath, barrel.endsWith('\n') ? barrel : barrel + '\n', 'utf8');
    files.push(indexPath);
  }

  // root index — unique headless subpaths
  const rootIndex = path.join(outDir, 'index.ts');
  const uniqueHeadless = [...byHeadless.keys()];
  const exports = uniqueHeadless.map(h => `export * from './${h}';`).join('\n');
  fs.writeFileSync(rootIndex, `import './theme.css';\n${exports}\n`, 'utf8');
  files.push(rootIndex);

  return { issues: allIssues, files, rawBlockCount };
}

export function checkDesignSystem(bundle: DesignSystemBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const recipe of bundle.recipes) {
    const manifest = getManifest(recipe.component);
    issues.push(...validateRecipe(recipe, bundle.preset, manifest));
  }
  return issues;
}
