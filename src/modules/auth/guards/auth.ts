import { GqlContext } from '@modules/common/decorators';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const session = ctx?.extra?.session;

    if (!session) {
      throw new ForbiddenException();
    }

    return true;
  }
}
