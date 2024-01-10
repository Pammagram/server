import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/modules/user/dto/user';

import { Session } from '../entities';

@ObjectType()
export class SessionDto implements Session {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => String)
  ip: string;

  @Field(() => Date)
  lastVisitInMs: Date;

  // ! We should not give user access to sessionId because it's not safe
  sessionId: string;

  @Field(() => UserDto)
  user: UserDto;

  @Field(() => String)
  userAgent: string;
}
