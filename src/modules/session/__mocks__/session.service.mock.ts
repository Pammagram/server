import { Provider } from '@nestjs/common';

import { SessionService } from '../service';

// @ts-expect-error -- ts expects private fields to be defined
class MockedSessionServiceClass implements AuthService {
  sendSms = (_phoneNumber) => Promise.resolve(true) as Promise<true>;
}

export const MockedSessionService: Provider = {
  provide: SessionService,
  useClass: MockedSessionServiceClass,
};
