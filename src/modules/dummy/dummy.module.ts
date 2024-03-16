import { AuthModule } from '@modules/auth';
import { Module } from '@nestjs/common';

import { DummyService } from './dummy.service';

@Module({
  imports: [AuthModule],
  providers: [DummyService],
  exports: [DummyService],
})
export class DummyModule {}
