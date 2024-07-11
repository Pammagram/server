import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { Provider } from '@nestjs/common';

import { ChatService } from '../chat.service';

export class MockedChatServiceClass
  implements PublicInterface<Pick<ChatService, 'create' | 'sendMessage'>>
{
  create = jest.fn<ChatService['create']>();

  sendMessage = jest.fn<ChatService['sendMessage']>();
}

export const MockedChatService: Provider = {
  provide: ChatService,
  useClass: MockedChatServiceClass,
};
