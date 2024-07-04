import { Config } from '@config';
import { SessionService } from '@modules/session';
import { UserDto } from '@modules/user/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MessagingService } from '../messaging/messaging.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly messagingService: MessagingService,
    private readonly configService: ConfigService<Config>,
    private readonly sessionService: SessionService,
  ) {}

  // TODO cleanup of unutilized users
  async sendSms(phoneNumber: string): Promise<true> {
    if (!this.configService.get('app.isSmsEnabled', { infer: true })) {
      return true;
    }

    let user = await this.userService.findByPhoneNumber(phoneNumber);

    if (!user) {
      // ? TODO we can utilize redis and store temp user there with TMP
      user = await this.userService.createUser({
        phoneNumber,
      });
    }

    await this.messagingService.sendVerificationCode({ phoneNumber });

    return true;
  }

  // TODO cleanup of unutilized users
  async verifySms(phoneNumber: string, code: string): Promise<UserDto> {
    if (this.configService.get('app.isSmsEnabled', { infer: true })) {
      try {
        await this.messagingService.validateVerificationCode({
          phoneNumber,
          code,
        });
      } catch (error) {
        throw new NotFoundException(
          'Verification code not found. Try sending sms again',
        );
      }
    }

    const user = await this.userService.findByPhoneNumberOrFail(phoneNumber);

    return user;
  }
}
