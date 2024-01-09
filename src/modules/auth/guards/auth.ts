import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigType } from 'src/config';
import { Config, RequestAndResponse } from 'src/modules/common/decorators';

import { sessions } from '../auth.resolver';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly config: ConfigType['auth'];

  constructor(@Config() configService: ConfigType) {
    this.config = configService.auth;
  }

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

    if (
      currentTimeInMs - session.lastVisitInMs >
      this.config.sessionTimeoutInMs
    ) {
      // TODO nest logger
      console.debug('Session expired');

      throw new UnauthorizedException();
    }

    session.lastVisitInMs = currentTimeInMs;

    return true;
  }
}
