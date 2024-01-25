import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddMembersOutput {
  @Field(() => Boolean)
  data: boolean;
}
