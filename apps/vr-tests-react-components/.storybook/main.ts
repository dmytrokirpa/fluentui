import * as path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

import { loadWorkspaceAddon, registerRules, registerTsPaths, rules } from '@fluentui/scripts-storybook';

const tsConfigPath = path.resolve(__dirname, '../../../tsconfig.base.json');

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
    loadWorkspaceAddon('@fluentui/react-storybook-addon', { tsConfigPath }),
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
