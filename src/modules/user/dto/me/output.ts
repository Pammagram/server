import { Field } from '@nestjs/graphql';

import { UserOutput } from '../user';

export class MeOutput {
  @Field(() => UserOutput)
  data: UserOutput;
}
