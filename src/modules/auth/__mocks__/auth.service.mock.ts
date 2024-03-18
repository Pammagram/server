import { Provider } from '@nestjs/common';

import { AuthService } from '../service';

// @ts-expect-error -- ts expects private fields to be defined
class MockedAuthServiceClass implements AuthService {
  sendSms = (_phoneNumber) => Promise.resolve(true) as Promise<true>;
}

export const MockedAuthService: Provider = {
  provide: AuthService,
  useClass: MockedAuthServiceClass,
};
