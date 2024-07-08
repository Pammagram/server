/* eslint-disable @cspell/spellchecker  --  TODO remove */
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
      .filter((token) => typeof token === 'string')
      .filter((token) => token.length);

    this.logger.debug('tokens', tokens);

    // * not all sessions have fc token for now
    if (tokens.length) {
      const response = await this.firebaseApp.messaging().sendEachForMulticast({
        tokens,
        data: {
          notifee: JSON.stringify({
            body: notificationParams.body,
            title: notificationParams.title,
            android: {
              channelId: 'default',
              actions: [
                {
                  title: 'Mark as Read',
                  pressAction: {
                    id: 'read',
                  },
                },
                {
                  title: 'Reply',
                  pressAction: {
                    id: 'reply',
                  },
                  input: true,
                },
              ],
            },
          }),
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
