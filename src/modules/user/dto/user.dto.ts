import { ChatDto } from '@modules/chat/dto';
import { SessionDto } from '@modules/session/dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { User } from '../entities';

@ObjectType()
export class UserDto implements User {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Date)
  lastActiveInMs: Date;

  sessions: SessionDto[];

  chats: ChatDto[];
}
