import { ChatType } from '@modules/chat/constants/chat-type';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateChatInput {
  @Field(() => String)
  title: string;

  @Field(() => [Int])
  memberIds: number[];

  @Field(() => ChatType)
  type: ChatType;
}
