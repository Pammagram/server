import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { Provider } from '@nestjs/common';

import { MessagingService } from '../messaging.service';

export const MOCK_VERIFICATION_CODE = 'mocked_verification_code';

export class MockedMessagingServiceClass
  implements PublicInterface<MessagingService>
{
  private verificationCode: string;

  sendVerificationCode = jest.fn<MessagingService['sendVerificationCode']>(
    async (_params): Promise<void> => {
      await Promise.resolve();
      this.verificationCode = Math.random().toString(36);
    },
  );

  validateVerificationCode = jest.fn<
    MessagingService['validateVerificationCode']
  >(async (params): Promise<void> => {
    await Promise.resolve();

    if (params.code === MOCK_VERIFICATION_CODE) {
      return;
    }

    if (params.code !== this.verificationCode) {
      throw new Error('Wrong code');
    }
  });

  getVerificationCode(): string {
    return this.verificationCode;
  }
}

export const MockedMessagingService: Provider = {
  provide: MessagingService,
  useClass: MockedMessagingServiceClass,
};
