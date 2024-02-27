import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat.dto';

@ObjectType()
export class RemoveChatOutput {
  @Field(() => ChatDto)
  data: ChatDto;
}
