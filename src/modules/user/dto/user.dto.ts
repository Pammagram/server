import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field(() => String)
  username: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Date)
  lastActiveInMs: number;
}
