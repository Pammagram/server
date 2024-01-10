import { InputType, OmitType } from '@nestjs/graphql';

import { UserDto } from '../user';

@InputType()
export class CreateUserInput extends OmitType(
  UserDto,
  ['id', 'lastActiveInMs', 'sessions'],
  InputType,
) {}
