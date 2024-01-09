import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SessionDto } from 'src/modules/auth/dto';

import { User } from '../entities';

@ObjectType()
export class UserDto implements User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Date)
  lastActiveInMs: Date;

  @Field(() => [SessionDto], { nullable: true })
  sessions?: SessionDto[];
}
