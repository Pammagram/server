import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateUserInput, CreateUserOutput, UserOutput } from './dto';
import { UserService } from './user.service';

import { AuthGuard } from '../auth/guards/auth';
import { Input, SignedCookies } from '../common/decorators';

@UseGuards(AuthGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserOutput)
  me(@SignedCookies('sessionId') _sessionId: string): UserOutput {
    return {
      lastActiveInMs: new Date(),
      phoneNumber: '+38',
      username: 'Max',
      id: 0,
    };
  }

  // TODO add filtering
  @Query(() => [UserOutput])
  async users(): Promise<UserOutput[]> {
    return this.userService.findAll();
  }

  // TODO user resolver

  @Mutation(() => CreateUserOutput)
  async createUser(@Input() input: CreateUserInput): Promise<CreateUserOutput> {
    const data = await this.userService.createUser(input);

    return {
      data,
    };
  }
}
