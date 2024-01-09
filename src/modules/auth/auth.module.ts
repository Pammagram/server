import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { authProviders } from './entities';

import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [...authProviders, AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
