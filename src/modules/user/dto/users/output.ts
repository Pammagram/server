import { Field, ObjectType } from '@nestjs/graphql';

import { UserOutput } from '../user/output';

@ObjectType()
export class UsersOutput {
  @Field(() => [UserOutput])
  data: UserOutput[];
}
