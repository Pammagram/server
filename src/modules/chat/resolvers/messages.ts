import { AuthGuard } from '@modules/auth/guards';
import { Input } from '@modules/common/decorators';
import { SessionId } from '@modules/session';
import { UserService } from '@modules/user/user.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';

import { messageAddedFilter } from '../chat.filter';
import { ChatService } from '../chat.service';
import {
  MESSAGE_ADDED,
  MessageAddedOutput,
  MessagesInput,
  MessagesOutput,
} from '../dto';
import { SendMessageInput, SendMessageOutput } from '../dto/sendMessage';

// TODO sub module for pubsub
export const pubSub = new PubSub();

@Resolver()
export class MessageResolver {
  private logger: Logger = new Logger(MessageResolver.name);

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

  @Mutation(() => SendMessageOutput)
  @UseGuards(AuthGuard)
  async sendMessage(
    @Input() input: SendMessageInput,
    @SessionId() sessionId: string,
  ): Promise<SendMessageOutput> {
    this.logger.debug('Sending message from sessionId', sessionId);

    const user = await this.useService.findUserBySessionIdOrFail(sessionId);

    const data = await this.chatService.sendMessage({
      ...input,
      id: input.id ?? uuidv4(),
      senderId: user.id,
    });

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
    const data = await this.chatService.findMessagesByChatId(chatId);

    return { data, chatId };
  }
}
