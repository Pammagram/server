import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppResolver],
  exports: [],
})
export class AppModule {}
