import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

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
  ],
})
export class GraphqlModule {}
