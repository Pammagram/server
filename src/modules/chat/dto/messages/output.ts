import { Field, Int, ObjectType } from '@nestjs/graphql';

import { MessageDto } from '../message.dto';

@ObjectType()
export class MessagesOutput {
  @Field(() => Int)
  chatId: number;

  @Field(() => [MessageDto])
  data: MessageDto[];
}
