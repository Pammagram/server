import { Field } from '@nestjs/graphql';

import { UserDto } from '../user';

export class MeOutput {
  @Field(() => UserDto)
  data: UserDto;
}
