import { InputType } from '@nestjs/graphql';

import { SessionOutput } from './output';

@InputType()
export class SessionInput extends SessionOutput {}
