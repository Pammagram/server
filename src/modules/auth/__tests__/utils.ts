import { MockedConfigService } from '@core/__mocks__/config.service.mock';
import { MockedCookieService } from '@modules/cookie/__mocks__/cookie.service.mock';
import { MockedMessagingService } from '@modules/messaging/__mocks__/messaging.service.mock';
import { MockedSessionService } from '@modules/session/__mocks__/session.service.mock';
import { MockedUserService } from '@modules/user/__mocks__/user.service.mock';
import { Test } from '@nestjs/testing';

import { MockedAuthService } from '../__mocks__/auth.service.mock';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';

export const triggerVerifySms = async (resolver: AuthResolver) => {
  const phoneNumber = '+380977777777';

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- mock response object
  await resolver.verifySms('test ip', {} as any, {
    code: 'test code',
    device: 'test device',
    phoneNumber,
  });
};

export const initAuthServiceTestModule = async () => {
  const module = await Test.createTestingModule({
    providers: [AuthService, MockedUserService, MockedMessagingService],
  }).compile();

  const service = module.get<AuthService>(AuthService);

  return {
    module,
    service,
  };
};

export const initAuthResolverTestModule = async () => {
  const module = await Test.createTestingModule({
    providers: [
      AuthResolver,
      MockedAuthService,
      MockedUserService,
      MockedMessagingService,
      MockedConfigService,
      MockedSessionService,
      MockedCookieService,
    ],
  }).compile();

  const resolver = module.get<AuthResolver>(AuthResolver);

  return {
    module,
    resolver,
  };
};
