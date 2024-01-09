import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { RequestAndResponse } from '../common/decorators';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: (ctx: RequestAndResponse) => ctx,
      playground: {
        settings: {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- we don't need it here
          'request.credentials': 'include', // Otherwise cookies won't be sent
        },
      },
    }),
  ],
})
export class GraphqlModule {}
