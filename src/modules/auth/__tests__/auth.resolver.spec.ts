import { MockedConfigService } from '@core/__mocks__/config.service.mock';
import { MockedMessagingService } from '@modules/messaging/__mocks__/messaging.service.mock';
import { MockedSessionService } from '@modules/session/__mocks__/session.service.mock';
import { MockedUserService } from '@modules/user/__mocks__/service';
import { Test, TestingModule } from '@nestjs/testing';

import {
  MockedAuthService,
  MockedAuthServiceClass,
} from '../__mocks__/auth.service.mock';
import { AuthResolver } from '../resolver';
import { AuthService } from '../service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthResolver,
        MockedAuthService,
        MockedUserService,
        MockedMessagingService,
        MockedConfigService,
        MockedSessionService,
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('invokes right services', () => {
    it('invoke sending sms service', async () => {
      const authService: MockedAuthServiceClass =
        module.get<MockedAuthServiceClass>(AuthService);

      const phoneNumber = '+380977777777';

      await resolver.sendSms({ phoneNumber });

      expect(authService.sendSms).toHaveBeenCalledWith(phoneNumber);
    });
  });
});
