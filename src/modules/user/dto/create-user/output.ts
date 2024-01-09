import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

@ObjectType()
export class CreateUserOutput {
  @Field(() => UserDto)
  data: UserDto;
}
