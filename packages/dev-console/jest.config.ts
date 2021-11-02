import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true,
    },
  },

  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testEnvironment: 'jsdom',

  moduleNameMapper: {
    'tests/(.*)': '<rootDir>/tests/$1',
    '\\.(scss)$': '<rootDir>/__mocks__/styleMock.js',
  },

  moduleDirectories: ['node_modules', 'src'],

  transform: {
    '^.+\\.scss$': '<rootDir>/tests/css-transform.ts',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};

export default config;
