import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Args, GqlExecutionContext } from '@nestjs/graphql';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { SessionDto } from '../session/dto';

export type GqlContext = {
  req: ExpressRequest;
  res: ExpressResponse;
  extra?: {
    session?: SessionDto;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- We don't know types beforehand
export const Input = (...args: any[]) => Args('input', ...args);

export const Cookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request =
      GqlExecutionContext.create(ctx).getContext<GqlContext>().req;

    const cookies = (request.cookies?.[cookieName] ?? request.cookies) as
      | Record<string, string>
      | string;

    return cookies;
  },
);

export const SignedCookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request =
      GqlExecutionContext.create(ctx).getContext<GqlContext>().req;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- We need to access property we don't know beforehand
    const cookies = request.signedCookies?.[cookieName] as string | undefined;

    return cookies;
  },
);

export const Response = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<GqlContext>().res;
  },
);

export const Request = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<GqlContext>().req;
  },
);

export const Ip = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<GqlContext>().req.ip;
  },
);
