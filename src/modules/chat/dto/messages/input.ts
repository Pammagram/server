import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MessagesInput {
  @Field(() => Int)
  chatId: number;
}
