import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SessionDto } from 'src/modules/session/dto';

import { User } from '../../entities';

@ObjectType()
export class RawUserDto implements User {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  username: null;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Date)
  lastActiveInMs: Date;

  @Field(() => [SessionDto])
  sessions: SessionDto[];
}
