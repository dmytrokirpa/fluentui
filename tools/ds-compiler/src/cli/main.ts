import * as path from 'node:path';
import { fluent2 } from '../../design-systems/fluent2';
import { buildDesignSystem, checkDesignSystem } from '../build';
import { assertNoErrors } from '../validate';

const root = path.resolve(__dirname, '../..');

function printHelp(): void {
  console.log(`Usage: ds-compiler <command> [options]

Commands:
  build   Compile design-system recipes into wrappers + CSS
  check   Validate recipes without emitting

Options:
  --ds <name>    Design system (default: fluent2)
  --out <dir>    Output directory (build only)
  --help         Show help
`);
}

function getArg(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : undefined;
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    process.exit(command ? 0 : 1);
  }

  const dsName = getArg(args, '--ds') ?? 'fluent2';
  if (dsName !== 'fluent2') {
    throw new Error(`Unknown design system "${dsName}". Known: fluent2`);
  }
  const bundle = fluent2;

  if (command === 'check') {
    const issues = checkDesignSystem(bundle);
    assertNoErrors(issues, dsName);
    const warnings = issues.filter(i => i.level === 'warning');
    console.log(`OK: ${bundle.recipes.length} recipe(s), ${warnings.length} warning(s)`);
    for (const w of warnings) {
      console.log(`  [${w.path}] ${w.message}`);
    }
    return;
  }

  if (command === 'build') {
    const outDir = path.resolve(getArg(args, '--out') ?? path.join(root, 'generated', 'fluent2'));
    const result = buildDesignSystem(bundle, { outDir });
    const warnings = result.issues.filter(i => i.level === 'warning');
    console.log(`Built ${bundle.preset.name}: ${result.files.length} files → ${outDir}`);
    console.log(`Raw CSS blocks: ${result.rawBlockCount}`);
    if (warnings.length) {
      console.log(`Warnings (${warnings.length}):`);
      for (const w of warnings) {
        console.log(`  [${w.path}] ${w.message}`);
      }
    }
    return;
  }

  printHelp();
  throw new Error(`Unknown command "${command}"`);
}

try {
  main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
