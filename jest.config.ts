/* eslint-disable @typescript-eslint/naming-convention -- jest config */
import { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@modules(.*)': '<rootDir>/src/modules$1',
    '^@config': '<rootDir>/src/config/index.ts',
    '^@core(.*)': '<rootDir>/src/core$1',
    '^@root(.*)': '<rootDir>/src$1',
  },
};

export default jestConfig;
