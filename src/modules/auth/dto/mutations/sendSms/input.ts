import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendSmsInput {
  @Field(() => String)
  phoneNumber: string;
}
