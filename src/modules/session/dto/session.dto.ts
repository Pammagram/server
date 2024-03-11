import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Session } from '../entities';

import { UserDto } from '$modules/user/dto/user.dto';

@ObjectType()
export class SessionDto implements Session {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  ip: string;

  @Field(() => String)
  device: string;

  @Field(() => Date)
  lastVisitInMs: Date;

  // ! We should not give user access to sessionId because it's not safe
  sessionId: string;

  // @Field(() => UserDto)
  user: UserDto;
}
