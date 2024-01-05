/* eslint-disable class-methods-use-this -- fix in future */
import { Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Mutation()
  sendSms(): true {
    return true;
  }

  @Mutation()
  verifySms(): true {
    return true;
  }

  @Mutation()
  resendSms(): true {
    return true;
  }
}
