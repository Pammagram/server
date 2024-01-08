import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestAndResponse } from 'src/modules/common/decorators';

import { sessions } from '../auth.resolver';

const SESSION_TIMEOUT = 3000;

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request =
      GqlExecutionContext.create(context).getContext<RequestAndResponse>().req;

    const { sessionId } = request.signedCookies as Record<string, string>;

    const session = sessions.find(
      (existingSession) => existingSession.sessionId === sessionId,
    );

    if (!session) {
      console.debug('Session not found');

      throw new UnauthorizedException();
    }

    // * Last activity exceeds session timeout, require login again
    const currentTimeInMs = Date.now();

    if (currentTimeInMs - session.lastVisitInMs > SESSION_TIMEOUT) {
      // TODO nest logger
      console.debug('Session expired');

      throw new UnauthorizedException();
    }

    session.lastVisitInMs = currentTimeInMs;

    return true;
  }
}
