import { config, configValidationSchema } from '@config';
import { AuthModule } from '@modules/auth/module';
import { ChatModule } from '@modules/chat/chat.module';
import { DbModule } from '@modules/db/db.module';
import { GraphqlModule } from '@modules/graphql/graphql.module';
import { SessionModule } from '@modules/session/module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppResolver } from './app.resolver';
import { CookieModule } from './modules/cookie/cookie.module';

@Module({
  imports: [
    GraphqlModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configValidationSchema,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DbModule,
    UserModule,
    AuthModule,
    SessionModule,
    ChatModule,
    CookieModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
