import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { SessionId } from '../../auth/auth.decorators';
import { AuthGuard } from '../../auth/guards';
import { GqlContext, Input } from '../../common/decorators';
import { UserService } from '../../user/user.service';
import { ChatService } from '../chat.service';
import {
  AddMessageInput,
  AddMessageOutput,
  MESSAGE_ADDED,
  MessageAddedOutput,
  MessageAddedPayload,
  MessagesInput,
  MessagesOutput,
} from '../dto';

const pubSub = new PubSub();

@Resolver()
export class MessageResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly useService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Subscription(() => MessageAddedOutput, {
    filter: (payload: MessageAddedPayload, _variables, context: GqlContext) => {
      const {
        messageAdded: { data },
      } = payload;

      const {
        chat: { members },
      } = data;

      const userId = context.extra.session.user.id;

      if (members.some((member) => member.id === userId)) {
        return true;
      }

      return false;
    },
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

    const user = await this.useService.findUserBySessionId(sessionId);

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
