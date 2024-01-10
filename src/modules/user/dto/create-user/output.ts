import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user';

@ObjectType()
export class CreateUserOutput {
  @Field(() => UserDto)
  data: UserDto;
}
