import type { StorybookConfig } from '@storybook/react-webpack5';

import rootMain from '../../../.storybook/main';

export default {
  ...rootMain,
  stories: [...rootMain.stories, '../src/**/*.stories.mdx', '../src/**/index.stories.@(ts|tsx)'],
  addons: [...rootMain.addons],
  webpackFinal: (config, options) => {
    const localConfig = { ...rootMain.webpackFinal(config, options) };

    // add your own webpack tweaks if needed

    return localConfig;
  },
} satisfies StorybookConfig;
