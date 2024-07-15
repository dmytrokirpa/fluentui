import * as path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';
import { getPackageStoriesGlob, registerTsPaths, rules, registerRules } from '@fluentui/scripts-storybook';

import rootMain from '../../../.storybook/main';

const tsConfigAllPath = path.join(__dirname, '../../../tsconfig.base.all.json');

export default {
  ...rootMain,
  stories: [
    ...rootMain.stories,
    '../src/**/*.stories.mdx',
    '../src/**/index.stories.@(ts|tsx)',
    ...getPackageStoriesGlob({ packageName: '@fluentui/react-components', callerPath: __dirname }),
    ...getPackageStoriesGlob({
      packageName: '@fluentui/public-docsite-v9',
      callerPath: __dirname,
      excludeStoriesInsertionFromPackages: ['@fluentui/react-storybook-addon', '@fluentui/theme-designer'],
    }),
  ],
  staticDirs: ['../public'],
  addons: [...rootMain.addons],
  webpackFinal: config => {
    const localConfig = { ...rootMain.webpackFinal(config) };

    // add your own webpack tweaks if needed
    registerTsPaths({ configFile: tsConfigAllPath, config: localConfig });
    registerRules({ rules: [rules.scssRule], config: localConfig });

    return localConfig;
  },
} satisfies StorybookConfig;
