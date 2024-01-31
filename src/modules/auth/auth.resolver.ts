import { NotFoundException, UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { ConfigType } from 'src/config';

import { SESSION_ID } from './auth.constants';
import { SessionId } from './auth.decorators';
import { AuthService } from './auth.service';
import { SendSmsInput, SendSmsOutput } from './dto';
import { VerifySmsInput, VerifySmsOutput } from './dto/verifySms';
import { AuthGuard } from './guards';

import { Config, Input, Ip, Request, Response } from '../common/decorators';
import { MessagingService } from '../messaging/messaging.service';
import { SessionService } from '../session/session.service';
import { UserDto } from '../user/dto';
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly messagingService: MessagingService,
    @Config() private readonly configService: ConfigType,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => UserDto)
  async me(@SessionId() sessionId: string): Promise<UserDto> {
    return this.userService.findUserBySessionIdOrFail(sessionId);
  }

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
    @Request() request: ExpressRequest,
    @Input() input: VerifySmsInput,
  ): Promise<VerifySmsOutput> {
    const { phoneNumber, code } = input;

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
      userAgent: request.headers['user-agent'],
      ip,
      user,
      rememberMe: input.rememberMe,
    });

    response.cookie(SESSION_ID, sessionId, {
      httpOnly: true,
      secure: this.configService.app.isProduction,
      signed: true,
    });

    return {
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async logout(
    @Response() response: ExpressResponse,
    @SessionId() sessionId: string,
  ): Promise<boolean> {
    await this.sessionService.removeBySessionId(sessionId);

    response.cookie(SESSION_ID, null);

    return true;
  }
}
