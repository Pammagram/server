import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Int)
  chatId: number;

  @Field(() => String)
  text: string;
}
