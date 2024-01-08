import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifySmsInput {
  @Field(() => String)
  code: string;

  @Field(() => Boolean, { nullable: true })
  rememberMe?: boolean;
}
