import { InputType, PickType } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

@InputType()
export class UpdateUserInput extends PickType(
  UserDto,
  ['lastActiveInMs', 'username'],
  InputType,
) {}
