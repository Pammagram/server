/* eslint-disable @typescript-eslint/naming-convention -- jest config */
import { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@modules(.*)': '<rootDir>/src/modules$1',
    '^@config': '<rootDir>/src/config/index.ts',
  },
};

export default jestConfig;
