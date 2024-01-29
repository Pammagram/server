import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CONFIG_PROVIDER } from 'src/config';

import { SESSION_ID } from '../auth/auth.constants';
import { GqlContext } from '../common/decorators';
import { SessionService } from '../session/session.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [SessionService, CONFIG_PROVIDER],
      useFactory: (
        sessionService: SessionService,
        // configService: ConfigType, // TODO check if needed to disable playground on prod
      ): ApolloDriverConfig => ({
        autoSchemaFile: true,
        allowBatchedHttpRequests: true,
        context: async (ctx: GqlContext) => {
          if (SESSION_ID in ctx.req.signedCookies) {
            const session = await sessionService.findBySessionIdOrFail(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- we are sure it's in there
              ctx.req.signedCookies[SESSION_ID] as string,
            );

            return {
              ...ctx,
              session,
            };
          }

          return ctx;
        },
        subscriptions: {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- library property
          'subscriptions-transport-ws': {
            onConnect: async (ctx: { sessionId?: string }) => {
              const { sessionId } = ctx;

              if (!sessionId) {
                return ctx;
              }

              const session =
                await sessionService.findBySessionIdOrFail(sessionId);

              return {
                ...ctx,
                session,
              };
            },
          },
        },
        playground: {
          settings: {
            // eslint-disable-next-line @typescript-eslint/naming-convention -- we don't need it here
            'request.credentials': 'include', // Otherwise cookies won't be sent
          },
        },
      }),
    }),
  ],
})
export class GraphqlModule {}
