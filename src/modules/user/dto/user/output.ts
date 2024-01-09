import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SessionOutput } from 'src/modules/auth/dto';

@ObjectType()
export class UserOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Date)
  lastActiveInMs: Date;

  @Field(() => [SessionOutput], { nullable: true })
  sessions?: SessionOutput[];
}
