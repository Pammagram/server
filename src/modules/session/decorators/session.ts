import { SESSION_ID } from '@modules/auth/constants';
import { GqlContext, SignedCookies } from '@modules/common/decorators';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const SessionId = SignedCookies.bind(
  SignedCookies,
  SESSION_ID,
) as typeof SignedCookies;

export const Session = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const gqlContext = ctx.getContext<GqlContext>();

    return gqlContext.extra.session;
  },
);
