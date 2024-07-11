import { UserDto } from '@modules/user/dto';
import { Field, ObjectType } from '@nestjs/graphql';

import { ChatDto } from './chat.dto';

import { Message } from '../entities';

@ObjectType()
export class MessageDto implements Message {
  @Field(() => String)
  id: string;

  @Field(() => String)
  text: string;

  @Field(() => UserDto)
  sender: UserDto;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => ChatDto)
  chat: ChatDto;
}
