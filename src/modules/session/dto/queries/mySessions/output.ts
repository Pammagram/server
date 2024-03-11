import { Field, ObjectType } from '@nestjs/graphql';

import { SessionDto } from '../../session';

@ObjectType()
export class MySessionsOutput {
  @Field(() => [SessionDto])
  data: SessionDto[];
}
