import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ChatService } from './chat.service';
import {
  AddMembersInput,
  AddMembersOutput,
  AddMessageInput,
  AddMessageOutput,
  ChatInput,
  ChatOutput,
  ChatsInput,
  ChatsOutput,
  CreateChatInput,
  CreateChatOutput,
  MessageAddedOutput,
  MessagesInput,
  MessagesOutput,
  RemoveChatInput,
  RemoveChatOutput,
} from './dto';

import { SessionId } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/guards';
import { GqlContext, Input } from '../common/decorators';
import { UserService } from '../user/user.service';

const pubSub = new PubSub();
const MESSAGE_ADDED = 'messageAdded';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly useService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Subscription(() => MessageAddedOutput, {
    filter: (
      payload: { [MESSAGE_ADDED]: MessageAddedOutput },
      _variables,
      context: GqlContext,
    ) => {
      const {
        messageAdded: { data },
      } = payload;

      const {
        chat: { members },
      } = data;

      const userId = context.session.user.id;

      if (members.some((member) => member.id === userId)) {
        return true;
      }

      return false;
    },
  })
  messageAdded() {
    return pubSub.asyncIterator(MESSAGE_ADDED);
  }

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

  @Mutation(() => AddMembersOutput)
  async addMembers(@Input() input: AddMembersInput): Promise<AddMembersOutput> {
    const { chatId, userIds } = input;
    // eslint-disable-next-line @typescript-eslint/naming-convention -- we need to conform to conventions in resolvers
    const data = await this.chatService.addMembers(chatId, userIds);

    return { data };
  }

  @Mutation(() => AddMessageOutput)
  async addMessage(
    @Input() input: AddMessageInput,
    @SessionId() sessionId: string,
  ): Promise<AddMessageOutput> {
    const { chatId, text } = input;

    const user = await this.useService.findUserBySessionIdOrFail(sessionId);

    // eslint-disable-next-line @typescript-eslint/naming-convention -- we need to conform to conventions in resolvers
    const data = await this.chatService.addMessage(user.id, chatId, text);

    void pubSub.publish(MESSAGE_ADDED, {
      [MESSAGE_ADDED]: {
        data,
      },
    });

    return { data };
  }

  @Query(() => MessagesOutput)
  async messages(@Input() input: MessagesInput): Promise<MessagesOutput> {
    const { chatId } = input;
    const data = await this.chatService.messages(chatId);

    return { data };
  }
}
