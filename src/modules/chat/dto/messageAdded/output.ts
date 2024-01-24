import { Field, ObjectType } from '@nestjs/graphql';

import { MessageDto } from '../message.dto';

@ObjectType()
export class MessageAddedOutput {
  @Field(() => MessageDto)
  data: MessageDto;
}
