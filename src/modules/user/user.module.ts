import { Module } from '@nestjs/common';

import { userProviders } from './entities';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [...userProviders, UserService, UserResolver],
})
export class UserModule {}
