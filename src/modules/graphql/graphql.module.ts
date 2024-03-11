import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { parse } from 'cookie';
import { signedCookie } from 'cookie-parser';

import { CONFIG_PROVIDER, ConfigType } from '$config';
import { SESSION_ID } from '$modules/auth/constants';
import { GqlContext } from '$modules/common/decorators';
import { SessionService } from '$modules/session/service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [SessionService, CONFIG_PROVIDER],
      useFactory: (
        sessionService: SessionService,
        configService: ConfigType,
      ): ApolloDriverConfig => ({
        autoSchemaFile: true,
        allowBatchedHttpRequests: true,
        context: async (ctx: GqlContext) => {
          if (ctx.req.signedCookies && SESSION_ID in ctx.req.signedCookies) {
            const session =
              await sessionService.findSessionBySessionIdOrFailAndUpdate(
                ctx.req?.signedCookies[SESSION_ID] as string,
              );

            Object.assign(ctx, {
              extra: {
                session,
              },
            });
          }

          return ctx;
        },
        subscriptions: {
          // ! This is for playground
          // eslint-disable-next-line @typescript-eslint/naming-convention -- library property
          'subscriptions-transport-ws': {
            onConnect: async (ctx: { sessionId?: string }) => {
              const { sessionId } = ctx;

              if (!sessionId) {
                throw new Error('No auth cookies found');
              }

              const session =
                await sessionService.findSessionBySessionIdOrFailAndUpdate(
                  sessionId,
                );

              return {
                ...ctx,
                extra: {
                  session,
                },
              };
            },
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention -- don't need
          'graphql-ws': {
            onConnect: async (ctx) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- workaround
              const rawHeaders = (ctx.extra as any).request
                .rawHeaders as string[];

              const sessionIdEncrypted = parseCookie(rawHeaders, SESSION_ID);

              const sessionId = signedCookie(
                sessionIdEncrypted,
                configService.security.cookieSecret,
              );

              if (!sessionId) {
                return false;
              }

              const session =
                await sessionService.findSessionBySessionIdOrFailAndUpdate(
                  sessionId,
                );

              Object.assign(ctx.extra, {
                session,
              });
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

export const parseCookie = (headers: string[], cookieName: string) => {
  const cookiesIndex = headers.findIndex((header) => header === 'Cookie') + 1;

  const cookiesRaw = headers[cookiesIndex];

  const cookies = parse(cookiesRaw);

  return cookies[cookieName];
};
