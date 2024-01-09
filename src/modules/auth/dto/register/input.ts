import { InputType, OmitType } from '@nestjs/graphql';
import { UserDto } from 'src/modules/user/dto';

@InputType()
export class RegisterInput extends OmitType(
  UserDto,
  ['id', 'lastActiveInMs'],
  InputType,
) {}
