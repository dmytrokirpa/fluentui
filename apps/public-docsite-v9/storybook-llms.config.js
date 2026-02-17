// @ts-check

const fs = require('node:fs');
const path = require('node:path');
const storybookConfig = require('./.storybook/main');

const skillContent = fs.readFileSync(path.join(__dirname, 'assets/SKILL.md'), 'utf-8');

/**
 * Config for the LLMs docs generator script.
 * @see {@link file://./../../tools/storybook-llms-extractor/src/cli.ts}
 *
 * @type {import('@fluentui/storybook-llms-extractor').Config}
 */
module.exports = {
  distPath: './dist/react',
  summaryBaseUrl: 'https://storybooks.fluentui.dev/react',
  summaryTitle: 'Fluent UI React v9',
  summaryDescription:
    "Fluent UI React is a library of React components that implement Microsoft's [Fluent Design System](https://fluent2.microsoft.design).",
  agentSkill: {
    name: 'fluentui-react-v9',
    description:
      "Comprehensive documentation for Fluent UI React v9 - Microsoft's official React component library implementing Fluent Design System. Covers 100+ production-ready components (Button, Dialog, Menu, Table, DataGrid, etc.), theming system with design tokens, accessibility patterns (WCAG 2.1 AA compliant), migration guides from v8/v0, styling with Griffel CSS-in-JS, positioning utilities, motion/animation components, SSR support (Next.js, Remix, React Router), and development best practices. Use when working with: fluent ui, react components, microsoft design, fluent design system, @fluentui/react-components, ui component library, accessible components, design tokens, theme customization, migration from v8 or v0.",
    content: skillContent,
  },
  refs: storybookConfig.refs ? Object.values(storybookConfig.refs) : [],
};
