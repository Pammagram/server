import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { UserDto } from './dto/user.dto';

import { AuthGuard } from '../auth/guards/auth';

@Resolver()
export class UserResolver {
  @Query(() => UserDto)
  @UseGuards(AuthGuard)
  me(): UserDto {
    return {
      lastActiveInMs: 0,
      phoneNumber: '+38',
      username: 'Max',
    };
  }
}
