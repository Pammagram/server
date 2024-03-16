import { UserDto } from '@modules/user/dto/user.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionDto {
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
