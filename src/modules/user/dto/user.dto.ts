import { Field, ObjectType } from '@nestjs/graphql';

import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class UserDto implements Omit<UserEntity, 'id'> {
  @Field(() => String)
  username: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Date)
  lastActiveInMs: number;
}
