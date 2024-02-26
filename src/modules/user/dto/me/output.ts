import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

@ObjectType()
export class MeOutput {
  @Field(() => UserDto, { nullable: true })
  data: UserDto | null;
}
