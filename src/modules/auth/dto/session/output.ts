import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserOutput } from 'src/modules/user/dto';

import { Session } from '../../entities/session.entity';

@ObjectType()
export class SessionOutput implements Session {
  @Field(() => Boolean)
  active: boolean;

  @Field(() => String)
  ip: string;

  @Field(() => Int)
  lastVisitInMs: number;

  @Field(() => String)
  sessionId: string;

  @Field(() => [UserOutput])
  user: UserOutput[];

  @Field(() => String)
  userAgent: string;
}
