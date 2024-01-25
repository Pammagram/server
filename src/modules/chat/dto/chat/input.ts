import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChatInput {
  @Field(() => Int)
  id: number;
}
