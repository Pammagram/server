import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UsersByPhoneNumbersInput {
  @Field(() => [String])
  phoneNumbers: string[];
}
