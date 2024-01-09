import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import config, { configValidationSchema } from 'src/config';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AuthModule } from './modules/auth/auth.module';
import { DbModule } from './modules/db/db.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configValidationSchema,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      playground: {
        settings: {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- we don't need it here
          'request.credentials': 'include', // Otherwise cookies won't be sent
        },
      },
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
