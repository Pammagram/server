import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddMessageOutput {
  @Field(() => Boolean)
  data: boolean;
}
