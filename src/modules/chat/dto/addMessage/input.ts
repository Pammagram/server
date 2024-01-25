import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddMessageInput {
  @Field(() => Int)
  chatId: number;

  @Field(() => String)
  text: string;
}
