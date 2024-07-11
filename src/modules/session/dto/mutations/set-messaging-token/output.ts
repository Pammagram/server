import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SetMessagingTokenOutput {
  @Field(() => Boolean)
  data: boolean;
}
