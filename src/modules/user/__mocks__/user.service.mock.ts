import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { UserService } from '@modules/user/user.service';
import { Provider } from '@nestjs/common';

export class MockedUserServiceClass implements PublicInterface<UserService> {
  createUser = jest.fn<UserService['createUser']>();

  findAll = jest.fn<UserService['findAll']>();

  findByPhoneNumber = jest.fn<UserService['findByPhoneNumber']>();

  findByUserIdOrFail = jest.fn<UserService['findByUserIdOrFail']>();

  findByUserIds = jest.fn<UserService['findByUserIds']>();

  findUserBySessionId = jest.fn<UserService['findUserBySessionId']>();

  strictFindByPhoneNumber = jest.fn<UserService['strictFindByPhoneNumber']>();

  updateByUserId = jest.fn<UserService['updateByUserId']>();
}

export const MockedUserService: Provider = {
  useClass: MockedUserServiceClass,
  provide: UserService,
};
