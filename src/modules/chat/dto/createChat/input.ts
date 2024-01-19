import { Field, InputType, Int } from '@nestjs/graphql';

import { ChatType } from '../../entities';

@InputType()
export class CreateChatInput {
  @Field(() => String)
  title: string;

  @Field(() => [Int])
  userIds: number[];

  @Field(() => ChatType)
  type: ChatType;
}
