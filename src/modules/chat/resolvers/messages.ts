import { AuthGuard } from '@modules/auth/guards';
import { Input } from '@modules/common/decorators';
import { SessionId } from '@modules/session';
import { UserService } from '@modules/user/user.service';
import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { messageAddedFilter } from '../chat.filter';
import { ChatService } from '../chat.service';
import {
  AddMessageInput,
  AddMessageOutput,
  MESSAGE_ADDED,
  MessageAddedOutput,
  MessagesInput,
  MessagesOutput,
} from '../dto';

// TODO sub module
export const pubSub = new PubSub();

@Resolver()
export class MessageResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly useService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Subscription(() => MessageAddedOutput, {
    filter: messageAddedFilter,
  })
  messageAdded() {
    return pubSub.asyncIterator(MESSAGE_ADDED);
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

    return { data, chatId };
  }
}
