import { Field, ObjectType } from '@nestjs/graphql';

import { SessionDto } from '../../session';

@ObjectType()
export class RemoveSessionOutput {
  @Field(() => SessionDto)
  data: SessionDto;
}
