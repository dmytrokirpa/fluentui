import type { StorybookConfig } from '@storybook/react-webpack5';
import { registerTsPaths, registerRules, rules } from '@fluentui/scripts-storybook';

import * as path from 'path';

const tsConfigPath = path.resolve(__dirname, '../../../../tsconfig.base.v0.json');

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
  ],
  stories: ['../src/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: { lazyCompilation: true },
    },
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
    registerRules({ config, rules: [rules.griffelRule] });

    return config;
  },
} satisfies StorybookConfig;
