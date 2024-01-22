import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RemoveChatInput {
  @Field(() => Int)
  chatId: number;
}
