import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '$modules/user/dto';

@ObjectType()
export class VerifySmsOutput {
  @Field(() => UserDto)
  data: UserDto;
}
