import { repositoryMockFactory } from '@modules/common/__mocks__/utils';
import { MockedSessionService } from '@modules/session/__mocks__/session.service.mock';
import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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

export const UserRepositoryProvider = getRepositoryToken(UserEntity);

export const MockedUserRepository: Provider = {
  provide: UserRepositoryProvider,
  useFactory: repositoryMockFactory,
};
