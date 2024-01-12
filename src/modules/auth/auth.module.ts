import { Global, Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

import { MessagingModule } from '../messaging/messaging.module';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule, MessagingModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
