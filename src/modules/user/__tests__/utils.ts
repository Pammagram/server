import { MockedSessionService } from '@modules/session/__mocks__/session.service.mock';
import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities';
import { UserService } from '../user.service';

export const initUserServiceTestModule = async () => {
  const module = await Test.createTestingModule({
    providers: [UserService, MockedSessionService, MockedUserRepository],
  }).compile();

  const service = module.get<UserService>(UserService);

  return {
    module,
    service,
  };
};

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    // * querying
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),

    // * saving
    update: jest.fn(),
    save: jest.fn(),
  }),
);

export const UserRepositoryProvider = getRepositoryToken(UserEntity);

export const MockedUserRepository: Provider = {
  provide: UserRepositoryProvider,
  useFactory: repositoryMockFactory,
};
