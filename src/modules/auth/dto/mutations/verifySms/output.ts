import { UserDto } from '@modules/user/dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerifySmsOutput {
  @Field(() => UserDto)
  data: UserDto;
}
