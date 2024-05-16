import { Config, config, configValidationSchema } from '@config';
import { ChatModule } from '@modules/chat/chat.module';
import { DbModule } from '@modules/db/db.module';
import { GraphqlModule } from '@modules/graphql/graphql.module';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppController } from '@root/app.controller';
import { AuthGuard } from '@root/modules/auth/guards';
import {
  MESSAGE_ADDED,
  MessageAddedOutput,
  MessageDto,
} from '@root/modules/chat/dto';
import { ChatType } from '@root/modules/chat/entities';
import { pubSub } from '@root/modules/chat/resolvers/messages';
import { SessionModule } from '@root/modules/session';
import { mockedUser } from '@root/modules/user/__mocks__/user.entity.mock';
import { UserModule } from '@root/modules/user/user.module';
import * as cookieParser from 'cookie-parser';
import { supertestWs } from 'supertest-graphql';

import { createMessageAddedSubscription } from './subscriptions/messageAdded';

// * mock to always return message for any user
jest.mock('@root/modules/chat/chat.filter.ts', () => {
  return {
    messageAddedFilter: () => {
      return true;
    },
  };
});

describe('Chat flow', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphqlModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
          validationSchema: configValidationSchema,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        DbModule.forRoot(),
        ChatModule,
        SessionModule,
        UserModule,
      ],
      controllers: [AppController],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();

    const configService = app.get<ConfigService<Config>>(ConfigService);

    const cookieSecret = configService.getOrThrow('security.cookieSecret', {
      infer: true,
    });

    app.use(cookieParser(cookieSecret));

    app.enableCors({
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    await app.init();

    return app.listen(0, 'localhost');
  });

  afterEach(async () => {
    await app.close();
  });

  it('Receives message by subscription', async () => {
    const server = app.getHttpServer();

    const subscription = await supertestWs<{
      messageAdded: MessageAddedOutput;
    }>(server).subscribe(createMessageAddedSubscription());

    const mockedMessage = {
      data: {
        chat: { id: 0, members: [], title: 'test', type: ChatType.GROUP },
        createdAt: new Date(),
        id: 0,
        sender: mockedUser,
        text: 'test',
        updatedAt: new Date(),
      } satisfies MessageDto,
    };

    setTimeout(() => {
      void pubSub.publish(MESSAGE_ADDED, {
        [MESSAGE_ADDED]: mockedMessage,
      });
    }, 50);

    const { data } = await subscription.next();

    void subscription.close();

    expect(data?.messageAdded.data.id).toBe(mockedMessage.data.id);
  });
});
