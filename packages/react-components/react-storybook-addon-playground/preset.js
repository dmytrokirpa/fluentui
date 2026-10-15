const fs = require('fs');
const path = require('path');
const preset = require('./lib-commonjs/preset/preset');

/**
 * Package root resolved via package.json instead of `__dirname`.
 * During monorepo development the workspace Storybook loader copies this preset into `<pkg>/temp/preset.ts`,
 * so `__dirname` would point to the wrong folder there.
 */
function getPackageRoot() {
  return path.dirname(require.resolve('@fluentui/react-storybook-addon-playground/package.json'));
}

/**
 * @param {string} configDir
 */
function hasAddonDocs(configDir) {
  try {
    require.resolve('@storybook/addon-docs/package.json', { paths: [configDir ?? process.cwd()] });
    return true;
  } catch {
    return false;
  }
}

/**
 * The Docs Canvas integration imports `@storybook/addon-docs/blocks`, so it is only registered when that optional
 * peer is installed. The decorator alone works without it.
 *
 * @param {string[]} entry
 * @param {{ configDir: string }} options
 */
function previewAnnotations(entry = [], options) {
  return [
    ...entry,
    require.resolve('./lib/preset/preview'),
    ...(hasAddonDocs(options?.configDir) ? [require.resolve('./lib/preset/previewDocs')] : []),
  ];
}

/**
 * Serves the pre-built playground shell at `<storybook>/playground/app/playground.html`.
 * The Storybook Webpack build separately emits the runtime under `<storybook>/playground/runtime/`.
 *
 * @param {Array<string | {from:string;to:string}>} entry
 */
function staticDirs(entry = []) {
  const playgroundDist = path.join(getPackageRoot(), 'dist', 'playground');

  if (!fs.existsSync(playgroundDist)) {
    console.warn(
      `[@fluentui/react-storybook-addon-playground] "${playgroundDist}" does not exist. ` +
        'Run "nx run react-storybook-addon-playground:build-playground" to build the playground shell.',
    );
    return entry;
  }

  return [...entry, { from: playgroundDist, to: '/playground/app' }];
}

module.exports = { previewAnnotations, staticDirs, ...preset };
