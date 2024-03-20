import { Config } from '@config';
import { Input, Ip, Response } from '@modules/common/decorators';
import { CookieService } from '@modules/cookie/cookie.service';
import { MessagingService } from '@modules/messaging/messaging.service';
import { SessionId, SessionService } from '@modules/session';
import { UserService } from '@modules/user/user.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mutation, Resolver } from '@nestjs/graphql';
import { Response as ExpressResponse } from 'express';

import { AuthService } from './auth.service';
import { ONE_YEAR, SESSION_ID } from './constants';
import {
  LogoutOutput,
  SendSmsInput,
  SendSmsOutput,
  VerifySmsInput,
  VerifySmsOutput,
} from './dto';
import { AuthGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly messagingService: MessagingService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService<Config>,
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

    const user = await this.userService.findByPhoneNumberOrFail(phoneNumber);

    const { sessionId } = await this.sessionService.createSession({
      device,
      ip,
      user,
    });

    this.cookieService.setCookie(response, {
      name: SESSION_ID,
      value: sessionId,
      options: {
        expires: new Date(Date.now() + ONE_YEAR),
        isHttpOnly: true,
        isSecure: this.configService.getOrThrow('app.isProduction', {
          infer: true,
        }),
        isSigned: true,
      },
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

    this.cookieService.clearCookie(response, { name: SESSION_ID });

    return {
      data: true,
    };
  }
}
