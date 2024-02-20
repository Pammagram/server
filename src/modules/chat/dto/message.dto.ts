import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/modules/user/dto';

import { ChatDto } from './chat.dto';

import { Message } from '../entities';

@ObjectType()
export class MessageDto implements Message {
  @Field(() => Int)
  id: number;

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
