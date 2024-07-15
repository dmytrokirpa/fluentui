import * as fs from 'fs';
import * as path from 'path';

import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Configuration } from 'webpack';

import {
  getImportMappingsForExportToSandboxAddon,
  loadWorkspaceAddon,
  processBabelLoaderOptions,
  registerTsPaths,
} from '@fluentui/scripts-storybook';

const tsConfigPath = path.resolve(__dirname, '../tsconfig.base.json');

const previewHeadTemplate = fs.readFileSync(path.resolve(__dirname, 'preview-head-template.html'), 'utf8');

export default {
  features: {
    // Enables the legacy MDX V1 parser
    legacyMdx1: true,
  },

  stories: [],

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-knobs'),
    getAbsolutePath('storybook-addon-performance'),

    // internal monorepo custom addons
    /**  {@link file://./../packages/react-components/react-storybook-addon/package.json} */
    // loadWorkspaceAddon('@fluentui/react-storybook-addon', { tsConfigPath }),
    /** {@link file://./../packages/react-components/react-storybook-addon-export-to-sandbox/package.json} */
    // loadWorkspaceAddon('@fluentui/react-storybook-addon-export-to-sandbox', {
    //   tsConfigPath,
    //   /** @type {import('../packages/react-components/react-storybook-addon-export-to-sandbox/src/public-types').PresetConfig} */
    //   options: {
    //     importMappings: getImportMappingsForExportToSandboxAddon(),
    //     babelLoaderOptionsUpdater: processBabelLoaderOptions,
    //     webpackRule: {
    //       test: /\.stories\.tsx$/,
    //       include: /stories/,
    //     },
    //   },
    // }),
  ],

  webpackFinal: config => {
    registerTsPaths({ config: config as Configuration, configFile: tsConfigPath });

    if ((process.env.CI || process.env.TF_BUILD || process.env.LAGE_PACKAGE_NAME) && config.plugins) {
      // Disable ProgressPlugin in PR/CI builds to reduce log verbosity (warnings and errors are still logged)
      config.plugins = config.plugins.filter(value => value && value.constructor.name !== 'ProgressPlugin');
    }

    return config;
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: { lazyCompilation: true, useSWC: true },
    },
  },

  core: {
    disableTelemetry: true,
  },

  /**
   * Programmatically enhance previewHead as inheriting just static file `preview-head.html` doesn't work in monorepo
   * @see https://storybook.js.org/docs/addons/writing-presets#ui-configuration
   */
  previewHead: head => head + previewHeadTemplate,

  docs: {
    autodocs: true,
  },
} satisfies StorybookConfig;

function getAbsolutePath(value: string) {
  return path.dirname(require.resolve(path.join(value, 'package.json')));
}
