const path = require('path');
const fs = require('fs');
const { workspaceRoot } = require('@nx/devkit');
const { pathsToModuleNameMapper } = require('ts-jest');
const { createV0Config: commonConfig } = require('@fluentui/scripts-jest-v0');

const config = commonConfig({
  displayName: 'react-northstar',
  moduleNameMapper: {
    // Legacy aliases, they should not be used in new tests
    ...getAliases(),
  },
  // Keeps Jest from using too much memory as GC gets invokes more often, makes tests slower
  // https://stackoverflow.com/a/75857711
  workerIdleMemoryLimit: '1024MB',
});
config.setupFilesAfterEnv = [...config.setupFilesAfterEnv, './jest-setup.js'];

module.exports = config;

function getAliases() {
  const tsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'tsconfig.spec.json')));
  const normalizedPathAliases = Object.entries(tsConfig.compilerOptions.paths).reduce(
    (acc, [importAlias, importPaths]) => {
      if (importAlias.startsWith('react') | importAlias.startsWith('@testing-library')) {
        return acc;
      }
      acc[importAlias] = importPaths;
      return acc;
    },
    {},
  );
  const tsPathAliases = pathsToModuleNameMapper(normalizedPathAliases, {
    prefix: `<rootDir>/${path.relative(__dirname, workspaceRoot)}/`,
  });

  return tsPathAliases;
}
