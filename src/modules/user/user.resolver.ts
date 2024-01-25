import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  CreateUserInput,
  CreateUserOutput,
  UpdateUserInput,
  UpdateUserOutput,
  UserDto,
} from './dto';
import { UserService } from './user.service';

import { SessionId } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/guards/auth';
import { Input } from '../common/decorators';

@UseGuards(AuthGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserDto])
  async users(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => UserDto)
  async me(@SessionId() sessionId: string): Promise<UserDto> {
    return this.userService.findUserBySessionIdOrFail(sessionId);
  }

  @Mutation(() => CreateUserOutput)
  async createUser(@Input() input: CreateUserInput): Promise<CreateUserOutput> {
    const data = await this.userService.createUser(input);

    return {
      data,
    };
  }

  @Mutation(() => UpdateUserOutput)
  async updateMe(
    @SessionId() sessionId: string,
    @Input() input: UpdateUserInput,
  ): Promise<CreateUserOutput> {
    const { id: userId } =
      await this.userService.findUserBySessionIdOrFail(sessionId);

    await this.userService.updateByUserId(userId, input);

    const updatedUser = await this.userService.findByUserIdOrFail(userId);

    return {
      data: updatedUser,
    };
  }
}
