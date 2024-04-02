import { InputType, PickType } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

@InputType()
export class CreateUserInput extends PickType(
  UserDto,
  ['phoneNumber', 'username'],
  InputType,
) {}
