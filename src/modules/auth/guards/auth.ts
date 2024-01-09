import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigType } from 'src/config';
import { Config, RequestAndResponse } from 'src/modules/common/decorators';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly config: ConfigType['auth'];

  constructor(
    @Config() configService: ConfigType,
    private readonly authService: AuthService,
  ) {
    this.config = configService.auth;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      GqlExecutionContext.create(context).getContext<RequestAndResponse>().req;

    const { sessionId } = request.signedCookies as Record<string, string>;

    const session = await this.authService.findSessionById(sessionId);

    if (!session) {
      console.debug('Session not found');

      throw new UnauthorizedException();
    }

    // * Last activity exceeds session timeout, require login again
    const currentTimeInMs = Date.now();

    if (
      currentTimeInMs - session.lastVisitInMs.getTime() >
      this.config.sessionTimeoutInMs
    ) {
      // TODO nest logger
      console.debug('Session expired');

      throw new UnauthorizedException();
    }

    await this.authService.updateSessionById(sessionId, {
      lastVisitInMs: new Date(currentTimeInMs),
    });

    return true;
  }
}
