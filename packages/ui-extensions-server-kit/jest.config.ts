import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true,
    },
  },

  setupFilesAfterEnv: ['<rootDir>/src/testing/setup.ts'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testEnvironment: 'jsdom',

  testPathIgnorePatterns: ['node_modules', 'dist'],

  moduleNameMapper: {
    'tests/(.*)': '<rootDir>/tests/$1',
    '\\.(scss)$': '<rootDir>/tests/css-transform.js',
  },

  moduleDirectories: ['node_modules', 'src'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default config;
