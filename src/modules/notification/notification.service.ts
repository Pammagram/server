import { FIREBASE_APP } from '@modules/firebase/firebase.module';
import { SessionService } from '@modules/session';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { app } from 'firebase-admin';

import { PushTicket } from './types/push-ticket';
import { SendNotificationParams } from './types/send-notification';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly sessionService: SessionService,
    @Inject(FIREBASE_APP) private readonly firebaseApp: app.App,
  ) {}

  async sendNotificationsByUserIds(
    userIds: number[],
    notificationParams: Pick<SendNotificationParams, 'body' | 'title'>,
  ): Promise<PushTicket[]> {
    this.logger.debug('userIds', userIds);
    this.logger.debug('notificationParams', notificationParams);

    const sessions =
      await this.sessionService.findMessagingTokensByUserIds(userIds);

    this.logger.debug('sessions', sessions);

    const tokens = sessions
      .map((session) => session.messagingToken)
      .filter((token) => typeof token !== 'undefined') as string[];

    const response = await this.firebaseApp.messaging().sendEachForMulticast({
      tokens,
      notification: notificationParams,
    });

    this.logger.debug('response', response);

    return response.responses;
  }
}
