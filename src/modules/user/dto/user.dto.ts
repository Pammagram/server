import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChatDto } from 'src/modules/chat/dto';
import { SessionDto } from 'src/modules/session/dto';

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
