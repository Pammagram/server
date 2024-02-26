import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Session } from 'src/modules/auth/auth.decorators';
import { AuthGuard } from 'src/modules/auth/guards';
import { SessionDto } from 'src/modules/session/dto';

import { pubSub } from './messages';

import { GqlContext, Input } from '../../common/decorators';
import { ChatService } from '../chat.service';
import {
  AddMembersInput,
  AddMembersOutput,
  CHAT_CREATED,
  ChatCreatedOutput,
  ChatCreatedPayload,
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

  @Query(() => ChatsOutput)
  // TODO add filtering
  async myChats(
    @Input() _input: ChatsInput,
    @Session() session: SessionDto,
  ): Promise<ChatsOutput> {
    const data = await this.chatService.findChatsByMemberId(session.user.id);

    return { data };
  }

  @Query(() => ChatOutput)
  async chat(@Input() input: ChatInput): Promise<ChatOutput> {
    const data = await this.chatService.findById(input.id);

    return { data };
  }

  @Mutation(() => CreateChatOutput)
  async createChat(@Input() input: CreateChatInput): Promise<CreateChatOutput> {
    const data = await this.chatService.create(input);

    void pubSub.publish(CHAT_CREATED, {
      [CHAT_CREATED]: {
        data,
      },
    });

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

  @UseGuards(AuthGuard)
  @Subscription(() => ChatCreatedOutput, {
    filter: (payload: ChatCreatedPayload, _variables, context: GqlContext) => {
      const {
        chatCreated: { data },
      } = payload;

      const { members } = data;

      // TODO functions getters
      const userId = context.extra.session.user.id;

      if (members.some((member) => member.id === userId)) {
        return true;
      }

      return false;
    },
  })
  chatCreated() {
    return pubSub.asyncIterator(CHAT_CREATED);
  }
}
