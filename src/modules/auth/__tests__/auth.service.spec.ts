import {
  MockedMessagingService,
  MockedMessagingServiceClass,
} from '@modules/messaging/__mocks__/messaging.service.mock';
import { MessagingService } from '@modules/messaging/messaging.service';
import { MockedUserService } from '@modules/user/__mocks__/service';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../service';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [AuthService, MockedUserService, MockedMessagingService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('invokes messaging service on sending sms', async () => {
    const phoneNumber = '+380977777777';

    await service.sendSms(phoneNumber);

    const messagingService = module.get(
      MessagingService,
    ) as MockedMessagingServiceClass;

    expect(messagingService.sendVerificationCode).toHaveBeenCalledWith({
      phoneNumber,
    });
  });
});
