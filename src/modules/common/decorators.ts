import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { Args, GqlExecutionContext } from '@nestjs/graphql';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { CONFIG_PROVIDER } from 'src/config';

export type RequestAndResponse = {
  req: ExpressRequest;
  res: ExpressResponse;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- We don't know types beforehand
export const Input = (...args) => Args('input', ...args);

export const Cookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request =
      GqlExecutionContext.create(ctx).getContext<RequestAndResponse>().req;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- We need to access property we don't know beforehand
    const cookies = (request.cookies?.[cookieName] ?? request.cookies) as
      | Record<string, string>
      | string;

    return cookies;
  },
);

export const SignedCookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request =
      GqlExecutionContext.create(ctx).getContext<RequestAndResponse>().req;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- We need to access property we don't know beforehand
    const cookies = (request.signedCookies?.[cookieName] ?? request.cookies) as
      | Record<string, string>
      | string;

    return cookies;
  },
);

export const Response = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<RequestAndResponse>().res;
  },
);

export const Request = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<RequestAndResponse>().req;
  },
);

export const Ip = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<RequestAndResponse>().req.ip;
  },
);

// TODO to config
export const Config = () => Inject(CONFIG_PROVIDER);
