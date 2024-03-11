import { Query, Resolver } from '@nestjs/graphql';

import { SessionDto } from './dto';
import { SessionService } from './session.service';

import { Session } from '$modules/auth/auth.decorators';

@Resolver()
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => [SessionDto])
  mySessions(@Session() session: SessionDto) {
    return this.sessionService.findByUserId(session.user.id);
  }
}
