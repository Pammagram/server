import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { Provider } from '@nestjs/common';

import { AuthService } from '../auth.service';

export class MockedAuthServiceClass implements PublicInterface<AuthService> {
  sendSms = jest.fn<AuthService['sendSms']>();
}

export const MockedAuthService: Provider = {
  provide: AuthService,
  useClass: MockedAuthServiceClass,
};
