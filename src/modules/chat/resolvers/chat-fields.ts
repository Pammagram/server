import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { ChatService } from '../chat.service';
import { ChatDto, MessageDto } from '../dto';

@Resolver(() => ChatDto)
export class ChatFieldsResolver {
  constructor(private readonly chatService: ChatService) {}

  @ResolveField(() => MessageDto, { nullable: true })
  async lastMessage(@Parent() chat: ChatDto) {
    const message = await this.chatService.findChatLastMessage(chat.id);

    return message;
  }
}
