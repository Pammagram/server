import { Field, InputType, Int } from '@nestjs/graphql';

// TODO add filtering
@InputType()
export class AddMessageInput {
  @Field(() => Int)
  chatId: number;

  @Field(() => String)
  text: string;
}
