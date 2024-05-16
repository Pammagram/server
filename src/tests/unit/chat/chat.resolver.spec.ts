import { config, configValidationSchema } from '@config';
import { describe } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MockedChatService } from '@root/modules/chat/__mocks__/chat.service.mock';
import { ChatService } from '@root/modules/chat/chat.service';
import { ChatType } from '@root/modules/chat/entities';
import { ChatResolver } from '@root/modules/chat/resolvers/chats';
import { MessageResolver } from '@root/modules/chat/resolvers/messages';
import { MockedUserService } from '@root/modules/user/__mocks__/user.service.mock';

describe('Chat resolver', () => {
  let app: INestApplication;
  let chatResolver: ChatResolver;
  let messageResolver: MessageResolver;
  let chatService: ChatService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
          validationSchema: configValidationSchema,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [
        MessageResolver,
        ChatResolver,
        MockedChatService,
        MockedUserService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    chatResolver = app.get<ChatResolver>(ChatResolver);
    chatService = app.get<ChatService>(ChatService);
    messageResolver = app.get<MessageResolver>(MessageResolver);

    return app;
  });

  describe('Create chat', () => {
    test('Triggers create method', async () => {
      await chatResolver.createChat({
        memberIds: [],
        title: 'test',
        type: ChatType.GROUP,
      });

      expect(chatService.create).toHaveBeenCalled();
    });
  });

  describe('Send message', () => {
    test('Triggers addMessage method', async () => {
      await messageResolver.addMessage(
        {
          chatId: 0,
          text: 'test',
        },
        'test',
      );

      expect(chatService.addMessage).toHaveBeenCalled();
    });
  });
});
