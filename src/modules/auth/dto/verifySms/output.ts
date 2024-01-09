import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerifySmsOutput {
  // TODO return user instead
  @Field(() => String)
  sessionId: string;
}
