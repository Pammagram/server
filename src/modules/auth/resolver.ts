import { ConfigType } from '@config';
import { Config, Input, Ip, Response } from '@modules/common/decorators';
import { MessagingService } from '@modules/messaging/messaging.service';
import { SessionId, SessionService } from '@modules/session';
import { UserService } from '@modules/user/user.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { Response as ExpressResponse } from 'express';

import { ONE_YEAR, SESSION_ID } from './constants';
import {
  LogoutOutput,
  SendSmsInput,
  SendSmsOutput,
  VerifySmsInput,
  VerifySmsOutput,
} from './dto';
import { AuthGuard } from './guards';
import { AuthService } from './service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly messagingService: MessagingService,
    @Config() private readonly configService: ConfigType,
  ) {}

  @Mutation(() => SendSmsOutput)
  async sendSms(@Input() input: SendSmsInput): Promise<SendSmsOutput> {
    await this.authService.sendSms(input.phoneNumber);

    return {
      data: true,
    };
  }

  @Mutation(() => VerifySmsOutput)
  async verifySms(
    @Ip() ip: string,
    @Response() response: ExpressResponse,
    @Input() input: VerifySmsInput,
  ): Promise<VerifySmsOutput> {
    const { phoneNumber, code, device } = input;

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

    const user = await this.userService.strictFindByPhoneNumber(phoneNumber);

    const { sessionId } = await this.sessionService.createSession({
      device,
      ip,
      user,
    });

    response.cookie(SESSION_ID, sessionId, {
      httpOnly: true,
      secure: this.configService.app.isProduction,
      signed: true,
      expires: new Date(Date.now() + ONE_YEAR),
    });

    return {
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => LogoutOutput)
  async logout(
    @Response() response: ExpressResponse,
    @SessionId() sessionId: string,
  ): Promise<LogoutOutput> {
    await this.sessionService.removeBySessionId(sessionId);

    response.cookie(SESSION_ID, null);

    return {
      data: true,
    };
  }
}
