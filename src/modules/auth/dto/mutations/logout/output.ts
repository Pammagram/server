import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutOutput {
  @Field(() => Boolean)
  data: true;
}
