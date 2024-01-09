import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

@ObjectType()
export class UsersOutput {
  @Field(() => [UserDto])
  data: UserDto[];
}
