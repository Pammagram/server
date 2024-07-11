import { FirebaseModule } from '@modules/firebase/firebase.module';
import { SessionModule } from '@modules/session';
import { Module } from '@nestjs/common';

import { NotificationService } from './notification.service';

@Module({
  imports: [SessionModule, FirebaseModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
