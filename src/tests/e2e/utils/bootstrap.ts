import { config, configValidationSchema } from '@config';
import { AuthModule } from '@modules/auth/module';
import { ChatModule } from '@modules/chat/chat.module';
import { CookieModule } from '@modules/cookie/cookie.module';
import { DbModule } from '@modules/db/db.module';
import { GraphqlModule } from '@modules/graphql/graphql.module';
import { SessionModule } from '@modules/session';
import { UserModule } from '@modules/user/user.module';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppController } from '@root/app.controller';

export const initializeApp = async (): Promise<INestApplication> => {
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

  const app = moduleRef.createNestApplication();

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.init();

  return app;
};
