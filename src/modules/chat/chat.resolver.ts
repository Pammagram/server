import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { ChatService } from './chat.service';
import { ChatDto, ChatInput } from './dto';
import { CreateChatInput } from './dto/createChat';

import { Input } from '../common/decorators';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => ChatDto)
  async chat(@Input() input: ChatInput): Promise<ChatDto> {
    return this.chatService.findByIdOrFail(input.id);
  }

  @Mutation(() => ChatDto)
  async createChat(@Input() input: CreateChatInput): Promise<ChatDto> {
    return this.chatService.create(input);
  }
}
