import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddMembersInput {
  @Field(() => [Int])
  userIds: number[];

  @Field(() => Int)
  chatId: number;
}
