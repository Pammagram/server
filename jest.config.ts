/* eslint-disable @typescript-eslint/naming-convention -- jest config */
import { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: 'src/.*/.*/__tests__/.*\\.spec\\.ts',
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
  },
};

export default jestConfig;
