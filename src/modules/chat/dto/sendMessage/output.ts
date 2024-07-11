import { Field, ObjectType } from '@nestjs/graphql';

import { MessageDto } from '../message.dto';

@ObjectType()
export class SendMessageOutput {
  @Field(() => MessageDto)
  data: MessageDto;
}
