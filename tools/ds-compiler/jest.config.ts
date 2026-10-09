import type { Config } from 'jest';

const config: Config = {
  displayName: 'ds-compiler',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  coverageDirectory: '../../coverage/tools/ds-compiler',
};

export default config;
