import { config, configValidationSchema } from '@config';
import { expect } from '@jest/globals';
import { AuthModule } from '@modules/auth/module';
import { ChatModule } from '@modules/chat/chat.module';
import { CookieModule } from '@modules/cookie/cookie.module';
import { DbModule } from '@modules/db/db.module';
import { GraphqlModule } from '@modules/graphql/graphql.module';
import { SessionModule } from '@modules/session';
import { UserModule } from '@modules/user/user.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// eslint-disable-next-line import/no-extraneous-dependencies -- only for test
import { Test } from '@nestjs/testing';
// eslint-disable-next-line import/no-extraneous-dependencies -- only for test
import * as request from 'supertest';

import { AppController } from '../../app.controller';

describe('Cats', () => {
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
        UserModule,
        AuthModule,
        SessionModule,
        ChatModule,
        CookieModule,
      ],
      controllers: [AppController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Server starts', async () => {
    const response = await request(app.getHttpServer()).get('/alive');

    expect(response.status).toBe(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
