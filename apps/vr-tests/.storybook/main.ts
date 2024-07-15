import * as path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

import { registerRules, registerTsPaths, rules } from '@fluentui/scripts-storybook';

const tsConfigPath = path.resolve(__dirname, '../../../tsconfig.base.v8.json');

export default {
  addons: [
    {
      name: 'storybook-addon-swc',
      options: {
        swcLoaderOptions: {
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
          },
        },
        swcMinifyOptions: { mangle: false },
      },
    },
    '@storybook/addon-actions',
  ],
  stories: ['../src/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    // disable react-docgen-typescript (totally not needed here, slows things down a lot)
    reactDocgen: false,
  },
  webpackFinal: config => {
    registerTsPaths({ config, configFile: tsConfigPath });
    registerRules({ config, rules: [rules.scssRule] });

    return config;
  },
} satisfies StorybookConfig;
