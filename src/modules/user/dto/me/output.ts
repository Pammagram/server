import { Field } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

export class MeOutput {
  @Field(() => UserDto)
  data: UserDto;
}
