import { FIREBASE_APP } from '@modules/firebase/firebase.module';
import { SessionService } from '@modules/session';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Notification } from '@notifee/react-native';
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
    notificationParams: SendNotificationParams,
  ): Promise<PushTicket[]> {
    this.logger.debug('userIds', userIds);
    this.logger.debug('notificationParams', notificationParams);

    const sessions =
      await this.sessionService.findMessagingTokensByUserIds(userIds);

    this.logger.debug('sessions', sessions);

    const tokens = sessions
      .map((session) => session.messagingToken)
      .filter((token) => typeof token === 'string')
      .filter((token) => token.length);

    this.logger.debug('tokens', tokens);

    // * can be extracted to separate package in case more quick actions and groups are available for notifications
    const notification: Notification = {
      ...notificationParams,
      android: {
        pressAction: {
          id: 'default',
        },
        channelId: 'default',
        actions: [
          {
            title: 'Reply',
            pressAction: {
              id: 'reply',
            },
            input: true,
          },
        ],
      },
    };

    // * not all sessions have fc token for now
    if (tokens.length) {
      const response = await this.firebaseApp.messaging().sendEachForMulticast({
        tokens,
        data: {
          notifee: JSON.stringify(notification),
        },
        android: {
          ttl: 604800, // 7 days in seconds
          priority: 'high',
        },
      });

      this.logger.debug('response', response);

      return response.responses;
    }

    return [];
  }
}
