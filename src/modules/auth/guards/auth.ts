import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/modules/common/decorators';
import { SessionDto } from 'src/modules/session/dto';
import { SessionService } from 'src/modules/session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(
    context: ExecutionContext & { session?: SessionDto },
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const session = ctx.session ?? ctx?.extra?.session;

    if (!session) {
      throw new UnauthorizedException();
    }

    // * Last activity exceeds session timeout, require login again
    const currentTimeInMs = Date.now();

    await this.sessionService.updateBySessionId(session.sessionId, {
      lastVisitInMs: new Date(currentTimeInMs),
    });

    return true;
  }
}
