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

  findUserBySessionIdOrFail =
    jest.fn<UserService['findUserBySessionIdOrFail']>();

  findByPhoneNumberOrFail = jest.fn<UserService['findByPhoneNumberOrFail']>();

  updateByUserId = jest.fn<UserService['updateByUserId']>();
}

export const MockedUserService: Provider = {
  provide: UserService,
  useClass: MockedUserServiceClass,
};
