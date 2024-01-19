import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat.dto';

@ObjectType()
export class CreateChatOutput {
  @Field(() => ChatDto)
  data: ChatDto;
}
