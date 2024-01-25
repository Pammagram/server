import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat.dto';

@ObjectType()
export class ChatsOutput {
  @Field(() => [ChatDto])
  data: ChatDto[];
}
