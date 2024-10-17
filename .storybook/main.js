import { dirname, join } from 'path';
const path = require('path');
const fs = require('fs');

const {
  loadWorkspaceAddon,
  registerTsPaths,
  registerRules,
  processBabelLoaderOptions,
  getImportMappingsForExportToSandboxAddon,
} = require('@fluentui/scripts-storybook');

const tsConfigPath = path.resolve(__dirname, '../tsconfig.base.json');

const previewHeadTemplate = fs.readFileSync(path.resolve(__dirname, 'preview-head-template.html'), 'utf8');

module.exports = /** @type {import('./types').StorybookConfig} */ ({
  stories: [],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    // getAbsolutePath('storybook-addon-performance'),
    getAbsolutePath('@storybook/addon-mdx-gfm'),

    // internal monorepo custom addons

    /**  {@link file://./../packages/react-components/react-storybook-addon/package.json} */
    loadWorkspaceAddon('@fluentui/react-storybook-addon', { tsConfigPath }),
    /** {@link file://./../packages/react-components/react-storybook-addon-export-to-sandbox/package.json} */
    loadWorkspaceAddon('@fluentui/react-storybook-addon-export-to-sandbox', {
      tsConfigPath,
      /** @type {import('../packages/react-components/react-storybook-addon-export-to-sandbox/src/public-types').PresetConfig} */
      options: {
        importMappings: getImportMappingsForExportToSandboxAddon(),
        babelLoaderOptionsUpdater: processBabelLoaderOptions,
        webpackRule: {
          test: /\.stories\.tsx$/,
          include: /stories/,
        },
      },
    }),
  ],
  webpackFinal(config, options) {
    registerRules({
      config,
      rules: [
        {
          test: /\.((c|m)?(j|t)sx?)$/,
          use: [
            {
              loader: require.resolve('swc-loader'),
              options: this.swc?.({}, options),
            },
          ],
          // include: [getProjectRoot()],
          // exclude: [/node_modules/, ...virtualModuleFiles],
        },
      ],
    });

    registerTsPaths({ config, configFile: tsConfigPath });

    if ((process.env.CI || process.env.TF_BUILD) && config.plugins) {
      // Disable ProgressPlugin in PR/CI builds to reduce log verbosity (warnings and errors are still logged)
      config.plugins = config.plugins.filter(value => value && value.constructor.name !== 'ProgressPlugin');
    }

    return config;
  },
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      builder: {
        lazyCompilation: true,
      },
    },
  },
  /**
   * Programmatically enhance previewHead as inheriting just static file `preview-head.html` doesn't work in monorepo
   * @see https://storybook.js.org/docs/addons/writing-presets#ui-configuration
   */
  previewHead: head => head + previewHeadTemplate,

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  swc() {
    return {
      jsc: {
        target: 'es2019',
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: true,
          dynamicImport: true,
        },
        transform: {
          decoratorMetadata: true,
          legacyDecorator: true,
        },
        keepClassNames: true,
        externalHelpers: true,
        loose: true,
        minify: {
          mangle: false,
        },
      },
    };
  },
});

/**
 * @param {string} value
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
