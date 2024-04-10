import { config, configValidationSchema } from '@config';
import { beforeEach, describe } from '@jest/globals';
import { ChatModule } from '@modules/chat/chat.module';
import { ChatService } from '@modules/chat/chat.service';
import { CreateChatInput } from '@modules/chat/dto';
import { ChatType } from '@modules/chat/entities';
import { DbModule } from '@modules/db/db.module';
import { SessionModule } from '@modules/session';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { omit, pick } from 'lodash';

import { createNewSchema, dropSchema } from '../utils';

describe('Chat service', () => {
  let schemaName: string;
  let module: TestingModule;
  let chatService: ChatService;
  let userService: UserService;

  beforeEach(async () => {
    // TODO can abstract away creating testing module
    const { schema } = await createNewSchema();

    schemaName = schema;

    try {
      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validationSchema: configValidationSchema,
          }),
          DbModule.forTest(schemaName),
          ChatModule,
          UserModule,
          SessionModule,
        ],
      }).compile();
    } catch (error) {
      console.error(error);
      // * if initialization goes wrong - remove created schema
      await dropSchema(schemaName);
    }

    chatService = module.get<ChatService>(ChatService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('Fetches empty list of chats', async () => {
    const chats = await chatService.findAll();

    expect(chats).toHaveLength(0);
  });

  it('Creates chat', async () => {
    const chats = await chatService.findAll();

    expect(chats).toHaveLength(0);

    const createChatData: CreateChatInput = {
      memberIds: [],
      title: 'test',
      type: ChatType.PRIVATE,
    };

    await chatService.create(createChatData);

    const newChats = await chatService.findAll();

    expect(newChats.length).toBe(1);

    const newChat = pick(newChats[0], ['title', 'type']);

    expect(newChat).toEqual(omit(createChatData, ['memberIds']));
  });

  it('Adds message to chat', async () => {
    const createChatData: CreateChatInput = {
      memberIds: [],
      title: 'test',
      type: ChatType.PRIVATE,
    };

    const newUser = await userService.createUser({
      phoneNumber: 'test',
      username: 'test',
    });

    await chatService.create(createChatData);

    const newChats = await chatService.findAll();

    const newChat = newChats[0]!;

    const testingMessage = 'testing message';

    await chatService.addMessage(newUser.id, newChat?.id, testingMessage);

    const messages = await chatService.messages(newChat.id);

    expect(messages[0]?.text).toEqual(testingMessage);
  });
});
