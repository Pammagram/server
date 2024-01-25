import { Field, ObjectType } from '@nestjs/graphql';

import { MessageDto } from '../message.dto';

@ObjectType()
export class MessagesOutput {
  @Field(() => [MessageDto])
  data: MessageDto[];
}
