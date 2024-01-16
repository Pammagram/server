import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

@ObjectType()
export class UpdateUserOutput {
  @Field(() => UserDto)
  data: UserDto;
}
