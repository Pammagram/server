import { Field, ObjectType } from '@nestjs/graphql';

import { MessageDto } from '../message.dto';

@ObjectType()
export class AddMessageOutput {
  @Field(() => MessageDto)
  data: MessageDto;
}
