import { AuthGuard } from '@modules/auth/guards';
import { Input } from '@modules/common/decorators';
import { Session } from '@modules/session/decorators/session';
import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  MySessionsOutput,
  RemoveSessionInput,
  RemoveSessionOutput,
  SessionDto,
} from './dto';
import { SessionService } from './service';

@UseGuards(AuthGuard)
@Resolver()
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => MySessionsOutput)
  async mySessions(@Session() session: SessionDto): Promise<MySessionsOutput> {
    const data = await this.sessionService.findByUserId(session.user.id);

    return {
      data,
    };
  }

  @Mutation(() => RemoveSessionOutput)
  async removeSession(
    @Input() input: RemoveSessionInput,
  ): Promise<RemoveSessionOutput> {
    // TODO checks so that user can;t delete somebody else's session
    const data = await this.sessionService.removeById(input.id);

    return {
      data,
    };
  }
}
