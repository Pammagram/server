import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetMessagingTokenInput {
  @Field(() => String)
  messagingToken: string;
}
