import { Config } from '@config';
import { SESSION_ID } from '@modules/auth/constants';
import { GqlContext } from '@modules/common/decorators';
import { SessionService } from '@modules/session/service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { parse } from 'cookie';
import { signedCookie } from 'cookie-parser';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [SessionService, ConfigService],
      useFactory: (
        sessionService: SessionService,
        configService: ConfigService<Config>,
      ): ApolloDriverConfig => ({
        autoSchemaFile: true,
        allowBatchedHttpRequests: true,
        context: async (ctx: GqlContext) => {
          if (!ctx.req?.signedCookies) {
            return ctx;
          }

          if (SESSION_ID in ctx.req.signedCookies) {
            try {
              const session =
                await sessionService.findSessionBySessionIdOrFailAndUpdate(
                  ctx.req?.signedCookies[SESSION_ID] as string,
                );

              Object.assign(ctx, {
                extra: {
                  session,
                },
              });
            } catch (error) {
              ctx.res.cookie(SESSION_ID, null);

              return ctx;
            }
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

              if (!sessionIdEncrypted) {
                return;
              }

              const sessionId = signedCookie(
                sessionIdEncrypted,
                configService.getOrThrow('security.cookieSecret', {
                  infer: true,
                }),
              );

              if (!sessionId) {
                return;
              }

              const session =
                await sessionService.findSessionBySessionIdOrFailAndUpdate(
                  sessionId,
                );

              // @ts-expect-error -- mismatching types
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

  const cookiesRaw = headers[cookiesIndex] as string;

  const cookies = parse(cookiesRaw) as Record<string, string>;

  return cookies[cookieName];
};
