import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config, { configValidationSchema } from 'src/config';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AuthModule } from './modules/auth/auth.module';
import { DbModule } from './modules/db/db.module';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { UserModule } from './modules/user/user.module';

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
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppResolver],
  exports: [],
})
export class AppModule {}
