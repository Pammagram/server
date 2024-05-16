import { config, configValidationSchema } from '@config';
import { describe } from '@jest/globals';
import { ChatModule } from '@modules/chat/chat.module';
import { DbModule } from '@modules/db/db.module';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthGuard } from '@root/modules/auth/guards';
import {
  MockedChatService,
  MockedChatServiceClass,
} from '@root/modules/chat/__mocks__/chat.service.mock';
import { ChatService } from '@root/modules/chat/chat.service';
import { ChatType } from '@root/modules/chat/entities';
import { ChatResolver } from '@root/modules/chat/resolvers/chats';
import { MockedUserServiceClass } from '@root/modules/user/__mocks__/user.service.mock';
import { UserService } from '@root/modules/user/user.service';

describe('Chat resolver', () => {
  let app: INestApplication;
  let chatResolver: ChatResolver;
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
        DbModule.forRoot(),
        ChatModule,
      ],
      providers: [MockedChatService],
    })
      .overrideProvider(ChatService)
      .useClass(MockedChatServiceClass)
      .overrideProvider(UserService)
      .useClass(MockedUserServiceClass)
      .overrideGuard(AuthGuard)
      .useValue({ canActive: () => true })
      .compile();

    app = moduleRef.createNestApplication();

    chatResolver = app.get<ChatResolver>(ChatResolver);
    chatService = app.get<ChatService>(ChatService);

    return app;
  });

  describe('Create chat', () => {
    test('Triggers correct chat service', async () => {
      await chatResolver.createChat({
        memberIds: [],
        title: 'test',
        type: ChatType.GROUP,
      });

      expect(chatService.create).toHaveBeenCalled();
    });
  });
});
