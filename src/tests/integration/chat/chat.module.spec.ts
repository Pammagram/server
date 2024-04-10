import { config, configValidationSchema } from '@config';
import { beforeEach, describe } from '@jest/globals';
import { ChatModule } from '@modules/chat/chat.module';
import { ChatService } from '@modules/chat/chat.service';
import { CreateChatInput } from '@modules/chat/dto';
import { ChatType } from '@modules/chat/entities';
import { DbModule } from '@modules/db/db.module';
import { SessionModule } from '@modules/session';
import { UserModule } from '@modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { omit, pick } from 'lodash';

import { createNewSchema, dropSchema } from '../utils';

describe('Chat service', () => {
  let schemaName: string;
  let module: TestingModule;
  let service: ChatService;

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

    service = module.get<ChatService>(ChatService);
  });

  afterEach(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('Fetches empty list of chats', async () => {
    const chats = await service.findAll();

    expect(chats).toHaveLength(0);
  });

  it('Creates chat', async () => {
    const chats = await service.findAll();

    expect(chats).toHaveLength(0);

    const createChatData: CreateChatInput = {
      memberIds: [],
      title: 'test',
      type: ChatType.PRIVATE,
    };

    await service.create(createChatData);

    const newChats = await service.findAll();

    expect(newChats.length).toBe(1);

    const newChat = pick(newChats[0], ['title', 'type']);

    expect(newChat).toEqual(omit(createChatData, ['memberIds']));
  });
});
