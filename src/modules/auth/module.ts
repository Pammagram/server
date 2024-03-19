import { CookieModule } from '@modules/cookie/cookie.module';
import { Global, Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

import { MessagingModule } from '../messaging/messaging.module';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule, MessagingModule, CookieModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
