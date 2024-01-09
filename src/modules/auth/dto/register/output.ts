import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/modules/user/dto';

@ObjectType()
export class RegisterOutput {
  @Field(() => UserDto)
  data: UserDto;
}
