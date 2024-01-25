import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat.dto';

@ObjectType()
export class EditChatOutput {
  @Field(() => ChatDto)
  data: ChatDto;
}
