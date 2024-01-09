import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateUserInput, CreateUserOutput } from './dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

import { AuthGuard } from '../auth/guards/auth';
import { Input, SignedCookies } from '../common/decorators';

@UseGuards(AuthGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserDto)
  me(@SignedCookies('sessionId') sessionId: string): Promise<UserDto> {
    return this.userService.findBySessionId(sessionId);
  }

  // TODO add filtering
  @Query(() => [UserDto])
  async users(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  // TODO user resolver

  // TODO admins
  @Mutation(() => CreateUserOutput)
  async createUser(@Input() input: CreateUserInput): Promise<CreateUserOutput> {
    const data = await this.userService.createUser(input);

    return {
      data,
    };
  }
}
