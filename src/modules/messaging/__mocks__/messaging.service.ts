import { Provider } from '@nestjs/common';

import { MessagingService } from '../messaging.service';

// @ts-expect-error -- ts expects private fields to be defined
class MockedMessagingServiceClass implements MessagingService {
  sendVerificationCode = async (_params) => Promise.resolve();

  validateVerificationCode = (_params) => Promise.resolve();
}

export const MockedMessagingService: Provider = {
  provide: MessagingService,
  useClass: MockedMessagingServiceClass,
};
