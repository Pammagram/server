import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EditChatInput {
  @Field(() => Int)
  chatId: number;

  @Field(() => String)
  title: string;
}
