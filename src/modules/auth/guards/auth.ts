import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/modules/common/decorators';
import { SessionService } from 'src/modules/session/session.service';

import { SESSION_ID } from '../auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();

    const sessionId =
      (ctx?.req?.signedCookies?.[SESSION_ID] as string) ??
      ctx.session.sessionId;

    if (!sessionId) {
      console.debug('Session id is not found');

      throw new UnauthorizedException();
    }

    const session = await this.sessionService.findBySessionId(sessionId);

    if (!session) {
      console.debug('Session not found');

      throw new UnauthorizedException();
    }

    // * Last activity exceeds session timeout, require login again
    const currentTimeInMs = Date.now();

    await this.sessionService.updateBySessionId(sessionId, {
      lastVisitInMs: new Date(currentTimeInMs),
    });

    return true;
  }
}
