import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat.dto';

@ObjectType()
export class ChatRemovedOutput {
  @Field(() => ChatDto)
  data: ChatDto;
}

export const CHAT_REMOVED = 'chatRemoved';

export type ChatRemovedPayload = Record<typeof CHAT_REMOVED, ChatRemovedOutput>;
