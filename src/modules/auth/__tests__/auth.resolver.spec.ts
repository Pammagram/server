import { CookieService } from '@modules/cookie/cookie.service';
import { MessagingService } from '@modules/messaging/messaging.service';
import { SessionService } from '@modules/session';
import { TestingModule } from '@nestjs/testing';

import { initAuthResolverTestModule, triggerVerifySms } from './utils';

import { MockedAuthServiceClass } from '../__mocks__/auth.service.mock';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let testModule: TestingModule;

  beforeAll(async () => {
    const { module, resolver } = await initAuthResolverTestModule();

    authResolver = resolver;
    testModule = module;
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('Sending sms', () => {
    it('invoke messaging service to send sms', async () => {
      const authService: MockedAuthServiceClass =
        testModule.get<MockedAuthServiceClass>(AuthService);

      const phoneNumber = '+380977777777';

      await authResolver.sendSms({ phoneNumber });

      expect(authService.sendSms).toHaveBeenCalledWith(phoneNumber);
    });
  });

  describe('Verifying sms', () => {
    it('invokes messaging service to validate code', async () => {
      const messagingService =
        testModule.get<MessagingService>(MessagingService);

      await triggerVerifySms(authResolver);

      expect(messagingService.validateVerificationCode).toHaveBeenCalled();
    });

    it('invokes session service to create session', async () => {
      const sessionService = testModule.get<SessionService>(SessionService);

      await triggerVerifySms(authResolver);

      expect(sessionService.createSession).toHaveBeenCalled();
    });

    it('invokes cookies service to set auth cookie', async () => {
      const cookieService = testModule.get<CookieService>(CookieService);

      await triggerVerifySms(authResolver);

      expect(cookieService.setCookie).toHaveBeenCalled();
    });
  });
});
