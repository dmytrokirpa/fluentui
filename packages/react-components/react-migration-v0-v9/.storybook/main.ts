import type { StorybookConfig } from '@storybook/react-webpack5';

import * as path from 'path';
import { registerTsPaths } from '@fluentui/scripts-storybook';

import rootMain from '../../../../.storybook/main';

const tsConfigAllPath = path.join(__dirname, '../../../../tsconfig.base.all.json');

export default {
  ...rootMain,
  stories: [...rootMain.stories, '../stories/**/*.stories.mdx', '../stories/**/index.stories.@(ts|tsx)'],
  addons: [...(rootMain.addons ?? [])],
  webpackFinal: (config, options) => {
    const localConfig = { ...rootMain.webpackFinal?.(config, options) };

    // add your own webpack tweaks if needed

    registerTsPaths({ config: localConfig, configFile: tsConfigAllPath });

    return localConfig;
  },
} satisfies StorybookConfig;
