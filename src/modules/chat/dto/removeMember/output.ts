import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveMemberOutput {
  @Field(() => Boolean)
  data: boolean;
}
