import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChatsInput {
  @Field(() => [Int], { nullable: true })
  chatIds?: number[];
}
