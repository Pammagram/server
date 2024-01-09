import { Field, ObjectType } from '@nestjs/graphql';

import { UserOutput } from '../user';

@ObjectType()
export class CreateUserOutput {
  @Field(() => UserOutput)
  data: UserOutput;
}
