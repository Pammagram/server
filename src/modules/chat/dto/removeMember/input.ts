import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RemoveMemberInput {
  @Field(() => Int)
  memberId: number;

  @Field(() => Int)
  chatId: number;
}
