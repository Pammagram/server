import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from './entities';
import { SessionResolver } from './resolver';
import { SessionService } from './service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionService, SessionResolver],
  exports: [SessionService],
})
export class SessionModule {}
