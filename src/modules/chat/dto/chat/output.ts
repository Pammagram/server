import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat.dto';

@ObjectType()
export class ChatOutput {
  @Field(() => ChatDto, { nullable: true })
  data: ChatDto | null;
}
