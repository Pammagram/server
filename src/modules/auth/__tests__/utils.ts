import { MockedConfigService } from '@config/__mocks__/config.service.mock';
import { MockedCookieService } from '@modules/cookie/__mocks__/cookie.service.mock';
import { MockedMessagingService } from '@modules/messaging/__mocks__/messaging.service.mock';
import { MockedSessionService } from '@modules/session/__mocks__/session.service.mock';
import { MockedUserService } from '@modules/user/__mocks__/user.service.mock';
import { Test } from '@nestjs/testing';
import { Response } from 'express';

import { MockedAuthService } from '../__mocks__/auth.service.mock';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';

export const triggerVerifySms = async (resolver: AuthResolver) => {
  const phoneNumber = '+380977777777';

  await resolver.verifySms('test ip', mockedExpressResponse, {
    code: 'test code',
    device: 'test device',
    phoneNumber,
  });
};

export const triggerLogout = async (resolver: AuthResolver) => {
  const sessionId = 'test session id';

  await resolver.logout(mockedExpressResponse, sessionId);
};

export const initAuthServiceTestModule = async () => {
  const module = await Test.createTestingModule({
    providers: [AuthService, MockedUserService, MockedMessagingService],
  }).compile();

  const service = await module.resolve<AuthService>(AuthService);

  return {
    module,
    service,
  };
};

export const initAuthResolverTestModule = async () => {
  console.log(' MockedConfigService', MockedConfigService);

  const module = await Test.createTestingModule({
    providers: [
      AuthResolver,
      MockedAuthService,
      MockedUserService,
      MockedSessionService,
      MockedMessagingService,
      MockedCookieService,
      MockedConfigService,
    ],
  }).compile();

  const resolver = await module.resolve<AuthResolver>(AuthResolver);

  return {
    module,
    resolver,
  };
};

export const mockedExpressResponse = {} as Response;
