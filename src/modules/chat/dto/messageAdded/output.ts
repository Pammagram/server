import { Field, ObjectType } from '@nestjs/graphql';

import { MessageDto } from '../message.dto';

@ObjectType()
export class MessageAddedOutput {
  @Field(() => MessageDto)
  data: MessageDto;
}

export const MESSAGE_ADDED = 'messageAdded';

export type MessageAddedPayload = Record<
  typeof MESSAGE_ADDED,
  MessageAddedOutput
>;
