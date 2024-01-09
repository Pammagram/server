import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendSmsOutput {
  @Field(() => Boolean)
  data: true;
}
