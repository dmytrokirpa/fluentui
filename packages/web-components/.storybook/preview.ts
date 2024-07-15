import type { Preview } from '@storybook/html';

import { switchTheme, ThemeName } from '../public/theme-switch.js';
import webcomponentsTheme from './theme.js';

import '../src/index-rollup.js';
import './docs-root.css';

function changeTheme(e: Event) {
  if (e.target instanceof HTMLSelectElement) {
    switchTheme(e.target.value as ThemeName);
  }
}

document.getElementById('theme-switch')?.addEventListener('change', changeTheme, false);
switchTheme('web-light');

export default <Preview>{
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    viewMode: 'docs',
    previewTabs: {
      canvas: { hidden: true },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Concepts', ['Introduction', 'Developer', ['Quick Start']], 'Components', 'Theme'],
      },
    },
    docs: {
      theme: webcomponentsTheme, // override the default Storybook theme with a custom fluent theme
    },
  },
};
