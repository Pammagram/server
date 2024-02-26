import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/modules/user/dto';

import { Chat, ChatType } from '../entities';

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
