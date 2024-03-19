import { Injectable } from '@nestjs/common';

import { MessagingService } from '../messaging/messaging.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly messagingService: MessagingService,
  ) {}

  // TODO cleanup of unutilized users
  async sendSms(phoneNumber: string): Promise<true> {
    let user = await this.userService.findByPhoneNumber(phoneNumber);

    if (!user) {
      console.debug('User does not exist, creating...');
      // ? TODO we can utilize redis and store temp user there with TMP
      user = await this.userService.createUser({
        phoneNumber,
        chats: [],
      });
    }

    await this.messagingService.sendVerificationCode({ phoneNumber });

    return true;
  }
}
