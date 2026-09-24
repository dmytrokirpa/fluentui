// @ts-check

const fluentPlugin = require('@fluentui/eslint-plugin');

module.exports = [
  ...fluentPlugin.configs['flat/react'],
  {
    files: ['src/**/*.cy.ts', 'src/**/*.cy.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: './tsconfig.cy.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
