import { UserDto } from '@modules/user/dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ChatType } from '../constants/chat-type';
import { Chat } from '../types/chat';

@ObjectType()
export class ChatDto implements Chat {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => ChatType)
  type: ChatType;

  @Field(() => [UserDto])
  members: UserDto[];
}
