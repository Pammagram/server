import { InputType, OmitType } from '@nestjs/graphql';

import { UserInput } from '../user';

@InputType()
export class CreateUserInput extends OmitType(
  UserInput,
  ['id', 'lastActiveInMs', 'sessions'],
  InputType,
) {}
