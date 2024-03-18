import { MockedConfigService } from '@core/__mocks__/config.service.mock';
import { MockedMessagingService } from '@modules/messaging/__mocks__/messaging.service';
import { MockedSessionService } from '@modules/session/__mocks__/session.service.mock';
import { MockedUserService } from '@modules/user/__mocks__/service';
import { Test, TestingModule } from '@nestjs/testing';

import { MockedAuthService } from '../__mocks__/auth.service.mock';
import { AuthResolver } from '../resolver';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
});
