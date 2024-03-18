import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { Provider } from '@nestjs/common';

import { MessagingService } from '../messaging.service';

export class MockedMessagingServiceClass
  implements PublicInterface<MessagingService>
{
  sendVerificationCode = jest.fn<MessagingService['sendVerificationCode']>();

  validateVerificationCode =
    jest.fn<MessagingService['validateVerificationCode']>();
}

export const MockedMessagingService: Provider = {
  provide: MessagingService,
  useClass: MockedMessagingServiceClass,
};
