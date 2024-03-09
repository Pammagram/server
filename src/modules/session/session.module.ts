import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from './entities';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
