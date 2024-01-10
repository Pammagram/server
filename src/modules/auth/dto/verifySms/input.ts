import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class VerifySmsInput {
  @Field(() => Int)
  code: number;

  @Field(() => String)
  phoneNumber: string;

  // TODO use this
  @Field(() => Boolean, { nullable: true })
  rememberMe?: boolean;
}
