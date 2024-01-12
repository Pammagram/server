import { Global, Module } from '@nestjs/common';

import { sessionProviders } from './entities';
import { SessionService } from './session.service';

@Global()
@Module({
  providers: [...sessionProviders, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
