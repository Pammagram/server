import { Field, Int, ObjectType } from '@nestjs/graphql';

import { User } from '../entities/user.entity';

@ObjectType()
export class UserDto implements User {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Date)
  lastActiveInMs: Date;
}
