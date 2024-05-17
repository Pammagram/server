import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '@root/modules/user/dto';

@ObjectType()
export class UsersByPhoneNumbersOutput {
  @Field(() => [UserDto])
  users: UserDto[];
}
