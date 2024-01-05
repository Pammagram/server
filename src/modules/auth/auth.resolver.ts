import { Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
    @Mutation()
    sendSms(): true {
        return true;
    }
}
