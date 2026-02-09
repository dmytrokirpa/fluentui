import type { Args } from '../types';

export const argsWithRefs = {
  summaryTitle: 'Fluent UI React v9',
  summaryDescription:
    "Fluent UI React is a library of React components that implement Microsoft's Fluent Design System.",
  summaryBaseUrl: 'https://react.fluentui.dev',
  distPath: 'dist/storybook',
  refs: [
    {
      title: 'Charts v9',
      url: 'https://charts.fluentui.dev',
    },
  ],
  agentSkill: {
    name: 'fluentui-v9-skill',
    description:
      'Agent skill for Fluent UI React v9 documentation, use it to answer questions about Fluent UI React v9 components and concepts.',
    content: [
      '# Fluent UI React v9 Agent Skill',
      ' ',
      'This skill provides documentation for Fluent UI React v9 components and concepts.',
    ].join('\n'),
    license: 'MIT',
    metadata: {
      version: '0.0.1',
      author: 'Fluent UI Team',
    },
  },
} satisfies Args;
