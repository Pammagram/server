import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
// import { genSalt, hash } from 'bcrypt';
// import { ConfigType } from 'src/config';
import {
  // Config,
  RequestAndResponse,
} from 'src/modules/common/decorators';
import { SessionService } from 'src/modules/session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // private readonly config: ConfigType['auth'];

  constructor(
    // @Config() configService: ConfigType,
    private readonly sessionService: SessionService,
  ) {
    // this.config = configService.auth;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      GqlExecutionContext.create(context).getContext<RequestAndResponse>().req;

    const { sessionId } = request.signedCookies as Record<string, string>;

    if (!sessionId) {
      console.debug('Session id is not found');

      throw new UnauthorizedException();
    }
    // const { saltRounds } = this.config;
    // const salt = await genSalt(saltRounds);

    // const sessionIdEncrypted = await hash(sessionId, salt);

    const session = await this.sessionService.findBySessionId(sessionId);

    if (!session) {
      console.debug('Session not found');

      throw new UnauthorizedException();
    }

    // * Last activity exceeds session timeout, require login again
    const currentTimeInMs = Date.now();

    // if (
    //   currentTimeInMs - session.lastVisitInMs.getTime() >
    //   this.config.sessionTimeoutInMs
    // ) {
    //   // TODO nest logger
    //   console.debug('Session expired');

    //   throw new UnauthorizedException();
    // }

    await this.sessionService.updateBySessionId(sessionId, {
      lastVisitInMs: new Date(currentTimeInMs),
    });

    return true;
  }
}
