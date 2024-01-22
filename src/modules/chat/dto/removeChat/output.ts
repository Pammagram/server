import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveChatOutput {
  @Field(() => Boolean)
  data: boolean;
}
