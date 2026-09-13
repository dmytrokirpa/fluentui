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
    const indexPath = path.join(componentDir, 'index.ts');
    const storiesPath = path.join(componentDir, `${recipe.component}.stories.tsx`);

    fs.writeFileSync(cssPath, emitCss(compiled), 'utf8');
    fs.writeFileSync(tsxPath, emitTsx(compiled), 'utf8');
    fs.writeFileSync(indexPath, emitIndex(compiled), 'utf8');
    fs.writeFileSync(storiesPath, emitStories(compiled), 'utf8');

    files.push(cssPath, tsxPath, indexPath, storiesPath);
  }

  // root index
  const rootIndex = path.join(outDir, 'index.ts');
  const exports = bundle.recipes.map(r => `export * from './${r.headless}';`).join('\n');
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
