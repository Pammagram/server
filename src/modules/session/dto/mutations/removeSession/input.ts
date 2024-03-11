import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RemoveSessionInput {
  @Field(() => Int)
  id: number;
}
