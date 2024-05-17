import { AuthGuard } from '@modules/auth/guards';
import { Input } from '@modules/common/decorators';
import { SessionId } from '@modules/session';
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
import { UsersByPhoneNumbersInput } from './graphql/queries/usersByPhoneNumbers/input';
import { UsersByPhoneNumbersOutput } from './graphql/queries/usersByPhoneNumbers/output';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AuthGuard)
  @Query(() => UsersOutput)
  async users(): Promise<UsersOutput> {
    const data = await this.userService.findAll();

    return { data };
  }

  @Query(() => MeOutput)
  async me(@SessionId() sessionId: string): Promise<MeOutput> {
    if (!sessionId) {
      return { data: null };
    }

    const data = await this.userService.findUserBySessionIdOrFail(sessionId);

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
      await this.userService.findUserBySessionIdOrFail(sessionId);

    await this.userService.updateByUserId(userId, input);

    const updatedUser = await this.userService.findByUserIdOrFail(userId);

    return {
      data: updatedUser,
    };
  }

  @UseGuards(AuthGuard)
  @Query(() => UsersByPhoneNumbersOutput)
  async usersByPhoneNumbers(
    @Input() input: UsersByPhoneNumbersInput,
  ): Promise<UsersByPhoneNumbersOutput> {
    const users = await this.userService.findUsersByPhoneNumber(
      input.phoneNumbers,
    );

    return {
      users,
    };
  }
}
