import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifySmsInput {
  @Field(() => String)
  code: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  device: string;
}
