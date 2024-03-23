import { MockedMessagingServiceClass } from '@modules/messaging/__mocks__/messaging.service.mock';
import { MessagingService } from '@modules/messaging/messaging.service';
import { MockedUserServiceClass } from '@modules/user/__mocks__/user.service.mock';
import { UserService } from '@modules/user/user.service';
import { TestingModule } from '@nestjs/testing';

import { initAuthServiceTestModule } from './utils';

import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let testingModule: TestingModule;
  const phoneNumber = '+380977777777';

  beforeAll(async () => {
    const { module, service } = await initAuthServiceTestModule();

    authService = service;
    testingModule = module;
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Sending sms', () => {
    it('invokes user service to find user', async () => {
      await authService.sendSms(phoneNumber);

      const userService =
        testingModule.get<MockedUserServiceClass>(UserService);

      expect(userService.findByPhoneNumber).toHaveBeenCalled();
    });

    it('invokes user service to create user if not exist', async () => {
      const userService =
        testingModule.get<MockedUserServiceClass>(UserService);

      // * ensure that createUser has preconditions to be called
      jest
        .spyOn(userService, 'findByPhoneNumber')
        .mockImplementation(() => Promise.resolve(null));

      await authService.sendSms(phoneNumber);

      expect(userService.createUser).toHaveBeenCalled();
    });

    it('invokes messaging service to send sms', async () => {
      await authService.sendSms(phoneNumber);

      const messagingService =
        testingModule.get<MockedMessagingServiceClass>(MessagingService);

      expect(messagingService.sendVerificationCode).toHaveBeenCalledWith({
        phoneNumber,
      });
    });
  });
});
