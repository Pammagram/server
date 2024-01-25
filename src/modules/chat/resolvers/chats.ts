import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { Input } from '../../common/decorators';
import { ChatService } from '../chat.service';
import {
  AddMembersInput,
  AddMembersOutput,
  ChatInput,
  ChatOutput,
  ChatsInput,
  ChatsOutput,
  CreateChatInput,
  CreateChatOutput,
  EditChatInput,
  EditChatOutput,
  RemoveChatInput,
  RemoveChatOutput,
  RemoveMemberInput,
  RemoveMemberOutput,
} from '../dto';

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

  @Mutation(() => EditChatOutput)
  async editChat(@Input() input: EditChatInput): Promise<EditChatOutput> {
    const data = await this.chatService.edit(input);

    return { data };
  }

  @Mutation(() => RemoveChatOutput)
  async removeChat(@Input() input: RemoveChatInput): Promise<RemoveChatOutput> {
    // TODO add admin rights check
    // eslint-disable-next-line @typescript-eslint/naming-convention -- we need to conform to conventions in resolvers
    const data = await this.chatService.removeById(input.chatId);

    return { data };
  }

  @Mutation(() => AddMembersOutput)
  async addMembers(@Input() input: AddMembersInput): Promise<AddMembersOutput> {
    const { chatId, userIds } = input;
    // eslint-disable-next-line @typescript-eslint/naming-convention -- we need to conform to conventions in resolvers
    const data = await this.chatService.addMembers(chatId, userIds);

    return { data };
  }

  @Mutation(() => RemoveMemberOutput)
  async removeMember(
    @Input() input: RemoveMemberInput,
  ): Promise<AddMembersOutput> {
    const { chatId, memberId } = input;
    // eslint-disable-next-line @typescript-eslint/naming-convention -- we need to conform to conventions in resolvers
    const data = await this.chatService.removeMember(chatId, memberId);

    return { data };
  }
}
