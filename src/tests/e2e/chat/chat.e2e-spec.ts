import { Config, config, configValidationSchema } from '@config';
import { ChatModule } from '@modules/chat/chat.module';
import { DbModule } from '@modules/db/db.module';
import { GraphqlModule } from '@modules/graphql/graphql.module';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppController } from '@root/app.controller';
import { SESSION_ID } from '@root/modules/auth/constants';
import { AuthGuard } from '@root/modules/auth/guards';
import {
  AddMessageInput,
  AddMessageOutput,
  CreateChatOutput,
} from '@root/modules/chat/dto';
import { ChatType } from '@root/modules/chat/entities';
import { SessionModule, SessionService } from '@root/modules/session';
import { UserModule } from '@root/modules/user/user.module';
import { UserService } from '@root/modules/user/user.service';
import * as cookieParser from 'cookie-parser';
import gqlRequest from 'supertest-graphql';

import { createAddMessageMutation } from './mutations/addMessage';
import { createCreateChatMutation } from './mutations/createChat';

describe('Chat flow', () => {
  let app: INestApplication;
  let userService: UserService;
  let sessionService: SessionService;

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

    userService = app.get<UserService>(UserService);
    sessionService = app.get<SessionService>(SessionService);

    app.use(cookieParser(cookieSecret));

    app.enableCors({
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    await app.init();

    return app;
  });

  afterEach(async () => {
    await app.close();
  });

  it('Creates chat', async () => {
    const { data } = await gqlRequest<{ createChat: CreateChatOutput }>(
      app.getHttpServer(),
    )
      .mutate(createCreateChatMutation())
      .variables({
        input: {
          memberIds: [],
          title: 'test',
          type: ChatType.GROUP.toUpperCase(),
        },
      })
      .expectNoErrors();

    expect(data?.createChat.data).toBeDefined();
  });

  it('Sends message', async () => {
    const server = app.getHttpServer();

    const user = await userService.createUser({
      phoneNumber: Math.random().toString(36),
      username: 'test',
    });

    const session = await sessionService.createSession({
      device: 'test',
      ip: 'q23',
      user,
      rememberMe: false,
    });

    const { data: chat } = await gqlRequest<{ createChat: CreateChatOutput }>(
      server,
    )
      .mutate(createCreateChatMutation())
      .variables({
        input: {
          memberIds: [user.id],
          title: 'testingChat',
          type: ChatType.GROUP.toUpperCase(),
        },
      })
      .expectNoErrors();

    const { data } = await gqlRequest<{ addMessage: AddMessageOutput }>(server)
      .mutate(createAddMessageMutation())
      .variables({
        input: {
          chatId: chat!.createChat.data.id,
          text: 'test',
        } satisfies AddMessageInput,
      })
      .set('Cookie', [`${SESSION_ID}=${session.sessionId}`])
      .expectNoErrors();

    expect(data?.addMessage.data).toBeDefined();
  });
});
