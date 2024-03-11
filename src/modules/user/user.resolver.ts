import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  CreateUserInput,
  CreateUserOutput,
  MeOutput,
  UpdateUserInput,
  UpdateUserOutput,
  UsersOutput,
} from './dto';
import { UserService } from './user.service';

import { AuthGuard } from '$modules/auth';
import { Input } from '$modules/common/decorators';
import { SessionId } from '$modules/session';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AuthGuard)
  @Query(() => UsersOutput)
  async users(): Promise<UsersOutput> {
    const data = await this.userService.findAll();

    return { data };
  }

  @Query(() => MeOutput, { nullable: true })
  async me(@SessionId() sessionId: string): Promise<MeOutput> {
    if (!sessionId) {
      return null;
    }

    const data = await this.userService.findUserBySessionId(sessionId);

    return { data };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CreateUserOutput)
  async createUser(@Input() input: CreateUserInput): Promise<CreateUserOutput> {
    const data = await this.userService.createUser(input);

    return {
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateUserOutput)
  async updateMe(
    @SessionId() sessionId: string,
    @Input() input: UpdateUserInput,
  ): Promise<CreateUserOutput> {
    const { id: userId } =
      await this.userService.findUserBySessionId(sessionId);

    await this.userService.updateByUserId(userId, input);

    const updatedUser = await this.userService.findByUserIdOrFail(userId);

    return {
      data: updatedUser,
    };
  }
}
