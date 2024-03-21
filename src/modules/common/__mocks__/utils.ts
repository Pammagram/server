import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

export const repositoryMockFactory: () => MockType<Repository<object>> =
  jest.fn(() => ({
    // * querying
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),

    // * saving
    update: jest.fn(),
    save: jest.fn(),
  }));
