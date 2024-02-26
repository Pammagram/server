import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat.dto';

@ObjectType()
export class ChatCreatedOutput {
  @Field(() => ChatDto)
  data: ChatDto;
}

export const CHAT_CREATED = 'chatCreated';

export type ChatCreatedPayload = Record<typeof CHAT_CREATED, ChatCreatedOutput>;
