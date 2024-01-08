/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// eslint-disable @typescript-eslint/no-unsafe-assignment
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Args, GqlExecutionContext } from '@nestjs/graphql';

// TODO into separate files
export const Input = (...args) => Args('input', ...args);

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return data ? request.cookies?.[data] : request.cookies;
  },
);

export const Response = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().res;
  },
);

export const Request = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  },
);

export const Ip = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req.ip;
  },
);
