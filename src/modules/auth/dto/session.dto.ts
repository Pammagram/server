import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/modules/user/dto/user.dto';

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

  @Field(() => String)
  sessionId: string;

  @Field(() => UserDto)
  user: UserDto;

  @Field(() => String)
  userAgent: string;
}
