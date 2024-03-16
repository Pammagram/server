import { MockedMessagingService } from '@modules/messaging/__mocks__/messaging.service';
import { MockedUserService } from '@modules/user/__mocks__/service';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, MockedUserService, MockedMessagingService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
