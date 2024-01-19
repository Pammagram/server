import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { UserDto } from '../user.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(UserDto, ['lastActiveInMs', 'username'], InputType),
) {}
