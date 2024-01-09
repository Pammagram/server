import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifySmsInput {
  @Field(() => String)
  code: string;

  @Field(() => String)
  phoneNumber: string;

  // TODO use this
  @Field(() => Boolean, { nullable: true })
  rememberMe?: boolean;
}
