import { InputType } from '@nestjs/graphql';

import { UserOutput } from './output';

@InputType()
export class UserInput extends UserOutput {}
