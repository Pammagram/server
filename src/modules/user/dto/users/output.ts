import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user';

@ObjectType()
export class UsersOutput {
  @Field(() => [UserDto])
  data: UserDto[];
}
