import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from '$modules/common/decorators';
import { SessionDto } from '$modules/session/dto';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext & { session?: SessionDto }): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const session = ctx?.extra?.session;

    if (!session) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
