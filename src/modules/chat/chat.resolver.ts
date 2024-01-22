import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { ChatService } from './chat.service';
import {
  ChatInput,
  ChatOutput,
  ChatsInput,
  ChatsOutput,
  CreateChatInput,
  CreateChatOutput,
  RemoveChatInput,
  RemoveChatOutput,
} from './dto';

import { Input } from '../common/decorators';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => ChatsOutput)
  // TODO add filtering
  async chats(@Input() _input: ChatsInput): Promise<ChatsOutput> {
    const data = await this.chatService.findAll();

    return { data };
  }

  @Query(() => ChatOutput)
  async chat(@Input() input: ChatInput): Promise<ChatOutput> {
    const data = await this.chatService.findByIdOrFail(input.id);

    return { data };
  }

  @Mutation(() => CreateChatOutput)
  async createChat(@Input() input: CreateChatInput): Promise<CreateChatOutput> {
    const data = await this.chatService.create(input);

    return { data };
  }

  @Mutation(() => RemoveChatOutput)
  async removeChat(@Input() input: RemoveChatInput): Promise<RemoveChatOutput> {
    // TODO add admin rights check
    // eslint-disable-next-line @typescript-eslint/naming-convention -- we need to conform to conventions in resolvers
    const data = await this.chatService.removeById(input.chatId);

    return { data };
  }
}
